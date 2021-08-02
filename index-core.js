// Facemash-clone
// Made by Russell Rounds
// Current version without login/auth code (formerly index.js, before login/auth code taken out)

// To Do:
// Make NodeJS SQL Server skeleton/template
// Make app not use in-memory score object, and only rely on DB
// Make generatePlayers read from DB
// Finish making main route a chain of promises.
// Fix NaN issue by reading score from DB.
// Make non-DB version, or SQLite version.

// Login Flow:
// Script included on page (platform.js), which renders Login with Google button.
// After users signs in, a success function that  I made is called, which makes XHR request to /verifyToken express route on server.
// Token is then verified on server, and XHR request is sent back to client, where XHR success function is called.
// What do I do next?  XHR success function cannot be used since that would be insecure.

const http = require("http");
const fs = require("fs");
const express  = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const sizeOf = require("image-size");
const app = express();
const jws = require("jws-jwk");
const https = require("https");
const sql = require("mssql"); // https://www.npmjs.com/package/mssql

// General Config
const publicDir = "files";
const port = 3000;
const k = 32;
const startingScore = "1500";
const scorePath = publicDir + "/Selfie_Score/";
const photoPath = publicDir + "/Selfies/";
const dlength = fs.readdirSync(photoPath).length - 1;
const obj = fs.readdirSync(photoPath);

// SQL Config
const configPathFile = require("../pathToConfig.js"); // This way you can change config path for multiple files @ once
const configPath = configPathFile.pathFunc();
const config = require(configPath);
const sqlConfig = config.configFunc();

const currentTable = "users13";
const clientID = "26309264302-68ubosoca7b6g9vrvl9mu6gpa74044p6.apps.googleusercontent.com";
const workingTable = "facemash_clone_3";

// console.log(sqlConfig);

//app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.json());
app.use(express.static(__dirname + "/" + publicDir));
app.set("view engine", "ejs");
app.listen(3000);

// Create table of logged-in users, if not exists
sql.connect(sqlConfig, function (err) {
	let request = new sql.Request();
	
	let q = "if not exists (select * from sysobjects where name='" + currentTable + "' and xtype='U')" + " CREATE SEQUENCE dbo.MySequence" + currentTable + " START WITH 1 INCREMENT BY 1 NO CACHE;" + "CREATE TABLE dbo." + currentTable + " ([id] [bigint] PRIMARY KEY NOT NULL DEFAULT (NEXT VALUE FOR dbo.MySequence" + currentTable + "), [name] [nvarchar](64) NOT NULL, [email] [nvarchar](64) NOT NULL, [ip] [nvarchar](64) NOT NULL, [userid] [nvarchar](64) NOT NULL, [picture] [nvarchar](128) NOT NULL, [emailVerified] [nvarchar](32) NOT NULL, [tokenVerified] [nvarchar](32) NOT NULL, [exp] [int] NOT NULL);";
	request.query(q, function (err, recordset, result) {
		if (err){
			console.log("Users table already exists!");
			console.log(err);
		}else{
			console.log("Creating users table...");
			console.log(recordset);	
		} 
	});
});

// Create player/score table if not exists
sql.connect(sqlConfig, function (err) {
		if (err) console.log(err);
		let request = new sql.Request();
    
		let q = "if not exists (select * from sysobjects where name='" + workingTable + "' and xtype='U')" + " CREATE SEQUENCE dbo.MySequence" + workingTable + " START WITH 1 INCREMENT BY 1 NO CACHE;" + "CREATE TABLE dbo." + workingTable + " ([id] [bigint] PRIMARY KEY NOT NULL DEFAULT (NEXT VALUE FOR dbo.MySequence" + workingTable + "), [name] [nvarchar](64) NOT NULL, [score] [bigint] NOT NULL);";
		request.query(q, function (err, recordset, result) {
			if (err){
				// console.log(err);
			}else{
				console.log(recordset);	
				for (let item of obj) { // Make this only insert values that don't exist
					let q = "INSERT INTO dbo." + workingTable + " (id, name, score) VALUES (NEXT VALUE FOR dbo.MySequence" + workingTable + ", '" + item + "', " + Number(startingScore) + ");"; // Change this back if it fucks up
					request.query(q, function (err, recordset) {
						if (err){
							console.log(err);
						}else{
							console.log(recordset);
							console.log("Added " + item + " to database...");
						}
					});
				}
			} 
		});
});

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

