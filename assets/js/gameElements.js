export {
    createWorldElements
};

const world = document.getElementById("world");

function createWorldElements(bg, duration, gameData, img) {
    world.innerHTML = "";
    world.style.cssText = `
    width: 100vw;
     height: 100vh;
     background-size: cover;
     position: relative; 
    overflow: hidden;
    `;
    world.scrollLeft = 0;

    let gameInfosZone = document.createElement("div")
    gameInfosZone.id = "gameInfosZone"
    gameInfosZone.style.cssText = `
        display: flex;
        position: fixed;
        width: 100vw;
        top: 12px;
        flex-direction: row;
        justify-content: center;
        z-index: 10;
    `;

    let gameInfos = document.createElement("div")
    gameInfos.id = "gameInfos"
    gameInfos.style.cssText = `
        display: flex;
        flex-direction: row;
        gap: 50px;
        font-size: 22px;
        font-family: Arial;
        font-weight: bolder;
        background-color: rgba(0,0,0,0.3);
        border-radius: 50px;
        padding: 4px 24px;
    `;
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
    scene.style.cssText = `
        background: ${bg};
        background-size: cover;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
    `;
    scene.id = "scene";
    world.appendChild(scene);
}