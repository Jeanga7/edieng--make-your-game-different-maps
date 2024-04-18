var direction = 1;
document.addEventListener("keydown", (e)=>{
    switch (e.key) {
        case "ArrowRight":
            requestAnimationFrame(runRight)
            break;

        case "ArrowLeft":
            requestAnimationFrame(runLeft)
            break;

        default:
            break;
    }
});

function runRight() {
    const player = document.querySelector("#player")
    let playerCoords = player.getBoundingClientRect()

    player.style.height = "90px"
    if (direction !== 1) {
        player.style.transform = "scaleX(1)"
        direction = 1
    }
    player.style.left = (playerCoords.left + 5)+"px"
    player.style.backgroundImage = "url('running-player.gif')"
}

function runLeft() {
    const player = document.querySelector("#player")
    let playerCoords = player.getBoundingClientRect()

    player.style.height = "90px"
    if (direction !== -1) {
        player.style.transform = "scaleX(-1)"
        direction = -1
    }
    player.style.left = (playerCoords.left - 5)+"px"
    player.style.backgroundImage = "url('running-player.gif')"
}

function static() {
    player.style.backgroundImage = "url('static.png')"
}

document.addEventListener("keyup", (e)=>{
    const player = document.querySelector("#player");

    switch (e.key) {
        case "ArrowLeft":
            case "ArrowRight":
                requestAnimationFrame(static)
                cancelAnimationFrame(runRight)
                cancelAnimationFrame(runLeft)
                cancelAnimationFrame(static)
                break;

        default:
            break;
    }
});