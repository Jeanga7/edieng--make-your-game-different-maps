import {
  backAudio,
  bonusAudio,
  coinAudio,
  dieAudio,
  enemyContact,
  img,
  imgStorage,
  killAudio,
  powerDuration,
  vh,
  vw
} from "./constants.js";
import { levels } from "./levels.js";
import { game } from "./game.mjs";
import { showHistory } from "./history.js";

export {
  gameData,
  Timer,
  gameOver,
  randomInterval,
  checkCollision,
  updateLives,
  updateScore,
  addScore,
  hideModals,
  switchLevel,
  checkEnd,
  decreaseLife,
  camera,
  restartGame,
  pauseGame,
  animate,
  showStats,
  setPlayerSkin
};

var gameData = {
  countdownTime: 240,
  duration: 240,
  currentLevel: 0,
  globalAnimation: null,
  player: null,
  totalScore: 0,
  lives: 3,
  coins: 0,
  levelScore: 0,
  distance: 0,
  obstacles: [],
  characters: [],
  isGameOver: false,
  levelEndPause: false,
  isAttacking: false,
}

// Start animation
function Timer() {
  var countdownElement = document.getElementById("timer");

  gameData.countdownTime = gameData.duration;

  gameData.timeLoop = setInterval(function () {
    if (!(gameData.paused || gameData.levelEndPause) && gameData.countdownTime >= 0) {
      gameData.countdownTime--;
    }
    countdownElement.textContent = " 🕐 " + gameData.countdownTime;

    if (gameData.countdownTime <= 0) {
      clearInterval(gameData.timeLoop);
      gameOver();
    }
  }, 1000);
}

function gameOver() {
  showStats();
  document.querySelector("#gameOverModal").style.display = "flex";
  clearInterval(gameData.timeLoop);
  gameData.isGameOver = true;
}

let randomInterval = (min, max) => Math.floor(Math.random() * (max - min) + min);

function checkCollision(player, obstacle, contact = 0) {
  // Calculer les coordonnées des bords du joueur et de l'obstacle
  const playerLeft = player.position.x;
  const playerRight = playerLeft + player.width;
  const playerBottom = player.position.y;
  const playerTop = playerBottom + player.height;

  const obstacleLeft = obstacle.position.x;
  const obstacleRight = obstacleLeft + obstacle.width;
  const obstacleBottom = obstacle.position.y;
  const obstacleTop = obstacleBottom + obstacle.height;

  // Vérifier s'il y a collision
  if (
    playerLeft + contact < obstacleRight &&
    obstacleLeft + contact < playerRight &&
    obstacleBottom + contact < playerTop &&
    playerBottom + contact < obstacleTop
  ) {
    return true;
  }

  return false;
}

let updateScore = () => (document.querySelector("#score").textContent = `Score: ${gameData.totalScore}`);
let updateLives = () => (document.querySelector("#life").textContent = " ❤️ ".repeat(gameData.lives));

function addScore(n) {
  gameData.totalScore += n;
  gameData.levelScore += n;
  updateScore();
}

function hideModals() {
  const modals = document.querySelectorAll("#pauseModal, #gameOverModal, #winModal ,#getInModal");
  modals.forEach(modal => {
    modal.style.display = "none";
  });
}

function switchLevel() {
  gameData.currentLevel++;
  if (gameData.currentLevel < levels.length) {
    const level = levels[gameData.currentLevel];
    // Notifications de fin de niveau
    showStats();
    document.querySelector("#winModal").style.display = "flex";
    gameData.levelEndPause = true;
    document.querySelector("#btn_continue_win").addEventListener("click", () => {
      gameData.levelEndPause = false;
      game(
        level.scene,
        level.obstacles,
        level.enemies,
        level.background,
        level.duration,
        level.end,
        score
      );
    });
  } else {
    // alert("You finished the GAME !");
    document.querySelector('#gameOverModal').style.display = "flex"
    document.querySelector("#game-over-text").textContent = "You Finished the Game"
    gameData.levelEndPause = true
  }
}

