import { createTimeStats } from "./gameElements.js";

export {
    gameData,
    Timer,
    gameOver,
    randomInterval,
    checkCollision,
    updateLives,
    updateScore,
    addScore,
    hideModals
};

var gameData = {
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
    isGameOver: false
}

// Start animation
function Timer() {
    var countdownElement = document.getElementById('timer');
    
    var countdownTime = gameData.duration;

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
    clearInterval(gameData.timeLoop)
    gameData.player.element.remove()
    gameData.characters.filter(c=>c.type === "player").map(c=>{c.element.remove()})
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

function addScore(n) {
    gameData.totalScore += n
    gameData.levelScore += n
    updateScore()
}

function hideModals() {
    const modals = document.querySelectorAll("#pauseModal, #gameOverModal, #winModal")
    modals.forEach(modal => {
        modal.style.display = "none"
    })
}