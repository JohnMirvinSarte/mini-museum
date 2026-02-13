// Password Protection System
const correctPassword = "082702"; // Change this to your desired password
const passwordOverlay = document.getElementById('passwordOverlay');
const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMessage = document.getElementById('errorMessage');

// Add locked class to body initially
document.body.classList.add('locked');

// Check if already unlocked in this session
if (sessionStorage.getItem('museumUnlocked') === 'true') {
    unlockMuseum();
}

function unlockMuseum() {
    passwordOverlay.style.display = 'none';
    document.body.classList.remove('locked');
    
    // Show all hidden elements
    document.getElementById('heartsContainer').style.display = 'block';
    document.getElementById('rosePetalsContainer').style.display = 'block';
    document.getElementById('themeToggleBtn').style.display = 'flex';
    document.getElementById('mapToggleBtn').style.display = 'flex';
    document.getElementById('envelopeWrapper').style.display = 'block';
    document.getElementById('musicPlayer').style.display = 'block';
    
    // Save unlock state for this session
    sessionStorage.setItem('museumUnlocked', 'true');
    
    // Initialize music and other features
    setTimeout(() => {
        startMusic();
    }, 500);
}

function checkPassword() {
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === correctPassword) {
        errorMessage.style.color = '#00ff00';
        errorMessage.textContent = '✓ ACCESS GRANTED - Welcome Back';
        setTimeout(unlockMuseum, 1000);
    } else {
        errorMessage.style.color = '#ffff00';
        errorMessage.textContent = '✗ INCORRECT PASSWORD - ACCESS DENIED';
        passwordInput.value = '';
        passwordInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }
}

unlockBtn.addEventListener('click', checkPassword);

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

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
    musicPlayer.classList.add('playing');
}

function playPrevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    bgMusic.play().catch(e => console.log('Autoplay prevented:', e));
    musicPlayer.classList.add('playing');
}

bgMusic.addEventListener('ended', playNextSong);

// Update playing state on pause/play
bgMusic.addEventListener('pause', () => {
    musicPlayer.classList.remove('playing');
});

bgMusic.addEventListener('play', () => {
    musicPlayer.classList.add('playing');
});

// Start music on user interaction
function startMusic() {
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Autoplay prevented:', e));
        playPauseIcon.textContent = '⏸';
        musicPlayer.classList.add('playing');
    }
}

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        playPauseIcon.textContent = '⏸';
        musicPlayer.classList.add('playing');
    } else {
        bgMusic.pause();
        playPauseIcon.textContent = '▶';
        musicPlayer.classList.remove('playing');
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

// Music Player Minimize/Maximize Functionality
const musicPlayer = document.getElementById('musicPlayer');
const minimizeBtn = document.getElementById('minimizeBtn');
const minimizeIcon = document.getElementById('minimizeIcon');
let isPlayerMinimized = false;

// Check for saved player state
if (localStorage.getItem('playerMinimized') === 'true') {
    isPlayerMinimized = true;
    musicPlayer.classList.add('minimized');
    minimizeIcon.textContent = '♪';
}

minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isPlayerMinimized = !isPlayerMinimized;
    
    if (isPlayerMinimized) {
        musicPlayer.classList.add('minimized');
        minimizeIcon.textContent = '♪';
        minimizeBtn.title = 'Expand Player';
        localStorage.setItem('playerMinimized', 'true');
    } else {
        musicPlayer.classList.remove('minimized');
        minimizeIcon.textContent = '−';
        minimizeBtn.title = 'Minimize Player';
        localStorage.setItem('playerMinimized', 'false');
    }
});

// Click on minimized player to expand
musicPlayer.addEventListener('click', (e) => {
    if (isPlayerMinimized && e.target === musicPlayer) {
        isPlayerMinimized = false;
        musicPlayer.classList.remove('minimized');
        minimizeIcon.textContent = '−';
        minimizeBtn.title = 'Minimize Player';
        localStorage.setItem('playerMinimized', 'false');
    }
});

// Prevent clicks inside player from bubbling when not minimized
musicPlayer.addEventListener('click', (e) => {
    if (!isPlayerMinimized && e.target !== musicPlayer) {
        e.stopPropagation();
    }
});

