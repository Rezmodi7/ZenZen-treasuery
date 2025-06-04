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
class Enemy {
    constructor(x, y, width, height, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.startX = x;
        this.range = range; // مسافتی که دشمن حرکت میکند
        this.speed = 2;
        this.direction = 1; // 1 یعنی به راست، -1 به چپ
    }

    update() {
        this.x += this.speed * this.direction;

        // برگشت از محدوده حرکت
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

const enemies = [
    new Enemy(220, 320, 40, 30, 100),  // روی اولین پلتفرم
    new Enemy(500, 270, 40, 30, 150),  // روی دومین پلتفرم
];

// اضافه کردن امتیاز اولیه
let score = 0;

// تابع برای بررسی برخورد بازیکن با دشمن
function checkPlayerEnemyCollision() {
    for (const enemy of enemies) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            // برخورد با دشمن
            alert('بازیکن به دشمن برخورد کرد! بازی دوباره شروع می‌شود.');
            resetGame();
            break;
        }
    }
}

// تابع ریست بازی
function resetGame() {
    player.x = 100;
    player.y = canvas.height - player.height - 10;
    player.vx = 0;
    player.vy = 0;
    score = 0;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم پلتفرم‌ها
    for (const platform of platforms) {
        platform.draw();
    }

    // رسم دشمن‌ها
    for (const enemy of enemies) {
        enemy.update();
        enemy.draw();
    }

    // کنترل حرکت
    if (keys.left) player.moveLeft();
    else if (keys.right) player.moveRight();
    else player.stop();

    if (keys.up) {
        player.jump();
        keys.up = false;  // فقط یک بار پرش به ازای هر فشردن دکمه
    }

    player.update(platforms);
    player.draw();

    checkPlayerEnemyCollision();

    // نمایش امتیاز (هنوز آیتم نداریم، پس صفر)
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('امتیاز: ' + score, 10, 30);

    requestAnimationFrame(gameLoop);
}

gameLoop();

         
