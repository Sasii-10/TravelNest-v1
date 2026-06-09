let globalDestinations = [];

const travelData = {
    quotes: [
        "\"The world is a book, and those who do not travel read only a page.\"",
        "\"Travel is the only thing you buy that makes you richer.\"",
        "\"Adventure is worthwhile in itself.\"",
        "\"To travel is to discover that everyone is wrong about other countries.\""
    ]
};

const StorageManager = {
    get: (key) => JSON.parse(localStorage.getItem(key)) || [],
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data))
};

document.addEventListener('DOMContentLoaded', async () => {
    initGlobalNav();
    registerPWA();
    
    try {
        // Path adjusted to look out of HTML folder into JSON folder
        const response = await fetch('../JSON/destinations.json');
        globalDestinations = await response.json();
    } catch (error) {
        console.warn("Local fetch restricted or file missing. Loading fallback array.");
        globalDestinations = [
            { id: 1, name: "Kyoto", country: "Japan", continent: "Asia", type: "cultural", budget: "medium", desc: "A preservation of historic Japanese legacy.", attractions: ["Fushimi Inari Shrine"], costs: { stay: "$90/night", food: "$30/day", transport: "$12/day" }, img: "https://placehold.co/600x400/ff9999/ffffff?text=Kyoto" },
            { id: 2, name: "Santorini", country: "Greece", continent: "Europe", type: "relaxation", budget: "high", desc: "An island paradise known for cliffside architecture.", attractions: ["Oia Village sunset"], costs: { stay: "$210/night", food: "$60/day", transport: "$25/day" }, img: "https://placehold.co/600x400/99ccff/ffffff?text=Santorini" },
            { id: 3, name: "Banff", country: "Canada", continent: "North America", type: "nature", budget: "high", desc: "Stunning, snow-peaked Canadian Rockies.", attractions: ["Lake Louise"], costs: { stay: "$180/night", food: "$45/day", transport: "$30/day" }, img: "https://placehold.co/600x400/99ff99/333333?text=Banff" },
            { id: 4, name: "Chiang Mai", country: "Thailand", continent: "Asia", type: "adventure", budget: "low", desc: "A mountainous northern city boasting rich jungle sanctuaries.", attractions: ["Elephant Nature Park"], costs: { stay: "$25/night", food: "$12/day", transport: "$5/day" }, img: "https://placehold.co/600x400/ffcc99/333333?text=Chiang+Mai" }
        ];
    }

    if (document.getElementById('home-view')) initHome();
    if (document.getElementById('explorer-view')) initExplorer();
    if (document.getElementById('planner-view')) initPlanner();
    if (document.getElementById('generator-view')) initGenerator();
    if (document.getElementById('mood-view')) initMood();
    if (document.getElementById('support-view')) initSupport();
});

function registerPWA() {
    if ('serviceWorker' in navigator) {
        // Scope defined to allow the service worker to monitor the parent directories
        navigator.serviceWorker.register('../JS/sw.js', { scope: '../' })
        .catch(err => console.log("PWA service worker registration bypassed: ", err));
    }
}

function initGlobalNav() {
    const burger = document.getElementById('hamburger');
    const menu = document.getElementById('nav-menu');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
    });
}

/* --- 1. Home Module --- */
function initHome() {
    const qEl = document.getElementById('dynamic-quote');
    let idx = 0;
    setInterval(() => {
        qEl.style.opacity = 0;
        setTimeout(() => {
            idx = (idx + 1) % travelData.quotes.length;
            qEl.textContent = travelData.quotes[idx];
            qEl.style.opacity = 1;
        }, 400);
    }, 4500);

    const dayIndex = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000) % globalDestinations.length;
    const todayDest = globalDestinations[dayIndex];
    
    document.getElementById('dod-title').textContent = todayDest.name + `, ${todayDest.country}`;
    document.getElementById('dod-desc').textContent = todayDest.desc;
    document.getElementById('dod-img').src = todayDest.img;

    document.getElementById('news-form').addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem('newsletter_subscriber', document.getElementById('news-email').value);
        alert('Thank you for subscribing!');
    });
}

/* --- 2. Destination Explorer Module --- */
function initExplorer() {
    const container = document.getElementById('explorer-grid');
    const search = document.getElementById('search-name');
    const filter = document.getElementById('filter-continent');
    const modal = document.getElementById('dest-modal');
    const closeBtn = document.querySelector('.close-modal');

    function renderCards(list) {
        container.innerHTML = list.map(d => `
            <div class="card" onclick="openModal(${d.id})">
                <img src="${d.img}" class="card-img" alt="${d.name}">
                <div class="card-body">
                    <h3>${d.name}</h3>
                    <p>${d.country} | <strong>${d.continent}</strong></p>
                </div>
            </div>
        `).join('');
    }

    window.openModal = (id) => {
        const d = globalDestinations.find(x => x.id === id);
        document.getElementById('modal-title').textContent = `${d.name}, ${d.country}`;
        document.getElementById('modal-desc').textContent = d.desc;
        document.getElementById('modal-attractions').innerHTML = d.attractions.map(a => `<li>${a}</li>`).join('');
        document.getElementById('modal-table-body').innerHTML = `
            <tr><td>Lodging / Hotel Base</td><td>${d.costs.stay}</td></tr>
            <tr><td>Food & Dining (Daily Average)</td><td>${d.costs.food}</td></tr>
            <tr><td>Local Transport Base Rate</td><td>${d.costs.transport}</td></tr>
        `;
        modal.classList.add('active');
    };

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    
    function filterData() {
        const sVal = search.value.toLowerCase();
        const fVal = filter.value;
        const matched = globalDestinations.filter(d => 
            d.name.toLowerCase().includes(sVal) && (fVal === "" || d.continent === fVal)
        );
        renderCards(matched);
    }

    search.addEventListener('input', filterData);
    filter.addEventListener('change', filterData);
    renderCards(globalDestinations);
}

