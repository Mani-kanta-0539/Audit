const testUrl = 'https://www.youtube.com/watch?v=9n9uR840r0E';

async function test() {
    console.log(`Testing NoEmbed for: ${testUrl}`);
    try {
        const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(testUrl)}`);
        const data = await response.json();
        console.log('NoEmbed Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
