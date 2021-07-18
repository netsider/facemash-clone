// ELO-Node-Regular-Voting-App (see readme)
// Made by Russell Rounds
// Version 0.2

const http = require("http");
const fs = require("fs");
const express  = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const sizeOf = require("image-size");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const publicDir = "files";
app.use(express.static(__dirname + "/" + publicDir));
app.set("view engine", "ejs");
app.listen(3000);

const scorePath = publicDir + "/Selfie_Score/";
const photoPath = publicDir + "/Selfies/";
const k = 32;
const startingScore = "0";
const dlength = fs.readdirSync(photoPath).length - 1;
const obj = fs.readdirSync(photoPath);

// Initial setup
if(fs.existsSync(publicDir) !== true) {
	console.log("Public directory not exists! Creating...");
	fs.mkdirSync(publicDir);
}

if(fs.existsSync(photoPath) !== true) {
	console.log("Photo directory not exists! Creating...");
	fs.mkdirSync(photoPath);
}

if(fs.existsSync(scorePath) !== true){
	fs.mkdirSync(scorePath);
	console.log("Score directory not exists! Creating...");
}

let playerScoresObj = {};
for (let item of obj) { // Read scores into memory, or write new file
	let file = item.substring(0, item.length - 4);
	let filePath = scorePath + file + ".txt";

	if(!fs.existsSync(filePath)){
		console.log("Writing Score File " + filePath);
		fs.writeFileSync(filePath, startingScore);
		playerScoresObj[file] = startingScore;
	}else{
		playerScoresObj[file] = Number(fs.readFileSync(filePath));
	}
}
//console.log(playerScoresObj);


let playerAspectRatioObj = {};
for (let item of obj) {  //Compute aspect ratios, and read into object
	let player = item.substring(0, item.length - 4);
	let playerImagePath = photoPath + player + ".jpg";
	let dimensions = sizeOf(playerImagePath);
	let aspectRatio = getAspectRatio(dimensions.width, dimensions.height);
	playerAspectRatioObj[player] = aspectRatio;
}
//console.log(playerAspectRatioObj);

console.log("Starting...");

app.get("/", function(req, res){
	let newPlayers = generatePlayers(null, null, "random");
	res.render("node-dopple-main", {newPlayers: newPlayers});
});

app.post("/submitPlayer", function(req, res){
	let unserialized = JSON.parse(req.body.playerName);
	let winner = unserialized[0].toString();
	let loser = unserialized[1].toString();
	
	let winnerOldScore = playerScoresObj[winner];
	let loserOldScore = playerScoresObj[loser];

	let winnerELO = ELO(winnerOldScore, loserOldScore);
	let loserELO = ELO(loserOldScore, winnerOldScore);
	
	let winnerNewScore = winnerOldScore + (k * (1 - winnerELO));
	let loserNewScore = loserOldScore + (k * (0 - loserELO));
	
	let winnerNewELO = ELO(winnerNewScore, loserNewScore);
	let loserNewELO = ELO(loserNewScore, winnerNewScore);
	
	let winnerName = winner + ".jpg";
	let loserName = loser + ".jpg";
	
	//fs.writeFileSync(winnerScoreFile, String(winnerNewScore)); // Perform batch write on shutdown
	//fs.writeFileSync(loserScoreFile, String(loserNewScore));
	
	playerScoresObj[winner] = winnerNewScore;
	playerScoresObj[loser] = loserNewScore;
	
	let winnerLoserObject = {winner: winner, loser: loser, winnerName: winnerName, loserName: loserName, winnerOldScore: winnerOldScore, loserOldScore: loserOldScore, winnerELO: winnerELO, loserELO: loserELO, winnerNewScore: winnerNewScore, loserNewScore: loserNewScore, winnerNewELO: winnerNewELO, loserNewELO: loserNewELO};
	
	let newPlayers = [];
	let playerArray = [];
	playerArray[0] = winnerLoserObject; //playerArray.push(winnerLoserObject);
		
	if(req.body.lockPlayer === "true"){
		playerArray[0].lockPlayer = true;
		newPlayers = generatePlayers(req.body.playerOneHidden, req.body.playerTwoHidden, "fixed");
	}else{
		newPlayers = generatePlayers(winner, loser, "random");
		playerArray[0].lockPlayer = false;
	}
	
	//console.log(winnerLoserObject);
	res.render("node-dopple-main", {playerArray: playerArray, newPlayers: newPlayers});
});

