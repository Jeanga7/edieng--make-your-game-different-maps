import { paused } from "./script.mjs";

export { Timer, gameOver, randomInterval };

let gameDuration = 240

// Start animation
function Timer() {
    var countdownElement = document.getElementById('timer');
    var countdownTime = gameDuration;

    var countdownInterval = setInterval(function () {
        if (!paused) {
            countdownTime--;
        }
        countdownElement.textContent = "Timer: " + countdownTime;

        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            gameOver()
        }
    }, 1000);
}

function gameOver() {
    // alert("Game over")
    console.log(document.querySelector("#gameOver"));
    document.querySelector("#gameOver").style.display = "block"
    // window.location.reload()
}

let randomInterval = (min, max) => Math.floor(Math.random() * (max - min) + min)