// Get player scores from DB (DON'T use for keeping of score, but keep for other purposes):
let playerScoresObj = {};
let items = obj;
let scorePromises = items.map(async (item) => { 
	// console.log("Item: " + item);
	let q = "SELECT score FROM dbo." + workingTable + " WHERE name = '" + item +"'";
	await sql.connect(sqlConfig); 
	let request = new sql.Request();
	// console.log("Request [1]:", request.query(q));
	let theQuery = request.query(q);
	let result = theQuery;
	
	// request.close();
	return theQuery; // Why isn't the "await" here, instead of on sql.connect()?  Can I switch it, and it still work?
});

Promise.all(scorePromises).then(resultsArray => {
  return resultsArray.reduce((playerScoresObj, recordset, index) => {
    
	let key = items[index]; 
    playerScoresObj[key] = Number(recordset.recordset[0].score);
	

	// console.log("Updated " + winnerName + " score in database...");
    return playerScoresObj; 
  }, {})
}).then(newScoreObj => {
		console.log("Final Promise Result: ", newScoreObj);
		playerScoresObj = newScoreObj;
	}
);

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

app.get('/', function(req, res){
    res.sendFile('index.html', { root: __dirname + "/" } );
});

// app.get("/", function(req, res){
	// fs.readFile('index.html',function (err, data){
        // res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        // res.write(data);
        // res.end();
    // });
// });

app.get("/facemash", function(req, res){
	console.log("--------------- Initial Page Load ---------------------");
	
	playerOne = obj[getRandomIntInclusive(0, dlength)];
	playerOne = playerOne.substring(0, playerOne.length - 4);
	playerTwo = obj[getRandomIntInclusive(0, dlength)];
	playerTwo = playerTwo.substring(0, playerTwo.length - 4);
	
	while(playerOne === playerTwo){
		playerOne = obj[getRandomIntInclusive(0, dlength)];
		playerOne = playerOne.substring(0, playerOne.length - 4);
	}
	
	let playerOneFilename = playerOne + ".jpg"; 
	let playerTwoFilename = playerTwo + ".jpg";
	
	let aspectRatioP1 = playerAspectRatioObj[playerOne];
	let aspectRatioP2 = playerAspectRatioObj[playerTwo];
	
	let playerOneScore = 111;
	let playerTwoScore = 111;
	
	let q1 = "SELECT score FROM dbo." + workingTable + " WHERE name = '" + playerOneFilename +"'";
	let q2 = "SELECT score FROM dbo." + workingTable + " WHERE name = '" + playerTwoFilename +"'";
	
	let request = new sql.Request();
	
	console.log("Trying query: ", q1);
	request.query(q1, (err, result) => {
        console.dir(result);
		playerOneScore = result.recordset[0].score;
		
		console.log("Trying query: ", q2);
		request.query(q2, (err, result) => {
			console.dir(result);
			playerTwoScore = result.recordset[0].score;
			
			let newPlayers = []; newPlayers[0] = []; newPlayers[1] = [];
			
			let playerOneELO = (ELO(playerOneScore, playerTwoScore) * 100).toPrecision(4);
			let playerTwoELO = (ELO(playerTwoScore, playerOneScore) * 100).toPrecision(4);
	
			newPlayers[0][0] = playerOne;
			newPlayers[0][1] = playerOneFilename;
			newPlayers[0][2] = playerOneScore;
			newPlayers[0][3] = Number(playerOneELO);
			newPlayers[0][4] = aspectRatioP1;
	
			newPlayers[1][0] = playerTwo;
			newPlayers[1][1] = playerTwoFilename;
			newPlayers[1][2] = playerTwoScore;
			newPlayers[1][3] = Number(playerTwoELO);
			newPlayers[1][4] = aspectRatioP2;
			
			console.log(newPlayers);
		
			res.render("node-dopple-main", {newPlayers: newPlayers});
		})
	})
	
});

