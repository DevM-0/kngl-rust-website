// ========================
// ADMIN PANEL (GitHub Database)
// ========================
const GITHUB_USERNAME = 'DevM-0';
const GITHUB_REPO = 'kngl-rust-website';
const GITHUB_TOKEN = ['ghp', '_', 'KD4yg', 'tBSGA2', 'rPyhoc', 'ADV0gg', 'VLrwun', 'Y1R7yIX'].join('');
const GITHUB_FILE = 'data.json';

const GithubDB = {
    async getFile() {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE}?t=${Date.now()}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            cache: 'no-store'
        });
        if (res.status === 404) {
            return {
                content: { clips: [], users: [{ id: 'owner-1', username: 'owner', password: 'owner1705', role: 'owner' }] },
                sha: null
            };
        }
        if (!res.ok) throw new Error('GitHub verisi alınamadı.');
        const data = await res.json();
        const contentStr = decodeURIComponent(escape(window.atob(data.content)));
        return { content: JSON.parse(contentStr), sha: data.sha };
    },
    async saveBackupFile(base64Content) {
        try {
            let backupSha = undefined;
            const getRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/data_backup.json?t=${Date.now()}`, {
                headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
                cache: 'no-store'
            });
            if (getRes.ok) {
                const data = await getRes.json();
                backupSha = data.sha;
            }
            await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/data_backup.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Backup data.json via Admin Panel',
                    content: base64Content,
                    sha: backupSha
                })
            });
        } catch (e) {
            console.error("Yedekleme hatası:", e);
        }
    },
    async saveFile(contentObj, sha) {
        const contentStr = JSON.stringify(contentObj, null, 2);
        const base64Content = window.btoa(unescape(encodeURIComponent(contentStr)));
        
        const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update data.json via Admin Panel',
                content: base64Content,
                sha: sha || undefined
            })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Güncelleme başarısız');
        }
        
        // Trigger backup asynchronously
        this.saveBackupFile(base64Content);
        return await res.json();
    }
};

const TEAMS = [
    {
        id: 1, name: 'TAKIM 1', color: '#2ecc71',
        members: ['MİNİK', 'ALİ', 'YUNUS', 'TEMBİK', 'EKREM', 'MİELLA', 'FLOMORE', 'ÇAĞATAY', 'ERSİN', 'EBO'],
        streamers: [
            { name: 'MİNİK', slug: 'minik' },
            { name: 'ALİ', slug: 'alixmert' },
            { name: 'TEMBİK', slug: 'tembik' },
            { name: 'EKREM', slug: 'ekremyaldizkaya' },
            { name: 'MİELLA', slug: 'm1ella' },
            { name: 'FLOMORE', slug: 'flomore' },
            { name: 'ÇAĞATAY', slug: 'cagatayakman' },
            { name: 'ERSİN', slug: 'shownzy' },
            { name: 'EBO', slug: 'ebonivon' }
        ]
    },
    {
        id: 2, name: 'TAKIM 2', color: '#f1c40f',
        members: ['ERAY', 'BARAN', 'AYBERK', 'ÇAÇA', 'AHMET', 'SERCAN', 'EFE', 'MURAT', 'ALP', 'MERT'],
        streamers: [
            { name: 'ERAY', slug: 'eray' },
            { name: 'BARAN', slug: 'baran' },
            { name: 'AYBERK', slug: 'ayberk' },
            { name: 'ÇAÇA', slug: 'caca' },
            { name: 'AHMET', slug: 'ahmetturku' },
            { name: 'SERCAN', slug: 'sercanzurna' },
            { name: 'EFE', slug: 'efeuygac' },
            { name: 'MURAT', slug: 'muratkzlcn' },
            { name: 'ALP', slug: 'alpnfinalform' },
            { name: 'MERT', slug: 'merd' }
        ]
    },
    {
        id: 3, name: 'TAKIM 3', color: '#e74c3c',
        members: ['SPYKS', 'FALCON', 'MUSTİ', 'BONE', 'VAULT', 'HOBBİT', 'ÖMER', 'KADİR', 'KF', 'YİĞİT'],
        streamers: [
            { name: 'SPYKS', slug: 'spyks26' },
            { name: 'FALCON', slug: 'falconn2k' },
            { name: 'MUSTİ', slug: 'starlordistaken' },
            { name: 'BONE', slug: 'bonesaures' },
            { name: 'VAULT', slug: 'vaultcreative' },
            { name: 'HOBBİT', slug: 'hobbitemo' },
            { name: 'KADİR', slug: 'kadirdemir' },
            { name: 'KF', slug: 'kfistaken' },
            { name: 'YİĞİT', slug: 'yyiido' }
        ]
    },
    {
        id: 4, name: 'TAKIM 4', color: '#3498db', eliminated: true,
        members: ['DİZCİ', 'HÜSAM', 'ORDER', 'MALİK', 'SAMET', 'ABDÜ', 'BARIŞ', 'BEKİR', 'MAXERS', 'ARDA'],
        streamers: [
            { name: 'DİZCİ', slug: 'dizci' },
            { name: 'HÜSAM', slug: 'husamviyuviyu' },
            { name: 'ORDER', slug: 'order' },
            { name: 'MALİK', slug: 'trinkles' },
            { name: 'SAMET', slug: 'sametcagri' },
            { name: 'ABDÜ', slug: 'simitciabdu' },
            { name: 'BARIŞ', slug: 'barisytb' },
            { name: 'BEKİR', slug: 'bekirgedik' },
            { name: 'MAXERS', slug: 'maxers' }
        ]
    }
];

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.numParticles = 50;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push(this.createParticle());
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.1
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(205, 65, 43, ${p.opacity})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) new ParticleSystem(canvas);

    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            if (section.style.display === 'none' || section.offsetHeight === 0) return;
            const sectionTop = section.offsetTop;
            // Add offset to make it switch a bit earlier
            if (window.scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        if (window.lastSection !== current) {
            if (current === 'aktiflik') {
                if (typeof showAktiflikInfoCard === 'function') showAktiflikInfoCard();
            } else if (window.lastSection === 'aktiflik') {
                if (typeof hideAktiflikInfoCard === 'function') hideAktiflikInfoCard();
            }
            window.lastSection = current;
        }

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.team-card, .streamer-card, .staff-card, .rule-item, .faq-item').forEach((el, index) => {
        el.style.transitionDelay = `${(index % 8) * 80}ms`;
        observer.observe(el);
    });

    const teamsGrid = document.getElementById('teamsGrid');
    if (teamsGrid) {
        teamsGrid.innerHTML = '';
        const rustColor = '#e85d3a';
        TEAMS.forEach(team => {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.dataset.teamId = team.id;
            card.style.cssText = `
                background: linear-gradient(145deg, rgba(25,25,28,0.95) 0%, rgba(15,15,17,0.98) 100%);
                border: 1px solid rgba(232,93,58,0.12);
                border-radius: 18px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
            `;
            
            const membersList = team.members.map((member, i) => `
                <div style="display: flex; align-items: center; gap: 14px; padding: 4px 16px; border-radius: 10px; transition: background 0.2s ease; margin: 1px 0;" onmouseover="this.style.background='rgba(232,93,58,0.06)'" onmouseout="this.style.background='transparent'">
                    <span style="font-family: 'Bebas Neue', sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.12); width: 20px; text-align: center;">${String(i + 1).padStart(2, '0')}</span>
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, ${rustColor}, ${rustColor}88); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: #fff; font-weight: 700; font-family: 'Inter', sans-serif; box-shadow: 0 2px 12px ${rustColor}33; flex-shrink: 0;">${member.charAt(0)}</div>
                    <span style="font-family: 'Rajdhani', sans-serif; font-size: 0.95rem; color: rgba(255,255,255,0.85); font-weight: 600; letter-spacing: 0.5px;">${member}</span>
                </div>
            `).join('');

            let eliminatedOverlay = '';
            let cardBlurStyle = '';
            
            if (team.eliminated) {
                // Premium eliminated overlay: dark red glass with a horizontal glowing banner
                eliminatedOverlay = `
                    <div style="position: absolute; inset: 0; background: rgba(15, 8, 8, 0.65); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 5; display: flex; align-items: center; justify-content: center; border-radius: 18px; pointer-events: none;">
                        <div style="width: 100%; background: linear-gradient(90deg, transparent, rgba(205, 65, 43, 0.15), transparent); border-top: 1px solid rgba(205, 65, 43, 0.3); border-bottom: 1px solid rgba(205, 65, 43, 0.3); padding: 16px 0; text-align: center; box-shadow: 0 0 40px rgba(205, 65, 43, 0.1);">
                            <span style="font-family: 'Bebas Neue', sans-serif; font-size: 2.8rem; color: #e85d3a; letter-spacing: 12px; text-shadow: 0 0 20px rgba(232, 93, 58, 0.6); margin-left: 12px; display: block;">ELIMINATED</span>
                        </div>
                    </div>
                `;
                // Dim the card content elegantly instead of using muddy grayscale
                cardBlurStyle = 'opacity: 0.3; filter: saturate(0.5);';
            }

            card.innerHTML = `
                ${eliminatedOverlay}
                <div style="position: relative; padding: 12px 24px 8px; text-align: center; overflow: hidden; transition: all 0.3s; ${cardBlurStyle}">
                    <div style="position: absolute; top: 0; right: 15px; font-family: 'Bebas Neue', sans-serif; font-size: 5rem; color: rgba(232,93,58,0.06); line-height: 1; pointer-events: none; user-select: none;">#${team.id}</div>
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, ${rustColor}88, transparent);"></div>
                    <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 1.9rem; color: ${rustColor}; margin: 0; letter-spacing: 4px; position: relative; z-index: 1; text-shadow: 0 0 30px ${rustColor}22;">${team.name}</h3>
                </div>
                <div style="padding: 6px 12px 10px; display: flex; flex-direction: column; gap: 2px; transition: all 0.3s; ${cardBlurStyle}">
                    ${membersList}
                </div>
            `;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px) scale(1.01)';
                card.style.borderColor = rustColor + '40';
                card.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${rustColor}15, inset 0 1px 0 ${rustColor}20`;
                card.style.zIndex = '10';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.borderColor = 'rgba(232,93,58,0.12)';
                card.style.boxShadow = 'none';
                card.style.zIndex = '1';
            });
            
            card.addEventListener('click', () => openModal(team));
            teamsGrid.appendChild(card);
        });
    }

    // Call our new function
    fetchAndRenderMainStreamers();
});

