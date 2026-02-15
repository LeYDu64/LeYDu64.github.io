// ===============================
// 🔥 CONFIG FIREBASE (A REMPLACER)
// ===============================

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGApT4md4vdZqeRMWevKtWcBLd2Xc3H9M",
  authDomain: "renegat-du-royaume-c5a0e.firebaseapp.com",
  databaseURL: "https://renegat-du-royaume-c5a0e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "renegat-du-royaume-c5a0e",
  storageBucket: "renegat-du-royaume-c5a0e.firebasestorage.app",
  messagingSenderId: "405467561031",
  appId: "1:405467561031:web:8dcc9bff65f25534794562"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
let currentRoom = null;
let currentPlayerId = null;
let isHost = false;

// ===============================
// 🔐 AUTH ANONYME
// ===============================

firebase.auth().signInAnonymously()
    .then((userCredential) => {
        currentPlayerId = userCredential.user.uid;
    });

// ===============================
// 🎲 CREER SALON
// ===============================

function createRoom(playerName) {

    const roomCode = generateCode();
    currentRoom = roomCode;
    isHost = true;

    database.ref("rooms/" + roomCode).set({
        hostId: currentPlayerId,
        gameState: "waiting",
        currentTurn: null
    });

    addPlayer(playerName);
    listenRoom();

    alert("Code de la partie : " + roomCode);
}

// ===============================
// 🚪 REJOINDRE SALON
// ===============================

function joinRoom(roomCode, playerName) {

    currentRoom = roomCode;

    database.ref("rooms/" + roomCode).once("value")
        .then(snapshot => {
            if (snapshot.exists()) {
                addPlayer(playerName);
                listenRoom();
            } else {
                alert("Salon introuvable");
            }
        });
}

// ===============================
// 👤 AJOUT JOUEUR
// ===============================

function addPlayer(name) {

    database.ref(`rooms/${currentRoom}/players/${currentPlayerId}`).set({
        name: name,
        alive: true,
        role: null
    });
}

// ===============================
// 🎤 CHAT
// ===============================

function sendMessage(text) {

    const messageRef = database.ref(`rooms/${currentRoom}/chat`).push();

    messageRef.set({
        sender: currentPlayerId,
        text: text,
        timestamp: Date.now()
    });
}

function listenChat() {

    database.ref(`rooms/${currentRoom}/chat`).on("child_added", snapshot => {

        const message = snapshot.val();
        displayMessage(message);
    });
}

// ===============================
// 🔄 ECOUTE SALON
// ===============================

function listenRoom() {

    database.ref("rooms/" + currentRoom).on("value", snapshot => {

        const roomData = snapshot.val();
        updateGame(roomData);
    });

    listenChat();
}

// ===============================
// 🗳️ VOTE
// ===============================

function vote(targetId) {

    database.ref(`rooms/${currentRoom}/votes/${currentPlayerId}`).set(targetId);
}

function checkVotes() {

    database.ref(`rooms/${currentRoom}/votes`).once("value")
        .then(snapshot => {

            const votes = snapshot.val();
            if (!votes) return;

            const count = {};

            for (let voter in votes) {
                const voted = votes[voter];
                count[voted] = (count[voted] || 0) + 1;
            }

            let eliminated = Object.keys(count).reduce((a, b) =>
                count[a] > count[b] ? a : b
            );

            eliminatePlayer(eliminated);
        });
}

// ===============================
// ❌ ELIMINATION
// ===============================

function eliminatePlayer(playerId) {

    database.ref(`rooms/${currentRoom}/players/${playerId}/alive`).set(false);

    checkWinCondition();
}

// ===============================
// 🏆 CONDITIONS VICTOIRE
// ===============================

function checkWinCondition() {

    database.ref(`rooms/${currentRoom}/players`).once("value")
        .then(snapshot => {

            const players = snapshot.val();
            let impostors = 0;
            let villagers = 0;

            for (let id in players) {
                if (players[id].alive) {
                    if (players[id].role === "impostor") {
                        impostors++;
                    } else {
                        villagers++;
                    }
                }
            }

            if (impostors === 0) {
                endGame("Villageois gagnent");
            } else if (impostors >= villagers) {
                endGame("Imposteurs gagnent");
            }
        });
}

// ===============================
// 🏁 FIN
// ===============================

function endGame(message) {
    database.ref(`rooms/${currentRoom}/gameState`).set("ended");
    alert(message);
}

// ===============================
// 🔢 GENERER CODE
// ===============================

function generateCode() {

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";

    for (let i = 0; i < 6; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
    }

    return code;
}

// ===============================
// 🎨 FONCTIONS D'AFFICHAGE A CONNECTER A TON HTML
// ===============================

function displayMessage(message) {
    console.log(message.text);
}

function updateGame(data) {
    console.log(data);
}
