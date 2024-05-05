import {
    audioStorage,
    img,
    runAudio
} from "./constants.js"
import {
    game
} from "./script.mjs"
import {
    levels
} from "./levels.js"
import {
    gameData,
    hideModals,
    pauseGame,
    restartGame
} from "./utils.js"

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

document.querySelector("#play").addEventListener('click', () => {
    audio.pause();
    music.pause();
    audio.currentTime = 0;
    currentIndex = 0;

    document.querySelector('#mainMenuModal').style.display = "none"
    gameData.paused = false;
    gameData.levelEndPause = false;
    gameData.timeLoop = null;
    gameData.totalScore = 0
    gameData.lives = 3
    gameData.coins = 0
    gameData.levelScore = 0
    gameData.distance = 0
    hideModals()
    if (levels.length === 0) {
        alert("Add levels to the game.")
        window.location.reload()
    } else {
        game(levels[0].scene, levels[0].obstacles, levels[0].enemies, levels[0].background, levels[0].duration, levels[0].end);
    }
})

document.querySelectorAll("#btn_classement_GO, #btn_classement_win").forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector("#getInModal").style.display = "flex";
        // removeScripts();
    });
});


let currentIndex = 0;
const audios = [
    audioStorage + "/paragraphe1_histoire.mp3",
    audioStorage + "/paragraphe2_histoire.mp3",
    audioStorage + "/paragraphe3_histoire.mp3",
    audioStorage + "/paragraphe4_histoire.mp3"
];
let audio = new Audio(audios[currentIndex]);
let music = new Audio(audioStorage + "/music_history.mp3")

audio.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % audios.length;
    if (currentIndex === 0) {
        audio.pause();
        music.pause();
    } else {
        music.volume = 0.2;
        audio.src = audios[currentIndex];
        audio.play();
        music.play();
    }
});

document.querySelector('#history').addEventListener('click', () => {
    if (audio.paused) {
        music.volume = 0.2;
        audio.play();
        music.play();
    } else {
        audio.pause();
        music.pause();
        audio.currentTime = 0;
        currentIndex = 0;
    }
});

document.querySelector('#instructions').addEventListener('click', () => {
    document.querySelector('#instuctionsModal').style.display = 'flex'
})

document.querySelector('#fermerInstruction').addEventListener('click', () => {
    const modal = document.querySelector('#instuctionsModal');
    modal.classList.add('closing');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('closing');
    }, 500);
});