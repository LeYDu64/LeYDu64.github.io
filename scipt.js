<script>
let players=[];
let currentPlayer=0;
let villageWord="";
let impostorWord="";

const words=[
["Chat","Tigre"],["Lion","Panthère"],["Chien","Loup"], ["Pizza","Burger"],["Pâtes","Riz"],["Frites","Chips"], ["Voiture","Moto"],["Locomotive","Wagon"],["Avion","Hélicoptère"], ["Mer","Piscine"],["Montagne","Colline"],
  ["Forêt","Jungle"], ["Ordinateur","Tablette"],["Téléphone","Radio"],["Caméra","Appareil photo"], ["Film","Série"],["Livre","Magazine"],["Hôpital","Vétérinaire"],["Café","Thé"], ["Chocolat","Bonbon"],
  ["Bateau","Sous-marin"],["Neige","Glace"],["Pomme","Poire"], ["Fraise","Framboise"],["Chaussure","Botte"],["Chemise","Veste"], ["Soleil","Lune"],["Mer","Océan"],["Police","Pompier"], ["Roi","Prince"],
  ["Supermarché","Boulangerie"], ["Football","Basket"],["Paris","Londres"], ["Netflix","YouTube"],["Amazon","eBay"], ["Facebook","Instagram"],["Snapchat","TikTok"], ["McDonald's","Burger King"],
  ["Pepsi","Coca-Cola"], ["Ferrari","Lamborghini"],["Nike","Adidas"], ["Marvel","DC"],["Bitcoin","Ethereum"], ["Samsung","Apple"], ["Xbox","PlayStation"],["Windows","Mac"], ["Google","FireFox"],
  ["Airbnb","Hotel"], ["Uber","Taxi"],["Croissant","Pain au chocolat"], ["Fromage","Beurre"],["Bière","Vin"], ["Guitare","Piano"],["Drame","Comédie"], ["Action","Horreur"],["Zombie","Vampire"], 
  ["Dragon","Dinosaure"], ["Clown","Magicien"], ["Pluie","Orage"],["Désert","Savane"], ["Cinéma","Théâtre"],["PlayMobil","LEGO"],["Mario","Link"],["Zelda","Ganondorph"],["Feutre","Peinture"],["Croquis","Dessin"],
  ["Château", "Forteresse"],
        ["Dragon", "Serpent"],
        ["Épée", "Dague"],
        ["Couronne", "Diadème"],
        ["Chevalier", "Soldat"]
];

function saveConfig(){
const config={
playerCount:playerCount.value,
impostorCount:impostorCount.value,
idiotCount:idiotCount.value,
names:getNames()
};
localStorage.setItem("royaumeConfig",JSON.stringify(config));
}

function loadConfig(){
const saved=JSON.parse(localStorage.getItem("royaumeConfig"));
if(!saved) return;
playerCount.value=saved.playerCount;
impostorCount.value=saved.impostorCount;
idiotCount.value=saved.idiotCount||0;
generateNameInputs();
setTimeout(()=>{
saved.names.forEach((name,i)=>{
let input=document.getElementById("name"+i);
if(input) input.value=name;
});
},100);
}

function resetData(){
localStorage.removeItem("royaumeConfig");
location.reload();
}

function shuffle(array){
for(let i=array.length-1;i>0;i--){
let j=Math.floor(Math.random()*(i+1));
[array[i],array[j]]=[array[j],array[i]];
}
}

function getNames(){
let names=[];
for(let i=0;i<playerCount.value;i++){
names.push(document.getElementById("name"+i)?.value||("Joueur "+(i+1)));
}
return names;
}

function generateNameInputs(){
let count=parseInt(playerCount.value)||0;
let container=document.getElementById("nameInputs");
container.innerHTML="";
for(let i=0;i<count;i++){
let input=document.createElement("input");
input.id="name"+i;
input.placeholder="Nom joueur "+(i+1);
container.appendChild(input);
}
saveConfig();
}

