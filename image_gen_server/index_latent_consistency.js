import urldecode from 'urldecode';
import http from 'http';
import { parse } from 'url';
import PQueue from 'p-queue';
import { registerFeedListener, sendToFeedListeners } from './feedListeners.js';
import { sendToAnalytics } from './sendToAnalytics.js';
import { createAndReturnImageCached, makeParamsSafe } from './createAndReturnImages.js';
import { getCachedImage, cacheImage, isImageCached } from './cacheGeneratedImages.js';
import awaitSleep from 'await-sleep';
import { splitEvery } from 'ramda';
import { readFileSync } from 'fs';
import { normalizeAndTranslatePrompt } from './normalizeAndTranslatePrompt.js';
import { generalImageQueue, concurrency, BATCH_SIZE } from './generalImageQueue.js';
import { bucketKeyStats, currentBatches, imageReturnTimestamps, requestTimestamps, printQueueStatus } from './bucketKeyStats.js';
import { getIp } from './getIp.js';
import { countJobs } from './bucketKeyStats.js';

const queueFullImages = [readFileSync("./queuefull1.png"), readFileSync("./queuefull2.png"), readFileSync("./queuefull3.png")];

// this is used to create a queue per ip address
const BOT_IP = "150.136.112.172";

/**
 * Function that wraps an async request handler and keeps count of the number of requests from the same IP address.
 * If an IP address already has a request in the queue, it will delay until the request is processed.
 * The delay increases by 1 second for each request in the queue.
 * If the query parameter noqueue=pollinations is passed, the queue is skipped entirely.
 * @param {Function} handler - The request handler function to wrap.
 * @returns {Function} The wrapped async request handler.
 */
const queuePerIp = (handler) => {
  const ipQueue = {};
  const rickrollCount = {}; // Count of times each IP was rickrolled
  const rickrollData = {}; // Amount of data each IP has downloaded as a rickroll in GB
  return async (params) => {
    const {req,res} = params;
    const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
    // if (urlParams.get('noqueue') === 'pollinations') {
    //   await handler(params);
    //   return;
    // }

    const ip = getIp(req);
    if (!ipQueue[ip]) {
      ipQueue[ip] = new PQueue({ concurrency: ip === BOT_IP ? 999999 : 1 });
      rickrollCount[ip] = 0; // Initialize rickroll count for this IP
      rickrollData[ip] = 0; // Initialize rickroll data for this IP
    } else {
      console.log("[queue] ip already in queue", ip, "queue length", ipQueue[ip].size, "pending", ipQueue[ip].pending);
      const ricUrl = "https://github.com/pollinations/rickroll-against-ddos/raw/main/Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up%20(Remastered%204K%2060fps,AI)-(720p60).mp4";
      if (ipQueue[ip].size > 10) {
        console.log("\x1b[36m%s\x1b[0m", "🚀🚀🚀 Redirecting IP: " + ip + " to rickroll 🎵🎵🎵");
        rickrollCount[ip] += 1; // Increment rickroll count for this IP
        rickrollData[ip] += 0.07; // Add 72.1MB (0.0721GB) to rickroll data for this IP
        console.log(`[queue] IP: ${ip} has been rickrolled ${rickrollCount[ip]} times, downloading ${rickrollData[ip].toFixed(2)}GB of rickroll data.`);
        res.writeHead(302, {
          'Location': ricUrl
        });
        res.end();
        return;
      }
    }
    const queueSize = ipQueue[ip].size + ipQueue[ip].pending;
    await ipQueue[ip].add(async () => {
      console.log("[queue] sleeping for", queueSize * 1000, "ms");
      await awaitSleep(Math.round(queueSize * countJobs(true)*2000)); // Delay increases by 1 second for each request in the queue
      console.log("[queue]starting handler for ip", ip)
      await handler(params);
      console.log("[queue]done handler for ip", ip)
    });
  };
};



