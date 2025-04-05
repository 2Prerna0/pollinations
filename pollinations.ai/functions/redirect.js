// Netlify function to handle redirects with analytics
const fetch = require('node-fetch');
// dotenv
require('dotenv').config();
// Import affiliate mappings directly from JS module
const affiliateMappings = require('./affiliate_mapping');

// Convert the array to a lookup object for faster access
const REFERRAL_LINKS = affiliateMappings.reduce((acc, curr) => {
  acc[curr.Id] = curr.TrackingLink;
  return acc;
}, {});

/**
 * Send analytics event to Google Analytics
 * @param {string} eventName - Name of the event
 * @param {object} metadata - Event metadata
 * @param {object} request - Request object
 * @returns {Promise} - Analytics response
 */
async function sendAnalytics(eventName, metadata, request) {
  try {
    const measurementId = process.env.GA_MEASUREMENT_ID;
    const apiSecret = process.env.GA_API_SECRET;

    if (!measurementId || !apiSecret) {
      console.log('Missing analytics credentials:', { 
        hasMeasurementId: !!measurementId, 
        hasApiSecret: !!apiSecret 
      });
      return;
    }

    // Extract client information
    const headers = request.headers || {};
    const referrer = headers.referer || headers.referrer || '';
    const userAgent = headers['user-agent'] || '';
    const clientIP = headers['x-real-ip'] || 
                    headers['x-forwarded-for'] || 
                    headers['client-ip'] || 
                    '::1';

    // Prepare analytics payload - following GA4 requirements
    const payload = {
      client_id: clientIP.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20) || 'anonymous',
      events: [{
        name: eventName,
        params: {
          // GA4 requires snake_case for parameter names
          referral_id: metadata.referralId || '',
          target_url: metadata.targetUrl || '',
          source: metadata.source || '',
          // Add user info
          referrer: referrer || '',
          user_agent: userAgent.substring(0, 100) || '',
          // Add timestamp as a standard parameter
          engagement_time_msec: 1,
          timestamp: Date.now().toString()
        }
      }]
    };

    console.log(`Sending analytics event: ${eventName}`, JSON.stringify(payload, null, 2));

    // Send to Google Analytics
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const responseText = await response.text();
    console.log('Analytics response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText || '(empty response)',
      headers: Object.fromEntries(response.headers)
    });

    return response;
  } catch (error) {
    console.error('Error sending analytics:', error);
  }
}

exports.handler = async function(event, context) {
  console.log('Redirect function called with event:', {
    path: event.path,
    httpMethod: event.httpMethod,
    headers: event.headers,
    queryStringParameters: event.queryStringParameters
  });

  // Get the target ID from the path
  const path = event.path || '';
  const pathSegments = path.split('/');
  const targetId = pathSegments[pathSegments.length - 1];
  
  // Get URL from query parameters or use the mapped URL
  const params = event.queryStringParameters || {};
  const url = params.url || REFERRAL_LINKS[targetId];
  
  // If no URL is found for this ID, return an error
  if (!url) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Redirect target not found',
        message: `No redirect URL found for ID: ${targetId}`
      })
    };
  }
  
  console.log(`Redirect requested for: ${targetId} to ${url}`);
  
  try {
    // Send analytics event
    await sendAnalytics('nsfwReferralLinkClicked', {
      referralId: targetId,
      targetUrl: url,
      source: 'nsfw_referral'
    }, event);
    
    // Return redirect response
    return {
      statusCode: 302,
      headers: {
        'Location': url,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: 'Redirecting...'
    };
  } catch (error) {
    console.error('Redirect error:', error);
    
    // If analytics fails, still redirect the user
    return {
      statusCode: 302,
      headers: {
        'Location': url,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: 'Redirecting...'
    };
  }
};
