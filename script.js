const TEAMS = [
    {
        id: 1, name: 'TAKIM 1', color: '#3498db',
        members: ['DİZCİ', 'HÜSAM', 'ORDER', 'MALİK', 'SAMET'],
        streamers: [
            { name: 'DİZCİ', slug: 'dizci' },
            { name: 'HÜSAM', slug: 'husamviyuviyu' },
            { name: 'ORDER', slug: 'order' },
            { name: 'MALİK', slug: 'malik' },
            { name: 'SAMET', slug: 'samet' }
        ]
    },
    {
        id: 2, name: 'TAKIM 2', color: '#e74c3c',
        members: ['HOBBİT', 'ÖMER', 'KADİR', 'KF', 'YİĞİT'],
        streamers: [
            { name: 'HOBBİT', slug: 'hobbitemo' },
            { name: 'ÖMER', slug: 'omer' },
            { name: 'KADİR', slug: 'kadirdemir' },
            { name: 'KF', slug: 'kfistaken' },
            { name: 'YİĞİT', slug: 'yyiido' }
        ]
    },
    {
        id: 3, name: 'TAKIM 3', color: '#2ecc71',
        members: ['MİNİK', 'ALİ', 'YUNUS', 'TEMBİK', 'EKREM'],
        streamers: [
            { name: 'MİNİK', slug: 'minik' },
            { name: 'ALİ', slug: 'alixmert' },
            { name: 'YUNUS', slug: 'yunus' },
            { name: 'TEMBİK', slug: 'tembik' },
            { name: 'EKREM', slug: 'ekremyaldizkaya' }
        ]
    },
    {
        id: 4, name: 'TAKIM 4', color: '#f1c40f',
        members: ['ERAY', 'BARAN', 'AYBERK', 'ÇAÇA', 'AHMET'],
        streamers: [
            { name: 'ERAY', slug: 'eray' },
            { name: 'BARAN', slug: 'baran' },
            { name: 'AYBERK', slug: 'ayberk' },
            { name: 'ÇAÇA', slug: 'caca' },
            { name: 'AHMET', slug: 'ahmetturku' }
        ]
    },
    {
        id: 5, name: 'TAKIM 5', color: '#9b59b6',
        members: ['SPYKS', 'FALCON', 'MUSTİ', 'BONE', 'VAULT'],
        streamers: [
            { name: 'SPYKS', slug: 'spyks26' },
            { name: 'FALCON', slug: 'falconn2k' },
            { name: 'MUSTİ', slug: 'musti' },
            { name: 'BONE', slug: 'bonesaures' },
            { name: 'VAULT', slug: 'vaultcreative' }
        ]
    },
    {
        id: 6, name: 'TAKIM 6', color: '#00e5ff',
        members: ['MİELLA', 'OGİ', 'ÇAĞATAY', 'ERSİN', 'EBO'],
        streamers: [
            { name: 'MİELLA', slug: 'm1ella' },
            { name: 'OGİ', slug: 'ogi' },
            { name: 'ÇAĞATAY', slug: 'cagatayakman' },
            { name: 'ERSİN', slug: 'ersin' },
            { name: 'EBO', slug: 'ebonivon' }
        ]
    },
    {
        id: 7, name: 'TAKIM 7', color: '#f39c12',
        members: ['SERCAN', 'EFE UYGAÇ', 'MURAT', 'ALP', 'MERT'],
        streamers: [
            { name: 'SERCAN', slug: 'sercanzurna' },
            { name: 'EFE UYGAÇ', slug: 'efeuygac' },
            { name: 'MURAT', slug: 'muratkzlcn' },
            { name: 'ALP', slug: 'alpnfinalform' },
            { name: 'MERT', slug: 'mert' }
        ]
    },
    {
        id: 8, name: 'TAKIM 8', color: '#ff66b2',
        members: ['FLOMORE', 'BARIS', 'BEKİR', 'MAXERS', 'SİMİTÇİ ABDÜ'],
        streamers: [
            { name: 'FLOMORE', slug: 'flomore' },
            { name: 'BARIS', slug: 'barisytb' },
            { name: 'BEKİR', slug: 'bekirgedik' },
            { name: 'MAXERS', slug: 'maxers' },
            { name: 'SİMİTÇİ ABDÜ', slug: 'simitciabdu' }
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
            const sectionTop = section.offsetTop;
            // Add offset to make it switch a bit earlier
            if (window.scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

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
        teamsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;';
        const rustColor = '#e85d3a';
        TEAMS.forEach(team => {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.dataset.teamId = team.id;
            card.style.cssText = 'background: rgba(20,20,20,0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.4s ease;';
            
            const membersList = team.members.map((member, i) => `
                <div style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
                    <span style="font-family: 'Bebas Neue', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.15); width: 22px;">${String(i + 1).padStart(2, '0')}</span>
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, ${rustColor}44, ${rustColor}22); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: ${rustColor}; font-weight: 700; font-family: 'Inter', sans-serif;">${member.charAt(0)}</div>
                    <span style="font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #ccc; font-weight: 500; letter-spacing: 0.3px;">${member}</span>
                </div>
            `).join('');

            card.innerHTML = `
                <div style="background: linear-gradient(135deg, ${rustColor}33 0%, ${rustColor}11 100%); padding: 24px; text-align: center; border-bottom: 1px solid ${rustColor}33; position: relative;">
                    <div style="position: absolute; top: 14px; right: 16px; font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: ${rustColor}15; line-height: 1;">#${team.id}</div>
                    <h3 style="font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: ${rustColor}; margin: 0; letter-spacing: 3px; text-shadow: 0 0 20px ${rustColor}44;">${team.name}</h3>
                    <div style="font-family: 'Inter', sans-serif; font-size: 0.7rem; color: #666; margin-top: 4px; letter-spacing: 1px;">${team.members.length} OYUNCU</div>
                </div>
                <div style="padding: 18px 24px;">
                    ${membersList}
                </div>
            `;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-6px) scale(1.02)';
                card.style.borderColor = rustColor + '44';
                card.style.boxShadow = '0 12px 40px ' + rustColor + '22';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.borderColor = 'rgba(255,255,255,0.06)';
                card.style.boxShadow = 'none';
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

    const apiUrl = window.location.protocol === 'file:' ? 'http://localhost:3000/api/streamers' : 'https://knglrust.onrender.com/api/streamers';
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

    const justSlugs = allSlugs.map(s => s.slug);
    let fetchedData = [];

    try {
        const chunkSize = 5;
        // Fetch 5 streamers at a time to prevent Puppeteer CPU overload
        for (let i = 0; i < justSlugs.length; i += chunkSize) {
            const chunk = justSlugs.slice(i, i + chunkSize);
            const apiUrl = window.location.protocol === 'file:' ? 'http://localhost:3000/api/streamers' : 'https://knglrust.onrender.com/api/streamers';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slugs: chunk })
            });
            if (!res.ok) throw new Error('Proxy error');
            const data = await res.json();
            fetchedData.push(...data);
        }

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

        mainGrid.innerHTML = ''; 

        const liveStreamers = mergedData.filter(s => s.isLive);
        const offlineStreamers = mergedData.filter(s => !s.isLive);
        
        // Sort offline alphabetically
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

            // BAŞ HARFİ BÜYÜK NİCKNAME
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

        // Render Lives first
        liveStreamers.forEach((s, index) => {
            mainGrid.appendChild(renderCard(s, index));
        });

        // Offline Collapsible Section
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

            // Offline cards container (hidden by default)
            const offlineContainer = document.createElement('div');
            offlineContainer.id = 'offlineContainer';
            offlineContainer.style.cssText = 'grid-column: 1 / -1; display: none; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;';

            offlineStreamers.forEach((s, index) => {
                offlineContainer.appendChild(renderCard(s, index));
            });
            mainGrid.appendChild(offlineContainer);

            // Toggle offline visibility
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

    } catch (err) {
        console.error('API Error:', err);
        mainGrid.innerHTML = '<p style="color: #ef4444; grid-column: 1/-1; text-align: center;">Yayıncı verileri çekilemedi. Node.js arka plan sunucusunun çalıştığından emin olun.</p>';
    }
}

// ========================
// ELAPSED TIMER
// ========================
function startElapsedTimer() {
    // Event started: 10 August 2026, 22:10 (Turkey time UTC+3)
    const eventStart = new Date('2026-08-10T22:10:00+03:00');

    function updateTimer() {
        const now = new Date();
        const diff = now - eventStart;

        if (diff < 0) return;

        const totalSeconds = Math.floor(diff / 1000);
        const totalHours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => n.toString().padStart(2, '0');

        const hoursEl = document.getElementById('timer-hours');
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');

        if (hoursEl) hoursEl.textContent = pad(totalHours);
        if (minutesEl) minutesEl.textContent = pad(minutes);
        if (secondsEl) secondsEl.textContent = pad(seconds);
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// Start timer when page loads
startElapsedTimer();

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

