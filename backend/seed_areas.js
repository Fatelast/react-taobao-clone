const https = require('https');
const mongoose = require('mongoose');
const Area = require('./models/Area');
const connectDB = require('./config/db');

// 中国行政区划数据源 (PCA: Province, City, Area) - 使用 jsDelivr CDN
const DATA_URL = 'https://cdn.jsdelivr.net/npm/china-division/dist/pca-code.json';

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                console.log(`Redirecting to: ${res.headers.location}`);
                return fetchJson(res.headers.location).then(resolve).catch(reject);
            }

            if (res.statusCode !== 200) {
                reject(new Error(`Failed to fetch: ${res.statusCode}`));
                return;
            }

            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(new Error('JSON Parse Error: ' + e.message));
                }
            });
            res.on('error', (err) => reject(err));
        }).on('error', (err) => reject(err));
    });
}

async function seedAreas() {
    try {
        await connectDB();
        console.log('Connected to MongoDB...');

        // 清理旧数据
        await Area.deleteMany({});
        console.log('Cleared existing areas...');

        console.log('Fetching data from jsDelivr...');
        const data = await fetchJson(DATA_URL);

        const flatAreas = [];

        // 递归展平数据
        function flatten(items, parentCode = null, level = 1) {
            for (const item of items) {
                flatAreas.push({
                    code: item.code,
                    name: item.name,
                    level,
                    parentCode
                });

                if (item.children && item.children.length > 0) {
                    flatten(item.children, item.code, level + 1);
                }
            }
        }

        flatten(data);

        console.log(`Prepared ${flatAreas.length} area records. Inserting...`);
        
        // 分批插入以避免内存溢出或过大请求
        const batchSize = 1000;
        for (let i = 0; i < flatAreas.length; i += batchSize) {
            const batch = flatAreas.slice(i, i + batchSize);
            await Area.insertMany(batch);
            console.log(`Inserted batch ${i / batchSize + 1}`);
        }

        console.log('Area data seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding areas:', error);
        process.exit(1);
    }
}

seedAreas();