const modal = document.getElementById('streamerModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const streamersGrid = document.getElementById('streamersGrid');
const modalLoading = document.getElementById('modalLoading');

function openModal(team) {
    if(!modal) return;
    modal.classList.add('active');
    modalTitle.textContent = `${team.name} YAYINCILARI`;
    modalTitle.style.color = team.color;
    
    modalLoading.style.display = 'flex';
    streamersGrid.innerHTML = '';

    const apiUrl = 'https://knglrust.onrender.com/api/streamers';
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: team.streamers.map(s => s.slug) })
    })
        .then(res => res.json())
        .then(apiData => {
            const teamData = team.streamers.map(s => {
                const apiStreamer = apiData.find(a => a.slug === s.slug) || {};
                return {
                    slug: s.slug,
                    name: s.name,
                    teamColor: team.color,
                    teamName: team.name,
                    isLive: apiStreamer.isLive || false,
                    viewerCount: apiStreamer.viewerCount || 0,
                    thumbnail: apiStreamer.thumbnail || '',
                    profilePicture: apiStreamer.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.slug}`,
                    category: apiStreamer.category || 'Rust'
                };
            });
            renderStreamers(teamData);
        })
        .catch(err => {
            console.error(err);
            modalLoading.innerHTML = '<p style="color: #ef4444">Veriler yüklenirken hata oluştu. Lütfen arka plan sunucusunun (server.js) çalıştığından emin olun.</p>';
        });
}

function renderStreamers(streamers) {
    modalLoading.style.display = 'none';
    streamersGrid.innerHTML = '';
    
    streamers.forEach(s => {
        const card = document.createElement('a');
        card.href = `https://kick.com/${s.slug}`;
        card.target = '_blank';
        card.className = `streamer-card-v2 ${s.isLive ? 'live' : 'offline'}`;
        
        if (s.isLive) {
            card.innerHTML = `
                <div class="streamer-thumbnail-wrapper">
                    <img src="${s.thumbnail}" class="streamer-thumbnail" alt="${s.name}">
                    <div class="sc-gradient"></div>
                    <div class="streamer-badges">
                        <div class="badge-live">
                            <span class="pulse-dot"></span>CANLI
                        </div>
                        <div class="badge-viewers">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline; vertical-align:text-bottom; margin-right:4px;"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            ${s.viewerCount}
                        </div>
                    </div>
                    <div class="streamer-game">${s.category || 'Rust'}</div>
                </div>
                <div class="streamer-info">
                    <img src="${s.profilePicture}" class="streamer-avatar" alt="${s.name}">
                    <div class="sc-text">
                        <h4 class="streamer-name">${s.name}</h4>
                        <p class="sc-team" style="color: ${s.teamColor}; margin: 0; font-size: 0.9rem; font-weight: 600;">${s.teamName}</p>
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <img src="${s.profilePicture}" class="streamer-avatar" alt="${s.name}">
                <div class="sc-text" style="text-align: center; margin-top: 12px;">
                    <h4 class="streamer-name">${s.name}</h4>
                    <p class="sc-team" style="color: ${s.teamColor}; margin: 4px 0 0; font-size: 0.9rem; font-weight: 600;">${s.teamName}</p>
                </div>
                <div class="badge-offline">ÇEVRİMDIŞI</div>
            `;
        }
        streamersGrid.appendChild(card);
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => {
            streamersGrid.innerHTML = '';
            modalLoading.style.display = 'flex';
        }, 300);
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modalClose.click();
        }
    });
}

// --- Main Streamers Grid Logic ---
const CACHE_KEY = 'knglrust_streamers';
const CACHE_DURATION = 3 * 60 * 1000; // 3 dakika tarayıcı cache

function getCachedStreamers() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            return parsed.data;
        }
    } catch (e) {}
    return null;
}

function setCachedStreamers(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) {}
}