const processChunk = async (chunk, bucketKey, safeParams) => {
  try {
    chunk.forEach(job => {
      job.timingInfo.push({ step: 'Start generating chunk', timestamp: Date.now() });
    })

    const buffersWithLegend = await createAndReturnImageCached({
      jobs: chunk, 
      safeParams, 
      concurrentRequests: countJobs(true),
    });

    chunk.forEach((job, index) => {
      job.callback(null, buffersWithLegend[index], job.timingInfo);
      cacheImage(job.originalPrompt, safeParams, buffersWithLegend[index].buffer);
      // Increment the count of images returned for this bucket key
      bucketKeyStats[bucketKey].returned++;
      job.timingInfo.push({ step: 'End generating chunk', timestamp: Date.now() });
    });
  } catch (e) {
    console.error(e);
    chunk.forEach(job => job.callback(e, null, job.timingInfo)); // Error callback
  }
};

const processBatches = async () => {
  const processingPromises = [];
  while (generalImageQueue.size + generalImageQueue.pending < concurrency) {
    let batchIndex = currentBatches.findIndex(batch => batch.safeParams.model === 'turbo' || !batch.safeParams.model);
    if (batchIndex === -1) {
      // If no turbo model found, use the original logic
      batchIndex = Math.random() < 0.8 ? 0 : 1;
    }
    const batch = currentBatches[batchIndex % currentBatches.length];
    if (batch) {
      const { bucketKey, jobs, safeParams } = batch;
      const chunks = splitEvery(BATCH_SIZE, jobs);
      const chunk = chunks.shift();
      if (chunk) {
        batch.jobs = batch.jobs.slice(chunk.length);
        if (batch.jobs.length === 0) {
          currentBatches.splice(batchIndex, 1);
        }
        processingPromises.push(generalImageQueue.add(() => processChunk(chunk, bucketKey, safeParams)));
      }
    }
    if (processingPromises.length >= concurrency) {
      await Promise.all(processingPromises);
      processingPromises.length = 0; // Clear the array
    }
    await awaitSleep(100);
  }
  if (processingPromises.length > 0) {
    await Promise.all(processingPromises); // Ensure all remaining promises are settled
  }
}

let memCache = {};

/**
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object|boolean>}
 */
const preMiddleware = async function (req, res) {
  console.error("requestListener", req.url);
  let { pathname, query } = parse(req.url, true);
  let extraParams = {...query};

  if (pathname.startsWith("/feed")) {
    registerFeedListener(req, res);
    sendToAnalytics(req, "feedRequested", {});
    return false;
  }

  if (!pathname.startsWith("/prompt")) {
    res.end('404: Not Found');
    return false;
  }

  const originalPrompt = pathname.split("/prompt/")[1];

  if (!originalPrompt) {
    res.writeHead(404);
    res.end('404: Not Found');
    return false;
  }
  
  const concurrentRequests = countJobs();
  const safeParams = makeParamsSafe(extraParams);
  const bucketKey = ["model","width","height"]
    .filter(key => safeParams[key])
    .map(key => safeParams[key])
    .join('-');

  const memCacheKey = `${bucketKey}-${originalPrompt}-${JSON.stringify(safeParams)}`;

  const analyticsMetadata = { promptRaw: originalPrompt, concurrentRequests, bucketKey, model: safeParams["model"] };
  sendToAnalytics(req, "imageRequested", analyticsMetadata);

  if (!bucketKeyStats[bucketKey]) {
    bucketKeyStats[bucketKey] = { requested: 0, returned: 0 };
  }

  if (memCache[memCacheKey]) {
    res.write(await memCache[memCacheKey]);
    res.end();
    imageReturnTimestamps.push(Date.now());
    return false;
  }

  if (await isImageCached(originalPrompt, safeParams)) {
    const cachedImage = await getCachedImage(originalPrompt, safeParams);
    res.write(cachedImage);
    res.end();
    console.error("image cached, returning from cache", originalPrompt, safeParams);
    return false;
  }

  bucketKeyStats[bucketKey].requested++;

  if (countJobs() > 100) {
    const queueFullImage = queueFullImages[Math.floor(Math.random() * queueFullImages.length)];
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.write(queueFullImage);
    res.end();
    return false;
  }

  const timingInfo = [{ step: 'Request received and queued.', timestamp: Date.now() }];
  return {req, res, timingInfo, memCacheKey, originalPrompt, safeParams, bucketKey, analyticsMetadata};
};

/**
 * @async
 * @function
 * @param {Object} params - The parameters object.
 * @returns {Promise<void>}
 */
