import { game } from "./script.mjs";
import { levels } from "./levels.js";
import { currentLevel } from "./script.mjs";




game(levels[currentLevel].scene, levels[currentLevel].obstacles, levels[currentLevel].ennemies, levels[currentLevel].bonus, levels[currentLevel].background, levels[currentLevel].duration, levels[currentLevel].end);
