const world = document.querySelector('#world');
world.style.width = `100%`;
world.style.height = `100%`;
world.style.backgroundSize = 'contain';
world.style.position = 'relative';

const timer = document.createElement("div")
timer.id = "timer"
timer.style.display = "flex"
timer.textContent = "Timer: 60"
timer.style.justifyContent = "center"
timer.style.backgroundColor = "white"

world.appendChild(timer)


class Player {
    constructor() {
        this.position = { x: 50, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.onground = true
        this.width = 50;
        this.height = 65;
        this.element = document.createElement('div');
        this.element.id = 'player';
        world.appendChild(this.element);
    }

    draw() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        this.element.style.width = `${this.width}px`
        this.element.style.height = `${this.height}px`
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.velocity.y <= world.clientHeight) {
            this.velocity.y += gravity;
        }
        else { this.velocity.y = 0; }
    }
}

class Obstacle {
    constructor({ x, y }, type) {
        this.position = { x, y };
        this.width = 200;
        this.height = 30;
        this.element = document.createElement('div');
        this.element.classList.add('obstacle');
        this.element.style.position = "absolute"
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        if ( type === "ground"){
            this.element.style.backgroundImage = 'url(./img/ground.png)'
            // this.element.style.backgroundRepeat =  "repeat-x" 
        }else if (type === "platform"){
            this.element.style.backgroundImage = "url(./img/platforme2.png)"
            this.height = 50
            this.element.style.backgroundSize = "cover"
        }
        // this.element.style.backgroundColor = "green"
        world.appendChild(this.element);
    }

    draw() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        this.element.style.width = `${this.width}px`
        this.element.style.height = `${this.height}px`
    }
    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= world.clientHeight)
            this.velocity.y += gravity;
        else this.velocity.y = 0;
    }
}

const gravity = 1.5;
const player = new Player();
const platforms = [
    new Obstacle({ x: 1, y: 650 }, "ground"),
    new Obstacle({ x: 200, y: 650 }, "ground"),
    new Obstacle({ x: 400, y: 650 }, "ground"),
    new Obstacle({ x: 750,y: 650 }, "ground"),
    new Obstacle({ x: 950,y: 650 }, "ground"),
    new Obstacle({ x: 50,y: 650 }, "ground"),
    new Obstacle({ x: 250,y: 520 }, "platform"),
    new Obstacle({ x: 650,y: 520 }, "platform")


];
const keys = { right: { pressed: false }, left: { pressed: false } };

function checkCollision(player, obstacle) {
    // Calculer les coordonnées des bords du joueur et de l'obstacle
    const playerLeft = player.position.x;
    const playerRight = player.position.x + player.width;
    const playerTop = player.position.y;
    const playerBottom = player.position.y + player.height;

    const obstacleLeft = obstacle.position.x;
    const obstacleRight = obstacle.position.x + obstacle.width;
    const obstacleTop = obstacle.position.y;
    const obstacleBottom = obstacle.position.y + obstacle.height;

    // Vérifier s'il y a collision
    if (
        playerLeft < obstacleRight &&
        playerRight > obstacleLeft &&
        playerTop < obstacleBottom &&
        playerBottom > obstacleTop
    ) {
        return true;
    }

    return false;
}

function animate() {
    requestAnimationFrame(animate);
    platforms.forEach(platform => platform.draw());
    // obstacles.forEach(obstacle => obstacle.draw());
    player.update();

    // Vérifier les collisions avec les obstacles
    platforms.forEach(obstacle => {
        if (checkCollision(player, obstacle)) {
            // Gérer la collision ici
            console.log("Collision avec un obstacle!");
    
            // Empêcher le joueur de passer à travers l'obstacle par le haut, le bas, la gauche ou la droite
            const playerLeft = player.position.x;
            const playerRight = player.position.x + player.width;
            const playerBottom = player.position.y + player.height;
            const obstacleTop = obstacle.position.y;
            const obstacleBottom = obstacle.position.y + obstacle.height;
            const obstacleRight = obstacle.position.x + obstacle.width;
            const obstacleLeft = obstacle.position.x;
            if (playerBottom > obstacleTop && playerBottom < obstacleBottom) {
                // Le joueur touche le haut de l'obstacle
                player.position.y = obstacleTop - player.height;
                player.velocity.y = 0; // Arrêter le mouvement vertical
            } else if (player.position.y < obstacleBottom && playerBottom > obstacleBottom) {
                // Le joueur touche le bas de l'obstacle
                player.position.y = obstacleBottom;
                player.velocity.y = 0;
                player.onground = true; // Arrêter le mouvement vertical
            } else if (playerRight < obstacleLeft && playerRight < obstacleRight) {
                // Le joueur touche la gauche de l'obstacle
                player.position.x = obstacleLeft - player.width
                alert(player.position.x)
                player.velocity.x = 0; // Arrêter le mouvement horizontal
            } else if (playerLeft < obstacleRight && playerLeft > obstacleLeft) {
                // Le joueur touche la droite de l'obstacle
                player.position.x = obstacleRight;
                alert(player.position.x)
                player.velocity.x = 0; // Arrêter le mouvement horizontal
            }
        }
    });
    

    if (keys.right.pressed && player.position.x < window.innerWidth / 2) {
        player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 50) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;
        if (keys.right.pressed) {
            player.position.x += 5
        }
    }
}



let isJumping = false;

addEventListener('keydown', (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        const sens = event.key === "ArrowRight" ? 1 : -1;
        player.element.style.backgroundImage = "url('./img/running-player.gif')";
        player.element.style.transform = `scaleX(${sens})`;
    }
    switch (event.key) {
        case "ArrowLeft":
            keys.left.pressed = true;
         
            break;
        case "ArrowRight":
            console.log(player.position.x);
            if (player.position.x > 600 && player.position.x < 700){
                alert("game over")
            }
            keys.right.pressed = true;
            break;
        case "ArrowUp":
            if (!isJumping && player.onground) {
                isJumping = true;
                player.velocity.y -= 20;
                player.onground = false
            }
            break;
        case " ":
            if (!isJumping) {
                isJumping = true;
                player.velocity.y -= 20;
            }
            break;
    }
});


addEventListener('keyup', (event) => {
    if (event.key === "ArrowLeft") {
        keys.left.pressed = false;
        player.velocity.x = 0; // Arrêter le mouvement horizontal
        player.element.style.backgroundImage = "url('./img/static.png')";
    }
    if (event.key === "ArrowRight") {
        keys.right.pressed = false;
        player.velocity.x = 0; // Arrêter le mouvement horizontal
        player.element.style.backgroundImage = "url('./img/static.png')";
    }

    if (event.key === "ArrowUp" || event.key === " ") {
        isJumping = false;
        player.onground = true
    }
});


// Start animation
function Timer(){
    var countdownElement = document.getElementById('timer');
    var countdownTime = 60;

    var countdownInterval = setInterval(function() {
        countdownTime--;
        countdownElement.textContent = "Timer: "+countdownTime;

        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            alert("game over")
        }
    }, 1000);
}
animate();
Timer()