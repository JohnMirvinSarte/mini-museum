// Background Music Management
let currentSongIndex = 0;
const songs = [
    { 
        src: 'songs/song1.mp3', 
        title: 'Wi$h Li$t (Acoustic Version)', 
        artist: 'Taylor Swift' 
    },
    { 
        src: 'songs/song2.mp3', 
        title: 'Someone To Stay (Acoustic)', 
        artist: 'Vancouver Sleep Clinic' 
    },
    { 
        src: 'songs/song3.mp3', 
        title: 'BIRDS OF A FEATHER', 
        artist: 'Billie Eilish' 
    }
];
const bgMusic = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');

// Set volume to 30% for comfortable reading
bgMusic.volume = 0.3;

function updateSongInfo() {
    songTitle.textContent = songs[currentSongIndex].title;
    songArtist.textContent = songs[currentSongIndex].artist;
}

function loadSong(index) {
    currentSongIndex = index;
    bgMusic.src = songs[currentSongIndex].src;
    updateSongInfo();
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    bgMusic.play().catch(e => console.log('Autoplay prevented:', e));
}

function playPrevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    bgMusic.play().catch(e => console.log('Autoplay prevented:', e));
}

bgMusic.addEventListener('ended', playNextSong);

// Start music on user interaction
function startMusic() {
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Autoplay prevented:', e));
        playPauseIcon.textContent = '⏸';
    }
}

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        playPauseIcon.textContent = '⏸';
    } else {
        bgMusic.pause();
        playPauseIcon.textContent = '▶';
    }
});

// Previous button
prevBtn.addEventListener('click', () => {
    playPrevSong();
});

// Next button
nextBtn.addEventListener('click', () => {
    playNextSong();
});

// Update progress bar
bgMusic.addEventListener('timeupdate', () => {
    const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
    progressFill.style.width = progress + '%';
    
    // Update time display
    currentTimeEl.textContent = formatTime(bgMusic.currentTime);
    if (!isNaN(bgMusic.duration)) {
        durationEl.textContent = formatTime(bgMusic.duration);
    }
});

// Format time helper
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Click on progress bar to seek
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    bgMusic.currentTime = percent * bgMusic.duration;
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value / 100;
});

// Initialize song info
updateSongInfo();

// Create red hearts burst effect
function createRedHeartBurst(x, y) {
    const directions = [
        'burstUp', 'burstDown', 'burstLeft', 'burstRight',
        'burstUpLeft', 'burstUpRight', 'burstDownLeft', 'burstDownRight'
    ];
    
    // Create 24 hearts (3 per direction)
    directions.forEach((direction, dirIndex) => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'burst-heart';
                heart.innerHTML = '❤';
                heart.style.left = x + 'px';
                heart.style.top = y + 'px';
                
                const duration = 1.5 + Math.random() * 0.8;
                heart.style.animation = `${direction} ${duration}s ease-out forwards`;
                heart.style.animationDelay = i * 0.05 + 's';
                
                document.body.appendChild(heart);
                
                setTimeout(() => heart.remove(), (duration + 0.5) * 1000);
            }, dirIndex * 40 + i * 60);
        }
    });
}

// Slideshow Management
let slideIndex = 10;
let slideshowInterval;

function showSlides() {
    const slides = document.getElementsByClassName('slide');
    const dots = document.getElementsByClassName('dot');
    
    // Add slide-out animation to current slide
    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('slide-out');
    }
    
    // Wait for slide-out animation before showing next slide
    setTimeout(() => {
        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active', 'slide-out');
        }
        
        // Remove active from all dots
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active');
        }
        
        // Decrement index (go backward)
        slideIndex--;
        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        }
        
        // Show current slide
        if (slides[slideIndex]) {
            slides[slideIndex].classList.add('active');
        }
        // Activate dot in reversed order
        const dotIndex = 10 - slideIndex;
        if (dots[dotIndex]) {
            dots[dotIndex].classList.add('active');
        }
    }, 400); // Wait for slide-out animation
}

function currentSlide(n) {
    const slides = document.getElementsByClassName('slide');
    const dots = document.getElementsByClassName('dot');
    
    // Add slide-out to current
    if (slides[slideIndex]) {
        slides[slideIndex].classList.add('slide-out');
    }
    
    setTimeout(() => {
        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active', 'slide-out');
        }
        
        // Remove active from all dots
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active');
        }
        
        slideIndex = n;
        
        // Show selected slide
        if (slides[slideIndex]) {
            slides[slideIndex].classList.add('active');
        }
        // Activate dot in reversed order
        const dotIndex = 10 - slideIndex;
        if (dots[dotIndex]) {
            dots[dotIndex].classList.add('active');
        }
    }, 400);
}

function startSlideshow() {
    slideIndex = 10;
    const slides = document.getElementsByClassName('slide');
    if (slides[10]) {
        slides[10].classList.add('active');
    }
    const dots = document.getElementsByClassName('dot');
    // First dot (index 0) for slide 10
    if (dots[0]) {
        dots[0].classList.add('active');
    }
    slideshowInterval = setInterval(showSlides, 4000); // Change image every 4 seconds
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    // Reset all slides
    const slides = document.getElementsByClassName('slide');
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active', 'slide-out');
    }
}

// Floating hearts animation
function createFloatingHeart() {
    const heartsContainer = document.getElementById('heartsContainer');
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '♥';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
    heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 10000);
}

// Create hearts at intervals
setInterval(createFloatingHeart, 800);

// Initial hearts
for (let i = 0; i < 5; i++) {
    setTimeout(createFloatingHeart, i * 200);
}

