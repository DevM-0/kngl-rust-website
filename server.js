const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'kngl-rust-gizli-anahtar-2026-super-secret';

app.use(express.static(__dirname));
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    next();
});

// ============================================
// RATE LIMITING
// ============================================
const rateLimitMap = new Map();
const loginRateLimitMap = new Map();
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

function loginRateLimit(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    const entry = loginRateLimitMap.get(ip);
    if (!entry || now - entry.start > 15 * 60 * 1000) {
        loginRateLimitMap.set(ip, { start: now, count: 1 });
        return next();
    }
    entry.count++;
    if (entry.count > 5) {
        return res.status(429).json({ error: 'Çok fazla giriş denemesi. 15 dakika bekleyin.' });
    }
    next();
}

setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap) {
        if (now - entry.start > RATE_LIMIT_WINDOW * 2) rateLimitMap.delete(ip);
    }
    for (const [ip, entry] of loginRateLimitMap) {
        if (now - entry.start > 30 * 60 * 1000) loginRateLimitMap.delete(ip);
    }
}, 5 * 60 * 1000);

// ============================================
// YAYINCI CACHE
// ============================================
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

const ALL_SLUGS = [
    'dizci','husamviyuviyu','order','malik',
    'hobbitemo','omer','kadirdemir','kfistaken','yyiido',
    'minik','alixmert','tembik','ekremyaldizkaya',
    'eray','baran','ayberk','caca','ahmetturku',
    'spyks26','falconn2k','musti','bonesaures','vaultcreative',
    'm1ella','ogi','cagatayakman','ersin','ebonivon',
    'sercanzurna','efeuygac','muratkzlcn','alpnfinalform','mert',
    'flomore','barisytb','bekirgedik','maxers','simitciabdu'
];

// ============================================
// KULLANICI + KLİP VERİTABANI (In-Memory)
// ============================================
let users = [];
let clips = [];

const OWNER_USERNAME = process.env.OWNER_USERNAME || 'owner';
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'admin123';

async function initOwner() {
    const hashedPassword = await bcrypt.hash(OWNER_PASSWORD, 12);
    users.push({
        id: 'owner_1',
        username: OWNER_USERNAME,
        password: hashedPassword,
        role: 'owner',
        createdAt: Date.now()
    });
    console.log(`[AUTH] Owner hesabı oluşturuldu: ${OWNER_USERNAME}`);
}

// ============================================
// AUTH MIDDLEWARE
// ============================================
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Yetkisiz erişim' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token' });
    }
}

function ownerOnly(req, res, next) {
    if (req.user.role !== 'owner') {
        return res.status(403).json({ error: 'Bu işlem sadece owner tarafından yapılabilir' });
    }
    next();
}

// ============================================
// ARKA PLAN VERİ ÇEKİCİ
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
        for (let i = 0; i < ALL_SLUGS.length; i += 5) {
            const chunk = ALL_SLUGS.slice(i, i + 5);
            await Promise.all(chunk.map(slug => fetchSingleStreamer(gotScraping, slug)));
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
    res.json({ status: 'ok', uptime: process.uptime(), cache_size: cache.size, clips_count: clips.length });
});

// ============================================
// YAYINCI ENDPOINT
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
// AUTH ENDPOINTS
// ============================================
app.post('/api/admin/login', loginRateLimit, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Kullanıcı adı ve şifre zorunludur' });
    }
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
    }
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

app.get('/api/admin/me', authMiddleware, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ id: user.id, username: user.username, role: user.role });
});

app.post('/api/admin/create-user', authMiddleware, ownerOnly, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || password.length < 6) {
        return res.status(400).json({ error: 'Kullanıcı adı ve şifre (min 6 karakter) zorunludur' });
    }
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ error: 'Bu kullanıcı adı zaten mevcut' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        role: 'admin',
        createdAt: Date.now()
    };
    users.push(newUser);
    res.json({ id: newUser.id, username: newUser.username, role: newUser.role });
});

