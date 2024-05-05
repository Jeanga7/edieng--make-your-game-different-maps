import {
    Player,
    Obstacle,
    Enemy,
    SceneElement
} from "./models.js";
import {
    Timer, checkCollision,
    gameData,
    updateLives, addScore,
    hideModals,
    checkEnd, camera,
    animate
} from "./utils.js";
import {
    img,
    enemyContact, powerDuration,
    backAudio,
    coinAudio,
    bonusAudio,
    dieAudio,
    killAudio
} from "./constants.js";
import {
    createWorldElements
} from "./gameElements.js";

export function game(sceneElements, obstacles, enemies, bg, duration, end) {
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

    gameData.keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    };

    // var val = 1

    camera()
    animate(end);
    Timer()
}
