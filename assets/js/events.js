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
// MOVES
// -----------------------------------------------------
document.addEventListener("keydown", (e)=>{
    switch (e.key) {
        case "ArrowRight":
            perso.move({x:1})
            break;

        case "ArrowLeft":
            perso.move({x:-1})
            break;

        case "ArrowUp":
            perso.jumping = true
            perso.move({y:1})
            break;

        default:
            break;
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
            perso.jumping = false
            perso.landed = true
            break;

        default:
            break;
    }
});