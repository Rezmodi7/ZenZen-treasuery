// script.js - ZenZen Acolyte Level

const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d');

const gravity = 0.5; let cameraX = 0;

class Player { constructor() { this.width = 50; this.height = 80; this.x = 100; this.y = 0; this.vx = 0; this.vy = 0; this.speed = 5; this.jumpPower = 15; this.isOnGround = false; }

update(platforms) { this.vy += gravity; this.x += this.vx; this.y += this.vy; this.isOnGround = false;

for (const platform of platforms) {
  if (
    this.x < platform.x + platform.width &&
    this.x + this.width > platform.x &&
    this.y + this.height <= platform.y + this.vy &&
    this.y + this.height + this.vy >= platform.y &&
    this.y + this.height <= platform.y + platform.height
  ) {
    this.y = platform.y - this.height;
    this.vy = 0;
    this.isOnGround = true;
  }
}

}

draw() { ctx.fillStyle = '#ff6600'; ctx.fillRect(this.x - cameraX, this.y, this.width, this.height); }

moveLeft() { this.vx = -this.speed; } moveRight() { this.vx = this.speed; } stop() { this.vx = 0; } jump() { if (this.isOnGround) { this.vy = -this.jumpPower; } } }

class Platform { constructor(x, y, width, height) { this.x = x; this.y = y; this.width = width; this.height = height; }

draw() { ctx.fillStyle = '#654321'; ctx.fillRect(this.x - cameraX, this.y, this.width, this.height); } }

const player = new Player(); const platforms = [ new Platform(0, canvas.height - 40, 2000, 40), new Platform(300, 300, 100, 20), new Platform(600, 250, 100, 20), new Platform(900, 200, 100, 20), ];

const keys = { left: false, right: false, up: false };

window.addEventListener('keydown', e => { if (e.code === 'ArrowLeft') keys.left = true; if (e.code === 'ArrowRight') keys.right = true; if (e.code === 'ArrowUp' || e.code === 'Space') keys.up = true; }); window.addEventListener('keyup', e => { if (e.code === 'ArrowLeft') keys.left = false; if (e.code === 'ArrowRight') keys.right = false; if (e.code === 'ArrowUp' || e.code === 'Space') keys.up = false; });

// Touch Controls const leftBtn = document.getElementById('left-btn'); const rightBtn = document.getElementById('right-btn'); const jumpBtn = document.getElementById('jump-btn');

leftBtn.addEventListener('touchstart', e => { e.preventDefault(); keys.left = true; }); leftBtn.addEventListener('touchend', e => { e.preventDefault(); keys.left = false; }); rightBtn.addEventListener('touchstart', e => { e.preventDefault(); keys.right = true; }); rightBtn.addEventListener('touchend', e => { e.preventDefault(); keys.right = false; }); jumpBtn.addEventListener('touchstart', e => { e.preventDefault(); keys.up = true; }); jumpBtn.addEventListener('touchend', e => { e.preventDefault(); keys.up = false; });

function gameLoop() { ctx.clearRect(0, 0, canvas.width, canvas.height);

if (keys.left) player.moveLeft(); else if (keys.right) player.moveRight(); else player.stop();

if (keys.up) { player.jump(); keys.up = false; }

player.update(platforms);

cameraX = player.x - 200; if (cameraX < 0) cameraX = 0;

for (const platform of platforms) { platform.draw(); }

player.draw();

requestAnimationFrame(gameLoop); }

gameLoop();

