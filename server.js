const express = require('express');
const app = express();

app.use(express.static(__dirname));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') return res.status(200).end();
    next();
});

// ============================================
// RATE LIMITING - DDoS / Spam Koruması
// ============================================
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
const RATE_LIMIT_MAX = 30;           // 1 dakikada max 30 istek

function rateLimit(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { start: now, count: 1 });
        return next();
    }

    entry.count++;
    if (entry.count > RATE_LIMIT_MAX) {
        return res.status(429).json({ error: 'Çok fazla istek. Lütfen bekleyin.' });
    }
    next();
}

// Her 5 dakikada rate limit tablosunu temizle (memory leak önleme)
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap) {
        if (now - entry.start > RATE_LIMIT_WINDOW * 2) rateLimitMap.delete(ip);
    }
}, 5 * 60 * 1000);

// ============================================
// CACHE - Sunucu Taraflı Önbellek
// ============================================
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 DAKİKA cache (eskiden 60 saniyeydi)

// Tüm yayıncıları tek seferde cache'leyen global cache
let globalCache = null;
let globalCacheTimestamp = 0;

// ============================================
// HEALTH CHECK - Sunucuyu Canlı Tutma
// ============================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), cache_size: cache.size });
});

// ============================================
// TÜM YAYINCILARI TEK SEFERDE GETİR (YENİ)
// ============================================
app.get('/api/all-streamers', rateLimit, async (req, res) => {
    // Global cache varsa ve tazeyse, direkt döndür
    if (globalCache && Date.now() - globalCacheTimestamp < CACHE_TTL_MS) {
        return res.json(globalCache);
    }

    try {
        const { gotScraping } = await import('got-scraping');
        const allSlugs = [
            'dizci','husamviyuviyu','order','malik','samet',
            'hobbitemo','omer','kadirdemir','kfistaken','yyiido',
            'minik','alixmert','yunus','tembik','ekremyaldizkaya',
            'eray','baran','ayberk','caca','ahmetturku',
            'spyks26','falconn2k','musti','bonesaures','vaultcreative',
            'm1ella','ogi','cagatayakman','ersin','ebonivon',
            'sercanzurna','efeuygac','muratkzlcn','alpnfinalform','mert',
            'flomore','barisytb','bekirgedik','maxers','simitciabdu'
        ];

        const results = [];
        for (const slug of allSlugs) {
            // Bireysel cache kontrolü
            const cached = cache.get(slug);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
                results.push(cached.data);
                continue;
            }

            try {
                const response = await gotScraping(`https://kick.com/api/v1/channels/${slug}`);
                if (response.statusCode === 200) {
                    const data = JSON.parse(response.body);
                    const livestream = data.livestream;
                    let thumbnailUrl = '';
                    if (livestream && livestream.thumbnail) {
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
                console.error(`Error fetching ${slug}:`, err.message);
                // Cache'de eski veri varsa onu kullan
                const oldCached = cache.get(slug);
                if (oldCached) {
                    results.push(oldCached.data);
                } else {
                    results.push({ slug, isLive: false, profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}` });
                }
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Global cache'i güncelle
        globalCache = results;
        globalCacheTimestamp = Date.now();

        res.json(results);
    } catch (err) {
        console.error('API Error:', err.message);
        // Global cache varsa eski veriyi döndür
        if (globalCache) return res.json(globalCache);
        res.status(500).json({ error: 'Failed to fetch from Kick API' });
    }
});

// ============================================
// TAKIM BAZLI ENDPOINT (ESKİ - modal için)
// ============================================
app.post('/api/streamers', rateLimit, async (req, res) => {
    const slugs = req.body.slugs;
    if (!slugs || !Array.isArray(slugs) || slugs.length > 10) {
        return res.status(400).json({ error: 'Slugs array is required (max 10)' });
    }

    try {
        const { gotScraping } = await import('got-scraping');
        const results = [];

        for (const slug of slugs) {
            const cached = cache.get(slug);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
                results.push(cached.data);
                continue;
            }

            try {
                const response = await gotScraping(`https://kick.com/api/v1/channels/${slug}`);
                if (response.statusCode === 200) {
                    const data = JSON.parse(response.body);
                    const livestream = data.livestream;
                    let thumbnailUrl = '';
                    if (livestream && livestream.thumbnail) {
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
                console.error(`Error fetching ${slug}:`, err.message);
                results.push({ slug, isLive: false, profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}` });
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        res.json(results);
    } catch (err) {
        console.error('API Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch from Kick API' });
    }
});

// ============================================
// SUNUCUYU BAŞLAT
// ============================================
const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`KNGL RUST sunucusu başladı: http://localhost:${port}`);
        console.log(`Cache: ${CACHE_TTL_MS / 1000}s | Rate Limit: ${RATE_LIMIT_MAX}/dk`);
    });
}

module.exports = app;
