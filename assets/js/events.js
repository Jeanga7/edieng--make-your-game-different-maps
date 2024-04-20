import {
    Character,
    Player,
    Obstacle,
    skins,
    Collision
} from "./models.js";

// -----------------------------------------------------
// OBJECTS INITIALIZATION
// -----------------------------------------------------
let perso = new Player(["10vw", "80vh"])
var obstacle = new Obstacle("wall",["40vw", "15vh"],["67.9", "36.7"])
var obstacle2 = new Obstacle("wall",["80vw", "15vh"],["67.9", "36.7"])
var collisio = new Collision(perso, obstacle)
// -----------------------------------------------------
// MOVES
// -----------------------------------------------------
var pressed = {}
// var position = 0
const obstacleElement = document.createElement('div');
obstacleElement.className = "wall"
obstacleElement.style.position = 'absolute';
obstacleElement.style.left = `${obstacle.x}`;
obstacleElement.style.bottom = `${obstacle.y}`;
obstacleElement.style.width = `${obstacle.width}px`;
obstacleElement.style.height = `${obstacle.height}px`;
obstacleElement.style.backgroundImage = `url('assets/img/wall-removebg-preview.png')`;
obstacleElement.style.backgroundSize = "cover";

// second wall

const obstacleElement2 = document.createElement('div');
obstacleElement2.className = "wall"
obstacleElement2.style.position = 'absolute';
obstacleElement2.style.left = `${obstacle2.x}`;
obstacleElement2.style.bottom = `${obstacle2.y}`;
obstacleElement2.style.width = `${obstacle2.width}px`;
obstacleElement2.style.height = `${obstacle2.height}px`;
obstacleElement2.style.backgroundImage = `url('assets/img/wall-removebg-preview.png')`;
obstacleElement2.style.backgroundSize = "cover";

// Add the obstacle to the #world element
const world = document.querySelector('#world');
world.appendChild(obstacleElement2);
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
    // console.log("x ->",this.character.x);
    //     console.log("y ->",this.character.y);
    console.log("Direction: " + perso.direction, "Pressed: " + JSON.stringify(pressed))
    perso.move(pressed)
    collisio.checkCollisions()
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