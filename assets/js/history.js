const story = [
    // Introduction
    "Vous êtes un jeune étudiant passionné par les sciences, mais un jour, une erreur de manipulation lors de vos recherches provoque un phénomène étrange. Vous vous retrouvez soudainement transporté dans un monde inconnu et ancien, où les lois de la nature semblent différentes de celles que vous avez apprises.",
    // Développement 1
    "Désorienté mais déterminé, vous découvrez que ce monde est rempli de défis et de dangers. Vous devez apprendre à vous adapter rapidement pour survivre. Vous réalisez également que pour retrouver votre monde d'origine, vous devez traverser une série de mondes qui représentent différentes époques, chacun étant gardé par des êtres mystérieux.",
    // Développement 2
    "Au fil de votre périple, vous découvrez des indices sur l'origine de cet anachronisme et sur la manière de le corriger. Vous ramassez des bonus qui vous aident à vous adapter à chaque nouvel environnement et à affronter les gardiens de chaque monde. Chaque monde traversé vous rapproche un peu plus de votre époque d'origine, mais aussi de la résolution du mystère qui vous a conduit ici. Finalement, il atteignit son objectif. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    // Conclusion
    "Après avoir surmonté de nombreux obstacles et avoir collecté des indices précieux, vous parvenez enfin à retourner dans votre monde. Mais votre aventure ne s'arrête pas là, car vous réalisez que les connaissances que vous avez acquises et les expériences que vous avez vécues dans ces mondes anciens ont changé votre perception du temps et de l'histoire à jamais",
    // slogan
    "Découvrez les méandres du temps dans Anachronos : voyagez à travers les époques, affrontez l'inconnu, devenez le maître du temps !"    
];

export { displayNextSegment, displayParagraphs }
const pageHistory =  document.getElementById('textHistory')

let currentPartie = 0;
let currentParagraph = 0;

function displayNextSegment() {
    if (currentPartie < story.length) {
        const segment = story[currentPartie];
        if (segment.length > 50) {
            const paragraphs = segment.match(/.{1,200}/g);
            console.log(paragraphs);
            displayParagraphs(paragraphs);
        } else {
           pageHistory.textContent = segment;
            currentPartie++;
        }
    } else {
        document.querySelector('#historyModal').style.display = 'none'
        return;
    }
}

function displayParagraphs(paragraphs) {
    if (currentParagraph < paragraphs.length) {
        document.getElementById('textHistory').textContent = paragraphs[currentParagraph];
        currentParagraph++;
        setTimeout(() => {
            displayParagraphs(paragraphs);
        }, 5000);
    } else {
        currentSegment++;
        currentParagraph = 0;
        displayNextSegment();
    }
}

// displayNextSegment();