app.get('/api/admin/users', authMiddleware, ownerOnly, (req, res) => {
    const safeUsers = users.map(u => ({ id: u.id, username: u.username, role: u.role }));
    res.json(safeUsers);
});

app.delete('/api/admin/users/:id', authMiddleware, ownerOnly, (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    if (users[userIndex].role === 'owner') return res.status(403).json({ error: 'Owner silinemez' });
    users.splice(userIndex, 1);
    res.json({ success: true });
});

// ============================================
// KLİP ENDPOINTS
// ============================================
app.get('/api/clips', (req, res) => {
    const sortedClips = [...clips].sort((a, b) => b.createdAt - a.createdAt);
    res.json(sortedClips);
});

app.post('/api/clips/fetch-info', authMiddleware, async (req, res) => {
    const { clipUrl } = req.body;
    if (!clipUrl) return res.status(400).json({ error: 'Klip URL zorunludur' });

    try {
        const urlParts = clipUrl.split('/');
        const clipId = urlParts[urlParts.length - 1];
        if (!clipId || !clipId.startsWith('clip_')) {
            return res.status(400).json({ error: 'Geçersiz klip URL formatı' });
        }

        const { gotScraping } = await import('got-scraping');
        const response = await gotScraping(`https://kick.com/api/v2/clips/${clipId}`);
        if (response.statusCode !== 200) throw new Error('Kick API error');

        const data = JSON.parse(response.body);
        const clip = data.clip;
        if (!clip) return res.status(404).json({ error: 'Klip bulunamadı' });

        res.json({
            clipId: clip.id,
            thumbnail: clip.thumbnail_url,
            title: clip.title,
            views: clip.view_count || clip.views || 0,
            duration: clip.duration,
            channelName: clip.channel?.username || '',
            channelAvatar: clip.channel?.profile_picture || '',
            category: clip.category?.name || 'Rust',
            clipUrl: clipUrl
        });
    } catch (err) {
        console.error('Clip fetch error:', err.message);
        res.status(500).json({ error: 'Klip bilgileri çekilemedi' });
    }
});

app.post('/api/clips', authMiddleware, (req, res) => {
    const { clipId, clipUrl, title, thumbnail, duration, views, channelName, channelAvatar, category } = req.body;
    if (!clipId || !clipUrl || !thumbnail) {
        return res.status(400).json({ error: 'Eksik klip bilgileri' });
    }
    const newClip = {
        id: Date.now().toString(),
        clipId, clipUrl, title, thumbnail, duration, views,
        channelName, channelAvatar, category,
        createdAt: Date.now(),
        addedBy: req.user.username
    };
    clips.push(newClip);
    console.log(`[CLIPS] Yeni klip eklendi: ${title} (by ${req.user.username})`);
    res.json(newClip);
});

app.put('/api/clips/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const clip = clips.find(c => c.id === id);
    if (!clip) return res.status(404).json({ error: 'Klip bulunamadı' });
    if (title) clip.title = title;
    res.json(clip);
});

app.delete('/api/clips/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const index = clips.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Klip bulunamadı' });
    const removed = clips.splice(index, 1);
    console.log(`[CLIPS] Klip silindi: ${removed[0].title} (by ${req.user.username})`);
    res.json({ success: true });
});

// ============================================
// SUNUCUYU BAŞLAT
// ============================================
const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    app.listen(port, async () => {
        console.log(`KNGL RUST sunucusu başladı: http://localhost:${port}`);
        console.log(`Cache: ${CACHE_TTL_MS / 1000}s | Rate Limit: ${RATE_LIMIT_MAX}/dk`);
        
        await initOwner();
        
        console.log('[BG] İlk veri çekme başlatılıyor...');
        backgroundFetchAll();
        setInterval(backgroundFetchAll, 5 * 60 * 1000);
    });
}

module.exports = app;
