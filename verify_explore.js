const http = require('http');

function verify() {
    http.get('http://localhost:4000/api/explore/trending', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try {
                const parsedData = JSON.parse(data);
                console.log('Status:', resp.statusCode);
                console.log('Data Length:', parsedData.length);
                if (parsedData.length > 0) {
                    console.log('First Item:', JSON.stringify(parsedData[0], null, 2));
                    const amritsar = parsedData.find(d => d.destination === 'Amritsar');
                    if (amritsar) {
                        console.log('Amritsar:', JSON.stringify(amritsar, null, 2));
                    }
                }
            } catch (e) {
                console.error(e.message);
            }
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

verify();
