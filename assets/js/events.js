import {
    Character,
    Player,
    Obstacle,
    skins
} from "./models.js";

// -----------------------------------------------------
// OBJECTS INITIALIZATION
// -----------------------------------------------------
export var obstacles = []
obstacles.push(new Obstacle("ground", {x:0, y:0}, {w:1000, h:30}))
obstacles.push(new Obstacle("wall", {x:500, y:20}, {w:270, h:150}))

let perso = new Player({x:30, y:250})
// -----------------------------------------------------
// MOVES
// -----------------------------------------------------
var pressed = {}

document.addEventListener("keydown", (e) => {
    e.preventDefault()
        // let world = document.querySelector("#world")
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        perso.DOMElement.style.backgroundImage = "url('/assets/img/running-player.gif')"
    }
    if (e.key === "ArrowRight") {
        perso.move({x:1})
        perso.direction = 1
    } else if (e.key === "ArrowLeft") {
        perso.move({x:-1})
        perso.direction = -1
    }

    if (e.key === "ArrowUp") {
        perso.move({y:1})
    }
    
}, true);

// -----------------------------------------------------
// KEYUPS
// -----------------------------------------------------
document.addEventListener("keyup", (e) => {
    const player = document.querySelector("#player");
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        // perso.stop("run")
        // delete pressed.x
    }

    if (e.key === "ArrowUp") {
        // if (perso.y === "80vh") {
            // perso.jumping = false
        // }
        // perso.landed = true
        // delete pressed.y
    }
});