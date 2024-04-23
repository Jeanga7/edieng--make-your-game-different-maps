// import { levels } from "./levels.js";
import { Player, Obstacle, Ennemy, SceneElement } from "./models.js";

export let imgStorage = "./assets/img/"
let gameDuration = 240
export const gravity = -1.5;

export let img = Object.fromEntries(Object.entries({
    sky: "sky.jpg",
    ground: "desert-ground.png",
    player: "static.png",
    ennemy: "static.png",
    runningPlayer: "running-player.gif",
    platform1: "",
    platform2: "platforme2.png",
    colonne: "bloc4-obstacle.png",
    scene1: "pyramid-sphinx.png",
    sun: "sun.png",
    scene2: "desert1.png",
}).map(el => [el[0], imgStorage + el[1]]))

export const world = document.querySelector('#world');

export let currentLevel = 0;

export function game(sceneElements, obstacles, ennemies, bg, duration, end) {
    world.innerHTML = ""
    world.style.width = `100%`;
    world.style.height = `100%`;
    world.style.backgroundSize = 'contain';
    world.style.position = 'relative';
    world.style.overflow = 'hidden';
    world.scrollLeft = 0

    // Background Sky
    let scene = document.createElement("div")
    scene.style.background = bg
    scene.style.backgroundSize = "cover"
    scene.style.position = "fixed"
    scene.style.top = "0px"
    scene.style.left = "0px"
    scene.style.width = "100vw"
    scene.style.height = "100vh"
    scene.style.zIndex = "0"
    scene.id = "scene"
    world.appendChild(scene)

    const timer = document.createElement("div")
    timer.id = "timer"
    timer.style.display = "flex"
    timer.textContent = `Timer: ${duration}`
    timer.style.justifyContent = "center"
    timer.style.backgroundColor = "white"
    timer.style.position = "fixed"
    timer.style.right = "0"

    world.appendChild(timer)

    let decor = []

    // Scene
    sceneElements.forEach(se => {
        decor.push(new SceneElement(se.pos, se.size, se.type, se.cssPosition))
    });

    let characters = [];

    const player = new Player();
    characters.push(player);

    ennemies.forEach(en => {
        characters.push(new Ennemy(en.pos))
    })


    const platforms = [];

    obstacles.forEach(obs => {
        platforms.push(new Obstacle(obs.pos, obs.type, obs.size))
    })

    const keys = { right: { pressed: false }, left: { pressed: false } };

    function checkCollision(player, obstacle) {
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

    function animate() {
        requestAnimationFrame(animate);
        platforms.forEach(platform => platform.draw());
        // obstacles.forEach(obstacle => obstacle.draw());

        characters.forEach(char => {
            char.update();

            // Vérifier les collisions avec les obstacles
            platforms.forEach(obstacle => {
                if (checkCollision(char, obstacle)) {
                    // Gérer la collision ici
                    // console.log("Collision avec un obstacle!");

                    // Empêcher le joueur de passer à travers l'obstacle par le haut, le bas, la gauche ou la droite
                    const playerLeft = char.position.x;
                    const playerRight = char.position.x + char.width;
                    const playerBottom = char.position.y + char.height;
                    const obstacleTop = obstacle.position.y;
                    const obstacleBottom = obstacle.position.y + obstacle.height;
                    const obstacleRight = obstacle.position.x + obstacle.width;
                    const obstacleLeft = obstacle.position.x;
                    var found = false
                    if (obstacleTop < playerBottom && playerBottom < obstacleBottom) {
                        // Le joueur touche le haut de l'obstacle
                        char.position.y = obstacleTop - char.height;
                        char.onground = true;
                        char.velocity.y = 0; // Arrêter le mouvement vertical
                        found = true
                    } else if (char.position.y < obstacleBottom && obstacleBottom < playerBottom) {
                        // Le joueur touche le bas de l'obstacle
                        char.position.y = obstacleBottom - (obstacle.type === "ground" ? 20 : 8);
                        char.velocity.y = 0; // Arrêter le mouvement vertical
                        char.onground = true;
                        found = true
                    } else if (playerRight < obstacleLeft && playerRight < obstacleRight) {
                        // Le joueur touche la gauche de l'obstacle
                        char.position.x = obstacleLeft - char.width
                        alert(char.position.x)
                        char.velocity.x = 0; // Arrêter le mouvement horizontal
                    } else if (playerLeft < obstacleRight && playerLeft > obstacleLeft) {
                        // Le joueur touche la droite de l'obstacle
                        char.position.x = obstacleRight;
                        alert(char.position.x)
                        char.velocity.x = 0; // Arrêter le mouvement horizontal
                    }
                }
            });

            if (char.type === "player") {
                if (keys.right.pressed) {
                    char.velocity.x = 5;
                    char.element.style.transform = `scaleX(1)`;
                } else if (keys.left.pressed && char.element.getBoundingClientRect().left > 10) {
                    char.velocity.x = -5;
                    char.element.style.transform = `scaleX(-1)`;
                } else {
                    char.velocity.x = 0;
                }

                if (char.velocity.x === 0) {
                    char.element.style.backgroundImage = `url('${img.player}')`;
                } else {
                    char.element.style.backgroundImage = `url('${img.runningPlayer}')`;
                }
                if (char.x === end) {
                    return true
                }
            }

            if (char.type === "ennemy") {
                char.velocity.x = 1;
                // if (found) {
                //     char.velocity.x = 1 * -1
                // }
            }
        });
        checkEnd()
    }


    function switchLevel() {
        currentLevel++;
        if (currentLevel < levels.length) {
            const level = levels[currentLevel];
            game(level.scene, level.obstacles, level.ennemies, level.background, level.duration, level.end);
        } else {
            console.log("OVER THE GAME");
        }
    }

    function checkEnd() {
        if (player.position.x >= levels[currentLevel].end) {
            switchLevel();
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
            gameOver()
        }
    }
    camera()

    let isJumping = false;

    document.addEventListener('keydown', (event) => {
        event.preventDefault()

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

    function gameOver() {
        alert("Game over")
        window.location.reload()
    }

    // Start animation
    function Timer() {
        var countdownElement = document.getElementById('timer');
        var countdownTime = gameDuration;

        var countdownInterval = setInterval(function () {
            countdownTime--;
            countdownElement.textContent = "Timer: " + countdownTime;

            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                gameOver()
            }
        }, 1000);
    }

    animate();
    Timer()
}




export let levels = [
    {
        scene: [
            { pos: { x: 800, y: 20 }, size: { w: 300, h: 300 }, type: "sun", cssPosition: "fixed" },
            { pos: { x: 2800, y: -20 }, size: { w: 341 * 2, h: 151 * 2 }, type: "scene1", cssPosition: "absolute" },
            { pos: { x: 1800, y: 20 }, size: { w: 2351 / 5, h: 981 / 5 }, type: "scene2", cssPosition: "absolute" },
        ],
        obstacles: [
            { pos: { x: 1, y: 0 }, type: "ground", size: { w: 600, h: 30 } },
            { pos: { x: 1000, y: 0 }, type: "ground", size: { w: 5000, h: 30 } },
            { pos: { x: 250, y: 70 }, type: "platform2", size: { w: 231, h: 72 } },
            { pos: { x: 650, y: 20 }, type: "platform2", size: { w: 231, h: 72 } },
            { pos: { x: 1250, y: 20 }, type: "colonne", size: { w: 176, h: 143 } },
        ],
        ennemies: [
            { pos: { x: 1000, y: 500 } },
        ],
        background: "skyblue",
        duration: 240,
        end: 1000
    },
    {
        scene: [
            { pos: { x: 800, y: 80 }, size: { w: 300, h: 300 }, type: "sun", cssPosition: "fixed" },
            { pos: { x: 2800, y: -20 }, size: { w: 341 * 2, h: 151 * 2 }, type: "scene1", cssPosition: "absolute" },
            { pos: { x: 1800, y: 20 }, size: { w: 2351 / 5, h: 981 / 5 }, type: "scene2", cssPosition: "absolute" },
        ],
        obstacles: [
            { pos: { x: 1, y: 0 }, type: "ground", size: { w: 600, h: 30 } },
            { pos: { x: 1000, y: 0 }, type: "ground", size: { w: 5000, h: 30 } },
            { pos: { x: 250, y: 70 }, type: "platform2", size: { w: 231, h: 72 } },
            { pos: { x: 650, y: 20 }, type: "platform2", size: { w: 231, h: 72 } },
            { pos: { x: 1250, y: 20 }, type: "colonne", size: { w: 176, h: 143 } },
        ],
        ennemies: [
            { pos: { x: 1000, y: 500 } },
        ],
        background: "darkblue",
        duration: 240,
        end: 3000
    },
]


// game(levels[currentLevel].scene, levels[currentLevel].obstacles, levels[currentLevel].ennemies, levels[currentLevel].background, levels[currentLevel].duration, levels[currentLevel].end);
