import {
    motions
} from './motions.js';

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
// RUNNING
// -----------------------------------------------------
document.addEventListener("keydown", (e)=>{
    switch (e.key) {
        case "ArrowRight":
            perso.move({x:1})
            break;

        case "ArrowLeft":
            perso.move({x:-1})
            break;

        default:
            break;
    }
});

// -----------------------------------------------------
// JUMPING
// -----------------------------------------------------
document.addEventListener('keydown', (event)=>{
    if (!motions.jumping && event.key === 'ArrowUp' && motions.positionY >= window.innerHeight - 220) {
        perso.move({y:1})
    }
});

// -----------------------------------------------------
// KEYUPS
// -----------------------------------------------------
document.addEventListener("keyup", (e)=>{
    const player = document.querySelector("#player");

    switch (e.key) {
        case "ArrowLeft":
            case "ArrowRight":
                perso.stop("run")
                break;
        
        case "ArrowUp":
            perso.stop("jump")
            break;

        default:
            break;
    }
});