app.post("/resetScores", function(req, res){
	//console.log("Resetting Scores...");
	
	// let scoreDirContents = fs.readdirSync(scorePath);
	// let scorePathLength = (fs.readdirSync(scorePath).length);
	// for (let i = 0; i < scorePathLength; i++) {
		// let scoreFileTemp1 = scorePath + scoreDirContents[i];
		// console.log("Resetting " + scoreFileTemp1);
		// fs.writeFileSync(scoreFileTemp1, startingScore);
		// if(scorePathLength - 1 === i){
			// console.log("All " + scorePathLength +  " score files reset!");
		// }
	// }
	
	//for (let item of playerScoresObj) { // not iterable ?  
	for (let key in playerScoresObj) {
		playerScoresObj[key] = startingScore;
		console.log("Resetting score of " + key);
	}
	
	let playerArray = [];
	playerArray[0] = {};
	let newPlayers = [];
	playerArray[0].resetPressed = true;
	if(req.body.lockPlayer === "true"){
		newPlayers = generatePlayers(req.body.playerOneHidden, req.body.playerTwoHidden, "fixed");
		playerArray[0].lockPlayer = true;
	}else{
		playerArray[0].lockPlayer = false;
		newPlayers = generatePlayers(null, null, "random");
	}
	
	res.render("node-dopple-main", {playerArray: playerArray, newPlayers: newPlayers});
});

function getAspectRatio(w, h){
	return Number((h / w).toPrecision(4));
};
	
function ELO(A, B){
	return 1 / (1 + Math.pow(10,((B - A)/400)));
};

function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
};
function generatePlayers(p1, p2, method){
	let playerOne = "0";
	let playerTwo = "0";
	
	if(method === "fixed"){
		playerOne = p1.toString();
		playerTwo = p2.toString();
	}else if(method === "random"){
		playerOne = obj[getRandomIntInclusive(0, dlength)];
		playerOne = playerOne.substring(0, playerOne.length - 4);
		playerTwo = obj[getRandomIntInclusive(0, dlength)];
		playerTwo = playerTwo.substring(0, playerTwo.length - 4);
	
		while(p1 === playerOne || p2 === playerOne || playerOne === playerTwo){
			playerOne = obj[getRandomIntInclusive(0, dlength)];
			playerOne = playerOne.substring(0, playerOne.length - 4);
		}
		while(p1 === playerTwo || p2 === playerTwo || playerOne === playerTwo){
			playerTwo = obj[getRandomIntInclusive(0, dlength)];
			playerTwo = playerTwo.substring(0, playerTwo.length - 4);
		}
	}
	
	let playerOneName = playerOne + ".jpg"; 
	let playerTwoName = playerTwo + ".jpg";
	
	let aspectRatioP1 = playerAspectRatioObj[playerOne];
	let aspectRatioP2 = playerAspectRatioObj[playerTwo];
	
	let playerOneScore = playerScoresObj[playerOne];
	let playerTwoScore = playerScoresObj[playerTwo];
	
	let playerOneELO = (ELO(playerOneScore, playerTwoScore) * 100).toPrecision(4);
	let playerTwoELO = (ELO(playerTwoScore, playerOneScore) * 100).toPrecision(4);
	
	let newPlayers = []; newPlayers[0] = []; newPlayers[1] = [];
	
	newPlayers[0][0] = playerOne;
	newPlayers[0][1] = playerOneName;
	newPlayers[0][2] = playerOneScore;
	newPlayers[0][3] = Number(playerOneELO);
	newPlayers[0][4] = aspectRatioP1;
	
	newPlayers[1][0] = playerTwo;
	newPlayers[1][1] = playerTwoName;
	newPlayers[1][2] = playerTwoScore;
	newPlayers[1][3] = Number(playerTwoELO);
	newPlayers[1][4] = aspectRatioP2;	
	
	return newPlayers;
};