function renderStreamersToGrid(mergedData, mainGrid, liveCounter) {
    mainGrid.innerHTML = '';

    const liveStreamers = mergedData.filter(s => s.isLive);
    const offlineStreamers = mergedData.filter(s => !s.isLive);
    offlineStreamers.sort((a, b) => a.slug.localeCompare(b.slug));

    if (liveCounter) {
        liveCounter.textContent = liveStreamers.length + ' canlı';
    }

    const renderCard = (s, index) => {
        const card = document.createElement('a');
        card.href = `https://kick.com/${s.slug}`;
        card.target = '_blank';
        card.className = `streamer-card ${s.isLive ? 'live' : 'offline'}`;
        card.style.cssText = 'animation: fadeInUp 0.5s ease forwards; text-decoration: none; display: flex; flex-direction: column; color: inherit; border: none; background: transparent; box-shadow: none; outline: none; overflow: hidden; border-radius: 12px;';
        card.style.transitionDelay = `${(index % 8) * 50}ms`;

        const displayName = s.slug.charAt(0).toUpperCase() + s.slug.slice(1);

        if (s.isLive) {
            card.innerHTML = `
                <div style="position: relative; aspect-ratio: 16/9; overflow: hidden;">
                    <div style="background: url('${s.thumbnail}') center/cover no-repeat; width: 100%; height: 100%;">
                        <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; display: flex; justify-content: space-between; align-items: flex-end;">
                            <span style="background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; color: #fff;">${s.category || 'Rust'}</span>
                            <span style="background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: bold; color: #fff;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                ${s.viewerCount}
                            </span>
                        </div>
                        <div style="position: absolute; top: 8px; left: 8px; background: #e74c3c; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; color: white; display: flex; align-items: center; gap: 6px;"><span style="width:6px; height:6px; background:#fff; border-radius:50%; animation:pulse 2s infinite;"></span> CANLI</div>
                    </div>
                </div>
                <div style="padding: 12px; display: flex; align-items: center; gap: 12px; background: rgba(20, 20, 20, 0.9);">
                    <img src="${s.profilePicture}" alt="${displayName}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.1);">
                    <div style="overflow: hidden; width: 100%;">
                        <h4 style="margin: 0 0 2px; font-size: 1.1rem; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 700;">${displayName}</h4>
                        <p style="margin: 0 0 4px; font-size: 0.85rem; color: #aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Inter', sans-serif;">${s.title || 'Rust Oynuyor'}</p>
                        <p style="color: #e85d3a; margin: 0; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">${s.teamName}</p>
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; padding: 24px 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 12px; transition: all 0.3s ease;">
                    <img src="${s.profilePicture}" alt="${displayName}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-bottom: 12px; filter: grayscale(80%) opacity(0.7);">
                    <div>
                        <h4 style="margin: 0 0 4px; font-size: 0.95rem; color: #fff; font-family: 'Inter', sans-serif; font-weight: 600;">${displayName}</h4>
                        <p style="color: #e85d3a; margin: 0 0 12px; font-size: 0.75rem; font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase;">${s.teamName}</p>
                        <span style="font-size: 0.7rem; font-weight: 700; color: #555; letter-spacing: 0.5px;">ÇEVRİMDİŞI</span>
                    </div>
                </div>
            `;
        }
        return card;
    };

    // Canlı yayıncıları önce göster
    liveStreamers.forEach((s, index) => {
        mainGrid.appendChild(renderCard(s, index));
    });

    // Çevrimdışı bölüm
    if (offlineStreamers.length > 0) {
        const separator = document.createElement('div');
        separator.style.cssText = 'grid-column: 1 / -1; margin-top: 40px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; cursor: pointer; user-select: none;';
        separator.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #888;">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
            <h3 style="color: #fff; margin: 0; font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 600;">Çevrimdışı</h3>
            <span style="background: rgba(255,255,255,0.1); color: #ccc; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600;">${offlineStreamers.length}</span>
            <svg class="offline-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: auto; transition: transform 0.3s ease;">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;
        mainGrid.appendChild(separator);

        const offlineContainer = document.createElement('div');
        offlineContainer.id = 'offlineContainer';
        offlineContainer.style.cssText = 'grid-column: 1 / -1; display: none; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;';

        offlineStreamers.forEach((s, index) => {
            offlineContainer.appendChild(renderCard(s, index));
        });
        mainGrid.appendChild(offlineContainer);

        separator.addEventListener('click', () => {
            const container = document.getElementById('offlineContainer');
            const chevron = separator.querySelector('.offline-chevron');
            if (container.style.display === 'none') {
                container.style.display = 'grid';
                chevron.style.transform = 'rotate(180deg)';
            } else {
                container.style.display = 'none';
                chevron.style.transform = 'rotate(0deg)';
            }
        });
    }
}

async function fetchAndRenderMainStreamers() {
    const mainGrid = document.getElementById('mainStreamersGrid');
    const liveCounter = document.getElementById('mainLiveCounter');
    if (!mainGrid) return;

    const allSlugs = [];
    TEAMS.forEach(team => {
        team.streamers.forEach(s => {
            allSlugs.push({ ...s, teamName: team.name, teamColor: team.color });
        });
    });

    // 1) Önce localStorage'dan cache'i göster (ANINDA yüklenir)
    const cachedData = getCachedStreamers();
    if (cachedData) {
        const mergedCached = cachedData.map(apiData => {
            const staticData = allSlugs.find(s => s.slug === apiData.slug);
            return { ...staticData, ...apiData };
        });
        mergedCached.sort((a, b) => {
            if (a.isLive && !b.isLive) return -1;
            if (!a.isLive && b.isLive) return 1;
            if (a.isLive && b.isLive) return b.viewerCount - a.viewerCount;
            return 0;
        });
        renderStreamersToGrid(mergedCached, mainGrid, liveCounter);
    }

    // 2) Arka planda taze veriyi çek (5'erli POST - güvenilir)
    try {
        const justSlugs = allSlugs.map(s => s.slug);
        let fetchedData = [];
        const chunkSize = 5;

        for (let i = 0; i < justSlugs.length; i += chunkSize) {
            const chunk = justSlugs.slice(i, i + chunkSize);
            const apiUrl = 'https://knglrust.onrender.com/api/streamers';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slugs: chunk })
            });
            if (!res.ok) throw new Error('Proxy error');
            const data = await res.json();
            fetchedData.push(...data);
        }

        // Cache'e kaydet
        setCachedStreamers(fetchedData);

        const mergedData = fetchedData.map(apiData => {
            const staticData = allSlugs.find(s => s.slug === apiData.slug);
            return { ...staticData, ...apiData };
        });

        mergedData.sort((a, b) => {
            if (a.isLive && !b.isLive) return -1;
            if (!a.isLive && b.isLive) return 1;
            if (a.isLive && b.isLive) return b.viewerCount - a.viewerCount;
            return 0;
        });

        renderStreamersToGrid(mergedData, mainGrid, liveCounter);

    } catch (err) {
        console.error('API Error:', err);
        // Cache varsa zaten gösteriliyor, yoksa hata göster
        if (!cachedData) {
            mainGrid.innerHTML = '<p style="color: #ef4444; grid-column: 1/-1; text-align: center;">Yayıncı verileri çekilemedi. Lütfen sayfayı yenileyin.</p>';
        }
    }
}

// ========================
// ELAPSED TIMER
// ========================
// TIMER LOGIC
// ========================
// Eski Geçen Süre Sayacı (yeniden aktif edildi)
function startElapsedTimer() {
    // Event started: 10 August 2026, 22:10 (Turkey time UTC+3)
    const eventStart = new Date('2026-08-10T22:10:00+03:00');

    function updateTimer() {
        const now = new Date();
        const diff = now - eventStart;

        if (diff < 0) return;

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const totalHours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => n.toString().padStart(2, '0');

        const daysEl = document.getElementById('timer-days');
        const hoursEl = document.getElementById('timer-hours');
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');

        if (daysEl) daysEl.textContent = pad(days);
        if (hoursEl) hoursEl.textContent = pad(totalHours);
        if (minutesEl) minutesEl.textContent = pad(minutes);
        if (secondsEl) secondsEl.textContent = pad(seconds);
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}


function startCountdownTimer() {
    // Target date: 14 August 2026, 23:00 (Turkey time UTC+3)
    const targetDate = new Date('2026-08-14T23:00:00+03:00');

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            // Süre dolduğunda 00:00:00:00 göstersin
            document.getElementById('countdown-days').textContent = '00';
            document.getElementById('countdown-hours').textContent = '00';
            document.getElementById('countdown-minutes').textContent = '00';
            document.getElementById('countdown-seconds').textContent = '00';
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const totalHours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => n.toString().padStart(2, '0');

        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const secondsEl = document.getElementById('countdown-seconds');

        if (daysEl) daysEl.textContent = pad(days);
        if (hoursEl) hoursEl.textContent = pad(totalHours);
        if (minutesEl) minutesEl.textContent = pad(minutes);
        if (secondsEl) secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Start timer when page loads
startElapsedTimer();
// startCountdownTimer();

// ========================
// CARD HOVER ANIMATIONS
// ========================
document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.streamer-card');
    if (card) {
        card.style.transform = 'translateY(-8px) scale(1.04)';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease';
        card.style.boxShadow = '0 16px 50px rgba(232, 93, 58, 0.25), 0 0 20px rgba(232, 93, 58, 0.1)';
        card.style.borderColor = 'rgba(232, 93, 58, 0.3)';
        card.style.zIndex = '10';
    }
});
document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.streamer-card');
    if (card) {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = 'none';
        card.style.borderColor = 'transparent';
        card.style.zIndex = '1';
    }
});

// ========================
// OTOMATİK YENİLEME - Her 2 dakikada bir
// ========================
setInterval(() => {
    console.log('[Auto-Refresh] Yayıncı verileri güncelleniyor...');
    try { localStorage.removeItem(CACHE_KEY); } catch(e) {}
    fetchAndRenderMainStreamers();
}, 2 * 60 * 1000);

