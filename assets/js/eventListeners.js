import { gameData } from "./utils.js"

document.addEventListener("keydown", (event) => {
    event.preventDefault()
    let keys = ["P", "p", "Escape"]
    if (keys.includes(event.key)) pauseGame()
})

document.addEventListener("keydown", (event) => {
    event.preventDefault()
    let keys = ["R", "r"]
    if (keys.includes(event.key)) restartGame()
})

const continu = document.querySelector("#continu")
continu.addEventListener('click', () => {
    pauseGame();
})

const restartBtn = document.querySelectorAll("#restart, #btn_restart_GO, #btn_restart_win");
restartBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        const modals = document.querySelectorAll("#pauseModal, #gameOverModal, #winModal")
        modals.forEach(modal => {
            modal.style.display = "none"
        })
        restartGame();
    });
});

// handle main menu
const mainMenuBtn = document.querySelectorAll("#main-menu, #btn_mainmenu_GO")
mainMenuBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('#mainMenuModal').style.display = "flex"
    })
})

gameData.isJumping = false;

document.addEventListener('keydown', (event) => {
    event.preventDefault()

    switch (event.key) {
        case "ArrowLeft":
            runAudio.play()
            gameData.keys.left.pressed = true;
            break;

        case "ArrowRight":
            runAudio.play()
            gameData.keys.right.pressed = true;
            break;

        case " ":
        case "ArrowUp":
            if (!gameData.isJumping && gameData.player.onground) {
                gameData.isJumping = true;
                gameData.player.velocity.y += 20;
                gameData.player.onground = false
            }
            break;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === "ArrowLeft") {
        runAudio.pause()
        gameData.keys.left.pressed = false;
        gameData.player.velocity.x = 0;
        gameData.player.element.style.backgroundImage = `url('${img.player}')`;
    }
    if (event.key === "ArrowRight") {
        runAudio.pause()
        gameData.keys.right.pressed = false;
        gameData.player.velocity.x = 0;
        gameData.player.element.style.backgroundImage = `url('${img.player}')`;
    }

    if (event.key === "ArrowUp" || event.key === " ") {
        gameData.isJumping = false;
        // gameData.player.onground = true
    }
});