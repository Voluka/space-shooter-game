const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Установим размер под мобильные устройства
canvas.width = 320;
canvas.height = 480;

// Игрок
const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 50,
  width: 30,
  height: 30,
  speed: 5,
  color: "#00ff00"
};

// Пули
let bullets = [];

// Враги
let enemies = [];

// Управление
let keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Отрисовка игрока
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Движение игрока
function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
  if (keys[" "] || keys["ArrowUp"]) {
    shoot();
  }
}

// Стрельба
function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 10,
    color: "#ffff00",
    speed: 7
  });
}

// Отрисовка пуль
function drawBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    // Удаляем пулю, если вышла за экран
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

// Создание врагов
function spawnEnemy() {
  if (Math.random() < 0.03) {
    enemies.push({
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 30,
      height: 30,
      color: "#ff0000",
      speed: 2
    });
  }
}

// Отрисовка врагов
function drawEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Удаляем врага, если вышел за экран
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });
}

// Главный игровой цикл
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  drawPlayer();
  drawBullets();
  spawnEnemy();
  drawEnemies();

  requestAnimationFrame(gameLoop);
}

gameLoop();
