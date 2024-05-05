// function addScripts() {
//     let links = ["./assets/js/game.mjs", "./assets/js/levels.js", "./assets/js/utils.js"]
//     links.forEach(l => {
//         let el = document.createElement("script")
//         el.src = l
//         el.type = "module"
//         // el.setAttribute("src", l)
//         // el.setAttribute("type", "module")
//         document.body.appendChild(el)
//     })
// }

// function removeScripts() {
//     let scripts = document.querySelectorAll('script');
//     scripts.forEach(script => {
//         if (script.type === 'module') {
//             script.body.removeChild(script);
//         }
//     });
// }