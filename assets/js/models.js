import {
    obstacles
} from "./events.js"

export const skins = {
    player: "/assets/img/static.png",
    runningPlayer: "/assets/img/running-player.gif",
    wall: "/assets/img/wall-removebg-preview.png",
    ground: "/assets/img/ground.png",
    // A ajouter : coins, wall, paka
}

const playerSize = {
    w: 60,
    h: 90
}
const maxJumpHeight = 500
const gravity = 1.5

export const elements = {
    character: "span",
    obstacle: "div"
}

export class Obstacle {
    // type is a string and the type of obstacle
    // position is a list containing [x, y] position of the obstacle
    // size is a list containing [width, height] of the obstacle
    constructor(type, position, size) {
        this.type = type
        this.skin = skins[type]
        this.x = position.x
        this.y = position.y
        this.width = size.w
        this.height = size.h
        this.createDOMElement()
    }

    get size() {
        return {
            w: this.width,
            h: this.height
        }
    }
    get position() {
        return {
            x: this.x,
            y: this.y
        }
    }

    createDOMElement() {
        if (this.DOMElement) {
            this.DOMElement.remove()
        }
        this.DOMElement = document.createElement(elements.character)
        this.DOMElement.style.position = "absolute"
        this.DOMElement.style.left = this.x + "px"
        this.DOMElement.style.bottom = this.y + "px"
        this.DOMElement.style.width = this.width + "px"
        this.DOMElement.style.height = this.height + "px"
        this.DOMElement.style.backgroundImage = `url('${this.skin}')`
        this.DOMElement.style.backgroundSize = this.type === "ground" ? "auto 100%" : "cover"
        this.DOMElement.style.backgroundRepeat = this.type === "ground" ? "repeat-x" : "no-repeat"
        this.DOMElement.className = "ground"
        let world = document.querySelector("#world")
        world.append(this.DOMElement)
    }
}

export class Character {
    constructor(type, position, size) {
        this.type = type
        this.skin = skins[type]
        this.x = position.x
        this.y = position.y
        this.width = size.w
        this.height = size.h
        this.velocity = {
            x: 1,
            y: 1
        }
        this.frameX = 0
        this.frameY = 0
        this.createDOMElement()
    }

    get direction() {
        return this._direction
    }
    set direction(val) {
        this._direction = val
        this.DOMElement.style.transform = `scaleX(${val})`
    }
    
    createDOMElement() {
        if (this.DOMElement) {
            this.DOMElement.remove()
        }
        this.DOMElement = document.createElement(elements.character)
        this.DOMElement.style.left = this.x + "px"
        this.DOMElement.style.bottom = this.y + "px"
        this.DOMElement.style.width = this.width + "px"
        this.DOMElement.style.height = this.height + "px"
        this.DOMElement.style.backgroundImage = `url('${this.skin}')`
        this.DOMElement.style.transform = `scaleX(${this._direction})`
        this.DOMElement.id = "player"
        let world = document.querySelector("#world")
        world.append(this.DOMElement)
    }

    move(direction) {
        if (direction.x !== undefined) {
            let animateX = () => {
                requestAnimationFrame(animateX) // Déclencher la première frame d'animation
                this.x += this.velocity.x
                let collision = false
                for (const obs of obstacles) {
                    let aheadFoot = obs.position.y <= this.y && this.y <= (obs.position.y + obs.size.h)
                    let aheadHead = obs.position.y <= (this.y + this.height) && (this.y + this.height) <= (obs.position.y + obs.size.h)
                    let touch = ((this.x + this.width) >= obs.position.x) || this.x === 0
                    if ((aheadFoot && aheadHead) && touch) {
                        collision = true
                        console.log("this.x:", this.x, " touch:", obs.position.x)
                        break; // Sortir de la boucle dès qu'une collision est détectée
                    }
                }

                if (collision) {
                    this.velocity.x = 0
                    cancelAnimationFrame(animateX)
                    return
                }
                this.createDOMElement()
            }
            requestAnimationFrame(animateX) // Déclencher la première frame d'animation
            return
        }

        if (direction.y !== undefined) {
            let animateY = () => {
                requestAnimationFrame(animateY)
                this.y += (direction.y * this.velocity.y)
                let collision = false
                for (const obs of obstacles) {
                    let over = obs.position.x < this.x && this.x <= (obs.position.x + obs.size.w)
                    let touch = this.y <= (obs.position.y + obs.size.h + this.velocity.y)
                    if (over && touch) {
                        collision = true
                        console.log("landed");
                        break;
                    }
                }

                if (collision) {
                    this.velocity.y = 0
                    cancelAnimationFrame(animateY)
                    return
                } else {
                    this.velocity.y += gravity
                }

                this.createDOMElement()
            }
            requestAnimationFrame(animateY)
            return
        }
    }
}

export class Player extends Character {
    constructor(position) {
        super("player", position, playerSize)
        this.weapon = false
        this._jumping = false
        this._landed = true
        this._jumpHeight = 0
        this._direction = 1
        this._maxJumpHeight = maxJumpHeight
        this.DOMElement.id = "player"
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
        this.DOMElement.animate({
            transform: `translateY(${this._jumpHeight}px)`
        }, 800)
    }

    manualMove() {

    }
}