/* --- 3. Trip Budget Planner Module --- */
function initPlanner() {
    const form = document.getElementById('budget-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const dest = document.getElementById('plan-dest').value;
        const days = parseInt(document.getElementById('plan-days').value);
        const daily = parseFloat(document.getElementById('plan-daily').value);
        
        const totalCost = days * daily;
        let tier = "Moderate";
        let percent = 65;
        
        if(daily < 50) { tier = "Low-Budget Saver"; percent = 30; }
        else if(daily > 150) { tier = "Luxury Getaway"; percent = 100; }

        document.getElementById('calc-total').innerText = `$${totalCost.toLocaleString()}`;
        document.getElementById('calc-tier').innerText = tier;
        
        const bar = document.getElementById('progress-bar');
        bar.style.width = '0%';
        setTimeout(() => bar.style.width = percent + '%', 100);

        StorageManager.save('saved_budgets', [...StorageManager.get('saved_budgets'), { dest, totalCost, tier }]);
    });
}

/* --- 4. Random Trip Generator Module --- */
function initGenerator() {
    const btn = document.getElementById('surprise-btn');
    const resultBox = document.getElementById('generator-result');

    btn.addEventListener('click', () => {
        const type = document.getElementById('gen-type').value;
        const budget = document.getElementById('gen-budget').value;
        
        btn.style.transform = "scale(0.95) rotate(2deg)";
        setTimeout(() => btn.style.transform = "none", 150);

        const pool = globalDestinations.filter(d => d.type === type && d.budget === budget);
        
        if(pool.length === 0) {
            resultBox.innerHTML = `
                <div style="margin-top: 1.5rem; color: #ff6b6b; font-weight:600;">
                    <p>No matching packages found.</p>
                    <p style="font-size:0.9rem; color:#777; margin-top:0.5rem;">Try: "Adventure & Sport" + "Budget Economy Saver"</p>
                </div>`;
            return;
        }

        const picked = pool[Math.floor(Math.random() * pool.length)];
        resultBox.innerHTML = `
            <div class="card" style="margin-top: 1.5rem; text-align: left; animation: slideIn 0.4s ease;">
                <img src="${picked.img}" class="card-img" alt="${picked.name}">
                <div class="card-body">
                    <h3>${picked.name} (${picked.country})</h3>
                    <p>${picked.desc}</p>
                    <button class="btn-primary" style="margin-top:1rem; width:100%;" onclick="saveWishlist('${picked.name}')">Add to Wishlist</button>
                </div>
            </div>
        `;
    });

    window.saveWishlist = (name) => {
        const currentList = StorageManager.get('wishlist');
        if(!currentList.includes(name)) {
            StorageManager.save('wishlist', [...currentList, name]);
            alert(`${name} saved to wishlist!`);
        } else {
            alert(`${name} is already in your wishlist.`);
        }
    };
}

/* --- 5. Travel Mood Module --- */
function initMood() {
    let context = null;
    let nodes = {};

    document.querySelectorAll('.sound-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const soundType = btn.dataset.sound;
            if (btn.classList.contains('playing')) {
                btn.classList.remove('playing');
                if(nodes[soundType]) { nodes[soundType].stop(); delete nodes[soundType]; }
            } else {
                btn.classList.add('playing');
                if(!context) context = new (window.AudioContext || window.webkitAudioContext)();
                
                let osc = context.createOscillator();
                let gain = context.createGain();
                osc.type = soundType === 'beach' ? 'triangle' : soundType === 'forest' ? 'sine' : 'sawtooth';
                osc.frequency.setValueAtTime(soundType === 'beach' ? 60 : soundType === 'forest' ? 220 : 110, context.currentTime);
                gain.gain.setValueAtTime(0.04, context.currentTime);
                osc.connect(gain);
                gain.connect(context.destination);
                osc.start();
                nodes[soundType] = osc;
            }
        });
    });

    document.querySelectorAll('.track-checkbox').forEach(box => {
        const key = box.dataset.dest;
        box.checked = localStorage.getItem(`mood_${key}`) === 'true';
        box.addEventListener('change', () => {
            localStorage.setItem(`mood_${key}`, box.checked);
        });
    });
}

/* --- 6. Feedback & Support Module --- */
function initSupport() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const open = body.style.display === 'block';
            document.querySelectorAll('.accordion-body').forEach(b => b.style.display = 'none');
            body.style.display = open ? 'none' : 'block';
        });
    });

    const form = document.getElementById('support-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sup-name').value.trim();
        const email = document.getElementById('sup-email').value.trim();
        const msg = document.getElementById('sup-msg').value.trim();

        if(name.length < 2 || msg.length < 10) {
            alert("Validation failed! Name must exceed 2 characters, and the message must exceed 10 characters.");
            return;
        }

        StorageManager.save('support_tickets', [...StorageManager.get('support_tickets'), { name, email, msg, date: new Date() }]);
        document.getElementById('sup-success').style.display = 'block';
        form.reset();
    });
}