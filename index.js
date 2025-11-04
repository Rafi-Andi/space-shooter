let isGameOver = false;

const mainMenu = document.getElementById("mainMenu");
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  requestAnimationFrame(gameLoop);
});

function restartGame() {
  gameOver.classList.add("hidden");

  clearInterval(ammoInterval);
  ammoInterval = setInterval(() => {
    if (!isGameOver) {
      ammoRewards.push(createAmmoReward());
    }
  }, 6000);


  nyawaValue = 3;
  pointValue = 0;
  peluruValue = 20;
  levelValue = 1;
  ENEMY_SPEED = 20;
  isGameOver = false;

  player.x = 280
  player.y = 320
  peluru.textContent = peluruValue;
  point.textContent = pointValue;
  renderLevel();
  renderNyawa(nyawaValue);

  enemies.length = 0;
  bullets.length = 0;
  ammoRewards.length = 0;

  lastTime = performance.now();

  requestAnimationFrame(gameLoop);
}

const canvas = document.getElementById("papanGame");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const playerImage = new Image();
playerImage.src = "player.png";
const enemyImage = new Image();
enemyImage.src = "enemy.png";
const ammoPackImage = new Image();
ammoPackImage.src = "ammo.png";

const peluru = document.getElementById("peluru");
let peluruValue = 20;
peluru.textContent = peluruValue;

const point = document.getElementById("point");
let pointValue = 0;
point.textContent = pointValue;

const nyawa = document.getElementById("nyawa");
let nyawaValue = 3;

const level = document.getElementById("level");
let levelValue = 1;

const renderLevel = () => (level.textContent = levelValue);
const renderNyawa = (value) => (nyawa.textContent = "❤️".repeat(value));

renderNyawa(nyawaValue);

const gameOver = document.getElementById("gameOver");
function handleGameOver() {
  isGameOver = true;
  gameOver.classList.remove("hidden");
  const restartButton = document.getElementById("restartButton");
  const finalScore = document.getElementById('finalScore')
  const finalLevel = document.getElementById('finalLevel')

  finalScore.textContent = pointValue
  finalLevel.textContent = levelValue
  restartButton.addEventListener("click", () => {
    restartGame();
  });
}

const player = {
  x: 280,
  y: 320,
  height: 50,
  width: 50,
  speed: 150,
};

const bullets = [];
const enemies = [];
const ammoRewards = [];

const ENEMY_MAX = 5;
let ENEMY_SPEED = 20;

const ammoRewardWidth = 30;
const ammoRewardHeight = 30;
const AMMO_REWARD_SPEED = 60;

const keys = [];

const btnLeft = document.getElementById('btnLeft')
const btnFire = document.getElementById('btnFire')
const btnRight = document.getElementById('btnRight')

btnLeft.addEventListener('mousedown', () => {
    keys['ArrowLeft'] = true
})
btnLeft.addEventListener('mouseup', () => {
    keys['ArrowLeft'] = false
})
btnRight.addEventListener('mousedown', () => {
    keys['ArrowRight'] = true
})
btnRight.addEventListener('mouseup', () => {
    keys['ArrowRight'] = false
})
btnFire.addEventListener('mousedown', () => {
    shoot()
})
btnFire.addEventListener('mouseup', () => {
    shoot()
})

function cekTabrakan(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function shoot() {
  if (peluruValue <= 0) return;
  bullets.push({
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 20,
    speed: 250,
  });
  peluruValue--;
  peluru.textContent = peluruValue;
}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " " && !keys["SPACE_HELD"]) {
    shoot();
    keys["SPACE_HELD"] = true;
  }
});
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
  if (e.key === " ") keys["SPACE_HELD"] = false;
});

function createEnemy() {
  return {
    x: Math.random() * (canvasWidth - 30),
    y: -30,
    width: 30,
    height: 30,
    speed: ENEMY_SPEED,
  };
}

function createAmmoReward() {
  return {
    x: Math.random() * (canvasWidth - ammoRewardWidth),
    y: -ammoRewardHeight,
    width: ammoRewardWidth,
    height: ammoRewardHeight,
    speed: AMMO_REWARD_SPEED,
  };
}

let ammoInterval = setInterval(() => {
  if (!isGameOver) {
    ammoRewards.push(createAmmoReward());
  }
}, 6000);

let lastTime = 0;
function gameLoop(timestamp) {
  if (isGameOver) return;

  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed * deltaTime;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed * deltaTime;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed * deltaTime;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed * deltaTime;

  player.x = Math.max(0, Math.min(canvasWidth - player.width, player.x));
  player.y = Math.max(0, Math.min(canvasHeight - player.height, player.y));

  if (enemies.length < ENEMY_MAX) {
    const newEnemy = createEnemy()
    enemies.push(newEnemy)
  };

  enemies.forEach((enemy, i) => {
    if(enemy.y > canvasHeight - enemy.height){
        enemies.splice(i, 1)
    }
    if (cekTabrakan(enemy, player)) {
      enemies.splice(i, 1);
      nyawaValue = Math.max(0, nyawaValue - 1);
      renderNyawa(nyawaValue);
    }
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);

    if (enemy.y < canvasHeight) enemy.y += enemy.speed * deltaTime;
  });

  ammoRewards.forEach((ammo, i) => {
    ammo.y += ammo.speed * deltaTime;
    ctx.drawImage(ammoPackImage, ammo.x, ammo.y, ammo.width, ammo.height);

    if (cekTabrakan(ammo, player)) {
      peluruValue += 3;
      peluru.textContent = peluruValue;
      ammoRewards.splice(i, 1);
    }
  });

  bullets.forEach((b, i) => {
    b.y -= b.speed * deltaTime;
    ctx.fillStyle = "yellow";
    ctx.fillRect(b.x, b.y, b.width, b.height);

    enemies.forEach((enemy, j) => {
      if (cekTabrakan(b, enemy)) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        pointValue++;
        point.textContent = pointValue;

        if (pointValue % 10 === 0) {
          levelValue++;
          ENEMY_SPEED += 30;
          renderLevel();
        }
      }
    });
  });

  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

  if (nyawaValue <= 0) {
    handleGameOver();
    return;
  }

  requestAnimationFrame(gameLoop);
}