// Keyboard accessibility for minimize button
minimizeBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        minimizeBtn.click();
    }
});

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
        
        // Show map toggle button
        mapToggleBtn.style.display = 'flex';
        
        // Create celebratory hearts
        for (let i = 0; i < 30; i++) {
            setTimeout(createFloatingHeart, i * 50);
        }
    }, 2000); // Wait for envelope animation to complete
});

// Close button to return to envelope
closeButton.addEventListener('click', () => {
    letterContainer.classList.remove('show');
    
    // Hide map toggle button
    mapToggleBtn.style.display = 'none';
    
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
        name: "Our First Date Began",
        coords: [14.5209815,121.013374], // NAIA T3, Bay 3 Manila, Philippines
        description: "Where our beautiful journey in-person started",
        date: "03:20 PM, August 01, 2022",
        image: "pictures/45.jpg"
    },
    {
        name: "First Starbucks Date at Intramuros, Manila City",
        coords: [14.588548, 120.975816], // SB Intramuros, Manila City
        description: "Our first coffee date together with Bea, ordering strawberry drinks",
        date: "04:26 PM, August 01, 2022"
    },
    {
        name: "First Picture was Taken infront of Manila Cathedral",
        coords: [14.591722, 120.973222], // Manila Cathedral, Intramuros, Manila City
        description: "The place where fate brought us together",
        date: "04:48 PM, August 01, 2022",
        image: "pictures/14.jpg"
    },
    {
        name: "Falsabraga de Media Naranja, Intramuros",
        coords: [14.595327, 120.969627], // Falsabraga de Media Naranja, Intramuros, Manila City
        description: "Where we spend quality time together and planning for dinner at Riverside",
        date: "05:19 PM, August 01, 2022",
        image: "pictures/11.jpg"
    },
    {
        name: "Fort Santiago, Intramuros, Manila City",
        coords: [14.594161, 120.970441], // Fort Santiago, Intramuros, Manila City
        description: "Having awesome moments while leaving our footprints at Intramuros",
        date: "06:03 PM, August 01, 2022",
        image: "pictures/15.jpg"
    },
    {
        name: "SM Mall of Asia, Pasay City",
        coords: [14.53422, 120.98199], // SM Mall of Asia, Pasay City
        description: "Having our first dinner together and enjoying the view at SM Mall of Asia",
        date: "07:40 PM, August 01, 2022",
        image: "pictures/16.jpg"
    },
    {
        name: "SM Moa Eye",
        coords: [14.532984, 120.979319], // SM MOA Eye, Pasay City
        description: "Enjoying the evening view at the 2nd Biggest PH Ferris Wheel",
        date: "09:34 PM, August 01, 2022",
        image: "pictures/10.jpg"
    },
    {
        name: "Sawadee Pot",
        coords: [14.546742, 120.986831], // Diosdado Macapagal Blvd, Pasay City
        description: "Dinner at Sawadee Pot along Diosdado Macapagal Blvd",
        date: "08:13 PM, July 17, 2024",
        image: "pictures/17.gif"
    },
    {
        name: "Pacific Coast Residences BF International Village",
        coords: [14.452285, 120.995769], // BF International Village, Las Piñas
        description: "First time meeting Cosmo in-person",
        date: "11:00 PM, July 17, 2024",
        image: "pictures/18.jpg"
    },
    {
        name: "The Radiance Manila Bay",
        coords: [14.557522, 120.988264], // Roxas Boulevard, Pasay City
        description: "Morning at The Radiance Manila Bay",
        date: "06:48 AM, July 18, 2024",
        image: "pictures/19.jpg"
    },
    {
        name: "Manila City Hall",
        coords: [14.58992, 120.98150], // Manila City Hall
        description: "Visiting My Baby's Mom for the first time at Manila City Hall before going to Rizal",
        date: "10:45 AM, July 18, 2024",
        image: "pictures/20.jpg"
    },
    {
        name: "Casa Mellifera Apiary & Restaurant Taytay",
        coords: [14.576161, 121.154235], // Taytay, Rizal
        description: "Lunch Date at Casa Mellifera",
        date: "01:23 PM, July 18, 2024",
        image: "pictures/2.jpg"
    },
    {
        name: "Pintô Art Museum Antipolo",
        coords: [14.580787, 121.164062], // Antipolo City
        description: "Exploring art at Pintô Art Museum",
        date: "03:10 PM, July 18, 2024",
        image: "pictures/21.jpg"
    },
    {
        name: "Antipolo Cathedral",
        coords: [14.587738, 121.176285], // Antipolo City
        description: "Visiting the historic Antipolo Cathedral",
        date: "04:29 PM, July 18, 2024",
        image: "pictures/22.jpg"
    },
    {
        name: "Helipad Legazpi City and afterwards going down using the Zipline",
        coords: [13.204104, 123.711161], // Legazpi City, Albay
        description: "Adventuring Helipad",
        date: "05:23 PM, June 24, 2025",
        image: "pictures/1.jpg"
    },
    {
        name: "ATV Ride Black Lava Trail",
        coords: [13.20155, 123.71313], // Legazpi City, Albay
        description: "Riding a ATV along the Black Lava Trail",
        date: "05:46 PM, June 24, 2025",
        image: "pictures/44.jpg"
    },
    {
        name: "Steakfix at Barry's Place Legazpi City",
        coords: [13.154474, 123.751176], // Legazpi City, Albay
        description: "Steak dinner date at Steakfix",
        date: "07:00 PM, June 24, 2025",
        image: "pictures/23.jpg"
    },
    {
        name: "Bicol University Polangui",
        coords: [13.296263, 123.484147], // Polangui, Albay
        description: "Mirvin's College Graduation",
        date: "07:30 PM, June 27, 2025",
        image: "pictures/24.jpg"
    },
    {
        name: "Uncle Wilsons Farm at Gamot Polangui Albay",
        coords: [13.326277, 123.510726], // Gamot, Polangui, Albay
        description: "Visiting Uncle Wilsons Farm",
        date: "June 28, 2025",
        image: "pictures/25.jpg"
    },
    {
        name: "Camalig Bypass Road Camalig, Albay",
        coords: [13.180631, 123.64407], // Camalig, Albay
        description: "Morning drive along Camalig Bypass Road",
        date: "08:11 AM, June 30, 2025",
        image: "pictures/26.jpg"
    },
    {
        name: "Mount Mayon 7-Eleven Camalig Bypass Road",
        coords: [13.188267, 123.661861], // Camalig, Albay
        description: "Visiting the famous Mount Mayon 7-Eleven",
        date: "08:15 AM, June 30, 2025",
        image: "pictures/27.jpg"
    },
    {
        name: "Farm Plate Daraga Albay",
        coords: [13.128529, 123.715776], // Daraga, Albay
        description: "Breakfast at Farm Plate",
        date: "09:40 AM, June 30, 2025",
        image: "pictures/28.jpg"
    },
    {
        name: "Misibis Bay Resort",
        coords: [13.238167, 123.909005], // Cagraray Island, Albay
        description: "Relaxing with brizzy ocean views while having a typhoon",
        date: "02:50 PM, July 24, 2025",
        image: "pictures/3.jpg"
    },
    {
        name: "Walking along Cagraray Island Coastline",
        coords: [13.236479, 123.906081], // Cagraray Island, Albay
        description: "Enjoying a morning walk along the beautiful coastline before breakfast",
        date: "05:43 AM, July 25, 2025",
        image: "pictures/29.jpg"
    },
    {
        name: "Cagraray Amphitheater",
        coords: [13.241497, 123.902972], // Cagraray Island, Albay
        description: "Overview look of the ocean at the Amphitheater with its unique architecture and stunning views",
        date: "09:37 AM, July 25, 2025",
        image: "pictures/30.jpg"
    },
    {
        name: "Stella Maris Chapel",
        coords: [13.242701, 123.903384], // Cagraray Island, Albay
        description: "Visiting the serene Stella Maris Chapel",
        date: "09:50 AM, July 25, 2025",
        image: "pictures/31.jpg"
    },  
    {
        name: "Polangui Rice Greenery Field",
        coords: [13.277772, 123.518181], // Polangui, Albay
        description: "Exploring the lush rice fields in Polangui before heading back to Manila",
        date: "03:20 PM, July 26, 2025",
        image: "pictures/12.gif"
    },  
    {
        name: "Oas - Polangui Roadtrip",
        coords: [13.273455, 123.513228], // Oas, Albay
        description: "Enjoying the motor ride and my baby flower picking along the Oas Proper",
        date: "03:07 PM, July 26, 2025",
        image: "pictures/32.jpg"
    },  
    {
        name: "Time to Depart Bicol at Polangui Bus Terminal",
        coords: [13.289070, 123.489902], // Polangui, Albay
        description: "Time to say goodbye to Bicol and heading back to Manila with a heart full of unforgettable memories",
        date: "07:22 PM, July 26, 2025",
        image: "pictures/33.jpg"
    },  
    {
        name: "Lunch and Roller Coaster Ride at Festival Mall",
        coords: [14.41775, 121.04124], // Festival Mall, Manila
        description: "Enjoying a delicious lunch followed by an exciting roller coaster ride",
        date: "11:48 AM, July 27, 2025",
        image: "pictures/34.jpg"
    },  
    {
        name: "Cafe Seolhwa at BF Homes Paranaque",
        coords: [14.45641, 121.00815], // BF Homes, Paranaque, Manila
        description: "Painting a cat while eating Bingsu",
        date: "03:30 PM, July 27, 2025",
        image: "pictures/13.gif"
    },  
    {
        name: "Dinner at Molito",
        coords: [14.42507, 121.02672], //  Alabang, Manila
        description: "A delicious dinner and night out at Molito",
        date: "08:16 PM, July 27, 2025",
        image: "pictures/35.jpg"
    }, 
    {
        name: "Binondo Date",
        coords: [14.60048, 120.97546], // Binondo, Manila City
        description: "Ate and bought Hopia at the historic Binondo district",
        date: "03:24 PM, July 29, 2025",
        image: "pictures/36.jpg"
    }, 
    {
        name: "Visiting Philippine National Museums",
        coords: [14.58523, 120.98101], //  Manila City
        description: "Exploring the rich history and culture at the Philippine National Museums",
        date: "04:40 PM, July 29, 2025",
        image: "pictures/37.jpg"
    }, 
    {
        name: "Eating Yabu at Robinson's Place Manila before going to Tagaytay",
        coords: [14.575703, 120.984136], // Manila City
        description: "Enjoying a delicious lunch before heading to Tagaytay City",
        date: "11:48 AM, December 15, 2025",
        image: "pictures/38.jpg"
    },  
    {
        name: "Cityland Tagaytay Prime Residences",
        coords: [14.117969, 120.964076], // Tagaytay, Cavite
        description: "Finally Arrived at our Airbnb in Tagaytay City",
        date: "7:59 PM, December 15, 2025",
        image: "pictures/9.jpg"
    },  
    {
        name: "Ka Tunying's Tagaytay",
        coords: [14.098012, 120.943528], //  Tagaytay, Cavite
        description: "Enjoying the view and having a delicious dinner at Ka Tunying's Tagaytay",
        date: "08:55 PM, December 15, 2025",
        image: "pictures/39.jpg"
    }, 
    {
        name: "Starbucks Reserve Hiraya",
        coords: [14.102823, 120.951568], // Tagaytay, Cavite
        description: "Enjoying a coffee with cake and a Taal Lake view",
        date: "07:56 AM, December 16, 2025",
        image: "pictures/40.jpg"
    }, 
    {
        name: "Sky Ranch Tagaytay",
        coords: [14.095157, 120.937702], //  Tagaytay, Cavite
        description: "Enjoying the extreme rides and attractions at Sky Ranch Tagaytay",
        date: "12:32 PM, December 16, 2025",
        image: "pictures/41.jpg"
    }, 
    {
        name: "Bamboo Organ Church Las Piñas",
        coords: [14.481320, 120.981651], //  Las Piñas, Manila
        description: "Visited and ate bibingka at the historic Bamboo Organ Church in Las Piñas",
        date: "06:47 PM, December 18, 2025",
        image: "pictures/42.jpg"
    }, 
    {
        name: "Bulacan  B-day Celeb of Vane",
        coords: [14.797666, 121.070288], //  Bulacan, Philippines
        description: "Visited the house of the fam of Vanessa and celebrated her birthday at Escobar's Steakhouse",
        date: "05:41 PM, December 19, 2025",
        image: "pictures/43.jpg"
    }, 
    {
        name: "Cosmo's First Mall trip at SM MOA with mom and dad",
        coords: [14.53620, 120.98012], //  Pasay City, Philippines
        description: "A hearttrobbling moment for Cosmo as he experienced his first mall trip",
        date: "04:28 PM, December 21, 2025",
        image: "pictures/6.jpg"
    }, 
   {
        name: "Wow Cow Hot Pot Date",
        coords: [14.53750, 120.97922], //  Pasay City, Philippines
        description: " hot pot date at Wow Cow with my baby",
        date: "05:40 PM, December 22, 2025",
        image: "pictures/8.jpg"
    }, 
    {
        name: "Samgyeopsal Dinner at Premier with Ate Ange, Bro Andres and Baby Rara",
        coords: [14.44516, 121.02889], //  Paranaque City, Philippines
        description: "A delicious samgyeopsal dinner with family",
        date: "06:18 PM, December 23, 2025"
    }, 
    {
        name: "Bali Indonesia Touch Down Soon",
        coords: [-8.74372, 115.16651], //  Bali, Indonesia
        description: "Excited for the upcoming trip to Bali, Indonesia Date",
        date: "TBA"
    }, 
];

