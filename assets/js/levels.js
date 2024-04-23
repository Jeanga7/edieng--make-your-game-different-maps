import { game } from "./script.js";

// Level 1

let levels = [
    {
        scene: [
            { pos: { x: 800, y: 20 }, size: { w: 400, h: 400 }, type: "sun", cssPosition: "fixed" },
            { pos: { x: 2800, y: -20 }, size: { w: 341 * 2, h: 151 * 2 }, type: "scene1", cssPosition: "absolute" },
            { pos: { x: 1800, y: 20 }, size: { w: 2351 / 5, h: 981 / 5 }, type: "scene2", cssPosition: "absolute" },
        ],
        obstacles: [
            { pos: { x: 1, y: 0 }, type: "ground", size: { w: 600, h: 30 } },
            { pos: { x: 1000, y: 0 }, type: "ground", size: { w: 5000, h: 30 } },
            { pos: { x: 250, y: 70 }, type: "platform2", size: { w: 231, h: 72 } },
            { pos: { x: 650, y: 20 }, type: "platform2", size: { w: 231, h: 72 } },
            { pos: { x: 1250, y: 20 }, type: "colonne", size: { w: 176, h: 143 } },
        ],
        ennemies: [
            { pos: { x: 1000, y: 500 } },
        ],
        background: "skyblue",
        duration: 240,
        end: 3000
    },
    {
        scene: [
            { pos: { x: 800, y: 20 }, size: { w: 400, h: 400 }, type: "sun", cssPosition: "fixed" },
            { pos: { x: 2800, y: -20 }, size: { w: 341 * 2, h: 151 * 2 }, type: "scene1", cssPosition: "absolute" },
            { pos: { x: 1800, y: 20 }, size: { w: 2351 / 5, h: 981 / 5 }, type: "scene2", cssPosition: "absolute" },
        ],
        obstacles: [
            { pos: { x: 1, y: 0 }, type: "ground", size: { w: 600, h: 30 } },
            { pos: { x: 1000, y: 0 }, type: "ground", size: { w: 5000, h: 30 } },
            { pos: { x: 250, y: 70 }, type: "platform2", size: { w: 231, h: 72 } },
            { pos: { x: 650, y: 20 }, type: "platform2", size: { w: 231, h: 72 } },
            { pos: { x: 1250, y: 20 }, type: "colonne", size: { w: 176, h: 143 } },
        ],
        ennemies: [
            { pos: { x: 1000, y: 500 } },
        ],
        background: "darkblue",
        duration: 240,
        end: 3000
    },
]

// while (i <= levels.length) {

// }

for (const level of levels) {
    if (game(level.scene, level.obstacles, level.ennemies, level.background, level.duration, level.end) === true) {
        continue;
    }
}
