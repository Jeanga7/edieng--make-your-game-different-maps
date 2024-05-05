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
    checkCollision,
    gameData,
    updateLives,
    updateScore,
    addScore,
    hideModals,
    checkEnd,
    decreaseLife,
    camera
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

export let paused = false;
var ContactWithennemy = false


export function game(sceneElements, obstacles, enemies, bonus, bg, duration, end) {
    hideModals()
    gameData.isGameOver = false
    cancelAnimationFrame(gameData.globalAnimation)
    createWorldElements(bg, duration, gameData, img);

    gameData.duration = duration
    gameData.levelScore = 0

    let decor = []

    // Scene
    sceneElements.forEach(se => {
        decor.push(new SceneElement(se.pos, se.size, se.type, se.cssPosition))
    });

    gameData.characters = [];

    gameData.player = new Player();
    gameData.characters.push(gameData.player);

    enemies.forEach(en => {
        gameData.characters.push(new Enemy(en.pos, en.mobile, en.speedUp))
    })


    gameData.obstacles = [];

    obstacles.forEach(obs => {
        gameData.obstacles.push(new Obstacle(obs.pos, obs.type, obs.size))
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
    let obstacleType;
    function animate() {
        backAudio.play()
        const PauseMenu = document.querySelector("#pauseModal")
        gameData.globalAnimation = requestAnimationFrame(animate);
        let posX = gameData.player.position.x
        if (posX !== 0 && posX > gameData.distance && posX - gameData.distance >= 1000) {
            addScore(10)
            gameData.distance = gameData.player.position.x
        }

        gameData.obstacles.forEach(platform => platform.draw());
        
        if (!gameData.paused && !gameData.isGameOver && !gameData.levelEndPause) {
            PauseMenu.style.display = "none"
            gameData.characters.forEach(char => {
                char.update();
                var found = false

                // Vérifier les collisions avec les obstacles
                gameData.obstacles.forEach(obstacle => {
                    if (obstacle.type !== "life" && obstacle.type !== "power" && obstacle.type !== "coin") {
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

                    if (isJumping === true && gameData.player.onground === false) {
                        char.element.style.backgroundImage = `url('${img.playerJumping}')`;
                    }
                    if (isJumping === false && gameData.player.onground === false) {
                        char.element.style.backgroundImage = `url('${img.playerFalling}')`;
                    }

                    if (char.x === end) {
                        return true
                    }
                }
            })
        } else if (gameData.paused && !gameData.isGameOver && !gameData.levelEndPause) {
            PauseMenu.style.display = "flex"
        };


        let newObstacleType;
        let obstacleFound;
        let obstacleIndex;
        gameData.obstacles.forEach((obs, i) => {
            if (checkCollision(gameData.player, obs, (obs.width/2)) && !obs.taken) {
                newObstacleType = obs.type
                obstacleFound = obs
                obstacleIndex = i
            }
        });

        if (newObstacleType !== obstacleType) {
            obstacleType = newObstacleType
            if (obstacleType === "coin") {
                console.log("Got coin !");
                obstacleFound.element.remove()
                obstacleFound.taken = true
                coinAudio.play()
                gameData.obstacles.splice(obstacleIndex, 1)
                addScore(20)
                gameData.coins++
            } else if (obstacleType === "life") {
                console.log("Got life !");
                obstacleFound.element.remove()
                bonusAudio.play()
                gameData.obstacles.splice(obstacleIndex, 1)
                var life = document.querySelector("#life").textContent.split(" ")[1]
                gameData.lives = parseInt(life) + 1
                updateLives()
            } else if (obstacleType === "power" && !gameData.player.power) {
                console.log("Got power !");
                obstacleFound.element.remove()
                bonusAudio.play()
                gameData.obstacles.splice(obstacleIndex, 1)
                gameData.player.power = true;
            }
        }

        gameData.characters.forEach((char, i) => {
            if (char.type === "enemy") {
                if (checkCollision(gameData.player, char, enemyContact)) {
                    if (!gameData.player.power) {
                        console.log("Dead !");
                        dieAudio.play()
                        gameData.player.velocity.y -= 20
                        ContactWithennemy = false
                    } else if (gameData.player.power) {
                        console.log("Enemy killed !");
                        char.element.remove()
                        killAudio.play()
                        gameData.characters.splice(i, 1)
                        // On doit supprimer l'élément de la liste des gameData.characters

                        // Sleep for 5 seconds
                        setTimeout(function () {
                            gameData.player.power = false;
                        }, powerDuration); // 5000 milliseconds = 5 seconds
                    }
                }
            }
        })

        checkEnd()
    }

    camera()

    let isJumping = false;

    document.addEventListener('keydown', (event) => {
        event.preventDefault()

        switch (event.key) {
            case "ArrowLeft":
                runAudio.play()
                keys.left.pressed = true;
                break;

            case "ArrowRight":
                runAudio.play()
                keys.right.pressed = true;
                break;

            case " ":
            case "ArrowUp":
                if (!isJumping && gameData.player.onground) {
                    isJumping = true;
                    gameData.player.velocity.y += 20;
                    gameData.player.onground = false
                }
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === "ArrowLeft") {
            runAudio.pause()
            keys.left.pressed = false;
            gameData.player.velocity.x = 0;
            gameData.player.element.style.backgroundImage = `url('${img.player}')`;
        }
        if (event.key === "ArrowRight") {
            runAudio.pause()
            keys.right.pressed = false;
            gameData.player.velocity.x = 0;
            gameData.player.element.style.backgroundImage = `url('${img.player}')`;
        }

        if (event.key === "ArrowUp" || event.key === " ") {
            isJumping = false;
            // gameData.player.onground = true
        }
    });

    animate();
    Timer()
}

document.addEventListener("keydown", (event) => {
    event.preventDefault()
    let keys = ["P", "p", "Escape"]
    if (keys.includes(event.key)) pauseGame()
})

document.addEventListener("keydown", (event) => {
    event.preventDefault()
    let keys = ["R", "r"]
    if (keys.includes(event.key)) restartGame()
})

const continu = document.querySelector("#continu")
continu.addEventListener('click', () => {
    pauseGame();
})

const restartBtn = document.querySelectorAll("#restart, #btn_restart_GO, #btn_restart_win");
restartBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        const modals = document.querySelectorAll("#pauseModal, #gameOverModal, #winModal")
        modals.forEach(modal => {
            modal.style.display = "none"
        })
        restartGame();
    });
});

// handle main menu
const mainMenuBtn = document.querySelectorAll("#main-menu, #btn_mainmenu_GO")
mainMenuBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('#mainMenuModal').style.display = "flex"
    })
})

// handle pause option
function pauseGame() {
    if (!gameData.paused) {
        gameData.paused = true
    } else {
        gameData.paused = false
    }
}


// handle the restart option
function restartGame() {
    gameData.currentLevel = 0;
    gameData.lives = 3;
    gameData.totalScore = 0;
    gameData.levelScore = 0;
    gameData.paused = false
    gameData.levelEndPause = false
    gameData.player = null
    gameData.isGameOver = false
    hideModals()
    game(levels[gameData.currentLevel].scene, levels[gameData.currentLevel].obstacles, levels[gameData.currentLevel].enemies, levels[gameData.currentLevel].bonus, levels[gameData.currentLevel].background, levels[gameData.currentLevel].duration, levels[gameData.currentLevel].end);
}