function initializeMap() {
    if (mapInitialized) return;

    // Determine initial zoom based on screen size
    const isMobile = window.innerWidth <= 768;
    const initialZoom = isMobile ? 6 : 7;

    // Initialize map with responsive zoom
    map = L.map('map', {
        center: [13.80, 122.50],
        zoom: initialZoom,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true
    });

    // Add tile layer (using OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        minZoom: 5
    }).addTo(map);

    // Custom heart icon with responsive sizing
    const iconSize = isMobile ? 24 : 28;
    const heartIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="font-size: ${iconSize}px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">❤️</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -35]
    });

    // Add markers for each location
    memoryLocations.forEach(location => {
        const marker = L.marker(location.coords, { icon: heartIcon }).addTo(map);
        
        const imageHTML = location.image ? 
            `<img src="${location.image}" alt="${location.name}" style="width: 100%; max-width: ${isMobile ? '240px' : '300px'}; max-height: ${isMobile ? '200px' : '250px'}; height: auto; object-fit: contain; border-radius: 5px; margin-bottom: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">` 
            : '';
        
        marker.bindPopup(`
            <div style="font-family: 'Crimson Text', serif; text-align: center; min-width: ${isMobile ? '160px' : '200px'}; max-width: ${isMobile ? '260px' : '320px'};">
                <h3 style="font-family: 'Dancing Script', cursive; color: #dc7882; margin-bottom: 5px; font-size: ${isMobile ? '16px' : '18px'};">${location.name}</h3>
                ${imageHTML}
                <p style="color: #6b5444; margin-bottom: 5px; font-size: ${isMobile ? '12px' : '14px'}; line-height: 1.4;">${location.description}</p>
                <p style="font-style: italic; color: #8b6f47; font-size: ${isMobile ? '11px' : '12px'}; margin-bottom: 0;">${location.date}</p>
            </div>
        `, {
            maxWidth: isMobile ? 280 : 350,
            minWidth: isMobile ? 180 : 220,
            maxHeight: isMobile ? 400 : 450,
            autoPan: true,
            autoPanPaddingTopLeft: isMobile ? [40, 60] : [80, 120],
            autoPanPaddingBottomRight: isMobile ? [40, 60] : [80, 120],
            keepInView: false,
            autoPanPadding: isMobile ? [30, 30] : [50, 50]
        });
    });

    mapInitialized = true;
    
    // Force initial resize
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

