// ===== SYSTEME DE TOUR =====

let speakingOrder = [];
let currentSpeakerIndex = 0;

// Initialise l'ordre de parole
function initTurns() {

    // On prend uniquement les joueurs vivants
    let alivePlayers = players.filter(p => p.alive);

    // On mélange les joueurs
    speakingOrder = [...alivePlayers];
    shuffle(speakingOrder);

    // Si le premier est l'Idiot du Royaume, on le décale
    if (speakingOrder[0].role === "Idiot du Royaume") {
        let idiot = speakingOrder.shift();
        speakingOrder.push(idiot);
    }

    currentSpeakerIndex = 0;
    showCurrentSpeaker();
}

// Affiche le joueur qui doit parler
function showCurrentSpeaker() {

    let speaker = speakingOrder[currentSpeakerIndex];

    let speakingZone = document.getElementById("speakingZone");

    if (!speakingZone) {
        speakingZone = document.createElement("div");
        speakingZone.id = "speakingZone";
        speakingZone.className = "card";
        document.querySelector(".container").appendChild(speakingZone);
    }

    speakingZone.innerHTML = `
        <h2>🗣 À ${speaker.name} de parler</h2>
        <button onclick="nextSpeaker()">Suivant</button>
    `;
}

// Passe au joueur suivant
function nextSpeaker() {

    currentSpeakerIndex++;

    if (currentSpeakerIndex >= speakingOrder.length) {
        startVote(); // Passe au vote après le dernier joueur
        return;
    }

    showCurrentSpeaker();
}
