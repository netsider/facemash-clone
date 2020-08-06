// ELO-Node-Regular-Voting-App-API (FaceMash Clone - API version)
// Made by Russell Rounds
// Version 0.1
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 3000;
const k = 32;

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

// Make start button to generate players first?

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Request domain
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.type('json');
  next();
})

app.get("/", (req, res, next) => {
	// res.json( {Data: "JSON Data."} );
});

// app.post("/submitPlayer", bodyParser.json(), (req, res, next) => { // If you don't use app.use(bodyParser.json());
app.post("/submitPlayer", (req, res, next) => {
	let winnerELO = loserELO = winnerNewScore = loserNewScore = playerOneNewScore = playerTwoNewScore = 0;

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
		playerTwoNewScore = playerTwoOldScore + (k * (1 - playerTwoELO));
		playerOneNewScore = playerOneOldScore + (k * (0 - playerOneELO));
		loser = "playerOne";
	}
	
	let playerOneNewELO = ELO(playerOneNewScore, playerTwoNewScore);
	let playerTwoNewELO = ELO(playerTwoNewScore, playerOneNewScore);
	
	let winnerLoserObject = { winner: winner, loser: loser, playerOneELO: playerOneELO, playerTwoELO: playerTwoELO, playerOneNewELO: playerOneNewELO, playerTwoNewELO: playerTwoNewELO, playerOneOldScore: playerOneOldScore, playerTwoOldScore: playerTwoOldScore, playerOneNewScore: playerOneNewScore, playerTwoNewScore: playerTwoNewScore };
	
	// Request
	// console.log(req.body);
	
	console.log(winnerLoserObject);
	
	// Response
	let newObj = { "data": req.body, "body": winnerLoserObject };
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