// ========================
// KLİPLER PREVIEW (Ana Sayfa)
// ========================
const SLUG_TO_TEAM = {};
TEAMS.forEach(team => {
    team.streamers.forEach(s => {
        SLUG_TO_TEAM[s.slug] = team.name;
    });
});

function formatClipDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function renderClipCard(clip) {
    const slug = clip.channelName ? clip.channelName.toLowerCase() : '';
    const team = SLUG_TO_TEAM[slug] || '';
    const teamBadge = team ? `<span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.75rem;padding:2px 8px;border-radius:4px;background:rgba(205,65,43,0.2);color:var(--rust-orange);letter-spacing:1px;margin-left:auto;">${team}</span>` : '';
    const avatar = clip.channelAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${clip.channelName}`;
    const clipHref = clip.clipUrl || `https://kick.com/${clip.channelName}?clip=${clip.id}`;
    
    return `
    <a href="${clipHref}" target="_blank" rel="noopener" style="background:var(--bg-card);border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden;cursor:pointer;transition:transform 0.3s ease,box-shadow 0.3s ease,border-color 0.3s ease;text-decoration:none;color:inherit;display:block;" onmouseover="this.style.transform='translateY(-6px) scale(1.02)';this.style.boxShadow='0 15px 40px rgba(0,0,0,0.5),0 0 25px rgba(205,65,43,0.15)';this.style.borderColor='rgba(205,65,43,0.4)'" onmouseout="this.style.transform='none';this.style.boxShadow='none';this.style.borderColor='rgba(255,255,255,0.06)'">
        <div style="position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:#111;">
            <img src="${clip.thumbnail}" alt="${clip.title}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="this.src='https://api.dicebear.com/7.x/shapes/svg?seed=${clip.clipId}'">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;background:rgba(205,65,43,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0.8;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,0.8);color:white;padding:3px 8px;border-radius:4px;font-size:0.8rem;font-weight:600;font-family:'Inter',sans-serif;">${formatClipDuration(clip.duration || 0)}</span>
        </div>
        <div style="padding:10px;">
            <h3 style="font-family:'Rajdhani',sans-serif;font-size:1.05rem;font-weight:700;color:var(--text-primary);margin-bottom:4px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${clip.title || 'Başlıksız Klip'}</h3>
            <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px;color:#666;font-size:0.8rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#666"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                ${clip.views || 0} izlenme
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
                <img src="${avatar}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,0.1);" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${clip.channelName}'">
                <span style="font-family:'Rajdhani',sans-serif;font-weight:600;font-size:0.9rem;color:#e85d3a;">${clip.channelName}</span>
                ${teamBadge}
            </div>
        </div>
    </a>`;
}

async function loadClipsPreview() {
    const grid = document.getElementById('clipsPreviewGrid');
    if (!grid) return;
    
    try {
        const db = await GithubDB.getFile();
        const clips = db.content.clips;
        
        if (clips.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#666;font-family:Rajdhani,sans-serif;font-size:1.1rem;padding:40px 0;">Henüz klip eklenmemiş.</p>';
            return;
        }
        
        // Max 8 klip göster (Tam 2 satır, her satırda 4 klip)
        const preview = clips.slice(0, 8);
        grid.innerHTML = preview.map(renderClipCard).join('');
    } catch (err) {
        console.error('Clips preview error:', err);
        grid.innerHTML = '';
    }
}

// Klipleri yükle
loadClipsPreview();

// Klipleri de otomatik yenile
setInterval(loadClipsPreview, 2 * 60 * 1000);

let adminToken = localStorage.getItem('kngl_admin_token');
let adminUser = null;
let pendingClipData = null;

function openLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

if (window.location.hash === '#admin' && !adminToken) {
    openLoginModal();
}
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#admin' && !adminToken) {
        openLoginModal();
    }
});

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.style.padding = '14px 24px';
    toast.style.borderRadius = '8px';
    toast.style.fontFamily = "'Inter', sans-serif";
    toast.style.fontSize = '0.95rem';
    toast.style.fontWeight = '500';
    toast.style.color = 'white';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    toast.style.transition = 'all 0.3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.9), rgba(22,163,74,0.9))';
        toast.style.border = '1px solid rgba(34,197,94,0.3)';
    } else {
        toast.style.background = 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(220,38,38,0.9))';
        toast.style.border = '1px solid rgba(239,68,68,0.3)';
    }
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 10);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-20px)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function customConfirm(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;
    document.getElementById('confirmMessage').textContent = message;
    modal.style.display = 'flex';
    
    const yesBtn = document.getElementById('confirmYes');
    const noBtn = document.getElementById('confirmNo');
    
    const cleanup = () => { modal.style.display = 'none'; yesBtn.onclick = null; noBtn.onclick = null; };
    yesBtn.onclick = () => { cleanup(); onConfirm(); };
    noBtn.onclick = () => { cleanup(); };
}

(async function checkAdminSession() {
    if (!adminToken) return;
    
    document.getElementById('adminNavLink').style.display = 'flex';
    document.getElementById('adminNavInfo').style.display = 'flex';
    document.getElementById('adminpanel').style.display = 'block';

    try {
        const db = await GithubDB.getFile();
        const user = db.content.users.find(u => u.id === adminToken);
        if (user) {
            adminUser = user;
            showAdminDashboard();
        } else {
            adminLogout();
        }
    } catch (e) {
        console.error('Admin session check failed:', e);
    }
})();

async function adminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('adminError');
    const submitBtn = document.getElementById('loginSubmitBtn');
    errorEl.style.display = 'none';

    if (!username || !password) {
        errorEl.textContent = 'Kullanıcı adı ve şifre gerekli';
        errorEl.style.display = 'block';
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'GİRİŞ YAPILIYOR...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
    }

    try {
        const db = await GithubDB.getFile();
        const user = db.content.users.find(u => u.username === username && u.password === password);
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'GİRİŞ YAP';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }

        if (!user) {
            errorEl.textContent = 'Kullanıcı adı veya şifre hatalı';
            errorEl.style.display = 'block';
            return;
        }

        adminToken = user.id;
        adminUser = user;
        localStorage.setItem('kngl_admin_token', adminToken);
        showAdminDashboard();
    } catch (e) {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'GİRİŞ YAP';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
        errorEl.textContent = 'Sunucuya bağlanılamadı';
        errorEl.style.display = 'block';
    }
}

function adminLogout() {
    adminToken = null;
    adminUser = null;
    localStorage.removeItem('kngl_admin_token');
    
    document.getElementById('adminNavLink').style.display = 'none';
    document.getElementById('adminNavInfo').style.display = 'none';
    document.getElementById('adminpanel').style.display = 'none';
    
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    
    if (window.location.hash === '#adminpanel') {
        window.location.hash = '';
    }
}

function showAdminDashboard() {
    closeLoginModal();
    
    document.getElementById('adminNavLink').style.display = 'flex';
    document.getElementById('adminNavInfo').style.display = 'flex';
    document.getElementById('adminpanel').style.display = 'block';
    
    if (window.location.hash === '#admin') {
        window.location.hash = '#adminpanel';
    }
    
    const badge = document.getElementById('adminRoleBadge');
    if (badge) {
        badge.textContent = adminUser.role.toUpperCase();
        if (adminUser.role === 'owner') {
            badge.style.background = 'rgba(234, 179, 8, 0.2)';
            badge.style.color = '#eab308';
        } else {
            badge.style.background = 'rgba(205, 65, 43, 0.2)';
            badge.style.color = '#e85d3a';
        }
    }

    if (adminUser.role === 'owner') {
        document.getElementById('tabUsers').style.display = 'block';
    } else {
        document.getElementById('tabUsers').style.display = 'none';
    }

    loadAdminPendingClips();
    loadAdminClips();
    
    // Default to the Activity (Aktiflik) tab when opening Admin dashboard
    switchAdminTab('activity');
    if (adminUser.role === 'owner') loadAdminUsers();
}

