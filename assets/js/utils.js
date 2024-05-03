import {
    game
} from "./script.mjs";
import { createTimeStats } from "./gameElements.js";
import { levels } from "./levels.js";

export {
    gameData,
    Timer,
    restartGame,
    pauseGame,
    gameOver,
    randomInterval,
    checkCollision,
    updateLives,
    updateScore,
    hideModals,
    addScore
};

var gameData = {
    duration: 240,
    player: null,
    currentLevel: 0,
    totalScore: 0,
    lives: 3,
    coins: 0,
    levelScore: 0,
    distance: 0,
    paused: false,
    levelEndPause: false,
    gameOverPause: false
}

// Start animation
function Timer() {
    var countdownElement = document.getElementById('timer');
    
    var countdownTime = gameData.duration;

    gameData.timeLoop = setInterval(function () {
        if (!(gameData.paused || gameData.levelEndPause || gameData.gameOverPause)) {
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

// handle pause option
function pauseGame() {
    let modalDisplay = document.querySelector("#pauseModal").style.display;
    if (!gameData.paused) {
        gameData.paused = true
    } else {
        gameData.paused = false
    }
}


// handle the restart option
function restartGame() {
    gameData.currentLevel = 0;
    gameData.lives = 3;
    gameData.totalScore = 0;
    gameData.levelScore = 0;
    gameData.paused = false
    gameData.levelEndPause = false
    gameData.gameOverPause = false
    // window.location.reload()
    game(levels[gameData.currentLevel].scene, levels[gameData.currentLevel].obstacles, levels[gameData.currentLevel].enemies, levels[gameData.currentLevel].bonus, levels[gameData.currentLevel].background, levels[gameData.currentLevel].duration, levels[gameData.currentLevel].end);
}

function gameOver() {
    document.querySelector("#gameOverModal").style.display = "flex"
    gameData.gameOverPause = true
    clearInterval(gameData.timeLoop);
    document.querySelector("#pauseModal").style.display = "none"
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

let updateScore = () => document.querySelector("#score").textContent = `Score: ${gameData.totalScore}`
let updateLives = () => document.querySelector("#life").textContent = `Lives: ${gameData.lives}`

function hideModals() {
    const modals = document.querySelectorAll("#pauseModal, #gameOverModal, #winModal")
    modals.forEach(modal => {
        modal.style.display = "none"
    })
    gameData.paused = false
    gameData.levelEndPause = false
    gameData.gameOverPause = false
}

function addScore(n) {
    gameData.totalScore += n
    gameData.levelScore += n
    updateScore()
}