import { fetchPageDetails } from './services/serpService';

// Mock API Key if needed for local test, or rely on env var if loaded
// For this test, we assume SERP_API_KEY is available or we might need to hardcode it temporarily for the test if env vars aren't loaded in this context.
// However, since we are running in the user's environment, we should try to use the existing service.

const testUrl = 'https://www.youtube.com/watch?v=9n9uR840r0E'; // Example video

async function test() {
    console.log(`Testing URL: ${testUrl}`);
    try {
        const data = await fetchPageDetails(testUrl);
        console.log('Fetched Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
