export { createWorldElements };

function createWorldElements(bg, duration, gameData, img) {
    const world = document.getElementById("world");

    world.innerHTML = "";
    world.style.width = "100%";
    world.style.height = "100%";
    world.style.backgroundSize = "contain";
    world.style.position = "relative";
    world.style.overflow = "hidden";
    world.scrollLeft = 0;

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

    // Ajoute le timer
    const timer = document.createElement("div");
    timer.id = "timer";
    timer.style.display = "flex";
    timer.textContent = `Timer: ${duration}`;
    timer.style.justifyContent = "center";
    timer.style.backgroundColor = "white";
    timer.style.position = "fixed";
    timer.style.right = "600px";
    timer.style.fontSize = "30px";
    world.appendChild(timer);

    // Ajoute le score
    const score = document.createElement("div");
    score.id = "score";
    score.style.display = "flex";
    score.textContent = `Score: ${gameData.totalScore}`;
    score.style.justifyContent = "center";
    score.style.backgroundColor = "white";
    score.style.position = "fixed";
    score.style.left = "300px";
    score.style.fontSize = "30px";
    world.appendChild(score);

    // Ajoute la vie
    const life = document.createElement("div");
    life.id = "life";
    life.style.display = "flex";
    life.textContent = `Lives: ${gameData.lives}`;
    life.style.justifyContent = "center";
    life.style.backgroundColor = "white";
    life.style.position = "fixed";
    life.style.right = "800px";
    life.style.fontSize = "30px";
    world.appendChild(life);

    // Ajoute le menu pause
    const pauseMenu = document.createElement("div");
    pauseMenu.id = "pauseMenu";
    pauseMenu.style.display = "flex";
    pauseMenu.style.position = "fixed";
    pauseMenu.style.height = "100px";
    pauseMenu.style.top = "300px";
    pauseMenu.style.left = "600px";
    pauseMenu.style.alignItems = "center";
    pauseMenu.style.justifyContent = "center";
    pauseMenu.style.fontSize = "60px";
    pauseMenu.textContent = "PAUSED";
    pauseMenu.style.display = "none";
    world.appendChild(pauseMenu);

    // Ajoute le modal de fin de jeu
    const gameOverModal = document.createElement("div");
    gameOverModal.id = "gameOver";
    gameOverModal.style.display = "flex";
    gameOverModal.style.position = "fixed";
    gameOverModal.style.height = "80%";
    gameOverModal.style.width = "40%";
    gameOverModal.style.top = "10%";
    gameOverModal.style.left = "30%";
    gameOverModal.style.backgroundSize = "cover";
    gameOverModal.style.backgroundImage = `url('${img.gameOver}')`;
    gameOverModal.style.alignItems = "center";
    gameOverModal.style.justifyContent = "center";
    gameOverModal.style.fontSize = "70px";
    gameOverModal.textContent = "GAME OVER";
    gameOverModal.style.color = "white";
    gameOverModal.style.fontWeight = "bold";
    gameOverModal.style.zIndex = "100";
    gameOverModal.style.display = "none";
    world.appendChild(gameOverModal);
}
