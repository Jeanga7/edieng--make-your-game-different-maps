export {
    img,
    imgStorage,
    gravity,
    world,
    enemyContact,
    playerInitialPosition,
    playerDims,
    numberOfEnemies,
    powerDuration
}

const imgStorage = "./assets/img/"
const gravity = -1.5;
const world = document.querySelector('#world');
const enemyContact = 25
const playerInitialPosition = { x: 50, y: 80 }
const playerDims = { w: 66, h: 65 }
const powerDuration = 5000


const img = Object.fromEntries(Object.entries({
    sky: "sky.jpg",
    ground: "desert-ground.png",
    groundNL: "groundNextLevel.jpeg",
    ground_grotte: "ground-grotte.jpg",
    player: "static.png",
    playerJumping: "jumping.png",
    playerFalling: "falling.png",
    enemy: "static.png",
    runningPlayer: "running-player.gif",
    platform1: "",
    platform2: "platforme2.png",
    colonne: "bloc4-obstacle.png",
    scene1: "pyramid-sphinx.png",
    sun: "sun.png",
    moon: "moon.png",
    scene2: "desert1.png",
    nuage: "nuage.png",
    enemy_1: "enemy1.gif",
    enemy_2: "enemy2.gif",
    enemy_3: "enemy3.gif",
    enemy_4: "enemy4.gif",
    enemy_5: "enemy5.gif",
    enemy_6: "enemy6.gif",
    enemy_7: "enemy7.gif",
    enemy_8: "enemy8.gif",
    enemy_9: "enemy9.gif",
    status: "status_colonne.png",
    sphinx: "sphinx.png",
    gameOver: "anibus_gameOver.jpeg",
    life: "coeur.gif",
    power: "power.gif",
    coin: "coin.gif"
}).map(el => [el[0], imgStorage + el[1]]))

const numberOfEnemies = Object.entries(img)
    .filter(el => el[0].includes("enemy_"))
    .length