function startGame(){

saveConfig();

let count=parseInt(playerCount.value)||0;
let impostors=parseInt(impostorCount.value)||0;
let idiotCountValue=parseInt(idiotCount.value)||0;

if(count<3){
alert("Minimum 3 joueurs.");
return;
}

if(impostors<0||idiotCountValue<0){
alert("Valeur invalide.");
return;
}

if(impostors+idiotCountValue>=count){
alert("Trop de rôles spéciaux.");
return;
}

if(impostors===0 && idiotCountValue===0){
alert("Il faut au moins un Renégat ou un Idiot du Royaume.");
return;
}

players=[];

let pair=words[Math.floor(Math.random()*words.length)];
villageWord=pair[0];
impostorWord=pair[1];

let names=getNames();

for(let i=0;i<count;i++){
players.push({
name:names[i],
role:"Villageois",
word:villageWord,
alive:true
});
}

shuffle(players);

for(let i=0;i<impostors;i++){
players[i].role="Renégat";
players[i].word=impostorWord;
}

let index=impostors;
for(let i=0;i<idiotCountValue;i++){
players[index].role="Idiot du Royaume";
players[index].word="";
index++;
}

shuffle(players);

currentPlayer=0;
setup.classList.add("hidden");
transition.classList.remove("hidden");
playerName.innerText=players[currentPlayer].name;
}

function showWord(){
transition.classList.add("hidden");
reveal.classList.remove("hidden");

let player=players[currentPlayer];

if(player.role==="Idiot du Royaume"){
wordText.innerText = player.name + ", tu es l'Idiot du Royaume 🤡";
}else{
wordText.innerText = player.name + ", ton mot est : " + player.word;
}
}


function nextPlayer(){
currentPlayer++;
if(currentPlayer>=players.length){
reveal.classList.add("hidden");
startVote();
return;
}
reveal.classList.add("hidden");
transition.classList.remove("hidden");
playerName.innerText=players[currentPlayer].name;
}

function startVote(){
voteScreen.classList.remove("hidden");
voteButtons.innerHTML="";
players.forEach(p=>{
if(p.alive){
let btn=document.createElement("button");
btn.className="playerButton";
btn.innerText=p.name;
btn.onclick=()=>eliminate(p);
voteButtons.appendChild(btn);
}
});
}

function eliminate(player){
player.alive=false;
voteScreen.classList.add("hidden");
resultScreen.classList.remove("hidden");
resultScreen.innerHTML="<h3>"+player.name+" était "+player.role+"</h3>";

if(player.role==="Idiot du Royaume"){
let guess=prompt("Quel est le mot des villageois ?");
if(guess && guess.toLowerCase()===villageWord.toLowerCase()){
resultScreen.innerHTML+="<h2>🤡 L'Idiot triomphe ! 🤡</h2>";
resultScreen.innerHTML+="<button onclick='location.reload()'>Nouvelle partie</button>";
return;
}
}

let impostorsAlive=players.filter(p=>p.role==="Renégat"&&p.alive).length;
let villagersAlive=players.filter(p=>p.role==="Villageois"&&p.alive).length;

if(impostorsAlive===0){
resultScreen.innerHTML+="<h2>🎉 Victoire des Villageois</h2>";
resultScreen.innerHTML+="<button onclick='location.reload()'>Nouvelle partie</button>";
return;
}

if(impostorsAlive>=villagersAlive){
resultScreen.innerHTML+="<h2>💀 Victoire des Renégats</h2>";
resultScreen.innerHTML+="<button onclick='location.reload()'>Nouvelle partie</button>";
return;
}

resultScreen.innerHTML+="<button onclick='nextRound()'>Continuer</button>";
}

function nextRound(){
resultScreen.classList.add("hidden");
startVote();
}

function toggleRules(){
rules.classList.toggle("hidden");
}

loadConfig();
</script>