function checkEnd() {
  const playerPos = parseInt(document.querySelector("#player").style.left);
  if (playerPos >= levels[gameData.currentLevel].end) {
    switchLevel();
  }
}

function decreaseLife() {
  gameData.lives--;
  if (gameData.lives >= 1) {
    gameData.totalScore -= gameData.levelScore;
    clearInterval(gameData.timeLoop);
    game(
      levels[gameData.currentLevel].scene,
      levels[gameData.currentLevel].obstacles,
      levels[gameData.currentLevel].enemies,
      levels[gameData.currentLevel].background,
      levels[gameData.currentLevel].duration,
      levels[gameData.currentLevel].end
    );
  } else {
    gameData.paused = true;
    gameData.isGameOver = true;
    gameOver();
    cancelAnimationFrame(gameData.cameraAnimation);
  }
}

function camera() {
  let playerSize = gameData.player.element.getBoundingClientRect();

  if (playerSize.left >= vw / 2) {
    world.scrollLeft += 5;
  }

  if (playerSize.top >= vh) {
    decreaseLife();
  }
}

// handle pause option
function pauseGame() {
  if (!gameData.paused) {
    gameData.paused = true;
  } else {
    gameData.paused = false;
  }
}

// handle the restart option
function restartGame() {
  gameData.currentLevel = 0;
  gameData.lives = 3;
  gameData.totalScore = 0;
  gameData.levelScore = 0;
  gameData.paused = false;
  gameData.levelEndPause = false;
  gameData.player = null;
  gameData.isGameOver = false;
  hideModals();
  game(
    levels[gameData.currentLevel].scene,
    levels[gameData.currentLevel].obstacles,
    levels[gameData.currentLevel].enemies,
    levels[gameData.currentLevel].background,
    levels[gameData.currentLevel].duration,
    levels[gameData.currentLevel].end
  );
}

function animate(end) {
  backAudio.play();
  const PauseMenu = document.querySelector("#pauseModal");
  gameData.globalAnimation = requestAnimationFrame(animate);

  updatePlayerScore();

  gameData.obstacles.forEach(platform => platform.draw());

  if (shouldContinueAnimating()) {
    updateCharacters(PauseMenu, end);
  } else if (shouldDisplayPauseMenu()) {
    PauseMenu.style.display = "flex";
  }

  updateObstacles()
  handlePlayerEnemyCollision()

  checkEnd();
}


// //////////////////////////////////
function updatePlayerScore() {
  let posX = gameData.player.position.x;
  if (
    posX !== 0 &&
    posX > gameData.distance &&
    posX - gameData.distance >= 1000
  ) {
    addScore(10);
    gameData.distance = gameData.player.position.x;
  }
}