// Map Toggle Button Management
const mapToggleBtn = document.getElementById('mapToggleBtn');
const mapCloseBtn = document.getElementById('mapCloseBtn');
const memoryMapContainer = document.getElementById('memoryMapContainer');
const mapBackdrop = document.getElementById('mapBackdrop');

function openMap() {
    mapBackdrop.classList.add('show');
    memoryMapContainer.classList.add('show');
    
    // Prevent body scroll when map is open
    document.body.style.overflow = 'hidden';
    
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
    mapBackdrop.classList.remove('show');
    memoryMapContainer.classList.remove('show');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

mapToggleBtn.addEventListener('click', openMap);
mapCloseBtn.addEventListener('click', closeMap);

// Close map when clicking backdrop or outside
mapBackdrop.addEventListener('click', closeMap);
memoryMapContainer.addEventListener('click', (e) => {
    if (e.target === memoryMapContainer) {
        closeMap();
    }
});

// Day/Night Mode Toggle
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
let isNightMode = false;

// Check for saved theme preference
if (localStorage.getItem('theme') === 'night') {
    isNightMode = true;
    document.body.classList.add('night-mode');
    themeIcon.textContent = '☀️';
}

themeToggleBtn.addEventListener('click', () => {
    isNightMode = !isNightMode;
    
    if (isNightMode) {
        document.body.classList.add('night-mode');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'night');
        
        // Create stars effect for night mode
        createStarsEffect();
    } else {
        document.body.classList.remove('night-mode');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'day');
    }
});