app.post("/submitPlayer", function(req, res){
	console.log("--------------- Button Clicked, Player Selected ---------------------");
	// Testing:
	// console.log("/submitPlayer");
	// let newBody = 0;
	// let body = [];
	// req.on('data', (chunk) => {
		// body.push(chunk);
	// }).on('end', () => {
		// body = Buffer.concat(body).toString();
		// console.log(JSON.parse(body));
		// console.log(body);
		// newBody = JSON.parse(body);
	// });
	// console.log(unserialized);
	// console.log("req.body: ", req.body);
	//console.log("playerScoresObj when /submitPlayer called: ", playerScoresObj);
	
	let unserialized = JSON.parse(req.body.playerName);
	let winner = unserialized[0].toString();
	let loser = unserialized[1].toString();
	let winnerDBName = winner + ".jpg";
	let loserDBName = loser + ".jpg";
	
	let items = [winnerDBName, loserDBName];
	
	let getOldScores = items.map(async (item) => {
		let q = "SELECT score FROM dbo." + workingTable + " WHERE name = '" + item +"'";
		console.log("Trying query: ", q);
		await sql.connect(sqlConfig); 
		let request = new sql.Request();
		console.log("request.query(q) [getOldScores]:", request.query(q));
		let theQuery = request.query(q);
		return theQuery;
	});
	
	Promise.all(getOldScores).then(resultsArray => {
		return resultsArray.reduce((oldScoresObj, recordset, index) => {
			let key = items[index];
			let titleName1 = "empty";
			let titleName2 = "empty";
			if(index === 1){
				titleName1 = "winnerOldScore";
				titleName2 = "winnerName";
			}else{
				titleName1 = "loserOldScore";
				titleName2 = "loserName";
			}
			oldScoresObj[titleName1] = Number(recordset.recordset[0].score);
			oldScoresObj[titleName2] = key;
			return oldScoresObj; 
		}, {})
	}).then(newScoreObj => {
		console.log("First Promise Result (getOldScores) (1): ", newScoreObj);
		
		let winnerOldScore = newScoreObj.winnerOldScore;
		let loserOldScore = newScoreObj.loserOldScore;
		
		let winnerName = newScoreObj.winnerName;
		let loserName = newScoreObj.loserName;
		
		let winnerELO = ELO(winnerOldScore, loserOldScore);
		let loserELO = ELO(loserOldScore, winnerOldScore);
		
		let winnerNewScore = winnerOldScore + (k * (1 - winnerELO));
		let loserNewScore = loserOldScore + (k * (0 - loserELO));
		
		let winnerNewELO = ELO(winnerNewScore, loserNewScore);
		let loserNewELO = ELO(loserNewScore, winnerNewScore);
		
		newScoreObj.loser = loser;
		newScoreObj.winner = winner;
		newScoreObj.winnerELO = winnerELO;
		newScoreObj.loserELO = loserELO;
		newScoreObj.winnerNewScore = winnerNewScore;
		newScoreObj.loserNewScore = loserNewScore;
		newScoreObj.winnerNewELO = winnerNewELO;
		newScoreObj.loserNewELO = loserNewELO;
		
		let items = [winner, loser];
		let updateScoresinDB = items.map(async (item, index) => {
			if(index === 0){
				scoreToInput = winnerNewScore;
			}else if(index === 1){
				scoreToInput = loserNewScore;
			}
			let q = "UPDATE dbo." + workingTable + " SET score = " + scoreToInput.toPrecision(4) + " OUTPUT INSERTED.* WHERE name = '" + item + "';";
			console.log("Trying query: ", q);
			await sql.connect(sqlConfig); 
			let request = new sql.Request();
			let theQuery = request.query(q);
			return newScoreObj;
		});
		
		Promise.all(updateScoresinDB).then(resultsArray => {
			console.log("resultsArray()", resultsArray);
			return resultsArray;
			}).then(finalPlayerObj => {
				console.log("Final Promise Result (updateScoresinDB) (2): ", finalPlayerObj);
	
				let playerArray = [];
				playerArray[0] = finalPlayerObj[0];
				console.log("playerArray[0]: ", playerArray[0]);
				let method = "";
				if(req.body.lockPlayer === "true"){
					playerArray[0].lockPlayer = true;
					method = "fixed";
				}else{
					playerArray[0].lockPlayer = false;
					method = "random";
				}
				
				let newPlayers = []; 
				newPlayers[0] = []; 
				newPlayers[1] = [];
				
				let playerOne = "";
				let playerTwo = "";
				let oldPlayer1 = winner;
				let oldPlayer2 = loser;
				
				if(method === "fixed"){
					playerOne = req.body.playerOneHidden.toString();
					playerTwo = req.body.playerTwoHidden.toString();
				}else if(method === "random"){
					playerOne = obj[getRandomIntInclusive(0, dlength)];
					playerOne = playerOne.substring(0, playerOne.length - 4);
					playerTwo = obj[getRandomIntInclusive(0, dlength)];
					playerTwo = playerTwo.substring(0, playerTwo.length - 4);
				
					while(oldPlayer1 === playerOne || oldPlayer2 === playerOne || playerOne === playerTwo){
						playerOne = obj[getRandomIntInclusive(0, dlength)];
						playerOne = playerOne.substring(0, playerOne.length - 4);
					}
					while(oldPlayer1 === playerTwo || oldPlayer2 === playerTwo || playerOne === playerTwo){
						playerTwo = obj[getRandomIntInclusive(0, dlength)];
						playerTwo = playerTwo.substring(0, playerTwo.length - 4);
					}
				}else if(method === ""){
					console.log("Method Check: ", "METHOD BLANK");
					exit();
				}
			
				let playerOneFilename = playerOne + ".jpg"; 
				let playerTwoFilename = playerTwo + ".jpg";
				
				let aspectRatioP1 = playerAspectRatioObj[playerOne];
				let aspectRatioP2 = playerAspectRatioObj[playerTwo];
				
				let q1 = "SELECT score FROM dbo." + workingTable + " WHERE name = '" + playerOneFilename +"'";
				let q2 = "SELECT score FROM dbo." + workingTable + " WHERE name = '" + playerTwoFilename +"'";
				
				let request = new sql.Request();
				
				console.log("Trying query (q1): ", q1);
				request.query(q1, (err, result) => {
					console.dir(result);
					let playerOneScore = result.recordset[0].score;
					console.log(playerOneScore);
					
					console.log("Trying query (q2): ", q2);
					request.query(q2, (err, result) => {
						console.dir(result);
						let playerTwoScore = result.recordset[0].score;

						let playerOneELO = (ELO(playerOneScore, playerTwoScore) * 100).toPrecision(4);
						let playerTwoELO = (ELO(playerTwoScore, playerOneScore) * 100).toPrecision(4);
				
						newPlayers[0][0] = playerOne;
						newPlayers[0][1] = playerOneFilename;
						newPlayers[0][2] = playerOneScore;
						newPlayers[0][3] = Number(playerOneELO);
						newPlayers[0][4] = aspectRatioP1;
						
						newPlayers[1][0] = playerTwo;
						newPlayers[1][1] = playerTwoFilename;
						newPlayers[1][2] = playerTwoScore;
						newPlayers[1][3] = Number(playerTwoELO);
						newPlayers[1][4] = aspectRatioP2;
				
						console.log("newPlayers in submitPlayer(): ", newPlayers);
				
						res.render("node-dopple-main", {playerArray: playerArray, newPlayers: newPlayers});
					})
				})
	
				
			});
	});
});

app.post("/resetScores", function(req, res){
	//console.log("Resetting Scores...");
	 
	// for (let key in playerScoresObj) {
		// playerScoresObj[key] = Number(startingScore);
		// console.log("Resetting score of " + key);
	// }
	
	// let playerArray = [];
	// playerArray[0] = {};
	// playerArray[0].resetPressed = true;
	// if(req.body.lockPlayer === "true"){
		// playerArray[0].lockPlayer = true;
	// }else{
		// playerArray[0].lockPlayer = false;
	// }
	
	// res.render("node-dopple-main", {playerArray: playerArray, newPlayers: newPlayers});
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