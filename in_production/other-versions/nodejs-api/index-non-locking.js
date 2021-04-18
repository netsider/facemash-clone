// FaceMash Clone - API version
// Made by Russell Rounds
// Version 0.1
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const k = 32;
const publicDir = "files";
const scorePath = publicDir + "/Scores/";
const photoPath = publicDir + "/Pictures/";
const picObj = fs.readdirSync(photoPath);

let playerScoresObj = {};
for (let item of picObj) {
	playerScoresObj[item] = 1500;
}
let playerNameArray = Object.keys(playerScoresObj);

console.log(picObj);
console.log(playerScoresObj);
console.log(playerNameArray);

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Request domain
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.type("json");
  // res.type('json');
  next();
})

// app.get("/", (req, res, next) => {
	// res.json( {Data: "JSON Data."} );
// });

app.post("/getPlayers", (req, res, next) => {
	let playerOne = playerNameArray[getRandomIntInclusive(1, playerNameArray.length - 1)]; // To Do: Check range
	let playerTwo = playerNameArray[getRandomIntInclusive(1, playerNameArray.length - 1)];
	
	while(playerOne === playerTwo){
		playerTwo = playerNameArray[getRandomIntInclusive(1, playerNameArray.length - 1)];
	}
	let playerOneScore = playerScoresObj[playerOne];
	let playerTwoScore = playerScoresObj[playerTwo];
	
	// console.log("Player 1: " + playerOne + "Player 1 Score: " + playerOneScore);
	// console.log("Player 2: " + playerTwo + "Player 2 Score: " + playerTwoScore);

	res.json( { "body": { playerOne: playerOne, playerTwo: playerTwo, playerOneScore: playerOneScore, playerTwoScore: playerTwoScore } } );
});

// app.post("/submitPlayer", bodyParser.json(), (req, res, next) => { // If you don't use app.use(bodyParser.json());
app.post("/submitPlayer", (req, res, next) => {
	let playerOneNewScore = playerTwoNewScore = 0;

	let playerOne = req.body.playerOne;
	let playerTwo = req.body.playerTwo;
	
	let playerOneOldScore = Number(req.body.scoreOne);
	let playerTwoOldScore = Number(req.body.scoreTwo);
	
	let winner = req.body.winner;
	let loser = "playerTwo";
	
	let playerOneELO = ELO(playerOneOldScore, playerTwoOldScore);
	let playerTwoELO = ELO(playerTwoOldScore, playerOneOldScore);
	
	if(winner === "playerOne"){
		playerOneNewScore = playerOneOldScore + (k * (1 - playerOneELO));
		playerTwoNewScore = playerTwoOldScore + (k * (0 - playerTwoELO));
	}else{
		playerOneNewScore = playerOneOldScore + (k * (0 - playerOneELO));
		playerTwoNewScore = playerTwoOldScore + (k * (1 - playerTwoELO));
		loser = "playerOne";
	}
	
	playerScoresObj[playerOne + ".jpg"] = playerOneNewScore;
	playerScoresObj[playerTwo + ".jpg"] = playerTwoNewScore;
	
	let playerOneNewELO = ELO(playerOneNewScore, playerTwoNewScore);
	let playerTwoNewELO = ELO(playerTwoNewScore, playerOneNewScore);
	
	let winnerLoserObject = { winner: winner, loser: loser, playerOneELO: playerOneELO, playerTwoELO: playerTwoELO, playerOneNewELO: playerOneNewELO, playerTwoNewELO: playerTwoNewELO, playerOneOldScore: playerOneOldScore, playerTwoOldScore: playerTwoOldScore, playerOneNewScore: playerOneNewScore, playerTwoNewScore: playerTwoNewScore, playerOne: playerOne, playerTwo: playerTwo };
	
	// console.log(req.body);
	console.log(winnerLoserObject);
	
	let newObj = { "old": req.body, "body": winnerLoserObject };
	// let newObj = { "body": winnerLoserObject };
	
	res.json(newObj);
});

function ELO(A, B){
	return 1 / (1 + Math.pow(10,((B - A)/400)));
};
function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
};
