const http = require('https');

const queries = [
    { key: 'Amritsar', query: 'golden-temple,amritsar' },
    { key: 'Varanasi', query: 'varanasi,ghats,ganga' },
    { key: 'Rishikesh', query: 'rishikesh,ganga,river' },
    { key: 'Banff', query: 'banff,lake-louise,mountains' },
    { key: 'Swiss Alps', query: 'swiss-alps,zermatt,matterhorn' },
    { key: 'Phuket', query: 'phuket,thailand,beach' },
    { key: 'Queenstown', query: 'queenstown,new-zealand,landscape' },
    { key: 'Kyoto', query: 'kyoto,temple,cherry-blossom' },
    { key: 'Jaipur', query: 'jaipur,hawa-mahal,palace' },
    { key: 'Paris', query: 'paris,eiffel-tower' },
    { key: 'Rome', query: 'rome,colosseum' },
    { key: 'Goa', query: 'goa,beach,palm-trees' },
    { key: 'Varkala', query: 'varkala,cliff,beach' },
    { key: 'Maldives', query: 'maldives,resort,water' },
    { key: 'Manali', query: 'manali,snow,mountains' },
    { key: 'Interlaken', query: 'interlaken,switzerland' }
];

async function resolveRedirect(query) {
    return new Promise((resolve, reject) => {
        const url = `https://source.unsplash.com/featured/?${query}`;
        http.get(url, (res) => {
            // Unsplash source usually redirects (302) to the actual image
            if (res.statusCode === 302 || res.statusCode === 301) {
                resolve(res.headers.location);
            } else {
                // Sometimes it might not redirect if there's an error or rate limit?
                // But usually source.unsplash redirects.
                // If it returns 200, it might remain on the same URL?
                // Actually source.unsplash is DEPRECATED and might return 404/403.
                // If deprecated, this strategy fails.
                resolve(null);
            }
        }).on('error', (e) => {
            resolve(null);
        });
    });
}

async function run() {
    console.log('Resolving images...');
    for (const item of queries) {
        try {
            const finalUrl = await resolveRedirect(item.query);
            if (finalUrl) {
                // The final URL usually looks like: https://images.unsplash.com/photo-123456...?ixlib=...
                // We want to extract the base part
                const cleanUrl = finalUrl.split('?')[0];
                console.log(`${item.key}: "${cleanUrl}?auto=format&fit=crop&w=800&q=80"`);
            } else {
                console.log(`${item.key}: FAILED to resolve`);
            }
        } catch (e) {
            console.log(`${item.key}: ERROR`);
        }
        // polite delay
        await new Promise(r => setTimeout(r, 500));
    }
}

run();
