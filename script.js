let currentSection = 1;
const CUTE_COLORS = ['#ff8a80', '#ffcf40', '#a2d2ff', '#ffc0cb', '#bde0fe'];

// Global variables for kitty elements
const kittyMascot = document.getElementById('kittyMascot');
const kittyBubble = document.getElementById('kittyBubble');
const kittyGif = document.getElementById('kittyGif');

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => { showSection(2); }, 4000);

    document.getElementById('beginBtn').addEventListener('click', startCelebration);
    document.getElementById('wishStar').addEventListener('click', showWishForm);
    document.getElementById('sendWishBtn').addEventListener('click', sendWish);
    document.getElementById('envelope').addEventListener('click', openLetter);
    document.getElementById('fireworksBtn').addEventListener('click', startAutomaticFireworks);

    initKittyMascot();
    setupGardenGrowth();
});

// ========== SECTION TRANSITIONS ==========
function showSection(sectionNumber) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    const nextSection = document.getElementById(`section${sectionNumber}`);
    if (nextSection) {
        nextSection.classList.add('active');
        currentSection = sectionNumber;
        updateKittyHint(sectionNumber);
        kittyReaction('happy');
        growFlower(sectionNumber);
    }
}

// ========== NAME REVEAL ANIMATION ==========
function revealName() {
    const name = "IFRA !!";
    const nameElement = document.getElementById('nameReveal');
    nameElement.innerHTML = '';
    [...name].forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = 'letter-span';
        span.textContent = letter;
        span.style.animationDelay = `${index * 0.15}s`;
        nameElement.appendChild(span);
    });
}

// ========== CELEBRATION START ==========
function startCelebration() {
    kittyMascot.classList.add('peek-in'); // NEW: Trigger peek-in animation
    createBalloons(15);
    createConfetti(100);
    dropSpecialConfetti(); // NEW: Drop the confetti for the kitty
    setTimeout(() => { showSection(3); animateMessageLines(); }, 500);
}

// ... Balloon and Confetti functions ...
function createBalloons(count) {
    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${Math.random() * 95}vw`;
        balloon.style.background = CUTE_COLORS[Math.floor(Math.random() * CUTE_COLORS.length)];
        balloon.style.animationDuration = `${Math.random() * 8 + 8}s`;
        balloon.style.animationDelay = `${Math.random() * 2}s`;
        balloon.addEventListener('click', (e) => popBalloon(balloon, e));
        document.body.appendChild(balloon);
        setTimeout(() => balloon.remove(), 16000);
    }
}
function popBalloon(balloon, event) {
    if (balloon.classList.contains('popped')) return;
    balloon.classList.add('popped');
    createConfettiBurst(event.clientX, event.clientY);
    kittyReaction('happy');
    setTimeout(() => balloon.remove(), 400);
}
function createConfetti(count) {
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 4}s`;
        confetti.style.background = CUTE_COLORS[Math.floor(Math.random() * CUTE_COLORS.length)];
        document.body.appendChild(confetti);
    }
}
function createConfettiBurst(x, y) {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;
        confetti.style.background = CUTE_COLORS[Math.floor(Math.random() * CUTE_COLORS.length)];
        const angle = Math.random() * 360, distance = Math.random() * 100 + 50;
        confetti.style.transform = `rotate(${angle}deg) translate(${distance}px) rotate(${angle}deg)`;
        confetti.style.transition = `transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 1s ease`;
        document.body.appendChild(confetti);
        setTimeout(() => { confetti.style.transform = `translate(0,0)`; confetti.style.opacity = 0; }, 10);
        setTimeout(() => confetti.remove(), 1000);
    }
}

// ... Message, Wish, and Letter functions ...
function animateMessageLines() {
    const lines = document.querySelectorAll('.message-line');
    lines.forEach((line, index) => { line.style.animationDelay = `${index * 0.8 + 0.5}s`; });
}
function showWishForm() {
    const wishForm = document.getElementById('wishForm');
    wishForm.style.display = 'flex';
    setTimeout(() => { document.getElementById('wishInput').focus(); }, 100);
    kittyReaction('thinking');
}
function sendWish() {
    const wishInput = document.getElementById('wishInput');
    const sendWishBtn = document.getElementById('sendWishBtn');
    const wishSuccess = document.getElementById('wishSuccess');
    if (wishInput.value.trim() === '') {
        kittyReaction('waiting');
        updateKittyHint(-1, false, "Meow? You forgot to write a wish!");
        return;
    }
    sendWishBtn.textContent = 'Sending...';
    sendWishBtn.disabled = true;
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.textContent = '⭐';
    const btnRect = sendWishBtn.getBoundingClientRect();
    star.style.left = `${btnRect.left + btnRect.width / 2}px`;
    star.style.top = `${btnRect.top}px`;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1500);
    wishSuccess.classList.add('show');
    sendWishBtn.style.display = 'none';
    wishInput.style.display = 'none';
    kittyReaction('happy');
    setTimeout(() => showSection(4), 2500);
}
function openLetter() {
    const letter = document.getElementById('secretLetter');
    const fireworksBtn = document.getElementById('fireworksBtn');
    letter.classList.add('open');
    document.getElementById('envelope').style.display = 'none';
    kittyReaction('happy');
    setTimeout(() => { fireworksBtn.style.opacity = '1'; }, 800);
}

// ========== UPDATED: Automatic Fireworks Logic ==========
let fireworksInterval; // To hold the interval timer

function startAutomaticFireworks() {
    showSection(5);
    kittyReaction('excited');
    
    // Clear any previous interval to prevent duplicates
    if (fireworksInterval) clearInterval(fireworksInterval);
    
    // Create a new firework burst every 800ms
    fireworksInterval = setInterval(createFireworkBurst, 800);
}

