const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Установим размер под мобильные устройства
canvas.width = 320;
canvas.height = 480;

// Загрузка изображений
const playerImg = new Image();
playerImg.src = 'assets/player.png';

const enemyImg = new Image();
enemyImg.src = 'assets/enemy.png';

const bulletImg = new Image();
bulletImg.src = 'assets/bullet.png';

// Игрок
const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 50,
  width: 30,
  height: 30,
  speed: 5
};

// Пули
let bullets = [];

// Враги
let enemies = [];

// Счёт
let score = 0;

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
  if (playerImg.complete) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  } else {
    // Резервный вариант - зеленый квадрат
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
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
    speed: 7
  });
}

// Отрисовка пуль
function drawBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    
    if (bulletImg.complete) {
      ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    } else {
      // Резервный вариант - желтый квадрат
      ctx.fillStyle = "#ffff00";
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

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
      speed: 2
    });
  }
}

// Отрисовка врагов
function drawEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    
    if (enemyImg.complete) {
      ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    } else {
      // Резервный вариант - красный квадрат
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    // Удаляем врага, если вышел за экран
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });
}

// Проверка столкновений
function checkCollisions() {
  // Пуля <-> Враг
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (
        bullets[i].x < enemies[j].x + enemies[j].width &&
        bullets[i].x + bullets[i].width > enemies[j].x &&
        bullets[i].y < enemies[j].y + enemies[j].height &&
        bullets[i].y + bullets[i].height > enemies[j].y
      ) {
        // Столкновение!
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score += 10;
        break;
      }
    }
  }

  // Игрок <-> Враг
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (
      player.x < enemies[i].x + enemies[i].width &&
      player.x + player.width > enemies[i].x &&
      player.y < enemies[i].y + enemies[i].height &&
      player.y + player.height > enemies[i].y
    ) {
      // Игрок уничтожен
      alert("Game Over! Счёт: " + score);
      document.location.reload();
      return;
    }
  }
}

// Отображение счёта
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Счёт: " + score, 10, 20);
}

// Главный игровой цикл
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  drawPlayer();
  drawBullets();
  spawnEnemy();
  drawEnemies();
  checkCollisions();
  drawScore();

  requestAnimationFrame(gameLoop);
}

// Запуск игры - проверяем все изображения
function startGame() {
  // Проверяем, загружены ли все изображения
  if (playerImg.complete && enemyImg.complete && bulletImg.complete) {
    gameLoop();
  } else {
    // Если нет - ждем немного и пробуем снова
    setTimeout(startGame, 100);
  }
}

// Начинаем попытку запуска игры
startGame();
