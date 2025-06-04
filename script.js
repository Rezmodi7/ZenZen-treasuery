const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5;

class Player {
    constructor() {
        this.width = 50;
        this.height = 80;
        this.x = 100;
        this.y = canvas.height - this.height - 10;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.jumpPower = 15;
        this.isOnGround = false;
    }

    update(platforms) {
        this.x += this.vx;
        this.vy += gravity;
        this.y += this.vy;

        // Ground collision
        this.isOnGround = false;
        for (const platform of platforms) {
            if (
                this.y + this.height <= platform.y + this.vy &&
                this.y + this.height + this.vy >= platform.y &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width
            ) {
                this.y = platform.y - this.height;
                this.vy = 0;
                this.isOnGround = true;
            }
        }

        // Bottom floor
        if (this.y + this.height >= canvas.height - 10) {
            this.y = canvas.height - this.height - 10;
            this.vy = 0;
            this.isOnGround = true;
        }

        // Boundary limits
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }

    draw() {
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    moveLeft() {
        this.vx = -this.speed;
    }

    moveRight() {
        this.vx = this.speed;
    }

    stop() {
        this.vx = 0;
    }

    jump() {
        if (this.isOnGround) {
            this.vy = -this.jumpPower;
            this.isOnGround = false;
        }
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y, width, height, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.startX = x;
        this.range = range;
        this.speed = 2;
        this.direction = 1;
    }

    update() {
        this.x += this.speed * this.direction;

        if (this.x > this.startX + this.range) {
            this.direction = -1;
        } else if (this.x < this.startX) {
            this.direction = 1;
        }
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const player = new Player();

const platforms = [
    new Platform(200, 350, 150, 20),
    new Platform(450, 300, 150, 20),
    new Platform(650, 250, 100, 20),
];

const enemies = [
    new Enemy(220, 320, 40, 30, 100),
    new Enemy(500, 270, 40, 30, 150),
];

let score = 0;

function checkPlayerEnemyCollision() {
    for (const enemy of enemies) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            alert('Player hit an enemy! Game will reset.');
            resetGame();
            break;
        }
    }
}

function resetGame() {
    player.x = 100;
    player.y = canvas.height - player.height - 10;
    player.vx = 0;
    player.vy = 0;
    score = 0;
}

const keys = {
    left: false,
    right: false,
    up: false,
};

// Keyboard controls
window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space' || e.code === 'ArrowUp') keys.up = true;
});

window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space' || e.code === 'ArrowUp') keys.up = false;
});

// Touch controls
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const jumpBtn = document.getElementById('jump-btn');

leftBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    keys.left = true;
});
leftBtn.addEventListener('touchend', e => {
    e.preventDefault();
    keys.left = false;
});
rightBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    keys.right = true;
});
rightBtn.addEventListener('touchend', e => {
    e.preventDefault();
    keys.right = false;
});
jumpBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    keys.up = true;
});
jumpBtn.addEventListener('touchend', e => {
    e.preventDefault();
    keys.up = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    for (const platform of platforms) {
        platform.draw();
    }

    // Draw and update enemies
    for (const enemy of enemies) {
        enemy.update();
        enemy.draw();
    }

    // Player controls
    if (keys.left) player.moveLeft();
    else if (keys.right) player.moveRight();
    else player.stop();

    if (keys.up) {
        player.jump();
        keys.up = false;
    }

    player.update(platforms);
    player.draw();

    checkPlayerEnemyCollision();

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    requestAnimationFrame(gameLoop);
}

gameLoop();
        
