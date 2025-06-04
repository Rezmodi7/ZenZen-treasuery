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

    update() {
        // حرکت افقی
        this.x += this.vx;

        // جاذبه
        this.vy += gravity;
        this.y += this.vy;

        // برخورد با زمین
        if (this.y + this.height >= canvas.height - 10) {
            this.y = canvas.height - this.height - 10;
            this.vy = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }

        // جلوگیری از خروج از صفحه
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

const player = new Player();

const keys = {
    left: false,
    right: false,
    up: false,
};

// کنترل‌های کیبورد
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

// کنترل‌های لمسی
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

    // کنترل حرکت
    if (keys.left) player.moveLeft();
    else if (keys.right) player.moveRight();
    else player.stop();

    if (keys.up) {
        player.jump();
        keys.up = false;  // فقط یک بار پرش به ازای هر فشردن دکمه
    }

    player.update();
    player.draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
      
