import {
    Character,
    Player,
    Obstacle
} from "./models.js";

// -----------------------------------------------------
// OBJECTS INITIALIZATION
// -----------------------------------------------------
let perso = new Player(["10vw", "80vh"])

// -----------------------------------------------------
// MOVES
// -----------------------------------------------------
var pressed = {}
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        perso.DOMElement.style.backgroundImage = "url('assets/img/running-player.gif')"
    }
    if (e.key === "ArrowRight") {
        pressed.x = 1
    }
    if (e.key === "ArrowLeft") {
        pressed.x = -1
    }
    if (e.key === "ArrowUp") {
        pressed.y = 1
    }

    if (pressed.x) {
        perso.direction = pressed.x
    }
    console.log("Direction: " + perso.direction, "Pressed: " + JSON.stringify(pressed))
    perso.move(pressed)
}, true);

// -----------------------------------------------------
// KEYUPS
// -----------------------------------------------------
document.addEventListener("keyup", (e) => {
    const player = document.querySelector("#player");

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        perso.stop("run")
        delete pressed.x
    }

    if (e.key === "ArrowUp") {
        if (perso.y === "80vh") {
            perso.jumping = false
        }
        perso.landed = true
        delete pressed.y
    }
});