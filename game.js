let scene, camera, renderer, player, obstacles = [];
let moveLeft = false, moveRight = false, isJumping = false, isFalling = false;
let speed = 0.1, jumpSpeed = 0.2, gravity = 0.01;
let playerVelocityY = 0;

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('gameCanvas').appendChild(renderer.domElement);

    // Player (a simple cube)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    player = new THREE.Mesh(geometry, material);
    player.position.y = 0.5;
    scene.add(player);

    // Create the ground
    const groundGeometry = new THREE.PlaneGeometry(100, 10);
    const groundMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // Listen to keyboard events
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);

    // Start the game loop
    animate();
}

function onDocumentKeyDown(event) {
    switch(event.keyCode) {
        case 37: // Left arrow key
            moveLeft = true;
            break;
        case 39: // Right arrow key
            moveRight = true;
            break;
        case 32: // Space bar (Jump)
            if (!isJumping && !isFalling) {
                isJumping = true;
                playerVelocityY = jumpSpeed;
            }
            break;
    }
}

function onDocumentKeyUp(event) {
    switch(event.keyCode) {
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

    // Move player left or right
    if (moveLeft) player.position.x -= speed;
    if (moveRight) player.position.x += speed;

    // Jumping logic
    if (isJumping) {
        player.position.y += playerVelocityY;
        playerVelocityY -= gravity;
        if (player.position.y <= 0.5) {
            player.position.y = 0.5;
            isJumping = false;
            isFalling = false;
        }
    }

    // Add obstacles
    if (Math.random() < 0.02) {
        addObstacle();
    }

    // Move obstacles and check for collision
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].position.z += speed;
        if (obstacles[i].position.z > 5) {
            scene.remove(obstacles[i]);
            obstacles.splice(i, 1);
            i--;
        } else if (obstacles[i].position.distanceTo(player.position) < 1) {
            alert('Game Over! Refresh to restart.');
            return;
        }
    }

    renderer.render(scene, camera);
}

function addObstacle() {
    const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const obstacleMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.x = (Math.random() - 0.5) * 10;
    obstacle.position.y = 0.5;
    obstacle.position.z = -10;
    obstacles.push(obstacle);
    scene.add(obstacle);
}

init();
