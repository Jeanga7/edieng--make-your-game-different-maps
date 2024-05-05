import { vh, vw } from "./constants.js";
import { createTimeStats } from "./gameElements.js";
import { levels } from "./levels.js";
import { game } from "./script.mjs";

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
    camera
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
    gameData.isGameOver = true
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

function switchLevel() {
    gameData.currentLevel++;
    if (gameData.currentLevel < levels.length) {
        const level = levels[gameData.currentLevel];
        // Notifications de fin de niveau
        document.querySelector('#winModal').style.display = "flex"
        gameData.levelEndPause = true
        document.querySelector("#btn_continue_win").addEventListener('click', () => {
            gameData.levelEndPause = false
            game(level.scene, level.obstacles, level.enemies, level.bonus, level.background, level.duration, level.end, score);
        })
    } else {
        alert("You finished the GAME !")
    }
}

function checkEnd() {
    const playerPos = parseInt(document.querySelector("#player").style.left)
    if ((playerPos) >= levels[gameData.currentLevel].end) {
        switchLevel();
    }
}

function decreaseLife() {
    gameData.lives--
    if (gameData.lives >= 1) {
        gameData.totalScore -= gameData.levelScore
        clearInterval(gameData.timeLoop)
        game(levels[gameData.currentLevel].scene, levels[gameData.currentLevel].obstacles, levels[gameData.currentLevel].enemies, levels[gameData.currentLevel].bonus, levels[gameData.currentLevel].background, levels[gameData.currentLevel].duration, levels[gameData.currentLevel].end)
    } else {
        gameData.paused = true
        gameData.isGameOver = true
        console.log(gameData.player);
        gameOver()
        cancelAnimationFrame(gameData.cameraAnimation)
    }
}

function camera() {
    gameData.cameraAnimation = window.requestAnimationFrame(camera)
    let playerSize = gameData.player.element.getBoundingClientRect()

    if (playerSize.left >= (vw / 2)) {
        world.scrollLeft += 5
    }

    if (playerSize.top >= vh) {
        decreaseLife()
        // game(levels[gameData.currentLevel].scene, levels[gameData.currentLevel].obstacles, levels[gameData.currentLevel].enemies, levels[gameData.currentLevel].background, levels[gameData.currentLevel].duration, levels[gameData.currentLevel].end)
    }
}