// Create stars effect when switching to night mode
function createStarsEffect() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'floating-heart';
            star.innerHTML = '✨';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.position = 'fixed';
            star.style.animation = 'twinkle 1.5s ease-out';
            star.style.pointerEvents = 'none';
            star.style.zIndex = '1000';
            
            document.body.appendChild(star);
            
            setTimeout(() => star.remove(), 1500);
        }, i * 50);
    }
}

// Add twinkle animation
const twinkleStyle = document.createElement('style');
twinkleStyle.innerHTML = `
    @keyframes twinkle {
        0%, 100% {
            opacity: 0;
            transform: scale(0);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
    }
`;
document.head.appendChild(twinkleStyle);

// Rose Petal Cursor Trail
const rosePetalsContainer = document.getElementById('rosePetalsContainer');
let lastPetalTime = 0;
const petalDelay = 50; // milliseconds between petals

document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    
    // Throttle petal creation
    if (currentTime - lastPetalTime < petalDelay) {
        return;
    }
    
    lastPetalTime = currentTime;
    createRosePetal(e.clientX, e.clientY);
});

function createRosePetal(x, y) {
    const petal = document.createElement('div');
    petal.className = 'rose-petal';
    petal.style.left = x + 'px';
    petal.style.top = y + 'px';
    
    // Random drift direction
    const driftX = (Math.random() - 0.5) * 60;
    petal.style.setProperty('--drift-x', driftX + 'px');
    
    // Create rose petal SVG
    petal.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C9 2 7 4 7 6.5c0 1.5.5 2.5 1.5 3.5-.5.5-1 1.5-1 2.5C7.5 15 9 17 12 17s4.5-2 4.5-4.5c0-1-.5-2-1-2.5 1-.5 1.5-1.5 1.5-3.5C17 4 15 2 12 2z" 
                  fill="#dc143c" 
                  opacity="0.9"/>
            <path d="M12 4c1.5 0 3 1 3 2.5 0 1-.5 1.5-1 2-.5-.5-1-1-2-1s-1.5.5-2 1c-.5-.5-1-1-1-2C9 5 10.5 4 12 4z" 
                  fill="#ff4d6d" 
                  opacity="0.7"/>
            <ellipse cx="12" cy="11" rx="2" ry="2.5" 
                     fill="#8b0000" 
                     opacity="0.5"/>
        </svg>
    `;
    
    rosePetalsContainer.appendChild(petal);
    
    // Remove petal after animation completes
    setTimeout(() => {
        petal.remove();
    }, 2500);
}

// Create initial petals on page load
window.addEventListener('load', () => {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createRosePetal(x, y);
        }, i * 100);
    }
});

// Handle window resize for map responsiveness
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (mapInitialized && memoryMapContainer.classList.contains('show')) {
            map.invalidateSize();
        }
    }, 250);
});

// Ensure map is properly sized on orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (mapInitialized && memoryMapContainer.classList.contains('show')) {
            map.invalidateSize();
        }
    }, 300);
});
