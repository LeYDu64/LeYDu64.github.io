let players = [];
let currentPlayer = 0;

let words = [
["Château","Forteresse"],
["Roi","Prince"],
["Épée","Dague"],
["Dragon","Serpent"],
["Cheval","Âne"],
["Forêt","Jungle"],
["Couronne","Diadème"],
["Trône","Chaise"],
["Bouclier","Armure"]
];

function shuffle(array){
for(let i=array.length-1;i>0;i--){
let j=Math.floor(Math.random()*(i+1));
[array[i],array[j]]=[array[j],array[i]];
}
}

function startGame(){

let count=parseInt(document.getElementById("playerCount").value);
let impostors=parseInt(document.getElementById("impostorCount").value);

if(count<3){
alert("Minimum 3 joueurs !");
return;
}

if(impostors<1 || impostors>=count){
alert("Nombre de Renégats invalide !");
return;
}

players=[];

let randomPair=words[Math.floor(Math.random()*words.length)];
let villageWord=randomPair[0];
let renegatWord=randomPair[1];

for(let i=0;i<count;i++){
players.push({
name:"Joueur "+(i+1),
role:"Villageois",
word:villageWord,
alive:true
});
}

shuffle(players);

for(let i=0;i<impostors;i++){
players[i].role="Renégat";
players[i].word=renegatWord;
}

shuffle(players);

currentPlayer=0;

document.getElementById("setup").classList.add("hidden");
document.getElementById("transition").classList.remove("hidden");

updateTransition();
}

function updateTransition(){
let alivePlayers=players.filter(p=>p.alive);

if(currentPlayer>=alivePlayers.length){
startVote();
return;
}

document.getElementById("playerName").innerText=alivePlayers[currentPlayer].name;
}

function showWord(){
let alivePlayers=players.filter(p=>p.alive);
let player=alivePlayers[currentPlayer];

document.getElementById("transition").classList.add("hidden");
document.getElementById("reveal").classList.remove("hidden");

document.getElementById("wordText").innerText="Mot : "+player.word;
}

function nextPlayer(){
document.getElementById("reveal").classList.add("hidden");
document.getElementById("transition").classList.remove("hidden");

currentPlayer++;
updateTransition();
}

function startVote(){
document.getElementById("transition").classList.add("hidden");
document.getElementById("voteScreen").classList.remove("hidden");

let voteDiv=document.getElementById("voteButtons");
voteDiv.innerHTML="";

players.forEach((p,index)=>{
if(p.alive){
let btn=document.createElement("button");
btn.innerText=p.name;
btn.onclick=()=>vote(index);
voteDiv.appendChild(btn);
}
});
}

function vote(index){

players[index].alive=false;

checkWin();
}

function checkWin(){

let alivePlayers=players.filter(p=>p.alive);
let renegats=alivePlayers.filter(p=>p.role==="Renégat");

if(renegats.length===0){
endGame("Les Villageois gagnent !");
return;
}

if(renegats.length>=alivePlayers.length-renegats.length){
endGame("Les Renégats gagnent !");
return;
}

currentPlayer=0;

document.getElementById("voteScreen").classList.add("hidden");
document.getElementById("transition").classList.remove("hidden");

updateTransition();
}

function endGame(message){

document.getElementById("voteScreen").classList.add("hidden");
document.getElementById("resultScreen").classList.remove("hidden");

document.getElementById("resultScreen").innerHTML=
"<h2>"+message+"</h2><button onclick='restart()'>Rejouer</button>";
}

function restart(){
location.reload();
}
