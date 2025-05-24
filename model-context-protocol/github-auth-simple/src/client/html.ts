// HTML template for Pollinations.AI Auth client
import { CSS } from './styles';

export const generateHTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pollinations.AI Auth</title>
    <style>
        ${CSS}
    </style>
</head>
<body>
    <div class="container">
        <h1 class="emoji-title"><span>🐝</span> Pollinations.AI Auth <span>🌸</span></h1>
        
        <div id="auth-section">
            <h2>✨ 1. Authentication</h2>
            <button id="auth-button" onclick="startAuth()">Login with GitHub</button>
            <button id="logout-button" onclick="logout()" class="hidden">Logout</button>
            <div id="auth-status" class="status"></div>
        </div>
        
        <div id="user-section" class="hidden">
            <h2>👤 2. User Info</h2>
            <div id="user-info" class="status"></div>
        </div>
        
        <div id="domain-section" class="hidden">
            <h2>🌐 3. Domain Management</h2>
            <div class="input-group">
                <input type="text" id="new-domain" placeholder="example.com">
                <button onclick="addDomain()">Add Domain</button>
            </div>
            <div id="domain-info" class="status"></div>
            
            <h3>🔑 4. API Token Management</h3>
            <div id="token-info" class="status"><em>Loading token information...</em></div>
            <button onclick="generateApiToken()">Generate New Token</button>
        </div>
    </div>

    <script>
        // Global variables
        const API_BASE = window.location.origin;
        let authToken = null;
        let userId = null;
        let currentDomains = [];
        let apiToken = null;
        
        // Initialize on page load
        window.addEventListener('load', function() {
            // Add event delegation for domain removal
            document.addEventListener('click', function(event) {
                const target = event.target;
                if (target && target.classList.contains('remove-domain')) {
                    const domain = target.getAttribute('data-domain');
                    if (domain) {
                        removeDomain(domain);
                    }
                }
            });
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const username = params.get('username');
            
            if (token && username) {
                // Store token and show success message
                authToken = token;
                showStatus('auth-status', '✅ Authenticated as ' + username + ' 🎉', 'success');
                
                // Show user section and domain section
                document.getElementById('user-section').classList.remove('hidden');
                document.getElementById('domain-section').classList.remove('hidden');
                
                // Toggle auth/logout buttons
                document.getElementById('auth-button').classList.add('hidden');
                document.getElementById('logout-button').classList.remove('hidden');
                
                // Store in localStorage for persistence
                localStorage.setItem('github_auth_token', token);
                localStorage.setItem('github_username', username);
                localStorage.setItem('github_user_id', params.get('user_id') || '');
                
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Automatically load user info, domains and token
                userId = params.get('user_id');
                getUserInfo();
                getDomains();
                getApiToken();
            } else {
                // Check for stored token
                const storedToken = localStorage.getItem('github_auth_token');
                const storedUsername = localStorage.getItem('github_username');
                
                if (storedToken && storedUsername) {
                    authToken = storedToken;
                    userId = localStorage.getItem('github_user_id');
                    showStatus('auth-status', '✅ Authenticated as ' + storedUsername + ' 🎉', 'success');
                    
                    // Toggle auth/logout buttons
                    document.getElementById('auth-button').classList.add('hidden');
                    document.getElementById('logout-button').classList.remove('hidden');
                    
                    document.getElementById('user-section').classList.remove('hidden');
                    document.getElementById('domain-section').classList.remove('hidden');
                    
                    // Automatically load user info, domains and token
                    getUserInfo();
                    getDomains();
                    getApiToken();
                }
            }
        });
        
        // Start authentication
        function startAuth() {
            // Use the current path as the redirect URI (works for both / and /test-client)
            const redirectUri = encodeURIComponent(window.location.href);
            window.location.href = API_BASE + '/authorize?redirect_uri=' + redirectUri;
        }
        
        // Logout function
        function logout() {
            // Clear stored data
            localStorage.removeItem('github_auth_token');
            localStorage.removeItem('github_username');
            localStorage.removeItem('github_user_id');
            
            // Reset UI
            authToken = null;
            userId = null;
            currentDomains = [];
            apiToken = null;
            
            // Toggle auth/logout buttons
            document.getElementById('auth-button').classList.remove('hidden');
            document.getElementById('logout-button').classList.add('hidden');
            
            // Hide sections
            document.getElementById('user-section').classList.add('hidden');
            document.getElementById('domain-section').classList.add('hidden');
            
            // Show logout message
            showStatus('auth-status', '👋 Logged out successfully', 'info');
        }
        
        // Get user info
        async function getUserInfo() {
            if (!authToken) {
                showStatus('user-info', '❌ Not authenticated', 'error');
                return;
            }
            
            try {
                const response = await fetch(API_BASE + '/api/user', {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    userId = data.github_user_id;
                    
                    let userHtml = '<strong>User Info:</strong><br>' +
                        '🆔 ID: ' + data.github_user_id + '<br>' +
                        '👤 Username: ' + data.username;
                    
                    showStatus('user-info', userHtml, 'info');
                    
                    // Show domain section
                    document.getElementById('domain-section').classList.remove('hidden');
                    
                    // Automatically fetch domains
                    getDomains();
                } else {
                    showStatus('user-info', '❌ Error: ' + response.statusText, 'error');
                }
            } catch (error) {
                showStatus('user-info', '❌ Error: ' + error.message, 'error');
            }
        }
        
        // Get domains
        async function getDomains() {
            if (!authToken || !userId) {
                showStatus('domain-info', '❌ Get user info first', 'error');
                return;
            }
            
            try {
                const response = await fetch(API_BASE + '/api/domains?user_id=' + userId, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    currentDomains = data.domains || [];
                    displayDomains();
                } else {
                    showStatus('domain-info', '❌ Error: ' + response.statusText, 'error');
                }
            } catch (error) {
                showStatus('domain-info', '❌ Error: ' + error.message, 'error');
            }
        }
        
        // Display domains
        function displayDomains() {
            let domainHtml = '';
            
            if (currentDomains.length > 0) {
                domainHtml = '<strong>🌐 Allowed Domains:</strong><div style="margin-top:10px">';
                for (const domain of currentDomains) {
                    // Use data attributes instead of inline onclick handlers
                    domainHtml += '<span class="domain-item">' + domain + 
                        '<span class="remove-domain" data-domain="' + domain + '">&times;</span></span>';
                }
                domainHtml += '</div>';
            } else {
                domainHtml = '<em>No domains allowed yet</em> 🔍';
            }
            
            showStatus('domain-info', domainHtml, 'info');
        }
        
        // Add domain
        async function addDomain() {
            const domain = document.getElementById('new-domain').value.trim();
            if (!domain) {
                showStatus('domain-info', '❌ Please enter a domain', 'error');
                return;
            }
            
            if (!authToken || !userId) {
                showStatus('domain-info', '❌ Get user info first', 'error');
                return;
            }
            
            const newDomains = [...currentDomains, domain];
            
            try {
                const response = await fetch(API_BASE + '/api/domains?user_id=' + userId, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ domains: newDomains })
                });
                
                if (response.ok) {
                    currentDomains = newDomains;
                    document.getElementById('new-domain').value = '';
                    displayDomains();
                } else {
                    showStatus('domain-info', '❌ Error: ' + response.statusText, 'error');
                }
            } catch (error) {
                showStatus('domain-info', '❌ Error: ' + error.message, 'error');
            }
        }
        
        // Remove domain
        async function removeDomain(domainToRemove) {
            if (!authToken || !userId) {
                showStatus('domain-info', '❌ Get user info first', 'error');
                return;
            }
            
            const newDomains = currentDomains.filter(domain => domain !== domainToRemove);
            
            try {
                const response = await fetch(API_BASE + '/api/domains?user_id=' + userId, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ domains: newDomains })
                });
                
                if (response.ok) {
                    currentDomains = newDomains;
                    displayDomains();
                } else {
                    showStatus('domain-info', '❌ Error: ' + response.statusText, 'error');
                }
            } catch (error) {
                showStatus('domain-info', '❌ Error: ' + error.message, 'error');
            }
        }
        
        // Get API token
        async function getApiToken() {
            if (!authToken || !userId) {
                showStatus('token-info', '❌ Get user info first', 'error');
                return;
            }
            
            try {
                const response = await fetch(API_BASE + '/api/token?user_id=' + userId, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    apiToken = data.token;
                    
                    if (apiToken) {
                        showStatus('token-info', '<strong>🔑 Your API Token:</strong><br><code>' + apiToken + '</code>', 'info');
                    } else {
                        showStatus('token-info', '⚠️ No API token found. Generate one first! 🔄', 'info');
                    }
                } else {
                    showStatus('token-info', '❌ Error: ' + response.statusText, 'error');
                }
            } catch (error) {
                showStatus('token-info', '❌ Error: ' + error.message, 'error');
            }
        }
        
        // Generate API token
        async function generateApiToken() {
            if (!authToken || !userId) {
                showStatus('token-info', '❌ Get user info first', 'error');
                return;
            }
            
            try {
                const response = await fetch(API_BASE + '/api/token?user_id=' + userId, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    apiToken = data.token;
                    
                    showStatus('token-info', '<strong>✅ New API Token Generated:</strong><br><code>' + apiToken + '</code><br><em>Save this token! It will not be shown again.</em> 🔐', 'success');
                } else {
                    showStatus('token-info', '❌ Error: ' + response.statusText, 'error');
                }
            } catch (error) {
                showStatus('token-info', '❌ Error: ' + error.message, 'error');
            }
        }
        
        // Show status
        function showStatus(elementId, message, type) {
            const element = document.getElementById(elementId);
            element.className = 'status ' + (type || 'info');
            element.innerHTML = message;
        }
    </script>
</body>
</html>`;