// ////////////////
function shouldContinueAnimating() {
  return (
    !gameData.paused &&
    !gameData.isGameOver &&
    !gameData.levelEndPause &&
    !gameData.showHistoryPause
  );
}
// //////////////////////////////
function handleCollision(char) {
  var found = false;
  gameData.obstacles.forEach(obstacle => {
    if (
      obstacle.type !== "life" &&
      obstacle.type !== "power" &&
      obstacle.type !== "coin"
    ) {
      if (checkCollision(char, obstacle)) {
        if (char.type === "enemy") {
          char.velocity.x = char.direction;
          if (found) {
            char.turn();
          }
        }
        // Empêcher le joueur de passer à travers l'obstacle par le haut, le bas, la gauche ou la droite
        const playerLeft = char.position.x;
        const playerRight = playerLeft + char.width;
        const playerBottom = char.position.y;
        const playerTop = playerBottom + char.height;
        const obstacleBottom = obstacle.position.y;
        const obstacleTop = obstacleBottom + obstacle.height;
        const obstacleLeft = obstacle.position.x;
        const obstacleRight = obstacleLeft + obstacle.width;

        // Le joueur et l'obstacle sont sur le même alignement Vertical
        const obstacleAndPlayerSameVAxis =
          (obstacleLeft <= playerLeft && playerLeft <= obstacleRight) || // Le joueur dépasse l'obstacle sur la droite
          (obstacleLeft <= playerRight && playerRight <= obstacleRight) || // Le joueur dépasse l'obstacle sur la gauche
          (playerLeft <= obstacleLeft && obstacleRight <= playerRight); // L'obstacle est entre la gauche et la droite du joueur

        const obstacleAndPlayerSameHAxis =
          (obstacleBottom <= playerBottom && playerBottom <= obstacleTop) || // La tête du joueur dépasse l'obstacle
          (obstacleBottom <= playerTop && playerTop <= obstacleTop) || // L'obstacle dépasse la tête du joueur
          (playerBottom <= obstacleBottom && obstacleTop <= playerTop); // L'obstacle est entre la tête et les pieds du joueur

        // Est en dessous de l'obstacle
        const playerUnderObstacle =
          obstacleAndPlayerSameVAxis &&
          (playerBottom < obstacleBottom && obstacleBottom < playerTop);

        // Est au dessus de l'obstacle
        const playerOverObstacle =
          obstacleAndPlayerSameVAxis &&
          (playerBottom < obstacleTop && obstacleTop < playerTop);

        // Est avant l'obstacle
        const playerBeforeObstacle =
          obstacleAndPlayerSameHAxis &&
          (playerLeft < obstacleLeft && obstacleLeft < playerRight);

        // Est après l'obstacle
        const playerAfterObstacle =
          obstacleAndPlayerSameHAxis &&
          (playerLeft < obstacleRight && obstacleRight < playerRight);

        if (playerUnderObstacle) {
          char.position.y = obstacleBottom - char.height;
          char.velocity.y = 0;
        } else if (playerOverObstacle) {
          char.position.y =
            obstacleTop - (obstacle.type === "ground" ? 20 : 8);
          char.velocity.y = 0;
          char.onground = true;
        } else if (playerBeforeObstacle) {
          char.position.x = obstacleLeft - char.width;
          char.velocity.x = 0;
        } else if (playerAfterObstacle) {
          char.position.x = obstacleRight;
          char.velocity.x = 0;
        }
        found = true;
      }
    }
  });
}

// ////////////////////////////
function handlePlayerMovement(char) {
  if (char.type === "player") {
    if (gameData.keys.right.pressed) {
      char.velocity.x = 5;
      char.element.style.transform = `scaleX(1)`;
    } else if (
      gameData.keys.left.pressed &&
      char.element.getBoundingClientRect().left > 10
    ) {
      char.velocity.x = -5;
      char.element.style.transform = `scaleX(-1)`;
    } else {
      char.velocity.x = 0;
    }
  }
}

// ///////////////////////
function handlePlayerAnimation(char) {
  if (char.type === "player") {
    if (char.velocity.x === 0) {
      if (gameData.isAttacking) {
        char.element.className = "attack"
      } else {
        char.element.className = "idle";
      }
    } else {
      if (gameData.isAttacking) {
        char.element.className = "attack"
      } else {
        char.element.className = "run";
      }
    }
  }
}
// ///////////////////////////::*
function handlePlayerPosition(char, end) {
  if (char.type === "player") {
    if (gameData.player.onground === false) {
      char.element.className = "jump";
    }
    if (char.x === end) {
      return true;
    }
    showHistory(char.position.x);
  }
}
// ////////////////////////
function updateCharacters(PauseMenu, end) {
  camera()
  PauseMenu.style.display = "none";
  gameData.characters.forEach(char => {
    char.update();

    // Vérifier les collisions avec les obstacles
    handleCollision(char)
    handlePlayerMovement(char)
    handlePlayerAnimation(char)
    handlePlayerPosition(char, end)
  });
}
// ///////////////////////////////
function shouldDisplayPauseMenu() {
  return gameData.paused && !gameData.isGameOver && !gameData.levelEndPause;
}

