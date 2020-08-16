// ELO-Node-Regular-Voting-App (see readme)
// Made by Russell Rounds
// Version 0.1

// Node Modules
const http = require("http");
const fs = require("fs");

// NPM Modules
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
const photoPath  = publicDir + "/Selfies/";
const k = 32;
const startingScore = "0";
const obj = fs.readdirSync(photoPath);
const dlength = fs.readdirSync(photoPath).length - 1;
let maxPlayers = 2;
let playerArray = [];
let newPlayers = [];
let playerOne = 1;
let playerTwo = 1;
playerArray[0] = {};
playerArray[0].lockPlayer = false;

// Initial setup
if(fs.existsSync(publicDir) !== true) {
	console.log("PUBLIC directory not exists!");
	fs.mkdirSync(publicDir);
}

if(fs.existsSync(scorePath) !== true){
	fs.mkdirSync(scorePath);
	console.log("SCORE directory not exists!");
}

if(fs.existsSync(photoPath) !== true) {
	console.log("PHOTO directory not exists!");
	fs.mkdirSync(photoPath);
}

console.log("Starting...");

app.get("/", function(req, res){
	//console.log("Serving / ...");
	console.log("-------------------------------- New Game --------------------------------");

	// Player Selection -------------------------------------------------------
	if(playerArray[0].lockPlayer === true){
		//console.log("Players locked!"); 
		
		if(playerArray[0].lastPlayerOne !== undefined){
			//console.log("winner/loser chosen, but players locked.");
			playerOne = playerArray[0].lastPlayerOne;
			playerTwo = playerArray[0].lastPlayerTwo;
		}else{
			//console.log("reset pressed, but player locked.");
			playerOne = playerArray[0].lastPlayerOne;
			playerTwo = playerArray[0].lastPlayerTwo;
		}
		
	}else{
		//console.log("Players NOT locked!"); 
				
		playerOne = obj[getRandomIntInclusive(0, dlength)];
		playerOne = playerOne.substring(0, playerOne.length - 4);
		
		playerTwo = obj[getRandomIntInclusive(0, dlength)];
		playerTwo = playerTwo.substring(0, playerTwo.length - 4);
		
		while(playerOne === playerTwo){
			playerTwo = obj[getRandomIntInclusive(0, dlength)];
			playerTwo = playerTwo.substring(0, playerTwo.length - 4);
		}
		
		if(playerArray[0].winner !== undefined){
			//console.log("winner/loser chosen, players NOT locked.");
				while(playerArray[0].winner === playerOne || playerArray[0].loser === playerOne || playerOne === playerTwo){
					//console.log("Choosing new Player...");
					playerOne = obj[getRandomIntInclusive(0, dlength)];
					playerOne = playerOne.substring(0, playerOne.length - 4);
				}
				while(playerArray[0].winner === playerTwo || playerArray[0].loser === playerTwo || playerOne === playerTwo){
					//console.log("Choosing new Player...");
					playerTwo = obj[getRandomIntInclusive(0, dlength)];
					playerTwo = playerTwo.substring(0, playerTwo.length - 4);
				}
		}else{
			//console.log("NO winner/loser chosen, players NOT locked.");
		}
	}
	
	//console.log("playerOne: " + playerOne);
	//console.log("playerTwo: " + playerTwo);
	
	const playerOneNamePath = photoPath + playerOne + ".txt";
	const playerTwoNamePath = photoPath + playerTwo + ".txt";
	
	const playerOneScorePath = scorePath + playerOne + ".txt";
	const playerTwoScorePath = scorePath + playerTwo + ".txt";
	
	const playerOneImage = photoPath + playerOne + ".jpg";
	const playerTwoImage = photoPath + playerTwo + ".jpg";

	// Calculate original aspect ratio of pictures
	const dimensions1 = sizeOf(playerOneImage);
	const dimensions2 = sizeOf(playerTwoImage);
	const aspectRatioP1 = getAspectRatio(dimensions1.width, dimensions1.height);
	const aspectRatioP2 = getAspectRatio(dimensions2.width, dimensions2.height);
	
	const playerOneName = playerOne + ".jpg";
	const playerTwoName = playerTwo + ".jpg";
		
	let playerOneScore = 0;
	if(fs.existsSync(playerOneScorePath)){
		playerOneScore = Number(fs.readFileSync(playerOneScorePath));
	}else{
		fs.writeFileSync(playerOneScorePath, startingScore);
	}
		
	let playerTwoScore = 0;
	if(fs.existsSync(playerTwoScorePath)){
		playerTwoScore = Number(fs.readFileSync(playerTwoScorePath));
	}else{
		fs.writeFileSync(playerTwoScorePath, startingScore);
	}
	
	let playerOneELO = (ELO(playerOneScore, playerTwoScore) * 100).toPrecision(4);
	let playerTwoELO = (ELO(playerTwoScore, playerOneScore) * 100).toPrecision(4);

	newPlayers[0] = [];
	newPlayers[1] = [];
	
	newPlayers[0][0] = playerOne;
	newPlayers[0][1] = playerOneName;
	newPlayers[0][2] = playerOneScore;
	newPlayers[0][3] = playerOneELO;
	newPlayers[0][4] = aspectRatioP1;
	
	newPlayers[1][0] = playerTwo;
	newPlayers[1][1] = playerTwoName;
	newPlayers[1][2] = playerTwoScore;
	newPlayers[1][3] = playerTwoELO;
	newPlayers[1][4] = aspectRatioP2;

	res.render("node-dopple-main-old", {playerArray: playerArray, newPlayers: newPlayers});
	
});