const queuedImageGen =  queuePerIp(async ({req, res, timingInfo, memCacheKey, originalPrompt, safeParams, bucketKey, analyticsMetadata, ip}) =>  {
  memCache[memCacheKey] = new Promise(async (resolve, reject) => {
      timingInfo.push({ step: 'Start processing', timestamp: Date.now() });
      const prompt = await normalizeAndTranslatePrompt(originalPrompt, req, timingInfo, safeParams["enhance"]);

      if (!prompt) {
        res.writeHead(500);
        res.end('500: Internal Server Error');
        return;
      }
      console.error("prompt",prompt, "bucketKey", bucketKey);

      const callback = (error, bufferAndMaturity, timingInfo) => {
        if (error) {
          res.writeHead(500);
          res.end('500: Internal Server Error');
          reject(error);
          return;
        }
        res.write(bufferAndMaturity.buffer);
        resolve(bufferAndMaturity.buffer);
        res.end();
        imageReturnTimestamps.push(Date.now());
        
        timingInfo.push({ step: 'Image returned', timestamp: Date.now() });

        const requestReceivedTime = timingInfo[0].timestamp;
        timingInfo = timingInfo.map(info => ({
          ...info,
          timestamp: info.timestamp - requestReceivedTime
        }));
        console.log('Timing Info:', timingInfo);

        const imageURL = `https://image.pollinations.ai${req.url}`;
      
        if (!safeParams.nofeed) {
          const concurrentRequests = countJobs();
          const ip = getIp(req);
          sendToFeedListeners({
            ...safeParams, 
            concurrentRequests, 
            imageURL, 
            prompt, 
            originalPrompt: urldecode(originalPrompt), 
            nsfw: bufferAndMaturity.isMature, 
            isChild: bufferAndMaturity.isChild, 
            timingInfo,
            ip,
          }, { saveAsLastState: true }
          );
        }
        sendToAnalytics(req, "imageGenerated", analyticsMetadata);
      };


      const jobData = {prompt, callback, originalPrompt, timingInfo, ip};
      
      const existingBatch = currentBatches.find(batch => batch.bucketKey === bucketKey);
      if (!existingBatch) {
        currentBatches.push({ bucketKey, jobs: [jobData], safeParams });
        return;
      }

      const existingJob = existingBatch.jobs.find(job => job.prompt === prompt);
      if (existingJob) {
        console.error("job already exists in queue", prompt);
        return;
      }

      existingBatch.jobs.push(jobData);

  });

  requestTimestamps.push(Date.now());
  printQueueStatus();
});

/**
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const checkCacheAndGenerate = async (req, res) => {
  const result = await preMiddleware(req, res);
  if (result) {
    await queuedImageGen(result);
  }
};

const server = http.createServer(checkCacheAndGenerate);
server.listen(process.env.PORT || 16384);
processBatches();



const normalizeAndTranslatePrompt = async (promptRaw, req, timingInfo, enhance=false) => {
  timingInfo.push({ step: 'Start prompt normalization and translation', timestamp: Date.now() });
  // first 200 characters are used for the prompt
  promptRaw = urldecode(promptRaw);

  // if it is not a string make it a string
  if (typeof promptRaw !== "string") {
    promptRaw = ""+promptRaw;
  }

  // if prompt contains "A:" we want to take the part after "A:"
  if (promptRaw.includes("A:")) {
    promptRaw = promptRaw.split("A:")[1];
  }

  promptRaw = promptRaw.slice(0,250);
  // 
  promptRaw = sanitizeString(promptRaw);
  
  if (promptRaw.includes("content:")) {
    // promptRaw = promptRaw.replace("content:", "");
    console.log("content: detected in prompt, returning null");
    return null;
  }
  let prompt = promptRaw;

  // check from the request headers if the user most likely speaks english (value starts with en)
  const englishLikely = req.headers["accept-language"]?.startsWith("en");
  
  if (!englishLikely) {
    const startTime = Date.now();
    prompt = await translateIfNecessary(prompt);
    const endTime = Date.now();
    console.log(`Translation time: ${endTime - startTime}ms`);
  }

  const finalPrompt = prompt || promptRaw;


  timingInfo.push({ step: 'End prompt normalization and translation', timestamp: Date.now() });
  return finalPrompt;
};

function getIp(req) {
  return req.headers["x-bb-ip"] || req.headers["x-nf-client-connection-ip"] || req.headers["x-real-ip"] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

// //
