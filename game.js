let scene, camera, renderer, ball, platforms = [], obstacles = [], score = 0;
let moveLeft = false, moveRight = false, jump = false, isOnGround = true;
let ballSpeed = 0.2, ballJumpSpeed = 0.3, gravity = 0.02;
let ballVelocityY = 0;

// Responsive controls
function initControls() {
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);

    // Touch controls for mobile
    const hammer = new Hammer(document.getElementById('gameCanvas'));
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on('swipeleft', () => moveLeft = true);
    hammer.on('swiperight', () => moveRight = true);
    hammer.on('swipeup', () => {
        if (isOnGround) {
            jump = true;
            isOnGround = false;
            ballVelocityY = ballJumpSpeed;
        }
    });
    hammer.on('swipeend', () => {
        moveLeft = false;
        moveRight = false;
    });
}

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0f7fa);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 2;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('gameCanvas').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Ball (Player)
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff4081 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.y = 0.5;
    scene.add(ball);

    // Create Ground & Platforms
    createGround();
    createPlatforms();

    // Init Controls
    initControls();

    // Start the game loop
    animate();
}

function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x80deea });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);
}

function createPlatforms() {
    const platformGeometry = new THREE.BoxGeometry(3, 0.2, 3);
    const platformMaterial = new THREE.MeshStandardMaterial({ color: 0x7b1fa2 });

    for (let i = 0; i < 10; i++) {
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = Math.random() * 2 + 1;
        platform.position.x = (Math.random() - 0.5) * 20;
        platform.position.z = (Math.random() - 0.5) * 20;
        platform.castShadow = true;
        platform.receiveShadow = true;
        scene.add(platform);
        platforms.push(platform);
    }
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 37: // Left arrow key
            moveLeft = true;
            break;
        case 39: // Right arrow key
            moveRight = true;
            break;
        case 32: // Space bar (Jump)
            if (isOnGround) {
                jump = true;
                isOnGround = false;
                ballVelocityY = ballJumpSpeed;
            }
            break;
    }
}

function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 37: // Left arrow key
            moveLeft = false;
            break;
        case 39: // Right arrow key
            moveRight = false;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Move the ball left or right
    if (moveLeft) ball.position.x -= ballSpeed;
    if (moveRight) ball.position.x += ballSpeed;

    // Ball jumping logic
    if (jump) {
        ball.position.y += ballVelocityY;
        ballVelocityY -= gravity;

        if (ball.position.y <= 0.5) {
            ball.position.y = 0.5;
            jump = false;
            isOnGround = true;
        }
    }

    // Camera follows the ball
    camera.position.x = ball.position.x;
    camera.position.z = ball.position.z + 8;
    camera.position.y = ball.position.y + 2;

    renderer.render(scene, camera);
}

init();