// ///////////////////////////////
function updateObstacles() {
  let newObstacleType;
  let obstacleFound;
  let obstacleIndex;
  gameData.obstacles.forEach((obs, i) => {
    if (checkCollision(gameData.player, obs, obs.width / 2) && !obs.taken) {
      newObstacleType = obs.type;
      obstacleFound = obs;
      obstacleIndex = i;
    }
  });

  if (newObstacleType !== gameData.lastObstacleType) {

    gameData.lastObstacleType = newObstacleType;
    if (gameData.lastObstacleType === "coin") {
      console.log("Got coin !");
      obstacleFound.element.remove();
      obstacleFound.taken = true;
      coinAudio.play();
      gameData.obstacles.splice(obstacleIndex, 1);
      addScore(20);
      gameData.coins++;
    } else if (gameData.lastObstacleType === "life") {
      console.log("Got life !");
      obstacleFound.element.remove();
      bonusAudio.play();
      gameData.obstacles.splice(obstacleIndex, 1);
      gameData.lives++;
      updateLives();
    } else if (
      gameData.lastObstacleType === "power" &&
      !gameData.player.power
    ) {
      console.log("Got power !");
      obstacleFound.element.remove();
      bonusAudio.play();
      gameData.obstacles.splice(obstacleIndex, 1);
      gameData.player.power = true;
    }
  }
}

// ////////////////////////////////////
function handlePlayerEnemyCollision() {
  gameData.characters.forEach((char, i) => {
    if (char.type === "enemy") {
      if (checkCollision(gameData.player, char, 2)) {
        if (!gameData.player.power) {
          console.log("Dead !");
          dieAudio.play();
          gameData.player.velocity.y -= 20;
        } else if (gameData.player.power) {
          console.log("Enemy killed !");
          gameData.player.velocity.x = 0
          char.velocity.x = 0
          setTimeout(() => {
            char.element.remove();
          }, 800)
          if (!gameData.isAttacking) {
            gameData.isAttacking = true
            setTimeout(() => {
              gameData.player.element.className = "idle"
              gameData.isAttacking = false
            }, 500)
          }
          gameData.player.element.className = "attack"
          killAudio.play();
          addScore(10);
          gameData.characters.splice(i, 1);
          // On doit supprimer l'élément de la liste des gameData.characters

          // Sleep for 5 seconds
          setTimeout(function () {
            gameData.player.power = false;
          }, powerDuration); // 5000 milliseconds = 5 seconds
        }
      }
    }
  });
}

function showStats() {
  // handle the print of tab sta
  document
    .querySelectorAll("#timeStats_pause, #timeStats_GO, #timeStats_win")
    .forEach(element => {
      element.style.color = "white";
    });

  document
    .querySelectorAll("#livesStats_pause, #livesStats_GO, #livesStats_win")
    .forEach(element => {
      if (gameData.lives >= 0) {
        element.textContent = " ❤️ ".repeat(gameData.lives);
      } else {
        element.textContent = "";
      }
      element.style.color = "white";
      element.style.fontSize = "30px";
    });

  document
    .querySelectorAll("#scoreStats_pause, #scoreStats_GO, #scoreStats_win")
    .forEach(element => {
      element.textContent = `🎯 ${gameData.totalScore}`;
      element.style.color = "white";
      element.style.fontSize = "30px";
    });

  document
    .querySelectorAll("#timeStats_pause, #timeStats_GO, #timeStats_win")
    .forEach(element => {
      element.textContent = ` 🕐 ${gameData.countdownTime}`;
      element.style.fontSize = "30px";
    });
}


function setPlayerSkin() {
  document.querySelector("#homePlayer").style.backgroundImage = `url('/assets/img/player-${playersInfos[selectedPlayer].number}-home.png')`
  img.player = `${imgStorage}player-${playersInfos[selectedPlayer].number}.png`
}