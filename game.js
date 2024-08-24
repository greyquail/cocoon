const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let character = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: 'blue'
};

let projectiles = [];

function drawCharacter() {
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

function drawProjectiles() {
    projectiles.forEach((projectile, index) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
        projectile.y -= projectile.speed;

        // Remove projectile if it goes off screen
        if (projectile.y + projectile.height < 0) {
            projectiles.splice(index, 1);
        }
    });
}

function shootProjectile() {
    projectiles.push({
        x: character.x + character.width / 2 - 5,
        y: character.y,
        width: 10,
        height: 20,
        speed: 5
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCharacter();
    drawProjectiles();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        shootProjectile();
    }
});

update();









