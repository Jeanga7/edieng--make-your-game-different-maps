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
obstacles.push(new Obstacle("ground", {
    x: -20,
    y: 0
}, {
    w: 1000,
    h: 30
}))
obstacles.push(new Obstacle("wall", {
    x: 500,
    y: 20
}, {
    w: 270,
    h: 150
}))

let perso = new Player({
    x: 30,
    y: 250
})
perso.move({y:-1})
// -----------------------------------------------------
// MOVES
// -----------------------------------------------------
var pressed = {
    left: false,
    right: false,
    up: false
}

document.addEventListener("keydown", (e) => {
    e.preventDefault()
    // let world = document.querySelector("#world")
    // if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    //     perso.DOMElement.style.backgroundImage = "url('/assets/img/running-player.gif')"
    // }
    if (e.key === "ArrowRight") {
        if (!pressed.right) {
            perso.velocity.x = 1
            perso.move({
                x: 1
            })
            perso.direction = 1
            pressed.right = true
        }
    } else if (e.key === "ArrowLeft") {
        if (!pressed.left) {
            perso.velocity.x = -1
            perso.move({
                x: -1
            })
            perso.direction = -1
            pressed.left = true
        }
    }

    if (e.key === "ArrowUp") {
        if (!pressed.up) {
            perso.velocity.y = -15
            pressed.up = true
        }
    }

}, true);

// -----------------------------------------------------
// KEYUPS
// -----------------------------------------------------
document.addEventListener("keyup", (e) => {
    const player = document.querySelector("#player");
    if (e.key === "ArrowLeft") {
        perso.velocity.x = 0
        pressed.left = false
    } else if (e.key === "ArrowRight") {
        perso.velocity.x = 0
        pressed.right = false
    } else if (e.key === "ArrowUp") {
        perso.velocity.y = 1
        pressed.up = false
        // if (perso.y === "80vh") {
        // perso.jumping = false
        // }
        // perso.landed = true
        // delete pressed.y
    }
});