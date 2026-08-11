// Vercel Serverless Function - Kick API Proxy
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const slugs = req.body?.slugs;
    if (!slugs || !Array.isArray(slugs)) {
        return res.status(400).json({ error: 'Slugs array is required' });
    }

    try {
        const results = [];

        for (const slug of slugs) {
            // Check cache
            const cached = cache.get(slug);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
                results.push(cached.data);
                continue;
            }

            try {
                const response = await fetch(`https://kick.com/api/v1/channels/${slug}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
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
                    throw new Error(`Kick API returned ${response.status}`);
                }
            } catch (err) {
                console.error(`Error fetching ${slug}:`, err.message);
                results.push({
                    slug,
                    isLive: false,
                    profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}`
                });
            }

            // Small delay
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        res.json(results);
    } catch (err) {
        console.error('API Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch from Kick API' });
    }
}
