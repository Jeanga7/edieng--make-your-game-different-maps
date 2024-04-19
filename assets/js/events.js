import {
    Character,
    Player,
    Obstacle,
    skins
} from "./models.js";

// -----------------------------------------------------
// OBJECTS INITIALIZATION
// -----------------------------------------------------
let perso = new Player(["10vw", "80vh"])
var obstacle = new Obstacle("wall",["10vw", "80vh"],["500px", "100px"])
// -----------------------------------------------------
// MOVES
// -----------------------------------------------------
var pressed = {}
// var position = 0
const obstacleElement = document.createElement('div');
obstacleElement.className = "wall"
obstacleElement.style.position = 'absolute';
obstacleElement.style.left = `${obstacle.x}px`;
obstacleElement.style.top = `${obstacle.y}px`;
obstacleElement.style.width = `${obstacle.width}px`;
obstacleElement.style.height = `${obstacle.height}px`;
obstacleElement.style.backgroundImage = `url('assets/img/wall-removebg-preview.png')`;

// Add the obstacle to the #world element
const world = document.querySelector('#world');
world.appendChild(obstacleElement);
document.addEventListener("keydown", (e) => {
        // let world = document.querySelector("#world")
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        perso.DOMElement.style.backgroundImage = "url('assets/img/running-player.gif')"
    }
    if (e.key === "ArrowRight") {
        pressed.x = 1
    } else if (e.key === "ArrowLeft") {
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
        // if (perso.y === "80vh") {
            perso.jumping = false
        // }
        perso.landed = true
        delete pressed.y
    }
});