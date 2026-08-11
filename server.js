const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Cache for API responses
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

app.post('/api/streamers', async (req, res) => {
    const slugs = req.body.slugs;
    if (!slugs || !Array.isArray(slugs)) {
        return res.status(400).json({ error: 'Slugs array is required' });
    }

    try {
        const { gotScraping } = await import('got-scraping');
        const results = [];

        for (const slug of slugs) {
            // Check cache
            const cached = cache.get(slug);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
                results.push(cached.data);
                continue;
            }

            try {
                // KICK V1 API is the one that returns the high-quality .webp thumbnails!
                const response = await gotScraping(`https://kick.com/api/v1/channels/${slug}`);
                if (response.statusCode === 200) {
                    const data = JSON.parse(response.body);
                    const livestream = data.livestream;
                    
                    let thumbnailUrl = '';
                    if (livestream && livestream.thumbnail) {
                        // Get the exact webp url from the v1 api
                        thumbnailUrl = livestream.thumbnail.url || livestream.thumbnail;
                    }

                    const formattedData = {
                        slug,
                        isLive: Boolean(livestream && livestream.is_live),
                        viewerCount: livestream ? (livestream.viewer_count || 0) : 0,
                        thumbnail: thumbnailUrl,
                        title: livestream ? livestream.session_title : '',
                        profilePicture: data.user?.profile_pic || data.user?.profilepic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}`,
                        category: livestream?.categories?.[0]?.name || livestream?.category?.name || 'Rust'
                    };

                    cache.set(slug, { data: formattedData, timestamp: Date.now() });
                    results.push(formattedData);
                } else {
                    throw new Error(`Kick API returned ${response.statusCode}`);
                }
            } catch (err) {
                console.error(`Error fetching ${slug} from Kick:`, err.message);
                results.push({ slug, isLive: false, profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}` });
            }

            // Small delay to prevent rate-limiting from Kick
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        res.json(results);
    } catch (err) {
        console.error('API Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch from Kick API' });
    }
});

const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Arka plan sunucusu basladi: http://localhost:${port}`);
        console.log(`Bu sunucu Kick verilerini DOĞRUDAN orijinal kaynağından V1 API (webp destekli) çeker!`);
    });
}

module.exports = app;
