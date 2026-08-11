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
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 30;

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
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 dakika

// ============================================
// TÜM YAYINCILARI LISTESI
// ============================================
const ALL_SLUGS = [
    'dizci','husamviyuviyu','order','malik','samet',
    'hobbitemo','omer','kadirdemir','kfistaken','yyiido',
    'minik','alixmert','yunus','tembik','ekremyaldizkaya',
    'eray','baran','ayberk','caca','ahmetturku',
    'spyks26','falconn2k','musti','bonesaures','vaultcreative',
    'm1ella','ogi','cagatayakman','ersin','ebonivon',
    'sercanzurna','efeuygac','muratkzlcn','alpnfinalform','mert',
    'flomore','barisytb','bekirgedik','maxers','simitciabdu'
];

// ============================================
// ARKA PLAN VERİ ÇEKİCİ - Her 5 dk otomatik
// ============================================
async function fetchSingleStreamer(gotScraping, slug) {
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
            return formattedData;
        }
    } catch (err) {
        console.error(`[BG] Error ${slug}:`, err.message);
    }
    // Hata olursa cache'den eski veriyi kullan
    const old = cache.get(slug);
    if (old) return old.data;
    return { slug, isLive: false, profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}` };
}

let bgFetchRunning = false;

async function backgroundFetchAll() {
    if (bgFetchRunning) return;
    bgFetchRunning = true;
    console.log('[BG] Arka plan veri çekme başladı...');
    
    try {
        const { gotScraping } = await import('got-scraping');
        
        // 5'erli gruplar halinde çek (Kick rate limit'e takılmamak için)
        for (let i = 0; i < ALL_SLUGS.length; i += 5) {
            const chunk = ALL_SLUGS.slice(i, i + 5);
            await Promise.all(chunk.map(slug => fetchSingleStreamer(gotScraping, slug)));
            // Gruplar arası 500ms bekle
            await new Promise(r => setTimeout(r, 500));
        }
        
        console.log(`[BG] Tamamlandı! ${cache.size} yayıncı cache'de.`);
    } catch (err) {
        console.error('[BG] Toplu çekme hatası:', err.message);
    }
    bgFetchRunning = false;
}

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), cache_size: cache.size });
});

// ============================================
// YAYINCI ENDPOINT (POST - 5'erli gruplar)
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
            // Cache'de varsa direkt döndür (ANINDA)
            const cached = cache.get(slug);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
                results.push(cached.data);
                continue;
            }

            // Cache'de yoksa Kick'ten çek
            const data = await fetchSingleStreamer(gotScraping, slug);
            results.push(data);
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        res.json(results);
    } catch (err) {
        console.error('API Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch from Kick API' });
    }
});

// ============================================
// SUNUCUYU BAŞLAT + ARKA PLAN ÇEKME
// ============================================
const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`KNGL RUST sunucusu başladı: http://localhost:${port}`);
        console.log(`Cache: ${CACHE_TTL_MS / 1000}s | Rate Limit: ${RATE_LIMIT_MAX}/dk`);
        
        // Sunucu açılır açılmaz TÜM yayıncıları çek (cache'i ısıt)
        console.log('[BG] İlk veri çekme başlatılıyor...');
        backgroundFetchAll();
        
        // Her 5 dakikada bir otomatik güncelle
        setInterval(backgroundFetchAll, 5 * 60 * 1000);
    });
}

module.exports = app;
