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

const maxJumpHeight = 500;

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

    get direction() {
        return this._direction
    }
    set direction(val) {
        this._direction = val
        this.DOMElement.style.transform = `scaleX(${val})`
    }

    createDOMElement() {
        let world = document.querySelector("#world")
        world.append(this.DOMElement)
    }

    move(direction) {
        if (direction.x !== undefined) {
            if (direction.x === 1) {
                requestAnimationFrame(() => {
                    runRight(this)
                })
            } else {
                requestAnimationFrame(() => {
                    runLeft(this)
                })
            }
        }

        if (direction.y !== undefined) {
            if (direction.y === 1) {
                requestAnimationFrame(() => {
                    jump(this)
                })
            } else {
                requestAnimationFrame(() => {
                    fall(this)
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
        this._jumping = false
        this._landed = true
        this._jumpHeight = 0
        this._direction = 1
        this._maxJumpHeight = maxJumpHeight
        this.DOMElement.id = "player"
        this.DOMElement.style.left = this.x
        this.DOMElement.style.top = this.y
        this.createDOMElement()
    }

    get jumpHeight() {
        return this._jumpHeight
    }
    get maxJumpHeight() {
        return this._maxJumpHeight
    }
    get jumping() {
        return this._jumping
    }
    get landed() {
        return this._landed
    }

    set jumping(val) {
        this._jumping = val
    }
    set landed(val) {
        this._landed = val
    }
    set jumpHeight(val) {
        this._jumpHeight = val > 0 ? -val : 0
        this.DOMElement.animate({transform: `translateY(${this._jumpHeight}px)`},800)
    }

    manualMove() {

    }
}

export class Collision {
    constructor(character, obstacles) {
        this.character = character;
        this.obstacles = obstacles;
    }
    checkCollisions() {
        const character = this.character;
        const obstacles = this.obstacles;

        for (const obstacle of obstacles) {
            if (
                character.x <= obstacle.x + obstacle.width &&
                character.y <= obstacle.y + obstacle.height &&
                character.y + character.height >= obstacle.y
            ) {
                console.log('collision');
            }
        }
    }
}