function createFireworkBurst() {
    const fireworkContainer = document.getElementById('section5');
    // Create a burst of particles at a random location
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.7; // Avoid bottom of screen

    for (let i = 0; i < 15; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = `${x}px`;
        firework.style.top = `${y}px`;
        firework.style.background = CUTE_COLORS[Math.floor(Math.random() * CUTE_COLORS.length)];
        fireworkContainer.appendChild(firework);
        setTimeout(() => { firework.remove(); }, 1000); // Animation duration
    }
}

// ========== UPDATED: Kitty Mascot Logic ==========
function initKittyMascot() {
    kittyMascot.classList.add('visible');
    kittyMascot.addEventListener('click', () => {
        kittyReaction('happy'); 
        updateKittyHint(currentSection, true);
    });
    updateKittyHint(currentSection);
}
function updateKittyHint(sectionNum, isRandomReaction = false, customHint = "") {
    let hint = "";
    if (customHint) {
        hint = customHint;
    } else {
        const randomHappyHints = ["Meow! You're doing great! 💖", "Purrrfect! Keep going! 🐾", "This is so sweet! 😊"];
        if (isRandomReaction) {
            hint = randomHappyHints[Math.floor(Math.random() * randomHappyHints.length)];
        } else {
            switch (sectionNum) {
                case 1: hint = "Hello! Let's get this party started! ✨"; break;
                case 2: hint = "Happy Birthday! Click the button! ⬆️"; break;
                case 3: hint = "Meow! Happy birthday ifra"; break;
                case 4: hint = "Ooh, a letter! Click it! 💌"; break;
                case 5: hint = "Wow!The fireworks are starting! 🎆"; break;
                default: hint = "Meow! What a wonderful day! 🥳";
            }
        }
    }
    kittyBubble.textContent = hint;
    kittyBubble.classList.add('show');
    clearTimeout(kittyBubble.timeout);
    kittyBubble.timeout = setTimeout(() => { kittyBubble.classList.remove('show'); }, 5000);
}
function kittyReaction(type) {
    const idleGif = kittyGif.dataset.idleGif;
    const happyGif = kittyGif.dataset.happyGif;
    const thinkingGif = kittyGif.dataset.thinkingGif;
    const excitedGif = kittyGif.dataset.excitedGif;
    const waitingGif = kittyGif.dataset.waitingGif;
    let targetGif = idleGif;
    switch (type) {
        case 'happy': targetGif = happyGif; break;
        case 'thinking': targetGif = thinkingGif; break;
        case 'excited': targetGif = excitedGif; break;
        case 'waiting': targetGif = waitingGif; break;
        default: targetGif = idleGif; break;
    }
    if (kittyGif.src !== targetGif) { kittyGif.src = targetGif; }
    clearTimeout(kittyGif.reactionTimeout);
    const revertTime = (type === 'waiting') ? 4000 : 2500;
    kittyGif.reactionTimeout = setTimeout(() => {
        if (kittyGif.src !== idleGif) { kittyGif.src = idleGif; }
    }, revertTime);
}

// NEW: Confetti Collector Logic
function dropSpecialConfetti() {
    const container = document.getElementById('specialConfettiContainer');
    const confetti = document.createElement('div');
    confetti.className = 'special-confetti';

    // Start from a random top position
    confetti.style.left = `${Math.random() * 50 + 25}vw`;
    confetti.style.top = `-20px`;
    container.appendChild(confetti);

    // After a delay, calculate kitty's position and animate confetti towards it
    setTimeout(() => {
        const kittyRect = kittyMascot.getBoundingClientRect();
        const targetX = kittyRect.left + (kittyRect.width / 2);
        const targetY = kittyRect.top;

        confetti.style.left = `${targetX}px`;
        confetti.style.top = `${targetY}px`;
        
        // After confetti reaches kitty, make kitty react and remove confetti
        setTimeout(() => {
            kittyReaction('excited');
            updateKittyHint(-1, false, "Happy Birthday!!!! 🥳");
            confetti.remove();
        }, 1500); // Must match the CSS transition duration
    }, 100);
}


// ========== FIXED: Grow a Garden Logic ==========
function setupGardenGrowth() {
    const sprout = document.querySelector('.sprout');
    sprout.style.transform = `translateX(-50%) scale(1, 0.5)`;
}
function growFlower(sectionIndex) {
    const garden = document.getElementById('gardenContainer');
    const sprout = document.querySelector('.sprout');
    const sproutScales = {
        2: `translateX(-50%) scale(1.2, 1)`,
        3: `translateX(-50%) scale(1.5, 2)`,
        4: `translateX(-50%) scale(1.8, 2.5)`
    };
    if (sproutScales[sectionIndex]) {
        sprout.style.transform = sproutScales[sectionIndex];
    }
    if (sectionIndex === 3) {
        createAndPositionFlower(garden, 'left', 0);
    } else if (sectionIndex === 4) {
        createAndPositionFlower(garden, 'right', 1);
    }
}
function createAndPositionFlower(gardenContainer, side, flowerId) {
    const existingFlower = document.getElementById(`flower-${flowerId}`);
    if (existingFlower) return;

    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.id = `flower-${flowerId}`;
    
    let leftPos = (side === 'left') ? `${Math.random() * 10 + 25}%` : `${Math.random() * 10 + 60}%`;
    flower.style.left = leftPos;
    
    for (let i = 0; i < 4; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.background = CUTE_COLORS[Math.floor(Math.random() * CUTE_COLORS.length)];
        flower.appendChild(petal);
    }
    const centerPetal = document.createElement('div');
    centerPetal.className = 'petal center';
    flower.appendChild(centerPetal);
    
    gardenContainer.appendChild(flower);

    setTimeout(() => {
        flower.classList.add('grown');
    }, 50);
}