import {
    gameData
} from "./script.mjs";
import { createTimeStats } from "./gameElements.js";

export {
    Timer,
    gameOver,
    randomInterval,
    checkCollision
};

let gameDuration = 240

// Start animation
function Timer() {
    var countdownElement = document.getElementById('timer');
    
    var countdownTime = gameDuration;

    gameData.timeLoop = setInterval(function () {
        if (!(gameData.paused || gameData.levelEndPause)) {
            countdownTime--;
        }
        countdownElement.textContent = "Timer: " + countdownTime;

        createTimeStats(countdownTime)

        if (countdownTime <= 0) {
            clearInterval(gameData.timeLoop);
            gameOver()
        }
    }, 1000);
}

function gameOver() {
    document.querySelector("#gameOverModal").style.display = "flex"
}

let randomInterval = (min, max) => Math.floor(Math.random() * (max - min) + min)

function checkCollision(player, obstacle, contact = 0) {
    // Calculer les coordonnées des bords du joueur et de l'obstacle
    const playerLeft = player.position.x;
    const playerRight = playerLeft + player.width;
    const playerBottom = player.position.y
    const playerTop = playerBottom + player.height;

    const obstacleLeft = obstacle.position.x;
    const obstacleRight = obstacleLeft + obstacle.width;
    const obstacleBottom = obstacle.position.y
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