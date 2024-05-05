import {
    img,
    gravity,
    world,
    playerInitialPosition,
    playerDims,
    numberOfEnemies
} from "./constants.js";
import {
    randomInterval
} from "./utils.js";
export {
    Character,
    Player,
    Enemy,
    Obstacle,
    Bonus,
    SceneElement
}

class Character {
    constructor(type, pos, dims, mobile = true, speedUp = 1) {
        this.position = {
            x: pos.x,
            y: pos.y
        };
        this.type = type
        this.velocity = {
            x: 0,
            y: 0
        };
        this.onground = true
        this.mobile = mobile
        this.speedUp = speedUp
        this.width = dims.w;
        this.height = dims.h;
        this.element = document.createElement('span');
        this.element.style.zIndex = "999"
        if (type === "player") {
            this.element.id = type;
            this.live = 3
        } else {
            this.element.className = type
        }
        world.appendChild(this.element);
    }

    draw() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.bottom = `${this.position.y}px`;
        this.element.style.width = `${this.width}px`
        this.element.style.height = `${this.height}px`
    }

    update() {
        this.draw();
        if (this.mobile) {
            this.position.x += (this.velocity.x * this.speedUp);
        }
        this.position.y += this.velocity.y;
        if (this.position.y + this.velocity.y <= world.clientHeight) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
    }
}

class Player extends Character {
    constructor(position) {
        super("player", playerInitialPosition, playerDims)
        this.element.style.backgroundImage = `url('${img[this.type]}')`
        this.power = false
    }
}

class Enemy extends Character {
    constructor(pos, mobile, speedUp) {
        super("enemy", pos, {
            w: 50,
            h: 60
        }, mobile, speedUp)
        let imgName = img[this.type + "_" + randomInterval(1, numberOfEnemies)]
        this.element.style.backgroundImage = `url('${imgName}')`
        this.direction = 1
    }

    turn() {
        this.direction = -this.direction
        this.element.style.transform = `scaleX(${this.direction})`;
    }
}

class Obstacle {
    constructor({
        x,
        y
    }, type, dims) {
        this.position = {
            x,
            y
        };
        this.width = dims.w;
        this.height = dims.h;
        this.type = type
        this.element = document.createElement('div');
        this.element.style.backgroundImage = `url(${img[type]})`
        this.element.classList.add('obstacle');
        this.element.style.position = "absolute"
        this.element.style.left = `${x}px`;
        this.element.style.bottom = `${y}px`;
        if (type === "ground" || type === "groundNL") {
            this.element.style.backgroundSize = "auto 100%"
            this.element.style.backgroundRepeat = "repeat-x"
        } else {
            this.element.style.backgroundSize = "cover"
            this.element.style.backgroundPosition = "center center"
            this.element.style.backgroundRepeat = "no-repeat"
        }
        world.appendChild(this.element);
    }

    draw() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.bottom = `${this.position.y}px`;
        this.element.style.width = `${this.width}px`
        this.element.style.height = `${this.height}px`
    }

    update() {
        this.draw();
        // this.position.y += this.velocity.y;
        // this.position.x += this.velocity.x;
        // if (this.position.y + this.height + this.velocity.y <= world.clientHeight)
        //     this.velocity.y += gravity;
        // else this.velocity.y = 0;
    }
}

class Bonus extends Obstacle {
    constructor(pos, type, dimension) {
        super(pos, type, dimension)
    }
}

class SceneElement {
    constructor({
        x,
        y
    }, dims, ele, p) {
        this.position = {
            x,
            y
        };
        this.element = document.createElement('div');
        this.element.style.backgroundImage = `url(${img[ele]})`
        this.element.className = ele;
        this.element.style.width = dims.w + "px";
        this.element.style.height = dims.h + "px";
        this.element.style.position = p
        this.element.style.left = `${x}px`;
        this.element.style.bottom = `${y}px`;
        this.element.style.backgroundSize = "cover"
        this.element.style.backgroundPosition = "center center"
        this.element.style.backgroundRepeat = "no-repeat"
        world.appendChild(this.element);
    }
}