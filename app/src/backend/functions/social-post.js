
import SocialPost from "social-post-api"; 
import { IPFSState } from "../../network/ipfsClient.js";

import { getPostData } from "../../data/summaryData";

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTION'
};


export const handler = async ({path}) => {

    const cid = path.split("/").slice(-1)[0];
    const platform = path.split("/").slice(-2)[0];
    // your server-side functionality
    console.log("platform",platform,"cid",cid,". Fetching IPFS state");
    const ipfs = await IPFSState(cid);

    const data =  getPostData(ipfs, cid, true);
    
    try {
      const res = await doPost(data, platform);
      console.log("res",JSON.stringify(res,null,4));
      return {
        statusCode: 200,
        body: JSON.stringify(res, null, 4),
        headers
      };

    } catch (e) {
      console.error("error",e);
      return {
        statusCode: 500,
        body: JSON.stringify(e, null, 4),
        headers
      };
    }

}


async function doPost({post, title, videoURL, coverImage, url}, platform) {

  // Ayrshare API Key
  console.log("starting social post api with key", process.env["AYRSHARE_KEY"])
  const social = new SocialPost(process.env["AYRSHARE_KEY"]);

  const shareConfig = {
    post,
    title,
    youTubeOptions: {
      title,       // required: Video Title
      youTubeVisibility: "public", // optional: "public", "unlisted", or "private" - default "private"
      thumbNail: coverImage, // optional: URL of a JPEG or PNG and less than 2MB
      // playListId: "PLrav6EfwgDX5peD7Ni-pOKa7B13WjLyUB" // optional: Playlist ID to add the video
    },
    shortenLinks: false,
    "mediaUrls": [videoURL],
    "platforms": [platform],
    autoHashtag: {
      max: 2,
      position: "auto"
    }
  };

  const postResponse = await social.post(shareConfig).catch(console.error);
  console.log("postResponse", postResponse);
  return postResponse;
}



const followText =
`## Create
https://pollinations.ai

## Follow
https://fb.com/pollinations
https://twitter.com/pollinations_ai
https://instagram.com/pollinations_ai

#pollinations
`;



if (process.argv.length > 2) {
  handler({path: process.argv[2]});
}