import { img, world, gravity } from "./script.js";

export class Character {
    constructor(type, pos) {
        this.position = { x: pos.x, y: pos.y };
        this.type = type
        this.velocity = { x: 0, y: 0 };
        this.onground = true
        this.width = 50;
        this.height = 65;
        this.element = document.createElement('div');
        this.element.style.backgroundImage = `url('${img[type]}')`
        this.element.style.zIndex = "999"
        this.element.id = 'player';
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
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.velocity.y <= world.clientHeight) {
            this.velocity.y += gravity;
        }
        else { this.velocity.y = 0; }
    }
}

export class Player extends Character {
    constructor() {
        super("player", { x: 50, y: 80 })
    }
}

export class Ennemy extends Character {
    constructor(pos) {
        super("ennemy",pos)
    }
}

export class Obstacle {
    constructor({ x, y }, type, dims) {
        this.position = { x, y };
        this.width = dims.w;
        this.height = dims.h;
        this.type = type
        this.element = document.createElement('div');
        this.element.style.backgroundImage = `url(${img[type]})`
        this.element.classList.add('obstacle');
        this.element.style.position = "absolute"
        this.element.style.left = `${x}px`;
        this.element.style.bottom = `${y}px`;
        if (type === "ground") {
            this.element.style.backgroundSize =  "auto 100%"
            this.element.style.backgroundRepeat =  "repeat-x"
        } else if (type === "platform2") {
            this.element.style.backgroundSize = "cover"
            this.element.style.backgroundPosition =  "center center"
            this.element.style.backgroundRepeat =  "no-repeat"
        }
        // this.element.style.backgroundColor = "green"
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
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= world.clientHeight)
            this.velocity.y += gravity;
        else this.velocity.y = 0;
    }
}

export class SceneElement {
    constructor({ x, y }, dims, ele, p) {
        this.position = { x, y };
        this.element = document.createElement('div');
        this.element.style.backgroundImage = `url(${img[ele]})`
        this.element.className = ele;
        this.element.style.width = dims.w + "px";
        this.element.style.height = dims.h + "px";
        this.element.style.position = p
        this.element.style.left = `${x}px`;
        this.element.style.bottom = `${y}px`;
        this.element.style.backgroundSize = "cover"
        this.element.style.backgroundPosition =  "center center"
        this.element.style.backgroundRepeat =  "no-repeat"
        world.appendChild(this.element);
    }
}