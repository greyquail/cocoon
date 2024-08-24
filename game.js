let scene, camera, renderer;
let player, arrow, target;
let arrows = [], targets = [];
let score = 0;
let isGameOver = false;

// Initialize the game
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#87CEEB');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 5;

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
    const playerGeometry = new THREE.BoxGeometry(2, 0.2, 0.2);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 0.2;
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
        target = new THREE.Mesh(targetGeometry, targetMaterial);
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
    player.position.x += dx;
    player.position.z += dz;
}

function shoot() {
    if (isGameOver) return;

    // Create an arrow
    const arrowGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
    const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const newArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    newArrow.position.set(player.position.x, player.position.y, player.position.z);
    newArrow.rotation.x = Math.PI / 2;
    scene.add(newArrow);
    arrows.push(newArrow);

    // Animate the arrow
    gsap.to(newArrow.position, {
        x: player.position.x + Math.random() * 10 - 5,
        y: player.position.y + Math.random() * 5,
        z: player.position.z - 20,
        duration: 2,
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
                    // All targets hit
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
        target.position.z += 0.05;
        if (target.position.z > 10) {
            scene.remove(target);
            targets = targets.filter(t => t !== target);
            if (targets.length === 0) {
                // Create new targets if none are left
                createTargets();
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
