import { game, gameData } from "./script.mjs";
import { levels } from "./levels.js";
import { currentLevel } from "./script.mjs";


const play = document.querySelector("#play")

play.addEventListener('click', () => {
    document.querySelector("#getInModal").style.display = "flex"
    document.querySelector('#getIn').addEventListener('click', () => {
        document.querySelector("#getInModal").style.display = "none"
        document.querySelector('#mainMenuModal').style.display = "none"
        gameData.paused = false;
        gameData.totalScore = 0
        gameData.lives = 3
        gameData.coins = 0
        gameData.levelScore = 0
        gameData.distance = 0
        const modals = document.querySelectorAll("#pauseModal, #gameOverModal, #winModal")
        modals.forEach(modal => {
            modal.style.display = "none"
        })
        addScripts()

        alert(username)

        game(levels[currentLevel].scene, levels[currentLevel].obstacles, levels[currentLevel].ennemies, levels[currentLevel].bonus, levels[currentLevel].background, levels[currentLevel].duration, levels[currentLevel].end);
    })


})

function addScripts() {
    let links = ["./assets/js/script.mjs", "./assets/js/levels.js", "./assets/js/utils.js"]
    links.forEach(l => {
        let el = document.createElement("script")
        el.src = l
        el.type = "module"
        // el.setAttribute("src", l)
        // el.setAttribute("type", "module")
        document.body.appendChild(el)
    })
}