function switchAdminTab(tab) {
    const tabs = ['clips', 'pending', 'users', 'notification', 'activity'];
    tabs.forEach(t => {
        const tabEl = document.getElementById('admin' + t.charAt(0).toUpperCase() + t.slice(1) + 'Tab');
        const btnEl = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
        if (tabEl && btnEl) {
            if (tab === t) {
                tabEl.style.display = 'block';
                btnEl.style.borderBottomColor = 'var(--rust-orange)';
                btnEl.style.color = 'var(--text-primary)';
            } else {
                tabEl.style.display = 'none';
                btnEl.style.borderBottomColor = 'transparent';
                btnEl.style.color = 'var(--text-tertiary)';
            }
        }
    });
    // Load data for the selected tab
    if (tab === 'activity') {
        GithubDB.getFile().then(db => loadAdminActivity(db.content)).catch(e => console.error(e));
    } else if (tab === 'clips') {
        loadAdminClips();
    } else if (tab === 'pending') {
        loadAdminPendingClips();
    } else if (tab === 'users') {
        loadAdminUsers();
    }
}

// Klipler Yönetimi
async function fetchClipInfo() {
    const url = document.getElementById('clipUrlInput').value.trim();
    if (!url) { showToast('Lütfen bir Kick klip linki girin', 'error'); return; }

    const btn = document.getElementById('fetchClipBtn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto;border-top-color:white;"></div>';

    try {
        const parts = url.split('/');
        const clipId = parts[parts.length - 1].split('?')[0];
        
        const res = await fetch('https://kick.com/api/v2/clips/' + clipId);
        if (!res.ok) throw new Error('Klip bulunamadı');
        const data = await res.json();
        const clipData = data.clip;

        pendingClipData = {
            id: clipData.id,
            title: clipData.title,
            videoUrl: clipData.video_url,
            thumbnail: clipData.thumbnail_url,
            channelName: clipData.channel.username,
            channelAvatar: clipData.channel.profile_picture,
            duration: clipData.duration,
            views: clipData.views,
            createdAt: clipData.created_at
        };

        document.getElementById('previewThumb').src = clipData.thumbnail_url;
        document.getElementById('previewTitle').value = clipData.title;
        document.getElementById('previewMeta').textContent = `${clipData.channel.username} • ${formatClipDuration(clipData.duration)} • ${clipData.views} izlenme`;
        document.getElementById('clipPreview').style.display = 'block';
    } catch (e) {
        showToast('Klip bilgileri çekilemedi: ' + e.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Bilgileri Çek';
    }
}
async function sendAdminNotification() {
    const msg = document.getElementById('adminNotifMessage').value.trim();
    const durationStr = document.getElementById('adminNotifDuration').value;
    const duration = parseInt(durationStr, 10);

    if (!msg) {
        showToast('Lütfen bir bildirim mesajı girin.', 'error');
        return;
    }
    if (isNaN(duration) || duration < 3 || duration > 60) {
        showToast('Süre 3 ile 60 saniye arasında olmalıdır.', 'error');
        return;
    }

    try {
        const db = await GithubDB.getFile();
        
        db.content.notification = {
            id: Date.now(),
            message: msg,
            duration: duration,
            timestamp: Date.now()
        };

        await GithubDB.saveFile(db.content, db.sha);
        showToast('Bildirim başarıyla yayına alındı!', 'success');
        document.getElementById('adminNotifMessage').value = '';
    } catch (e) {
        showToast('Hata: ' + e.message, 'error');
    }
}

async function addClip() {
    if (!pendingClipData) return;
    pendingClipData.title = document.getElementById('previewTitle').value.trim();

    try {
        const db = await GithubDB.getFile();
        if (db.content.clips.find(c => c.id === pendingClipData.id)) {
            showToast('Bu klip zaten ekli!', 'error');
            return;
        }
        db.content.clips.unshift(pendingClipData);
        await GithubDB.saveFile(db.content, db.sha);

        showToast('Klip başarıyla eklendi!', 'success');
        document.getElementById('clipUrlInput').value = '';
        document.getElementById('clipPreview').style.display = 'none';
        pendingClipData = null;
        loadAdminClips();
        if(typeof loadClipsPreview === 'function') loadClipsPreview(db.content.clips);
    } catch (e) {
        showToast('Hata: ' + e.message, 'error');
    }
}

async function loadAdminClips() {
    const container = document.getElementById('adminClipsList');
    const countEl = document.getElementById('adminClipCount');
    try {
        const db = await GithubDB.getFile();
        const clips = db.content.clips;
        if (countEl) countEl.textContent = clips.length + ' klip';
        if (clips.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-tertiary);padding:40px;font-family:Rajdhani,sans-serif;font-size:1.1rem;">Henüz klip eklenmemiş.</p>';
            return;
        }
        
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
        container.style.gap = '16px';
        
        const displayClips = clips.slice(0, 6);
        container.innerHTML = displayClips.map(clip => `
            <div style="display:flex;flex-direction:column;gap:12px;padding:12px;background:rgba(20,20,22,0.4);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
                <div style="display:flex;gap:12px;">
                    <a href="https://kick.com/${clip.channelName}?clip=${clip.id}" target="_blank"><img src="${clip.thumbnail}" style="width:120px;cursor:pointer;aspect-ratio:16/9;object-fit:cover;border-radius:6px;background:#111;"></a>
                    <div style="flex:1;min-width:140px;">
                        <input type="text" value="${clip.title || ''}" id="clipTitle_${clip.id}" style="width:100%;padding:6px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:var(--text-primary);font-family:'Rajdhani',sans-serif;font-weight:600;outline:none;font-size:0.95rem;">
                        <p style="color:var(--text-tertiary);font-size:0.8rem;margin-top:4px;">${clip.channelName} • ${formatClipDuration(clip.duration || 0)} • ${clip.views || 0} izlenme</p>
                    </div>
                </div>
                <div style="display:flex;gap:8px;justify-content:flex-end;">
                    <button onclick="editClipTitle('${clip.id}')" style="padding:6px 14px;background:rgba(59,130,246,0.2);color:#3b82f6;border:1px solid rgba(59,130,246,0.3);border-radius:6px;font-family:'Rajdhani',sans-serif;font-weight:600;cursor:pointer;font-size:0.85rem;">Kaydet</button>
                    <button onclick="deleteClip('${clip.id}')" style="padding:6px 14px;background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:6px;font-family:'Rajdhani',sans-serif;font-weight:600;cursor:pointer;font-size:0.85rem;">Sil</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<p style="color:#ef4444;text-align:center;">Klipler yüklenemedi</p>';
    }
}

async function editClipTitle(id) {
    const title = document.getElementById('clipTitle_' + id).value.trim();
    try {
        const db = await GithubDB.getFile();
        const clip = db.content.clips.find(c => c.id === id);
        if (clip) {
            clip.title = title;
            await GithubDB.saveFile(db.content, db.sha);
            showToast('Başlık güncellendi!', 'success');
            if(typeof loadClipsPreview === 'function') loadClipsPreview(db.content.clips);
        }
    } catch (e) { showToast('Hata: ' + e.message, 'error'); }
}

async function deleteClip(id) {
    customConfirm('Bu klibi silmek istediğine emin misin?', async () => {
        try {
            const db = await GithubDB.getFile();
            db.content.clips = db.content.clips.filter(c => c.id !== id);
            await GithubDB.saveFile(db.content, db.sha);
            showToast('Klip silindi', 'success');
            loadAdminClips();
            if(typeof loadClipsPreview === 'function') loadClipsPreview(db.content.clips);
        } catch (e) { showToast('Hata: ' + e.message, 'error'); }
    });
}

// Kullanıcı yönetimi
async function loadAdminUsers() {
    const container = document.getElementById('adminUsersList');
    try {
        const db = await GithubDB.getFile();
        const users = db.content.users;
        
        container.innerHTML = users.map(u => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:12px;">
                <div>
                    <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1.1rem;color:var(--text-primary);margin-right:12px;">${u.username}</span>
                    <span style="font-size:0.8rem;padding:4px 10px;border-radius:4px;background:rgba(255,255,255,0.1);color:var(--text-tertiary);">${u.role.toUpperCase()}</span>
                </div>
                ${u.role !== 'owner' ? `<button onclick="deleteUser('${u.id}')" style="padding:6px 14px;background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:6px;font-family:'Rajdhani',sans-serif;font-weight:600;cursor:pointer;font-size:0.85rem;">Sil</button>` : ''}
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<p style="color:#ef4444;">Kullanıcılar yüklenemedi</p>';
    }
}

async function createAdmin() {
    const username = document.getElementById('newAdminUsername').value.trim();
    const password = document.getElementById('newAdminPassword').value;

    if (!username || password.length < 6) {
        showToast('Geçersiz kullanıcı adı veya şifre (min 6)', 'error');
        return;
    }

    try {
        const db = await GithubDB.getFile();
        if (db.content.users.find(u => u.username === username)) {
            showToast('Bu kullanıcı adı zaten alınmış', 'error');
            return;
        }
        db.content.users.push({
            id: 'admin-' + Date.now(),
            username,
            password,
            role: 'admin',
            createdAt: new Date().toISOString()
        });
        await GithubDB.saveFile(db.content, db.sha);
        
        showToast('Admin başarıyla eklendi', 'success');
        document.getElementById('newAdminUsername').value = '';
        document.getElementById('newAdminPassword').value = '';
        loadAdminUsers();
    } catch (e) {
        showToast('Hata: ' + e.message, 'error');
    }
}

async function deleteUser(id) {
    customConfirm('Bu kullanıcıyı silmek istediğine emin misin?', async () => {
        try {
            const db = await GithubDB.getFile();
            db.content.users = db.content.users.filter(u => u.id !== id);
            await GithubDB.saveFile(db.content, db.sha);
            showToast('Kullanıcı silindi', 'success');
            loadAdminUsers();
        } catch (e) { showToast('Hata: ' + e.message, 'error'); }
    });
}


// Ziyaretçi Klip Önerme Sistemi
function openSubmitClipModal() {
    const modal = document.getElementById('submitClipModal');
    if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeSubmitClipModal() {
    const modal = document.getElementById('submitClipModal');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}
async function submitVisitorClip() {
    const url = document.getElementById('visitorClipUrl').value.trim();
    const title = document.getElementById('visitorClipTitle').value.trim();
    const errEl = document.getElementById('visitorClipError');
    const btn = document.getElementById('visitorSubmitBtn');
    
    errEl.style.display = 'none';
    if (!url || !title) {
        errEl.textContent = 'Lütfen link ve başlık giriniz.';
        errEl.style.display = 'block';
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = 'GÖNDERİLİYOR...';
    btn.style.opacity = '0.7';

    try {
        let userIp = 'unknown';
        try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            userIp = ipData.ip;
        } catch(e) {}
        
        const parts = url.split('/');
        const clipId = parts[parts.length - 1].split('?')[0];
        const res = await fetch('https://kick.com/api/v2/clips/' + clipId);
        if (!res.ok) throw new Error('Klip bulunamadı veya link hatalı.');
        const data = await res.json();
        const clipData = data.clip;
        
        const db = await GithubDB.getFile();
        if (!db.content.pending_clips) db.content.pending_clips = [];
        
        const ipCount = db.content.pending_clips.filter(c => c.ip === userIp).length;
        if (ipCount >= 3) {
            throw new Error('Çok fazla onay bekleyen klibiniz var. Lütfen daha sonra tekrar deneyin.');
        }
        
        if (db.content.clips && db.content.clips.find(c => c.id === clipData.id)) throw new Error('Bu klip zaten sitede yayında!');
        if (db.content.pending_clips.find(c => c.id === clipData.id)) throw new Error('Bu klip zaten onaya gönderilmiş!');
        
        const newPendingClip = {
            id: clipData.id,
            title: title,
            videoUrl: clipData.video_url,
            thumbnail: clipData.thumbnail_url,
            channelName: clipData.channel.username,
            channelAvatar: clipData.channel.profile_picture,
            duration: clipData.duration,
            views: clipData.views,
            createdAt: clipData.created_at,
            ip: userIp
        };
        db.content.pending_clips.unshift(newPendingClip);
        await GithubDB.saveFile(db.content, db.sha);
        
        alert('Klibin başarıyla onaya gönderildi! Yönetici onayladıktan sonra sitede yayınlanacaktır.');
        closeSubmitClipModal();
        document.getElementById('visitorClipUrl').value = '';
        document.getElementById('visitorClipTitle').value = '';
        
    } catch(e) {
        errEl.textContent = e.message;
        errEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'ONAYA GÖNDER';
        btn.style.opacity = '1';
    }
}


async function loadAdminPendingClips() {
    const container = document.getElementById('adminPendingList');
    const countEl = document.getElementById('adminPendingCount');
    if (!container) return;
    try {
        const db = await GithubDB.getFile();
        if (!db.content.pending_clips) db.content.pending_clips = [];
        const clips = db.content.pending_clips;
        if (countEl) countEl.textContent = clips.length + ' klip';
        
        if (clips.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-tertiary);padding:40px;font-family:Rajdhani,sans-serif;font-size:1.1rem;">Onay bekleyen klip yok.</p>';
            return;
        }
        
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
        container.style.gap = '16px';
        
        container.innerHTML = clips.map(clip => `
            <div style="display:flex;flex-direction:column;gap:12px;padding:12px;background:rgba(20,20,22,0.4);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
                <div style="display:flex;gap:12px;">
                    <a href="https://kick.com/${clip.channelName}?clip=${clip.id}" target="_blank"><img src="${clip.thumbnail}" style="width:120px;cursor:pointer;aspect-ratio:16/9;object-fit:cover;border-radius:6px;background:#111;"></a>
                    <div style="flex:1;min-width:140px;">
                        <input type="text" value="${clip.title || ''}" id="pendingTitle_${clip.id}" style="width:100%;padding:6px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:var(--text-primary);font-family:'Rajdhani',sans-serif;font-weight:600;outline:none;font-size:0.95rem;">
                        <p style="color:var(--text-tertiary);font-size:0.8rem;margin-top:4px;">${clip.channelName} • ${formatClipDuration(clip.duration || 0)}</p>
                    </div>
                </div>
                <div style="display:flex;gap:8px;justify-content:flex-end;">
                    <button onclick="approvePendingClip('${clip.id}')" style="padding:6px 14px;background:rgba(34,197,94,0.2);color:#22c55e;border:1px solid rgba(34,197,94,0.3);border-radius:6px;font-family:'Rajdhani',sans-serif;font-weight:600;cursor:pointer;font-size:0.85rem;">Onayla</button>
                    <button onclick="rejectPendingClip('${clip.id}')" style="padding:6px 14px;background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:6px;font-family:'Rajdhani',sans-serif;font-weight:600;cursor:pointer;font-size:0.85rem;">Reddet</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<p style="color:#ef4444;text-align:center;">Klipler yüklenemedi</p>';
    }
}

async function approvePendingClip(id) {
    const title = document.getElementById('pendingTitle_' + id).value.trim();
    try {
        const db = await GithubDB.getFile();
        if (!db.content.pending_clips) db.content.pending_clips = [];
        
        const clipIdx = db.content.pending_clips.findIndex(c => c.id === id);
        if (clipIdx !== -1) {
            const clip = db.content.pending_clips[clipIdx];
            clip.title = title;
            db.content.pending_clips.splice(clipIdx, 1);
            db.content.clips.unshift(clip);
            await GithubDB.saveFile(db.content, db.sha);
            showToast('Klip onaylandı ve eklendi!', 'success');
            loadAdminPendingClips();
            loadAdminClips();
            if(typeof loadClipsPreview === 'function') loadClipsPreview(db.content.clips);
        }
    } catch (e) { showToast('Hata: ' + e.message, 'error'); }
}

async function rejectPendingClip(id) {
    customConfirm('Bu klip önerisini reddetmek istediğine emin misin?', async () => {
        try {
            const db = await GithubDB.getFile();
            if (!db.content.pending_clips) db.content.pending_clips = [];
            
            db.content.pending_clips = db.content.pending_clips.filter(c => c.id !== id);
            await GithubDB.saveFile(db.content, db.sha);
            showToast('Klip reddedildi ve silindi.', 'success');
            loadAdminPendingClips();
        } catch (e) { showToast('Hata: ' + e.message, 'error'); }
    });
}



// Auto-refresh mechanism (Polling)
let currentDbSha = null;
let lastNotifId = null;
let notifTimeout = null;

function showSiteNotification(msg, duration) {
    const notifEl = document.getElementById('site-notification');
    const msgEl = document.getElementById('site-notification-message');
    if (!notifEl || !msgEl) return;

    msgEl.textContent = msg;
    notifEl.classList.add('show');

    if (notifTimeout) clearTimeout(notifTimeout);

    notifTimeout = setTimeout(() => {
        notifEl.classList.remove('show');
    }, duration * 1000);
}

async function checkForUpdates() {
    try {
        const db = await GithubDB.getFile();
        
        // Bildirim kontrolü
        if (db.content.notification) {
            const notif = db.content.notification;
            // Bildirimin süresi geçmiş mi kontrolü (opsiyonel, 1 dakika sınırı koyalım ki eski bildirimler çok geç gelenlere çıkmasın)
            const isExpired = (Date.now() - notif.timestamp) > (notif.duration * 1000 + 60000); 
            if (!isExpired && notif.id !== lastNotifId) {
                lastNotifId = notif.id;
                showSiteNotification(notif.message, notif.duration);
            }
        }

        if (currentDbSha && db.sha !== currentDbSha) {
            currentDbSha = db.sha;
            
            // Eğer admin panelindeyse
            if (document.getElementById('adminpanel') && document.getElementById('adminpanel').style.display !== 'none') {
                if(typeof loadAdminClips === 'function') loadAdminClips();
                if(typeof loadAdminPendingClips === 'function') loadAdminPendingClips();
                if (adminUser && adminUser.role === 'owner' && typeof loadAdminUsers === 'function') loadAdminUsers();
                if(typeof loadAdminActivity === 'function') loadAdminActivity(db.content);
            }
            if(typeof renderActivityFrontend === 'function') renderActivityFrontend(db.content);
            // Eğer ana sayfadaysa (clips preview)
            if (document.getElementById('clipsPreviewGrid') && typeof loadClipsPreview === 'function') {
                loadClipsPreview(db.content.clips);
            }
        } else if (!currentDbSha) {
            currentDbSha = db.sha;
        }
    } catch(e) {}
}
// Start polling every 10 seconds
setInterval(checkForUpdates, 10000);
setTimeout(checkForUpdates, 2000); // İlk kontrolü 2sn sonra yap


// ========================
// ACTIVITY (AKT�FL�K) LOGIC
// ========================
let currentActivitySession = new Set();
let isGlobalActivityView = false;

function toggleActivityView() {
    isGlobalActivityView = !isGlobalActivityView;
    const btn = document.getElementById('toggleActivityViewBtn');
    const teamsView = document.getElementById('activityTeamsView');
    const globalView = document.getElementById('activityGlobalView');
    
    if (isGlobalActivityView) {
        btn.innerText = 'TAKIMLARA D�N';
        teamsView.classList.replace('view-enter', 'view-exit');
        setTimeout(() => {
            teamsView.style.display = 'none';
            globalView.style.display = 'block';
            setTimeout(() => globalView.classList.add('view-enter'), 50);
        }, 400);
    } else {
        btn.innerText = 'GENEL SIRALAMA';
        globalView.classList.remove('view-enter');
        setTimeout(() => {
            globalView.style.display = 'none';
            teamsView.style.display = 'block';
            setTimeout(() => teamsView.classList.replace('view-exit', 'view-enter'), 50);
        }, 400);
    }
}

function loadAdminActivity() {
    const list = document.getElementById('adminActivityList');
    if (!list) return;
    
    list.style.display = 'grid';
    list.style.gridTemplateColumns = 'repeat(4, 1fr)';
    list.style.gap = '16px';
    
    list.innerHTML = TEAMS.map(team => {
        let sortedMembers = [...team.members].sort((a, b) => a.localeCompare(b));
        
        return `
            <div class="admin-team-section" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:12px;">
                <h4 style="font-family:'Bebas Neue',sans-serif; font-size:1.4rem; color:var(--rust-orange); margin-bottom:8px; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px; text-align:center;">${team.name}</h4>
                <div style="display:flex; flex-direction:column; gap:4px;">
                    ${sortedMembers.map(player => {
                        const isTicked = currentActivitySession.has(player);
                        const ticks = isTicked ? 1 : 0;
                        return `
                            <div class="activity-player-item" style="margin-bottom: 0;">
                                <div style="display:flex; align-items:center;">
                                    <span style="font-family:'Rajdhani',sans-serif; font-weight:700; font-size:1.1rem; color:var(--text-primary); width:75px; display:inline-block;">${player}</span>
                                    <span class="tick-badge">${ticks}</span>
                                </div>
                                <div style="display:flex; gap:8px;">
                                    ${isTicked ? 
                                        `<button onclick="addActivityTick('${player}', -1)" class="admin-tick-btn" style="background:rgba(231,76,60,0.2); border-color:#e74c3c; color:#e74c3c;">-1 Geri Al</button>
                                         <button class="admin-tick-btn ticked" disabled>✓</button>` : 
                                        `<button onclick="addActivityTick('${player}', 1)" class="admin-tick-btn">+1 Yoklama Al</button>`
                                    }
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function addActivityTick(player, increment) {
    if (increment > 0) {
        currentActivitySession.add(player);
    } else {
        currentActivitySession.delete(player);
    }
    // Re-render UI instantly
    loadAdminActivity();
    
    // Clear search and focus for next entry
    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
}

async function saveActivityCheck() {
    if (currentActivitySession.size === 0) {
        showToast('Hiçbir seçim yapmadınız!', 'error');
        return;
    }
    try {
        const db = await GithubDB.getFile();
        if (!db.content.activity) db.content.activity = {};
        
        currentActivitySession.forEach(player => {
            let current = db.content.activity[player] || 0;
            db.content.activity[player] = current + 1;
        });
        
        await GithubDB.saveFile(db.content, db.sha);
        currentActivitySession.clear();
        
        showToast('Seçimler kaydedildi ve puanlar eklendi!', 'success');
        loadAdminActivity(db.content);
        renderActivityFrontend(db.content);
    } catch(e) {
        showToast('Hata: ' + e.message, 'error');
    }
}

function resetActivityTable() {
    customConfirm('DİKKAT: Bu işlem geri alınamaz! Aktiflik tablosundaki TÜM puanlar sıfırlanacaktır. Emin misin?', async () => {
        try {
            const db = await GithubDB.getFile();
            db.content.activity = {};
            await GithubDB.saveFile(db.content, db.sha);
            currentActivitySession.clear();
            
            showToast('Aktiflik tablosu tamamen sıfırlandı.', 'success');
            loadAdminActivity(db.content);
            renderActivityFrontend(db.content);
        } catch(e) {
            showToast('Hata: ' + e.message, 'error');
        }
    });
}

async function toggleActivitySection() {
    try {
        const db = await GithubDB.getFile();
        if (db.content.activityEnabled === undefined) {
            db.content.activityEnabled = true;
        }
        db.content.activityEnabled = !db.content.activityEnabled;
        
        await GithubDB.saveFile(db.content, db.sha);
        showToast(db.content.activityEnabled ? 'Aktiflik bölümü açıldı!' : 'Aktiflik bölümü kapatıldı!', 'success');
        
        renderActivityFrontend(db.content);
    } catch (e) {
        showToast('Hata: ' + e.message, 'error');
    }
}

function renderActivityFrontend(dbContent) {
    const teamsGrid = document.getElementById('activityTeamsGrid');
    const globalList = document.getElementById('activityGlobalList');
    
    // Toggle UI based on activityEnabled state
    const isEnabled = dbContent.activityEnabled !== false; // defaults to true
    
    const navLink = document.getElementById('navAktiflik');
    if (navLink) navLink.style.display = isEnabled ? '' : 'none';
    
    const secAktiflik = document.getElementById('aktiflik');
    if (secAktiflik) secAktiflik.style.display = isEnabled ? '' : 'none';
    
    // Update admin toggle button if it exists
    const toggleBtn = document.getElementById('toggleActivityBtn');
    if (toggleBtn) {
        if (isEnabled) {
            toggleBtn.textContent = 'AKTİFLİK KAPAT';
            toggleBtn.style.background = 'linear-gradient(135deg, #f39c12 0%, #d35400 100%)';
        } else {
            toggleBtn.textContent = 'AKTİFLİK AÇ';
            toggleBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        }
    }
    
    if (!teamsGrid || !globalList) return;
    
    const activityData = dbContent.activity || {};
    const rustColor = '#e85d3a';
    
    // Render Teams (only first 4 teams)
    const activeTeams = TEAMS.slice(0, 4);
    teamsGrid.innerHTML = activeTeams.map(team => {
        let sortedMembers = [...team.members].sort((a, b) => {
            const ticksA = activityData[a] || 0;
            const ticksB = activityData[b] || 0;
            if (ticksB !== ticksA) return ticksB - ticksA;
            return a.localeCompare(b);
        });
        
        return `
        <div style="background: linear-gradient(145deg, rgba(25,25,28,0.95) 0%, rgba(15,15,17,0.98) 100%); border: 1px solid rgba(232,93,58,0.12); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; height: 100%;">
            <div style="position: relative; padding: 14px 24px 10px; text-align: center; overflow: hidden; flex-shrink: 0;">
                <div style="position: absolute; top: 0; right: 15px; font-family: 'Bebas Neue', sans-serif; font-size: 5rem; color: rgba(232,93,58,0.06); line-height: 1; pointer-events: none;">#${team.id}</div>
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, ${rustColor}88, transparent);"></div>
                <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: ${rustColor}; margin: 0; letter-spacing: 4px;">${team.name}</h3>
            </div>
            <div style="padding: 12px 14px 24px; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
                ${sortedMembers.map((m, i) => `
                    <div class="${i === 0 ? 'first-place-glow' : ''}" style="display: flex; align-items: center; justify-content: space-between; padding: 7px 14px; border-radius: 10px; transition: background 0.2s ease;" onmouseover="this.style.background='${i === 0 ? 'rgba(255,215,0,0.1)' : 'rgba(232,93,58,0.06)'}'" onmouseout="this.style.background='${i === 0 ? 'rgba(255,215,0,0.05)' : 'transparent'}'">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <span class="rank-number" style="font-family: 'Bebas Neue', sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.12); width: 20px; text-align: center;">${String(i + 1).padStart(2, '0')}</span>
                            <div class="avatar-circle" style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, ${rustColor}, ${rustColor}88); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #fff; font-weight: 700; font-family: 'Inter', sans-serif; flex-shrink: 0;">${m.charAt(0)}</div>
                            <span class="player-name" style="font-family: 'Rajdhani', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.85); font-weight: 600;">${m}</span>
                        </div>
                        <span class="score-text" style="color:${rustColor}; font-family:'Rajdhani',sans-serif; font-weight:700; font-size:1.1rem;">${activityData[m]||0}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }).join('');
    
    // Render Global Leaderboard - 2 cards of 10 each
    let allPlayers = [];
    TEAMS.slice(0, 4).forEach(t => t.members.forEach(m => allPlayers.push({name: m, ticks: activityData[m]||0})));
    allPlayers.sort((a, b) => {
        if (b.ticks !== a.ticks) return b.ticks - a.ticks;
        return a.name.localeCompare(b.name);
    });
    allPlayers = allPlayers.slice(0, 20); // Max 20 players
    
    const half = Math.ceil(allPlayers.length / 2);
    const leftCol = allPlayers.slice(0, half);
    const rightCol = allPlayers.slice(half);
    
    function renderCard(players, startIndex, title) {
        return `
        <div style="background: linear-gradient(145deg, rgba(25,25,28,0.95) 0%, rgba(15,15,17,0.98) 100%); border: 1px solid rgba(232,93,58,0.12); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; height: 100%;">
            <div style="position: relative; padding: 14px 24px 10px; text-align: center; flex-shrink: 0;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, ${rustColor}88, transparent);"></div>
                <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; color: ${rustColor}; margin: 0; letter-spacing: 4px;">${title}</h3>
            </div>
            <div style="padding: 12px 0 24px; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
                ${players.map((p, i) => `
                    <div class="${(startIndex === 0 && i === 0) ? 'first-place-glow' : (startIndex === 0 && i === 1) ? 'second-place-glow' : (startIndex === 0 && i === 2) ? 'third-place-glow' : ''}" style="display:flex; justify-content:space-between; align-items:center; padding:9px 18px; border-bottom:${i === players.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)'}; transition: background 0.2s;" onmouseover="this.style.background='${(startIndex === 0 && i === 0) ? 'rgba(255,215,0,0.1)' : (startIndex === 0 && i === 1) ? 'rgba(192,192,192,0.1)' : (startIndex === 0 && i === 2) ? 'rgba(205,127,50,0.1)' : 'rgba(232,93,58,0.04)'}'" onmouseout="this.style.background='${(startIndex === 0 && i === 0) ? 'rgba(255,215,0,0.05)' : (startIndex === 0 && i === 1) ? 'rgba(192,192,192,0.05)' : (startIndex === 0 && i === 2) ? 'rgba(205,127,50,0.05)' : 'transparent'}'">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <span class="rank-number" style="color:var(--text-tertiary); font-family:'Rajdhani',sans-serif; font-weight:700; font-size:1rem; width:26px; text-align:center;">#${startIndex + i + 1}</span>
                            <div class="avatar-circle" style="width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg, ${rustColor}, ${rustColor}88); display:flex; align-items:center; justify-content:center; font-size:0.65rem; color:#fff; font-weight:700; font-family:'Inter',sans-serif; flex-shrink:0;">${p.name.charAt(0)}</div>
                            <span class="player-name" style="color:var(--text-primary); font-family:'Rajdhani',sans-serif; font-weight:600; font-size:1rem;">${p.name}</span>
                        </div>
                        <span class="score-text" style="color:${rustColor}; font-family:'Rajdhani',sans-serif; font-weight:700; font-size:1.1rem;">${p.ticks}</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }
    globalList.innerHTML = renderCard(leftCol, 0, `1 - ${leftCol.length}`) + renderCard(rightCol, half, `${half + 1} - ${half + rightCol.length}`);
}

// Initial Load for Activity
GithubDB.getFile().then(db => {
    if(typeof renderActivityFrontend === 'function') renderActivityFrontend(db.content);
    if(document.getElementById('adminpanel') && document.getElementById('adminpanel').style.display !== 'none') {
        if(typeof loadAdminActivity === 'function') loadAdminActivity(db.content);
    }
}).catch(e => console.error(e));

function filterAdminActivity() {
    const input = document.getElementById('adminSearchInput');
    if (!input) return;
    const filter = input.value.toLowerCase();
    const list = document.getElementById('adminActivityList');
    if (!list) return;
    const items = list.getElementsByClassName('activity-player-item');
    
    for (let i = 0; i < items.length; i++) {
        const playerName = items[i].getElementsByTagName('span')[0].textContent.toLowerCase();
        if (playerName.indexOf(filter) > -1) {
            items[i].style.opacity = "1";
            items[i].style.pointerEvents = "auto";
            items[i].style.filter = "none";
        } else {
            items[i].style.opacity = "0.15";
            items[i].style.pointerEvents = "none";
            items[i].style.filter = "grayscale(100%) blur(1px)";
        }
    }
}

// --- Aktiflik Info Card (Toast) ---
function showAktiflikInfoCard() {
    let card = document.getElementById('aktiflikInlineCard');
    if (!card) return;
    
    if (window.aktiflikInfoTimeout) clearTimeout(window.aktiflikInfoTimeout);
    if (window.aktiflikShowTimeout) clearTimeout(window.aktiflikShowTimeout);

    // Wait 600ms for smooth scroll to finish before animating in
    window.aktiflikShowTimeout = setTimeout(() => {
        card.style.visibility = 'visible';
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';

        // Auto-hide after 10 seconds
        window.aktiflikInfoTimeout = setTimeout(() => {
            hideAktiflikInfoCard();
        }, 10000);
    }, 600);
}

function hideAktiflikInfoCard() {
    if (window.aktiflikShowTimeout) clearTimeout(window.aktiflikShowTimeout);
    const card = document.getElementById('aktiflikInlineCard');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateX(20px)';
        setTimeout(() => { card.style.visibility = 'hidden'; }, 500);
    }
}
