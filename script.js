const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

const gravity = 0.6;
let currentLevel = 0;
let score = 0;

const levels = [
  {
    name: 'Acolyte',
    playerStart: { x: 100, y: 300 },
    platforms: [
      { x: 0, y: 380, width: 2000, height: 20 },
      { x: 300, y: 300, width: 120, height: 20 },
    ],
    enemies: [],
    items: [],
    goal: { x: 700, y: 300 }
  },
  {
    name: 'Guardian',
    playerStart: { x: 100, y: 300 },
    platforms: [
      { x: 0, y: 380, width: 2000, height: 20 },
      { x: 250, y: 280, width: 100, height: 20 },
      { x: 500, y: 250, width: 100, height: 20 },
    ],
    enemies: [
      { x: 260, y: 250, range: 60 },
      { x: 510, y: 220, range: 80 }
    ],
    items: [],
    goal: { x: 720, y: 250 }
  },
  {
    name: 'Sage',
    playerStart: { x: 100, y: 300 },
    platforms: [
      { x: 0, y: 380, width: 2000, height: 20 },
      { x: 300, y: 280, width: 100, height: 20 },
      { x: 500, y: 240, width: 100, height: 20 },
    ],
    enemies: [],
    items: [
      { x: 310, y: 250 },
      { x: 510, y: 210 }
    ],
    goal: { x: 700, y: 200 }
  },
  {
    name: 'Emperor',
    playerStart: { x: 100, y: 300 },
    platforms: [
      { x: 0, y: 380, width: 2000, height: 20 },
      { x: 200, y: 300, width: 100, height: 20 },
      { x: 350, y: 250, width: 100, height: 20 },
      { x: 550, y: 200, width: 100, height: 20 },
    ],
    enemies: [
      { x: 360, y: 220, range: 100 },
      { x: 560, y: 170, range: 100 }
    ],
    items: [{ x: 560, y: 170 }],
    goal: { x: 750, y: 150 }
  },
  {
    name: 'Zen Deity',
    playerStart: { x: 100, y: 300 },
    platforms: [
      { x: 0, y: 380, width: 3000, height: 20 },
      { x: 300, y: 280, width: 100, height: 20 },
      { x: 600, y: 240, width: 100, height: 20 },
      { x: 900, y: 200, width: 100, height: 20 },
    ],
    enemies: [],
    items: [
      { x: 310, y: 250 },
      { x: 610, y: 210 },
      { x: 910, y: 170 }
    ],
    goal: { x: 1000, y: 170 }
  }
];

class Player {
  constructor() {
    this.width = 50;
    this.height = 80;
    this.reset();
  }

  reset() {
    const pos = levels[currentLevel].playerStart;
    this.x = pos.x;
    this.y = pos.y;
    this.vx = 0;
    this.vy = 0;
    this.speed = 5;
    this.jumpPower = 15;
    this.isOnGround = false;
  }

  update(platforms) {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    this.isOnGround = false;

    for (const p of platforms) {
      if (
        this.x + this.width > p.x &&
        this.x < p.x + p.width &&
        this.y + this.height <= p.y &&
        this.y + this.height + this.vy >= p.y
      ) {
        this.y = p.y - this.height;
        this.vy = 0;
        this.isOnGround = true;
      }
    }
  }

  draw() {
    ctx.fillStyle = 'orange';
    ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
  }

  moveLeft() { this.vx = -this.speed; }
  moveRight() { this.vx = this.speed; }
  stop() { this.vx = 0; }
  jump() {
    if (this.isOnGround) {
      this.vy = -this.jumpPower;
      this.isOnGround = false;
    }
  }
}

class Platform {
  constructor(x, y, width, height) {
    Object.assign(this, { x, y, width, height });
  }

  draw() {
    ctx.fillStyle = '#654321';
    ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
  }
}

class Enemy {
  constructor(x, y, range) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 30;
    this.startX = x;
    this.range = range;
    this.direction = 1;
    this.speed = 2;
  }

  update() {
    this.x += this.direction * this.speed;
    if (this.x > this.startX + this.range || this.x < this.startX) {
      this.direction *= -1;
    }
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
  }
}

class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.collected = false;
  }

  draw() {
    if (!this.collected) {
      ctx.fillStyle = 'gold';
      ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    }
  }
}

let player = new Player();
let cameraX = 0;
let keys = { left: false, right: false, up: false };

function loadLevel(index) {
  currentLevel = index;
  const level = levels[index];

  platforms = level.platforms.map(p => new Platform(p.x, p.y, p.width, p.height));
  enemies = level.enemies.map(e => new Enemy(e.x, e.y, e.range));
  items = level.items.map(i => new Item(i.x, i.y));
  goal = level.goal;
  player.reset();
}

let platforms = [];
let enemies = [];
let items = [];
let goal = null;

loadLevel(0);

function checkCollisions() {
  for (const enemy of enemies) {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      alert('You hit an enemy! Try again.');
      loadLevel(currentLevel);
    }
  }

  for (const item of items) {
    if (!item.collected &&
      player.x < item.x + item.width &&
      player.x + player.width > item.x &&
      player.y < item.y + item.height &&
      player.y + player.height > item.y) {
      item.collected = true;
      score += 1;
    }
  }

  if (
    player.x < goal.x + 30 &&
    player.x + player.width > goal.x &&
    player.y < goal.y + 30 &&
    player.y + player.height > goal.y
  ) {
    if (currentLevel < levels.length - 1) {
      alert(`Level ${levels[currentLevel].name} complete!`);
      loadLevel(currentLevel + 1);
    } else {
      alert('You completed the final level! 🎉');
      loadLevel(0);
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.left) player.moveLeft();
  else if (keys.right) player.moveRight();
  else player.stop();

  if (keys.up) {
    player.jump();
    keys.up = false;
  }

  player.update(platforms);
  for (const e of enemies) e.update();

  cameraX = player.x - canvas.width / 2 + player.width / 2;
  if (cameraX < 0) cameraX = 0;

  platforms.forEach(p => p.draw());
  enemies.forEach(e => e.draw());
  items.forEach(i => i.draw());

  ctx.fillStyle = 'lime';
  ctx.fillRect(goal.x - cameraX, goal.y, 30, 30);

  player.draw();
  checkCollisions();

  ctx.fillStyle = 'black';
  ctx.font = '18px Arial';
  ctx.fillText(`Score: ${score}`, cameraX + 10, 30);
  ctx.fillText(`Level: ${levels[currentLevel].name}`, cameraX + 10, 50);

  requestAnimationFrame(gameLoop);
}

gameLoop();

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
document.getElementById('left-btn').addEventListener('touchstart', e => {
  e.preventDefault(); keys.left = true;
});
document.getElementById('left-btn').addEventListener('touchend', e => {
  e.preventDefault(); keys.left = false;
});

document.getElementById('right-btn').addEventListener('touchstart', e => {
  e.preventDefault(); keys.right = true;
});
document.getElementById('right-btn').addEventListener('touchend', e => {
  e.preventDefault(); keys.right = false;
});

document.getElementById('jump-btn').addEventListener('touchstart', e => {
  e.preventDefault(); keys.up = true;
});
document.getElementById('jump-btn').addEventListener('touchend', e => {
  e.preventDefault(); keys.up = false;
});
