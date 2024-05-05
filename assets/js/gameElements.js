export {
    createWorldElements,
    createTimeStats
};

const world = document.getElementById("world");

function createWorldElements(bg, duration, gameData, img) {
    world.innerHTML = "";
    world.style.width = "100vw";
    world.style.height = "100vh";
    world.style.backgroundSize = "cover";
    world.style.position = "relative";
    world.style.overflow = "hidden";
    world.scrollLeft = 0;

    let gameInfosZone = document.createElement("div")
    gameInfosZone.id = "gameInfosZone"
    gameInfosZone.style.display = "flex"
    gameInfosZone.style.position = "relative"
    gameInfosZone.style.width = "100vw"
    gameInfosZone.style.top = "12px"
    gameInfosZone.style.flexDirection = "row"
    gameInfosZone.style.justifyContent = "center"
    gameInfosZone.style.zIndex = "10"

    let gameInfos = document.createElement("div")
    gameInfos.id = "gameInfos"
    gameInfos.style.display = "inline-grid"
    gameInfos.style.gridTemplateColumns = "repeat(3, 1fr)"
    gameInfos.style.gap = "50px"
    gameInfos.style.fontSize = "22px"
    gameInfos.style.fontFamily = "Arial"
    gameInfos.style.fontWeight = "bolder"
    gameInfos.style.backgroundColor = "rgba(0,0,0,0.3)"
    gameInfos.style.borderRadius = "50px"
    gameInfos.style.padding = "4px 24px"

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
    timer.textContent = `🕐 ${duration}`;
    timer.style.color = "white";
    gameInfos.appendChild(timer);

    gameInfosZone.appendChild(gameInfos)
    world.appendChild(gameInfosZone)

    // Ajoute le fond
    const scene = document.createElement("div");
    scene.style.background = bg;
    scene.style.backgroundSize = "cover";
    scene.style.position = "fixed";
    scene.style.top = "0";
    scene.style.left = "0";
    scene.style.width = "100vw";
    scene.style.height = "100vh";
    scene.style.zIndex = "0";
    scene.id = "scene";
    world.appendChild(scene);
}

function createTimeStats(countdownTime) {
    document.querySelectorAll("#timeStats_pause, #timeStats_GO, #timeStats_win").forEach(element => {
        element.textContent = `⌚${countdownTime}`;
        element.style.fontSize = "30px"
    });
}