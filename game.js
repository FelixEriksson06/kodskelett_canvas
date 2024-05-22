const SCREENWIDTH = innerWidth;
const SCREENHEIGHT = innerHeight;
let gameCanvas = document.getElementById("gameCanvas");
let c = gameCanvas.getContext("2d");
gameCanvas.height = SCREENHEIGHT;
gameCanvas.width = SCREENWIDTH;

var body = document.body;
body.style.overflow = "hidden";

let dx = 5;
let dy = 5;

let playerX = 950;
let playerY = SCREENHEIGHT - 130;
let playerWidth = 20;
let playerHeight = 20;
let playerHP = 10;
let playerScore = 0;

let enemyWidth = 20;
let enemyHeight = 20;
let enemies = [];
let attackingEnemies = new Set();
let enemySpawnInterval;
let animationId;

document.addEventListener("keydown", handleKeyPress);

function getRandomNumberBetween1And2() {
  //Definierar funktion
  return Math.floor(Math.random() * 2) + 1;
}

function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowLeft":
      attack("left");
      break;
    case "ArrowRight":
      attack("right");
      break;
  }
}

function attack(direction) {
  let attackX = playerX;
  let attackY = playerY;

  switch (direction) {
    case "left":
      attackX -= 20;
      break;
    case "right":
      attackX += 20;
      break;
  }

  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    let distanceToEnemy = Math.sqrt(
      Math.pow(enemy.x - attackX, 2) + Math.pow(enemy.y - attackY, 2)
    );

    if (distanceToEnemy <= 20) {
      enemy.hp -= 1;

      if (direction === "left") {
        enemy.x -= 50;
      } else if (direction === "right") {
        enemy.x += 50;
      }

      if (enemy.hp <= 0) {
        enemies.splice(i, 1);

        if (playerScore < 19) playerScore += 1;
        else showGameWonScreen();
      }
    }
  }
}

function enemyAttackPlayer() {
  for (let enemy of enemies) {
    let distanceToPlayerX = Math.abs(enemy.x - playerX);

    if (distanceToPlayerX <= 50 && !attackingEnemies.has(enemy)) {
      attackingEnemies.add(enemy);
      setTimeout(() => {
        let distanceToPlayerAfterDelay = Math.abs(enemy.x - playerX);
        if (playerHP <= 0) {
          showGameOverScreen();
        } else if (distanceToPlayerAfterDelay <= 50) {
          playerHP -= 1;
        }
        attackingEnemies.delete(enemy);
      }, 400);
    }
  }
}

function showGameWonScreen() {
  cancelAnimationFrame(animationId);

  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  c.font = "48px serif";
  c.textAlign = "center";
  c.fillText("Game Won", SCREENWIDTH / 2, SCREENHEIGHT / 2 - 50);

  c.fillText("Press R to Restart", SCREENWIDTH / 2, SCREENHEIGHT / 2 + 50);

  window.addEventListener("keyup", (e) => {
    if (e.key === "r") {
      resetGame();
    }
  });
}

function showGameOverScreen() {
  cancelAnimationFrame(animationId);

  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  c.font = "48px serif";
  c.textAlign = "center";
  c.fillText("Game Over", SCREENWIDTH / 2, SCREENHEIGHT / 2 - 50);

  c.fillText("Press R to Restart", SCREENWIDTH / 2, SCREENHEIGHT / 2 + 50);

  window.addEventListener("keyup", (e) => {
    if (e.key === "r") {
      resetGame();
    }
  });
}

function changeBackgroundImage(imagePath) {
  gameCanvas.style.backgroundImage = `url('${imagePath}')`;
  gameCanvas.style.backgroundSize = "cover";
  gameCanvas.style.backgroundRepeat = "no-repeat";
}

function spawnEnemies() {
  let enemyX;
  if (getRandomNumberBetween1And2() === 1) {
    enemyX = SCREENWIDTH + 20;
  } else {
    enemyX = -20;
  }

  let enemyHP = Math.floor(Math.random() * 3) + 1;

  enemies.push({ x: enemyX, y: SCREENHEIGHT - 130, hp: enemyHP });
}

function moveEnemies() {
  for (let enemy of enemies) {
    let distanceToPlayer = Math.abs(enemy.x - playerX);

    if (distanceToPlayer > 30) {
      if (enemy.x > playerX) {
        enemy.x -= 5;
      } else {
        enemy.x += 5;
      }
    }
  }
}

function resetGame() {
  playerHP = 10;
  playerScore = 0;
  enemies = [];
  attackingEnemies = new Set();
  clearInterval(enemySpawnInterval);
  enemySpawnInterval = setInterval(spawnEnemies, 2000);
  animate();
}

function animate() {
  animationId = requestAnimationFrame(animate);
  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  c.fillRect(playerX, playerY, playerWidth, playerHeight);

  c.font = "48px serif";
  c.fillText("Score: " + playerScore, 20, 50);
  c.fillText("HP: " + playerHP, SCREENWIDTH - 150, 50);

  moveEnemies();
  enemyAttackPlayer();

  for (let enemy of enemies) {
    c.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
  }
}

changeBackgroundImage("PNGs/bakgrund.jpg");
enemySpawnInterval = setInterval(spawnEnemies, 2000);
animate();
