import {
    fall,
    jump,
    runLeft,
    runRight,
    motionless
} from "./motions.js"

export const skins = {
    player: "/assets/img/static.png",
    runningPlayer: "/assets/img/running-player.gif",
    wall: "/assets/img/wall-removebg-preview.png",
    // A ajouter : coins, wall, paka
}

export const elements = {
    character: "span",
    obstacle: "div"
}

export class Obstacle {
    // type is a string and the type of obstacle
    // position is a list containing [x, y] position of the obstacle
    // dimensions is a list containing [width, height] of the obstacle
    constructor(type, position, dimensions) {
        this.type = type
        this.skin = skins[type]
        this.x = position[0]
        this.y = position[1]
        this.width = dimensions[0]
        this.height = dimensions[1]
    }
}

export class Character {
    constructor(type, position) {
        this.type = type
        this.skin = skins[type]
        this.x = position[0]
        this.y = position[1]
        this.DOMElement = document.createElement(elements.character)
    }

    createDOMElement() {
        let world = document.querySelector("#world")
        world.append(this.DOMElement)
    }

    move(direction) {
        if (direction.x !== undefined) {
            if (direction.x === 1) {
                requestAnimationFrame(()=>{
                    runRight(this.DOMElement)
                })
            } else {
                requestAnimationFrame(()=>{
                    runLeft(this.DOMElement)
                })
            }
        }

        if (direction.y !== undefined) {
            if (direction.y === 1) {
                requestAnimationFrame(()=>{
                    jump(this.DOMElement)
                })
            } else {
                requestAnimationFrame(()=>{
                    fall(this.DOMElement)
                })
            }
        }
    }

    stop(type) {
        if (type === "run") {
            requestAnimationFrame(motionless)
            cancelAnimationFrame(runRight)
            cancelAnimationFrame(runLeft)
            cancelAnimationFrame(motionless)
        } else if (type === "jump") {
            requestAnimationFrame(fall)
            cancelAnimationFrame(jump)
            cancelAnimationFrame(fall)
        }
    }
}

export class Player extends Character {
    constructor(position) {
        super("player", position)
        this.weapon = false
        this.DOMElement.id = "player"
        this.DOMElement.style.left = this.x
        this.DOMElement.style.top = this.y
        this.createDOMElement()
    }

    manualMove() {

    }
}