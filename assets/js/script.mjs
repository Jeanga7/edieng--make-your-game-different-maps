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
    restartGame,
    pauseGame,
    checkCollision,
    updateLives,
    updateScore,
    hideModals
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

export var gameData = {
    player: null,
    currentLevel: 0,
    totalScore: 0,
    lives: 3,
    coins: 0,
    levelScore: 0,
    distance: 0,
    paused: false,
    levelEndPause: false,
    gameOverPause: false
}

const backaudio = new Audio("/assets/css/Epic Symphonic Ancient Egyptian Music - Valley of the Kings (Wādī Al-Mulūk)(1)(1).mp3")
const Runaudio = new Audio("/assets/css/Run on Sand Sound Effect.mp3")
const coinaudio = new Audio("/assets/css/rang.mp3")
const bonusaudio = new Audio("/assets/css/bonus.mp3")
const dieaudio = new Audio("/assets/css/dying.mp3")


export let paused = false;

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

export function game(sceneElements, obstacles, ennemies, bonus, bg, duration, end) {
    createWorldElements(bg, duration, gameData, img);
    hideModals()

    gameData.levelScore = 0


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

    gameData.player = new Player();
    characters.push(gameData.player);
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
        backaudio.play()
        const PauseMenu = document.querySelector("#pauseModal")
        requestAnimationFrame(animate);
        let posX = gameData.player.position.x
        if (posX !== 0 && posX > gameData.distance && posX - gameData.distance >= 1000) {
            addScore(10)
            console.log("Distance: ", gameData.distance, " posX: ", posX, " VelocityX: ", gameData.player.velocity.x);
            gameData.distance = gameData.player.position.x
        }

        platforms.forEach(platform => platform.draw());
        // obstacles.forEach(obstacle => obstacle.draw());
        if (!gameData.paused) {
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
        } else if (!gameData.levelEndPause && !gameData.gameOverPause) {
            PauseMenu.style.display = "flex"
        };

        characters.forEach((char, i) => {
            if (checkCollision(gameData.player, char, enemyContact)) {
                if (char.type === "coin") {
                    console.log("Got coin !");
                    char.element.remove()
                    coinaudio.play()
                    characters.splice(i, 1)
                    addScore(20)
                    gameData.coins++
                } else if (char.type === "life") {
                    console.log("Got life !");
                    char.element.remove()
                    bonusaudio.play()
                    characters.splice(i, 1)
                    gameData.lives += 1
                    updateLives()
                } else if (char.type === "power" && !gameData.player.power) {
                    console.log("Got power !");
                    char.element.remove()
                    bonusaudio.play()
                    characters.splice(i, 1)
                    gameData.player.power = true;
                } else if (char.type === "enemy") {
                    if (!gameData.player.power) {
                        console.log("Dead !");
                        dieaudio.play()
                        gameData.player.velocity.y -= 20
                    } else {
                        console.log("Enemy killed !");
                        char.element.remove()
                        killaudio.play()
                        characters.splice(i, 1)
                        // On doit supprimer l'élément de la liste des characters

                        // Sleep for 5 seconds
                        setTimeout(function () {
                            gameData.player.power = false;
                        }, powerDuration); // 5000 milliseconds = 5 seconds
                    }

                }
            }
        });
        checkEnd()
    }

    function switchLevel() {
        gameData.currentLevel++;
        if (gameData.currentLevel < levels.length) {
            const level = levels[gameData.currentLevel];
            // Notifications de fin de niveau

            document.querySelector('#winModal').style.display = "flex"
            gameData.paused = false
            gameData.levelEndPause = true
            document.querySelector("#btn_continue_win").addEventListener('click', () => {
                document.querySelector('#winModal').style.display = "none"
                gameData.levelEndPause = false
                game(level.scene, level.obstacles, level.ennemies, level.bonus, level.background, level.duration, level.end, score);
            })
        } else {
            alert("You finished the GAME !")
        }
    }

    function checkEnd() {
        const playerPos = parseInt(document.querySelector("#player").style.left)
        if ((playerPos) >= levels[gameData.currentLevel].end) {
            switchLevel();
        }
    }

    function decreaseLife() {
        gameData.lives--
        if (gameData.lives >= 1) {
            gameData.totalScore -= gameData.levelScore
            clearInterval(gameData.timeLoop)
            game(levels[gameData.currentLevel].scene, levels[gameData.currentLevel].obstacles, levels[gameData.currentLevel].ennemies, levels[gameData.currentLevel].bonus, levels[gameData.currentLevel].background, levels[gameData.currentLevel].duration, levels[gameData.currentLevel].end)
        } else {
            gameOver()
        }
    }

    function camera() {
        window.requestAnimationFrame(camera)
        let playerSize = gameData.player.element.getBoundingClientRect()



        if (playerSize.left >= (vw / 2)) {
            world.scrollLeft += 5
        }

        if (playerSize.top >= vh) {
            decreaseLife()
        }
    }
    camera()

    let isJumping = false;

    document.addEventListener('keydown', (event) => {
        event.preventDefault()

        switch (event.key) {
            case "ArrowLeft":
                Runaudio.play()
                keys.left.pressed = true;
                break;

            case "ArrowRight":
                Runaudio.play()
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
            Runaudio.pause()
            keys.left.pressed = false;
            gameData.player.velocity.x = 0;
            gameData.player.element.style.backgroundImage = `url('${img.player}')`;
        }
        if (event.key === "ArrowRight") {
            Runaudio.pause()
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
