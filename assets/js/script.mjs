import {
    levels
} from "./levels.js";
import {
    Player,
    Obstacle,
    Enemy,
    SceneElement,
    Bonus
} from "./models.js";
import {
    Timer,
    gameOver,
    checkCollision
} from "./utils.js";
import {
    img,
    enemyContact,
    world,
    powerDuration
} from "./constants.js";
import {
    createWorldElements
} from "./gameElements.js";

export let currentLevel = 0;

export var gameData = {
    totalScore: 0,
    lives: 3,
    coins: 0,
    levelScore: 0,
    distance: 0,
}

export let paused = false;

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

export function game(sceneElements, obstacles, ennemies, bonus, bg, duration, end) {
    createWorldElements(bg, duration, gameData, img);

    gameData.levelScore = 0

    let updateScore = () => document.querySelector("#score").textContent = `Score: ${gameData.totalScore}`
    let updateLives = () => document.querySelector("#life").textContent = `Lives: ${gameData.lives}`

    function addScore(n) {
        gameData.totalScore += n
        gameData.levelScore += n
        updateScore()
    }

    let decor = []

    // Scene
    sceneElements.forEach(se => {
        decor.push(new SceneElement(se.pos, se.size, se.type, se.cssPosition))
    });

    let characters = [];

    const player = new Player();
    characters.push(player);

    bonus.forEach(bon => {
        characters.push(new Bonus(bon.pos, bon.type, {
            w: 175 / 4,
            h: 200 / 4
        }))
    })

    ennemies.forEach(en => {
        characters.push(new Enemy(en.pos, en.mobile, en.speedUp))
    })


    const platforms = [];

    obstacles.forEach(obs => {
        platforms.push(new Obstacle(obs.pos, obs.type, obs.size))
    })

    const keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    };

    // var val = 1
    function animate() {
        const PauseMenu = document.querySelector("#pauseMenu")
        requestAnimationFrame(animate);

        let posX = player.position.x
        if (posX !== 0 && posX > gameData.distance && posX - gameData.distance >= 1000) {
            addScore(10)
            gameData.distance = player.position.x
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
                            ||
                            (obstacleLeft <= playerRight && playerRight <= obstacleRight) // Le joueur dépasse l'obstacle sur la gauche
                            ||
                            (playerLeft <= obstacleLeft && obstacleRight <= playerRight) // L'obstacle est entre la gauche et la droite du joueur
                        )

                        const obstacleAndPlayerSameHAxis = (
                            (obstacleBottom <= playerBottom && playerBottom <= obstacleTop) // La tête du joueur dépasse l'obstacle
                            ||
                            (obstacleBottom <= playerTop && playerTop <= obstacleTop) // L'obstacle dépasse la tête du joueur
                            ||
                            (playerBottom <= obstacleBottom && obstacleTop <= playerTop) // L'obstacle est entre la tête et les pieds du joueur
                        )

                        // Est en dessous de l'obstacle
                        const playerUnderObstacle = obstacleAndPlayerSameVAxis &&
                            (playerBottom < obstacleBottom && obstacleBottom < playerTop)

                        // Est au dessus de l'obstacle
                        const playerOverObstacle = obstacleAndPlayerSameVAxis &&
                            (playerBottom < obstacleTop && obstacleTop < playerTop)

                        // Est avant l'obstacle
                        const playerBeforeObstacle = obstacleAndPlayerSameHAxis &&
                            (playerLeft < obstacleLeft && obstacleLeft < playerRight)

                        // Est après l'obstacle
                        const playerAfterObstacle = obstacleAndPlayerSameHAxis &&
                            (playerLeft < obstacleRight && obstacleRight < playerRight)

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

        characters.forEach((char, i) => {
            if (checkCollision(player, char, enemyContact)) {
                if (char.type === "coin") {
                    console.log("Got coin !");
                    char.element.remove()
                    characters.splice(i, 1)
                    addScore(20)
                    gameData.coins++
                } else if (char.type === "life") {
                    console.log("Got life !");
                    char.element.remove()
                    characters.splice(i, 1)
                    gameData.lives += 1
                    updateLives()
                } else if (char.type === "power" && !player.power) {
                    console.log("Got power !");
                    char.element.remove()
                    characters.splice(i, 1)
                    player.power = true;
                } else if (char.type === "enemy") {
                    if (!player.power) {
                        console.log("Dead !");
                        player.velocity.y -= 20
                    } else {
                        console.log("Enemy killed !");
                        char.element.remove()
                        characters.splice(i, 1)
                        // On doit supprimer l'élément de la liste des characters

                        // Sleep for 5 seconds
                        setTimeout(function () {
                            player.power = false;
                        }, powerDuration); // 5000 milliseconds = 5 seconds
                    }

                }
            }
        });
        checkEnd()
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function switchLevel() {
        currentLevel++;
        if (currentLevel < levels.length) {
            const level = levels[currentLevel];
            // Notifications de fin de niveau
            alert("Level cleared !")
            console.log(paused);
            game(level.scene, level.obstacles, level.ennemies, level.bonus, level.background, level.duration, level.end, score);
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
        gameData.lives--
        if (gameData.lives >= 1) {
            gameData.totalScore -= gameData.levelScore
            game(levels[currentLevel].scene, levels[currentLevel].obstacles, levels[currentLevel].ennemies, levels[currentLevel].bonus, levels[currentLevel].background, levels[currentLevel].duration, levels[currentLevel].end)
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


        switch (event.key) {
            case "p":
            case "P":
                pauseGame();
                break;

            case "r":
            case "R":
                restartGame();
                break;

            case "ArrowLeft":
                keys.left.pressed = true;
                break;

            case "ArrowRight":

                keys.right.pressed = true;
                break;

            case " ":
            case "ArrowUp":
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
            player.velocity.x = 0;
            player.element.style.backgroundImage = `url('${img.player}')`;
        }
        if (event.key === "ArrowRight") {
            keys.right.pressed = false;
            player.velocity.x = 0;
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

game(levels[currentLevel].scene, levels[currentLevel].obstacles, levels[currentLevel].ennemies, levels[currentLevel].bonus, levels[currentLevel].background, levels[currentLevel].duration, levels[currentLevel].end);

// handle pause option
function pauseGame() {
    if (!paused) {
        paused = true
    } else {
        paused = false
    }
}

// handle the restart option
function restartGame() {
    currentLevel = 0;
    gameData.lives = 3;
    gameData.totalScore = 0;
    gameData.levelScore = 0;
    paused = false
    game(levels[currentLevel].scene, levels[currentLevel].obstacles, levels[currentLevel].ennemies, levels[currentLevel].bonus, levels[currentLevel].background, levels[currentLevel].duration, levels[currentLevel].end, levels[currentLevel].bonus);
}