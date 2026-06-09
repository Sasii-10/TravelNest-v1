document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Hamburger Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // --- 2. Auto-rotating Hero Quotes ---
    const quotes = [
        "\"The world is a book, and those who do not travel read only a page.\"",
        "\"Travel is the only thing you buy that makes you richer.\"",
        "\"Adventure is worthwhile in itself.\"",
        "\"To travel is to discover that everyone is wrong about other countries.\""
    ];
    
    const quoteElement = document.getElementById('dynamic-quote');
    let currentQuoteIndex = 0;

    setInterval(() => {
        // Fade out
        quoteElement.style.opacity = 0;
        
        setTimeout(() => {
            // Change text and fade back in
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            quoteElement.textContent = quotes[currentQuoteIndex];
            quoteElement.style.opacity = 1;
        }, 500); // Wait for CSS transition to finish
    }, 4000); // Rotate every 4 seconds


    // --- 3. Destination of the Day (Date-based Logic) ---
    const destinations = [
        {
            title: "Kyoto, Japan",
            desc: "Experience the perfect blend of ancient temples, traditional tea houses, and stunning cherry blossoms.",
            img: "https://placehold.co/600x400/ff9999/ffffff?text=Kyoto,+Japan"
        },
        {
            title: "Santorini, Greece",
            desc: "Wander through iconic white-washed buildings and enjoy breathtaking sunsets over the Aegean Sea.",
            img: "https://placehold.co/600x400/99ccff/ffffff?text=Santorini,+Greece"
        },
        {
            title: "Banff, Canada",
            desc: "Discover turquoise glacial lakes, majestic mountain peaks, and abundant wildlife in the heart of the Rockies.",
            img: "https://placehold.co/600x400/99ff99/333333?text=Banff,+Canada"
        }
    ];

    // Calculate the current day of the year to use as an index
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Select destination based on the day of the year
    const dailyIndex = dayOfYear % destinations.length;
    const todaysDestination = destinations[dailyIndex];

    // Populate the DOM
    document.getElementById('dod-title').textContent = todaysDestination.title;
    document.getElementById('dod-desc').textContent = todaysDestination.desc;
    document.getElementById('dod-image').src = todaysDestination.img;


    // --- 4. Newsletter Subscription (LocalStorage) ---
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email-input');
    const successMessage = document.getElementById('subscription-message');

    // Check if user is already subscribed
    if(localStorage.getItem('travelNestSubscriber')) {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.textContent = "You are already subscribed to our newsletter!";
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page refresh
        const email = emailInput.value.trim();

        if (email) {
            // Save to localStorage
            localStorage.setItem('travelNestSubscriber', email);
            
            // Update UI
            form.style.display = 'none';
            successMessage.style.display = 'block';
        }
    });
});