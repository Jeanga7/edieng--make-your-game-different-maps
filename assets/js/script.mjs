import { levels } from "./levels.js";
import { Player, Obstacle, Enemy, SceneElement, bonus } from "./models.js";
import { Timer, gameOver } from "./utils.js";
import { img, enemyContact, world } from "./constants.js";

export let currentLevel = 0;

export var gameData = {
    totalScore: 0,
    lives: 3,
    coins: 0,
    levelScore: 0
}

export let paused = false;

// handle the pause option
document.addEventListener("keydown", (e) => {
    if (e.key === "p" || e.key === "P") {
        if (!paused) {
            paused = true
        } else {
            paused = false
        }
    }
})

// handle the restart option
document.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") {
        currentLevel = 0;
        gameData.lives = 3;
        gameData.totalScore = 0;
        gameData.levelScore = 0;
        paused = false
        // window.location.reload()
        game(levels[currentLevel].scene, levels[currentLevel].obstacles, levels[currentLevel].ennemies, levels[currentLevel].coins, levels[currentLevel].background, levels[currentLevel].duration, levels[currentLevel].end, levels[currentLevel].coins);
    }
})

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
export function game(sceneElements, obstacles, ennemies, coins, bg, duration, end) {
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

    // timer initialization
    const timer = document.createElement("div")
    timer.id = "timer"
    timer.style.display = "flex"
    timer.textContent = `Timer: ${duration}`
    timer.style.justifyContent = "center"
    timer.style.backgroundColor = "white"
    timer.style.position = "fixed"
    timer.style.right = "600px"
    timer.style.fontSize = "30px"

    // life initialization
    const Life = document.createElement("div")
    Life.id = "live"
    Life.style.display = "flex"
    Life.textContent = `live: ${gameData.lives}`
    Life.style.justifyContent = "center"
    // Life.style.alignContent = "center"
    Life.style.backgroundColor = "white"
    Life.style.position = "fixed"
    Life.style.right = "800px"
    Life.style.fontSize = "30px"

    // score initialization
    const score = document.createElement("div")
    score.id = "score"
    score.style.display = "flex"
    score.textContent = `score: ${gameData.totalScore}`
    score.style.justifyContent = "center"
    // score.style.alignContent = "center"
    score.style.backgroundColor = "white"
    score.style.position = "fixed"
    score.style.left = "300px"
    score.style.fontSize = "30px"

    // pause initialization
    const PauseMenu = document.createElement("div");
    PauseMenu.id = "Menupause";
    PauseMenu.style.display = "flex";
    PauseMenu.style.position = "fixed";
    PauseMenu.style.height = "100px";
    PauseMenu.style.top = '300px';
    PauseMenu.style.left = "600px";
    PauseMenu.style.alignItems = "center"; 
    PauseMenu.style.justifyContent = "center";
    PauseMenu.style.fontSize = "60px"; 
    PauseMenu.textContent = "PAUSED";
    PauseMenu.style.display = "none"

    // pause initialization
    const gameOverModal = document.createElement("div");
    gameOverModal.id = "gameOver";
   gameOverModal.style.display = "flex";
    gameOverModal.style.position = "fixed";
    gameOverModal.style.height = "80%";
    gameOverModal.style.width = "40%";
    gameOverModal.style.top = "10%";
    gameOverModal.style.left = "30%";
    gameOverModal.style.backgroundSize = "cover"
    // gameOverModal.style.backgroundColor = "white";
    gameOverModal.style.backgroundImage = `url('${img.gameOver}')`
    gameOverModal.style.alignItems = "center"; 
    gameOverModal.style.justifyContent = "center"; 
    gameOverModal.style.fontSize = "70px";
    gameOverModal.textContent = "GAME OVER";
    gameOverModal.style.color = "white"
    gameOverModal.style.fontWeight = "bold"
    gameOverModal.style.zIndex = "100"
    gameOverModal.style.display= "none"


    world.appendChild(gameOverModal)
    world.appendChild(score)
    world.appendChild(PauseMenu)
    world.appendChild(timer)
    world.appendChild(Life)

    gameData.levelScore = 0

    let updateScore = () => score.textContent = `score: ${gameData.totalScore}`

    let decor = []

    // Scene
    sceneElements.forEach(se => {
        decor.push(new SceneElement(se.pos, se.size, se.type, se.cssPosition))
    });

    let characters = [];

    const player = new Player();
    characters.push(player);

    coins.forEach(coin => {
        characters.push(new bonus(coin.pos, { w: 50, h: 50 }))
    })

    ennemies.forEach(en => {
        characters.push(new Enemy(en.pos, en.mobile, en.speedUp))
    })


    const platforms = [];

    obstacles.forEach(obs => {
        platforms.push(new Obstacle(obs.pos, obs.type, obs.size))
    })

    const keys = { right: { pressed: false }, left: { pressed: false } };

    function checkCollision(player, obstacle, contact = 0) {
        // Calculer les coordonnées des bords du joueur et de l'obstacle
        const playerLeft = player.position.x;
        const playerRight = playerLeft + player.width;
        const playerBottom = player.position.y
        const playerTop = playerBottom + player.height;

        const obstacleLeft = obstacle.position.x;
        const obstacleRight = obstacleLeft + obstacle.width;
        const obstacleBottom = obstacle.position.y
        const obstacleTop = obstacleBottom + obstacle.height;

        // Vérifier s'il y a collision
        if (
            playerLeft + contact < obstacleRight &&
            obstacleLeft + contact < playerRight &&
            obstacleBottom + contact < playerTop &&
            playerBottom + contact < obstacleTop
        ) {
            return true;
        }

        return false;
    }

    // var val = 1
    function animate() {
        requestAnimationFrame(animate);

        let damage = false
        if (player.position.x % 1000 === 0) {
            gameData.totalScore += 10
            gameData.levelScore += 10
            updateScore()
        }

        platforms.forEach(platform => platform.draw());
        // obstacles.forEach(obstacle => obstacle.draw());
        if (!paused) {
            PauseMenu.style.display = "none"
            characters.forEach(char => {
                char.update();
                var found = false

                // Vérifier les collisions avec les obstacles
                platforms.forEach(obstacle => {
                    // console.log(obstacle.position);
                    if (checkCollision(char, obstacle)) {
                        if (char.type === "enemy") {
                            char.velocity.x = char.direction;
                            if (found) {
                                char.turn()
                            }
                        }
                        // Empêcher le joueur de passer à travers l'obstacle par le haut, le bas, la gauche ou la droite
                        const playerLeft = char.position.x;
                        const playerRight = playerLeft + char.width;
                        const playerBottom = char.position.y;
                        const playerTop = playerBottom + char.height;
                        const obstacleBottom = obstacle.position.y;
                        const obstacleTop = obstacleBottom + obstacle.height;
                        const obstacleLeft = obstacle.position.x;
                        const obstacleRight = obstacleLeft + obstacle.width;

                        // Le joueur et l'obstacle sont sur le même alignement Vertical
                        const obstacleAndPlayerSameVAxis = (
                            (obstacleLeft <= playerLeft && playerLeft <= obstacleRight) // Le joueur dépasse l'obstacle sur la droite
                            || (obstacleLeft <= playerRight && playerRight <= obstacleRight) // Le joueur dépasse l'obstacle sur la gauche
                            || (playerLeft <= obstacleLeft && obstacleRight <= playerRight) // L'obstacle est entre la gauche et la droite du joueur
                        )

                        const obstacleAndPlayerSameHAxis = (
                            (obstacleBottom <= playerBottom && playerBottom <= obstacleTop) // La tête du joueur dépasse l'obstacle
                            || (obstacleBottom <= playerTop && playerTop <= obstacleTop) // L'obstacle dépasse la tête du joueur
                            || (playerBottom <= obstacleBottom && obstacleTop <= playerTop) // L'obstacle est entre la tête et les pieds du joueur
                        )

                        // Est en dessous de l'obstacle
                        const playerUnderObstacle = obstacleAndPlayerSameVAxis
                            && (playerBottom < obstacleBottom && obstacleBottom < playerTop)

                        // Est au dessus de l'obstacle
                        const playerOverObstacle = obstacleAndPlayerSameVAxis
                            && (playerBottom < obstacleTop && obstacleTop < playerTop)

                        // Est avant l'obstacle
                        const playerBeforeObstacle = obstacleAndPlayerSameHAxis
                            && (playerLeft < obstacleLeft && obstacleLeft < playerRight)

                        // Est après l'obstacle
                        const playerAfterObstacle = obstacleAndPlayerSameHAxis
                            && (playerLeft < obstacleRight && obstacleRight < playerRight)

                        if (playerUnderObstacle) {
                            char.position.y = obstacleBottom - char.height
                            char.velocity.y = 0
                        } else if (playerOverObstacle) {
                            char.position.y = obstacleTop - (obstacle.type === "ground" ? 20 : 8)
                            char.velocity.y = 0
                            char.onground = true
                        } else if (playerBeforeObstacle) {
                            char.position.x = obstacleLeft - char.width
                            char.velocity.x = 0
                        } else if (playerAfterObstacle) {
                            char.position.x = obstacleRight
                            char.velocity.x = 0
                        }
                        found = true
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

                    if (isJumping === true && player.onground === false) {
                        char.element.style.backgroundImage = `url('${img.playerJumping}')`;
                    }
                    if (isJumping === false && player.onground === false) {
                        char.element.style.backgroundImage = `url('${img.playerFalling}')`;
                    }

                    if (char.x === end) {
                        return true
                    }
                }
            })
        } else {
            PauseMenu.style.display = "block"
        };


        characters.forEach(char => {
            if (checkCollision(player, char, enemyContact) && char.type === "enemy") {
                damage = true
            }
        });

        if (damage) {
            player.velocity.y -= 20
            // decreaseLife()
        };

        characters.forEach(char => {
            if (checkCollision(player, char, enemyContact) && char.type === "coin") {
                world.removeChild(char.element);
                gameData.totalScore += 20
                gameData.levelScore += 20
                gameData.coins++
                updateScore()
            }
        });

        checkEnd()
    }


    function switchLevel() {
        currentLevel++;
        if (currentLevel < levels.length) {
            const level = levels[currentLevel];
            // Notifications de fin de niveau
            alert("Level cleared !")
            console.log(paused);
            game(level.scene, level.obstacles, level.ennemies, level.coins, level.background, level.duration, level.end, score);
        } else {
            alert("You finished the GAME !")
        }
    }

    function checkEnd() {
        const playerPos = parseInt(document.querySelector("#player").style.left)
        if ((playerPos) >= levels[currentLevel].end) {
            switchLevel();
        }
    }

    function decreaseLife() {
        if (gameData.lives > 1) {
            gameData.lives--
            gameData.totalScore -= gameData.levelScore
            game(levels[currentLevel].scene, levels[currentLevel].obstacles, levels[currentLevel].ennemies, levels[currentLevel].coins, levels[currentLevel].background, levels[currentLevel].duration, levels[currentLevel].end)
        } else {
            gameOver()
        }
    }

    function camera() {
        window.requestAnimationFrame(camera)
        let playerSize = player.element.getBoundingClientRect()



        if (playerSize.left >= (vw / 2)) {
            world.scrollLeft += 5
        }

        if (playerSize.top >= vh) {
            decreaseLife()
            // game(levels[currentLevel].scene, levels[currentLevel].obstacles, levels[currentLevel].ennemies, levels[currentLevel].background, levels[currentLevel].duration, levels[currentLevel].end)
        }
    }
    camera()

    let isJumping = false;

    document.addEventListener('keydown', (event) => {
        event.preventDefault()

        // gestion de la fonctionnalité restart

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
                if (!isJumping && player.onground) {
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

    animate();
    Timer()
}


game(levels[currentLevel].scene, levels[currentLevel].obstacles, levels[currentLevel].ennemies, levels[currentLevel].coins, levels[currentLevel].background, levels[currentLevel].duration, levels[currentLevel].end);

