export { img, imgStorage, gravity, world };

const imgStorage = "./assets/img/"
const gravity = -1.5;
const world = document.querySelector('#world');

const img = Object.fromEntries(Object.entries({
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
    momie: "momie.gif",
    coin: "coin.gif",
}).map(el => [el[0], imgStorage + el[1]]))
