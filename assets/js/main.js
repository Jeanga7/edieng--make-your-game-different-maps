import { game, gameData } from "./script.mjs";
import { levels } from "./levels.js";
import { hideModals } from "./utils.js";


const play = document.querySelector("#play")

play.addEventListener('click', () => {
    document.querySelector("#getInModal").style.display = "flex"
    document.querySelector('#getIn').addEventListener('click', () => {
        document.querySelector("#getInModal").style.display = "none"
        document.querySelector('#mainMenuModal').style.display = "none"
        gameData.paused = false;
        gameData.levelEndPause = false;
        gameData.gameOverPause = false;
        gameData.totalScore = 0
        gameData.lives = 3
        gameData.coins = 0
        gameData.levelScore = 0
        gameData.distance = 0
        hideModals()
        addScripts()

        // alert(username)

        game(levels[gameData.currentLevel].scene, levels[gameData.currentLevel].obstacles, levels[gameData.currentLevel].ennemies, levels[gameData.currentLevel].bonus, levels[gameData.currentLevel].background, levels[gameData.currentLevel].duration, levels[gameData.currentLevel].end);
    })


})

function addScripts() {
    let links = ["./assets/js/script.mjs", "./assets/js/levels.js", "./assets/js/utils.js"]
    links.forEach(l => {
        let el = document.createElement("script")
        el.src = l
        el.type = "module"
        document.body.appendChild(el)
    })
}