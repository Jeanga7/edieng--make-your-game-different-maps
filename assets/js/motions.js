export var motions = {
    vitesseY: 0,
    gravity: 0.7,
    positionY: 0,
    jumping: false,
    direction: 1
}

export function runRight(player) {
    let playerCoords = player.getBoundingClientRect()

    player.style.height = "90px"
    if (motions.direction !== 1) {
        player.style.transform = "scaleX(1)"
        motions.direction = 1
    }
    player.style.left = (playerCoords.left + 5)+"px"
    player.style.backgroundImage = "url('assets/img/running-player.gif')"
}

export function runLeft(player) {
    let playerCoords = player.getBoundingClientRect()

    player.style.height = "90px"
    if (motions.direction !== -1) {
        player.style.transform = "scaleX(-1)"
        motions.direction = -1
    }
    player.style.left = (playerCoords.left - 5)+"px"
    player.style.backgroundImage = "url('assets/img/running-player.gif')"
}

export function motionless() {
    player.style.backgroundImage = "url('assets/img/static.png')"
}

export function jump(player) {
    motions.jumping = true
    motions.vitesseY = -15;
}

export function fall(player) {
    motions.jumping = false;
    animate(player)
}

export function animate(player) {
    motions.vitesseY += motions.gravity;
    motions.positionY += motions.vitesseY;
    if (motions.positionY <= 0) {
        cancelAnimationFrame(animate)
    } else if (motions.positionY >= window.innerHeight - 150) {
        motions.positionY = window.innerHeight - 150;
        motions.vitesseY = 0;
    }

    player.style.top = motions.positionY + 'px';
    requestAnimationFrame(animate);
}

// animate()