// Envelope click to open letter with realistic animation
const envelopeWrapper = document.getElementById('envelopeWrapper');
const letterContainer = document.getElementById('letterContainer');
const closeButton = document.getElementById('closeButton');

envelopeWrapper.addEventListener('click', (e) => {
    // Start music
    startMusic();
    
    // Get envelope position for hearts burst
    const rect = envelopeWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create red hearts burst from envelope
    createRedHeartBurst(centerX, centerY);
    
    // Add opening animation class
    envelopeWrapper.classList.add('opening');
    
    setTimeout(() => {
        envelopeWrapper.style.display = 'none';
        letterContainer.classList.add('show');
        slideshowContainer.classList.add('show');
        
        // Start slideshow
        startSlideshow();
        
        // Create celebratory hearts
        for (let i = 0; i < 30; i++) {
            setTimeout(createFloatingHeart, i * 50);
        }
    }, 2000); // Wait for envelope animation to complete
});

// Close button to return to envelope
closeButton.addEventListener('click', () => {
    letterContainer.classList.remove('show');
    slideshowContainer.classList.remove('show');
    
    // Stop slideshow
    stopSlideshow();
    
    setTimeout(() => {
        envelopeWrapper.style.display = 'flex';
        envelopeWrapper.classList.remove('opening');
        
        // Reset animations by forcing reflow
        void envelopeWrapper.offsetWidth;
    }, 300);
});

// Add sparkle effect on mouse move
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
        const sparkle = document.createElement('div');
        sparkle.className = 'floating-heart';
        sparkle.innerHTML = '✨';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.position = 'fixed';
        sparkle.style.animation = 'sparkleOut 1s ease-out forwards';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
});

// Add sparkle animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes sparkleOut {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: scale(1.5) rotate(180deg);
        }
    }
`;
document.head.appendChild(style);

// Add gentle shake to envelope on load
window.addEventListener('load', () => {
    const envelope = document.querySelector('.envelope');
    if (envelope) {
        envelope.style.animation = 'envelopeEntrance 1s ease-out, gentleShake 2s ease-in-out 1s infinite';
    }
});

// Add gentle shake animation
const shakeStyle = document.createElement('style');
shakeStyle.innerHTML = `
    @keyframes gentleShake {
        0%, 100% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(-2deg);
        }
        75% {
            transform: rotate(2deg);
        }
    }
`;
document.head.appendChild(shakeStyle);

// Memory Map Management
let map;
let mapInitialized = false;

const memoryLocations = [
    {
        name: "Our First Date",
        coords: [14.5995, 120.9842], // Manila, Philippines (example)
        description: "Where our beautiful journey began ❤️",
        date: "January 14, 2024"
    },
    {
        name: "First Kiss",
        coords: [14.5764, 121.0851], // Pasig (example)
        description: "The moment everything changed 💋",
        date: "February 10, 2024"
    },
    {
        name: "Where We Met",
        coords: [14.6091, 121.0223], // Quezon City (example)
        description: "The place where fate brought us together ✨",
        date: "December 2023"
    },
    {
        name: "Our Favorite Spot",
        coords: [14.5547, 121.0244], // Makati (example)
        description: "Where we spend quality time together 🌟",
        date: "Anytime"
    },
    {
        name: "Anniversary Celebration",
        coords: [14.5378, 121.0199], // BGC (example)
        description: "Celebrating our love milestone 🎉",
        date: "Coming Soon"
    }
];

function initializeMap() {
    if (mapInitialized) return;

    // Done
    map = L.map('map').setView([13.80, 122.50], 7);

    // Add tile layer (using OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
    }).addTo(map);

    // Custom heart icon
    const heartIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">❤️</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    // Add markers for each location
    memoryLocations.forEach(location => {
        const marker = L.marker(location.coords, { icon: heartIcon }).addTo(map);
        
        marker.bindPopup(`
            <div style="font-family: 'Crimson Text', serif; text-align: center;">
                <h3 style="font-family: 'Dancing Script', cursive; color: #dc7882; margin-bottom: 8px;">${location.name}</h3>
                <p style="color: #6b5444; margin-bottom: 5px;">${location.description}</p>
                <p style="font-style: italic; color: #8b6f47; font-size: 12px;">${location.date}</p>
            </div>
        `);
    });

    mapInitialized = true;
}

// Map Toggle Button Management
const mapToggleBtn = document.getElementById('mapToggleBtn');
const mapCloseBtn = document.getElementById('mapCloseBtn');
const slideshowContainer = document.getElementById('slideshowContainer');
const memoryMapContainer = document.getElementById('memoryMapContainer');

function openMap() {
    memoryMapContainer.classList.add('show');
    
    // Initialize map on first view
    if (!mapInitialized) {
        setTimeout(() => {
            initializeMap();
        }, 300);
    } else {
        // Refresh map size when showing
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }
}

function closeMap() {
    memoryMapContainer.classList.remove('show');
}

mapToggleBtn.addEventListener('click', openMap);
mapCloseBtn.addEventListener('click', closeMap);

// Close map when clicking outside
memoryMapContainer.addEventListener('click', (e) => {
    if (e.target === memoryMapContainer) {
        closeMap();
    }
});

// Show map toggle button when slideshow appears
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
            const isVisible = slideshowContainer.classList.contains('show') || 
                            slideshowContainer.style.display === 'block';
            if (isVisible) {
                mapToggleBtn.style.display = 'flex';
            }
        }
    });
});

observer.observe(slideshowContainer, {
    attributes: true,
    attributeFilter: ['class', 'style']
});
