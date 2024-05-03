import { game } from "./script.mjs";
import { levels } from "./levels.js";
import { gameData, hideModals } from "./utils.js";

const play = document.querySelector("#play")

play.addEventListener('click', () => {
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
    game(levels[gameData.currentLevel].scene, levels[gameData.currentLevel].obstacles, levels[gameData.currentLevel].enemies, levels[gameData.currentLevel].bonus, levels[gameData.currentLevel].background, levels[gameData.currentLevel].duration, levels[gameData.currentLevel].end);
})

document.querySelectorAll("#btn_classement_GO, #btn_classement_win").forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector("#getInModal").style.display = "flex";
        // removeScripts();
    });
});


let currentIndex = 0;
const audios = [
    "../../audio/paragraphe1_histoire.mp3",
    "../../audio/paragraphe2_histoire.mp3",
    "../../audio/paragraphe3_histoire.mp3",
    "../../audio/paragraphe4_histoire.mp3"
];
let audio = new Audio(audios[currentIndex]);
let music = new Audio("../../audio/music_history.mp3")

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




// function addScripts() {
//     let links = ["./assets/js/script.mjs", "./assets/js/levels.js", "./assets/js/utils.js"]
//     links.forEach(l => {
//         let el = document.createElement("script")
//         el.src = l
//         el.type = "module"
//         // el.setAttribute("src", l)
//         // el.setAttribute("type", "module")
//         document.body.appendChild(el)
//     })
// }

// function removeScripts() {
//     let scripts = document.querySelectorAll('script');

//     scripts.forEach(script => {
//         if (script.type === 'module') {
//             script.body.removeChild(script);
//         }
//     });
// }