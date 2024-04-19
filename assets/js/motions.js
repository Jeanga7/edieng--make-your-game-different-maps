export function runRight(player) {
    let el = player.DOMElement
    let playerCoords = el.getBoundingClientRect()

    el.style.height = "90px"

    el.style.left = (playerCoords.left + 5)+"px"
}

export function runLeft(player) {
    let el = player.DOMElement
    let playerCoords = el.getBoundingClientRect()

    el.style.height = "90px"
    el.style.left = (playerCoords.left - 5)+"px"
}

export function motionless() {
    player.style.backgroundImage = "url('assets/img/static.png')"
}

export function jump(player) {
    if (player.landed) {
        let [j, maxJ] = [player.jumpHeight, player.maxJumpHeight]
        player.jumpHeight = maxJ
        player.landed = false
        fall(player)
    }
}

export function fall(player) {
    let maxJ = player.maxJumpHeight
    player.jumpHeight = -maxJ
}
