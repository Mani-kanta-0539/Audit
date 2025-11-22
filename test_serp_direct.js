const SERP_API_KEY = "0583ef4796c696e0b52a857f4f89fb68ba1dd6709e49aba020dc219da6fc5239";
const testUrl = 'https://www.youtube.com/watch?v=9n9uR840r0E'; // Example video

async function test() {
    console.log(`Testing URL: ${testUrl}`);
    try {
        let searchUrl = `https://serpapi.com/search.json?api_key=${SERP_API_KEY}&num=1`;

        // Logic from serpService.ts
        if (testUrl.includes('youtube.com') || testUrl.includes('youtu.be')) {
            const videoId = testUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
            if (videoId) {
                searchUrl += `&engine=youtube&v=${videoId}`;
            } else {
                searchUrl += `&q=${encodeURIComponent(testUrl)}`;
            }
        }

        console.log(`Fetching: ${searchUrl}`);
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.video_results && data.video_results[0]) {
            console.log('SUCCESS: Found Video Metadata');
            console.log(JSON.stringify(data.video_results[0], null, 2));
        } else {
            console.log('FAILED: No video_results found');
            console.log('Full Response keys:', Object.keys(data));
            if (data.error) console.log('Error:', data.error);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

test();
