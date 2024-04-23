import { Character, Player, Obstacle, Ennemy } from "./models.js";

export let imgStorage = "./assets/img/"
let gameDuration = 240

export let img = {
    sky: imgStorage + "sky.jpg",
    ground: imgStorage + "ground.png",
    player: imgStorage + "static.png",
    runningPlayer: imgStorage + "running-player.gif",
    platform1: "",
    platform2: imgStorage + "platforme2.png",
}

export const world = document.querySelector('#world');
world.style.width = `100%`;
world.style.height = `100%`;
world.style.backgroundSize = 'contain';
world.style.position = 'relative';
world.style.overflow = 'hidden';
world.scrollLeft = 0

// Background Sky
let sky = document.createElement("div")
sky.style.backgroundImage = `url('${img.sky}')`
sky.style.backgroundSize = "cover"
sky.style.position = "fixed"
sky.style.top = "0px"
sky.style.left = "0px"
sky.style.width = "100vw"
sky.style.height = "100vh"
sky.style.zIndex = "0"
world.appendChild(sky)

const timer = document.createElement("div")
timer.id = "timer"
timer.style.display = "flex"
timer.textContent = `Timer: ${gameDuration}`
timer.style.justifyContent = "center"
timer.style.backgroundColor = "white"
timer.style.position = "fixed"
timer.style.right = "0"

world.appendChild(timer)


export const gravity = -1.5;

const player = new Player();
const platforms = [
    new Obstacle({ x: 1, y: 0 }, "ground", { w: 600, h: 30 }),
    new Obstacle({ x: 1000, y: 0 }, "ground", { w: 5000, h: 30 }),
    new Obstacle({ x: 250, y: 70 }, "platform", { w: 200, h: 30 }),
    new Obstacle({ x: 650, y: 20 }, "platform", { w: 200, h: 30 })
];
export const keys = { right: { pressed: false }, left: { pressed: false } };

export function checkCollision(player, obstacle) {
    // Calculer les coordonnées des bords du joueur et de l'obstacle
    const playerLeft = player.position.x;
    const playerRight = player.position.x + player.width;
    const playerTop = player.position.y;
    const playerBottom = player.position.y + player.height;

    const obstacleLeft = obstacle.position.x;
    const obstacleRight = obstacle.position.x + obstacle.width;
    const obstacleTop = obstacle.position.y;
    const obstacleBottom = obstacle.position.y + obstacle.height;

    // Vérifier s'il y a collision
    if (
        playerLeft < obstacleRight &&
        playerRight > obstacleLeft &&
        playerTop < obstacleBottom &&
        playerBottom > obstacleTop
    ) {
        return true;
    }

    return false;
}

export function animate() {
    requestAnimationFrame(animate);
    platforms.forEach(platform => platform.draw());
    // obstacles.forEach(obstacle => obstacle.draw());
    player.update();

    // Vérifier les collisions avec les obstacles
    platforms.forEach(obstacle => {
        if (checkCollision(player, obstacle)) {
            // Gérer la collision ici
            // console.log("Collision avec un obstacle!");

            // Empêcher le joueur de passer à travers l'obstacle par le haut, le bas, la gauche ou la droite
            const playerLeft = player.position.x;
            const playerRight = player.position.x + player.width;
            const playerBottom = player.position.y + player.height;
            const obstacleTop = obstacle.position.y;
            const obstacleBottom = obstacle.position.y + obstacle.height;
            const obstacleRight = obstacle.position.x + obstacle.width;
            const obstacleLeft = obstacle.position.x;
            if (obstacleTop < playerBottom && playerBottom < obstacleBottom) {
                // Le joueur touche le haut de l'obstacle
                player.position.y = obstacleTop - player.height;
                player.onground = true;
                player.velocity.y = 0; // Arrêter le mouvement vertical
            } else if (player.position.y < obstacleBottom && obstacleBottom < playerBottom) {
                // Le joueur touche le bas de l'obstacle
                player.position.y = obstacleBottom;
                player.velocity.y = 0;
                player.onground = true; // Arrêter le mouvement vertical
            } else if (playerRight < obstacleLeft && playerRight < obstacleRight) {
                // Le joueur touche la gauche de l'obstacle
                player.position.x = obstacleLeft - player.width
                alert(player.position.x)
                player.velocity.x = 0; // Arrêter le mouvement horizontal
            } else if (playerLeft < obstacleRight && playerLeft > obstacleLeft) {
                // Le joueur touche la droite de l'obstacle
                player.position.x = obstacleRight;
                alert(player.position.x)
                player.velocity.x = 0; // Arrêter le mouvement horizontal
            }
        }
    });

    if (keys.right.pressed) {
        player.velocity.x = 5;
        player.element.style.transform = `scaleX(1)`;
    } else if (keys.left.pressed && player.element.getBoundingClientRect().left > 10) {
        player.velocity.x = -5;
        player.element.style.transform = `scaleX(-1)`;
    } else {
        player.velocity.x = 0;
    }

    if (player.velocity.x === 0) {
        player.element.style.backgroundImage = `url('${img.player}')`;
    } else {
        player.element.style.backgroundImage = `url('${img.runningPlayer}')`;
    }

}

function camera() {
    window.requestAnimationFrame(camera)
    let playerSize = player.element.getBoundingClientRect()

    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    if (playerSize.left >= (vw / 2)) {
        world.scrollLeft += 5
    } 

    if (playerSize.top >= vh) {
        alert("Game over")
        window.location.reload()
    }
}
camera()

export let isJumping = false;

document.addEventListener('keydown', (event) => {
    event.preventDefault()
    // if (player.velocity.x === 0) {
    //     player.element.style.backgroundImage = `url('${img.player}')`;
    // } else {
    //     player.element.style.backgroundImage = `url('${img.runningPlayer}')`;
    // }
    console.log(player.velocity.x);

    switch (event.key) {
        case "ArrowLeft":
            keys.left.pressed = true;
            break;

        case "ArrowRight":
            
            keys.right.pressed = true;
            break;

        case "ArrowUp":
            if (!isJumping && player.onground) {
                isJumping = true;
                player.velocity.y += 20;
                player.onground = false
            }
            break;

        case " ":
            if (!isJumping) {
                isJumping = true;
                player.velocity.y += 20;
                player.onground = false
            }
            break;
    }
});



document.addEventListener('keyup', (event) => {
    if (event.key === "ArrowLeft") {
        keys.left.pressed = false;
        player.velocity.x = 0; // Arrêter le mouvement horizontal
        player.element.style.backgroundImage = `url('${img.player}')`;
    }
    if (event.key === "ArrowRight") {
        keys.right.pressed = false;
        player.velocity.x = 0; // Arrêter le mouvement horizontal
        player.element.style.backgroundImage = `url('${img.player}')`;
    }

    if (event.key === "ArrowUp" || event.key === " ") {
        isJumping = false;
        // player.onground = true
    }
});


// Start animation
function Timer() {
    var countdownElement = document.getElementById('timer');
    var countdownTime = gameDuration;

    var countdownInterval = setInterval(function () {
        countdownTime--;
        countdownElement.textContent = "Timer: " + countdownTime;

        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            alert("game over")
        }
    }, 1000);
}

animate();
Timer()