app.post("/submitPlayer", function(req, res){
	
	let unserialized = JSON.parse(req.body.playerName);
	let winner = unserialized[0].toString();
	let loser = unserialized[1].toString();
	
	let winnerScoreFile = scorePath + winner + ".txt";
	let loserScoreFile = scorePath + loser + ".txt";
	
	let winnerOldScore = Number(fs.readFileSync(winnerScoreFile));
	let loserOldScore = Number(fs.readFileSync(loserScoreFile));

	let winnerELO = ELO(winnerOldScore, loserOldScore);
	let loserELO = ELO(loserOldScore, winnerOldScore);
	
	// ELO score distribution
	let winnerNewScore = winnerOldScore + (k * (1 - winnerELO));
	let loserNewScore = loserOldScore + (k * (0 - loserELO));
	let winnerNewELO = ELO(winnerNewScore, loserNewScore);
	let loserNewELO = ELO(loserNewScore, winnerNewScore);
	
	let winnerName = winner + ".jpg";
	let loserName = loser + ".jpg";
	
	fs.writeFileSync(winnerScoreFile, String(winnerNewScore));
	fs.writeFileSync(loserScoreFile, String(loserNewScore));
	
	let winnerLoserObject = {winner: winner, loser: loser, winnerName: winnerName, loserName: loserName, winnerOldScore: winnerOldScore, loserOldScore: loserOldScore, winnerELO: winnerELO, loserELO: loserELO, winnerNewScore: winnerNewScore, loserNewScore: loserNewScore, winnerNewELO: winnerNewELO, loserNewELO: loserNewELO};
	
	playerArray[0] = winnerLoserObject; //playerArray.push(winnerLoserObject);
		
	// Form Logic --------
	playerArray[0].lastPlayerOne = req.body.playerOneHidden;
	playerArray[0].lastPlayerTwo = req.body.playerTwoHidden;
	playerArray[0].resetPressed = false;
	
	if(req.body.lockPlayer === "true"){
		playerArray[0].lockPlayer = true;
	}else{
		playerArray[0].lockPlayer = false;
	}
	// Form Logic -------
	
	console.log(winnerLoserObject);
	
	res.redirect("/");
});

app.post("/resetScores", function(req, res){
	console.log("Resetting Scores...");
	
	// Form Logic --------
	playerArray[0].lastPlayerOne = req.body.playerOneHidden;
	playerArray[0].lastPlayerTwo = req.body.playerTwoHidden;
	playerArray[0].resetPressed = true;
	if(req.body.lockPlayer === "true"){
		playerArray[0].lockPlayer = true;
	}else{
		playerArray[0].lockPlayer = false;
	}
	// Form Logic --------
		
	let scoreDirContents = fs.readdirSync(scorePath);
	let scorePathLength = (fs.readdirSync(scorePath).length);
	
	for (let i = 0; i < scorePathLength; i++) {
		let scoreFileTemp1 = scorePath + scoreDirContents[i];
		console.log("Resetting " + scoreFileTemp1);
		fs.writeFileSync(scoreFileTemp1, startingScore);
		if(scorePathLength - 1 === i){
			console.log("All " + scorePathLength +  " score files reset!");
		}
	}
	
	res.redirect("/");
});

function getAspectRatio(w, h){
	return Number((h / w).toString().substr(0, 4));
};
	
function ELO(A, B){
	return 1 / (1 + Math.pow(10,((B - A)/400)));
};

function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};

function isEven(value) {
	if (value%2 == 0)
		return true;
	else
		return false;
}

function logArray(theArray){
	Array.from(Object.keys(theArray)).forEach(function(key){
		console.log(key + ": " + theArray[key]);
	});
};