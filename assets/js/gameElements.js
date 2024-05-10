export {
    createWorldElements
};

const world = document.getElementById("world");

function createWorldElements(bg, duration, gameData, img) {
    world.innerHTML = "";
    world.scrollLeft = 0;

    let gameInfosZone = document.createElement("div")
    gameInfosZone.id = "gameInfosZone"

    let gameInfos = document.createElement("div")
    gameInfos.id = "gameInfos"

    // Ajoute le score
    const score = document.createElement("div");
    score.id = "score";
    score.textContent = `Score: ${gameData.totalScore}`;
    score.style.color = "white";
    gameInfos.appendChild(score);

    // Ajoute la vie
    const life = document.createElement("div");
    life.id = "life";
    life.textContent = " ❤️ ".repeat(gameData.lives);
    gameInfos.appendChild(life);

    // Ajoute le timer
    const timer = document.createElement("div");
    timer.id = "timer";
    timer.textContent = ` 🕐 ${duration}`;
    timer.style.color = "white";
    gameInfos.appendChild(timer);

    gameInfosZone.appendChild(gameInfos)
    world.appendChild(gameInfosZone)

    // Ajoute le fond
    const scene = document.createElement("div");
    scene.style.background = bg;
    scene.id = "scene";
    world.appendChild(scene);
}