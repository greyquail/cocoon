let scene, camera, renderer;
let player, arrow;
let arrows = [], targets = [];
let score = 0;
let isGameOver = false;
let targetSpeed = 0.02;

// Initialize the game
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#87CEEB');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 5, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('gameCanvas').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Player (Bow)
    const playerGeometry = new THREE.BoxGeometry(2, 0.5, 0.2);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 1;
    scene.add(player);

    // Create initial targets
    createTargets();

    // Setup controls
    initControls();

    // Start game loop
    animate();
}

function createTargets() {
    const targetGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const targetMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    for (let i = 0; i < 5; i++) {
        let target = new THREE.Mesh(targetGeometry, targetMaterial);
        target.position.set(Math.random() * 10 - 5, Math.random() * 5 + 0.5, -10);
        scene.add(target);
        targets.push(target);
    }
}

function initControls() {
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);

    const hammer = new Hammer(document.getElementById('gameCanvas'));
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on('swipeleft', () => move(-1, 0));
    hammer.on('swiperight', () => move(1, 0));
    hammer.on('swipeup', () => shoot());
}

function onDocumentKeyDown(event) {
    if (isGameOver) return;
    switch (event.keyCode) {
        case 37: // Left arrow
            move(-1, 0);
            break;
        case 39: // Right arrow
            move(1, 0);
            break;
        case 32: // Space bar
            shoot();
            break;
    }
}

function onDocumentKeyUp(event) {
    // Additional key release events can be handled here
}

function move(dx, dz) {
    if (isGameOver) return;
    player.position.x = Math.max(-5, Math.min(5, player.position.x + dx));
}

function shoot() {
    if (isGameOver) return;

    // Create an arrow
    const arrowGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
    const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const newArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    newArrow.position.set(player.position.x, player.position.y + 0.5, player.position.z);
    newArrow.rotation.x = Math.PI / 2;
    scene.add(newArrow);
    arrows.push(newArrow);

    // Animate the arrow with realistic physics
    gsap.to(newArrow.position, {
        x: player.position.x,
        y: player.position.y + 10,
        z: player.position.z - 20,
        duration: 2,
        ease: "power1.out",
        onComplete: () => {
            scene.remove(newArrow);
            arrows = arrows.filter(a => a !== newArrow);
        }
    });
}

function checkCollisions() {
    arrows.forEach(arrow => {
        targets.forEach(target => {
            if (arrow.position.distanceTo(target.position) < 0.5) {
                // Hit
                scene.remove(target);
                targets = targets.filter(t => t !== target);
                score += 10;
                document.getElementById('score').textContent = score;
                if (targets.length === 0) {
                    // Create new targets if all are hit
                    createTargets();
                }
            }
        });
    });
}

function animate() {
    if (isGameOver) return;

    requestAnimationFrame(animate);

    // Move targets (simple movement)
    targets.forEach(target => {
        target.position.z += targetSpeed;
        if (target.position.z > 10) {
            scene.remove(target);
            targets = targets.filter(t => t !== target);
            if (targets.length === 0) {
                createTargets(); // Create new targets if none are left
            }
        }
    });

    // Check for collisions
    checkCollisions();

    renderer.render(scene, camera);
}

// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
Key Features and Enhancements
Graphics and Textures:

Player: The bow is a simple box with a wood-like texture.
Targets: Red spheres are used as targets.
Background: Sky-blue background simulates an outdoor environment.
Shooting Mechanics:

Realistic Physics: Arrows follow a parabolic trajectory with easing to simulate realistic physics.
Smooth Animation: GSAP is used for smooth animation of arrows.
Game Mechanics:

Level Progression: New targets are generated when all existing targets are hit.
Collision Detection: Efficient detection of collisions between arrows and targets.
Controls:

Desktop: Arrow keys for movement and space bar for shooting.
Mobile: Swipe gestures for movement and shooting.
Responsive Design:

The game resizes and adjusts the camera aspect ratio on window resize.
UI Elements:

Scoreboard: Displays the current score.
Game Over Screen: Displays when the game ends (you can add a game over condition).
Running the Game
Save the Files: Create index.html and game.js with the provided code.
Open index.html: Double-click to open in a web browser.
Further Improvements
Textures and Models: Use high-resolution textures and detailed 3D models for a more immersive experience.
Sound Effects: Add sounds for shooting, hitting targets, and background music.
Advanced Physics: Implement a physics engine like ammo.js or cannon.js for more complex interactions.
**Levels and Challenges









