// Facemash-clone
// Made by Russell Rounds
// Version 0.5 - Promises Version

// To Do:
// Make NodeJS SQL Server skeleton/template
// Make app not use in-memory score object, and only rely on DB
// Make generatePlayers read from DB
// Finish making main route a chain of promises.
// Fix NaN issue by reading score from DB.

// Login Flow:
// Script included on page, which renders Login with Google button.
// After users signs in, success function is called, which makes XHR request to /verifyToken express route on server
// Token is then verified on server
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
const config = require("./config.js");

//app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.json());

const publicDir = "files";

app.use(express.static(__dirname + "/" + publicDir));
app.set("view engine", "ejs");
app.listen(3000);

const k = 32;
const startingScore = "1500";
const scorePath = publicDir + "/Selfie_Score/";
const photoPath = publicDir + "/Selfies/";
const dlength = fs.readdirSync(photoPath).length - 1;
const obj = fs.readdirSync(photoPath);

const sqlConfig = config.configFunc();
const currentTable = "users13";
const clientID = "26309264302-68ubosoca7b6g9vrvl9mu6gpa74044p6.apps.googleusercontent.com";
const workingTable = "facemash_clone_3";

// console.log(sqlConfig);

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
	
	let playerOneScore = 777;
	let playerTwoScore = 777;
	
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
				
				// let tempWinner = winner;
				// let tempLoser = loser;
				
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
	// let newPlayers = [];
	// playerArray[0].resetPressed = true;
	// if(req.body.lockPlayer === "true"){
		// playerArray[0].lockPlayer = true;
	// }else{
		// playerArray[0].lockPlayer = false;
	// }
	
	// res.render("node-dopple-main", {playerArray: playerArray, newPlayers: newPlayers});
});

app.get('/login', function(req, res){
    res.render("node-dopple-login", {});
});

app.post("/verifyToken", function(req, res){
	console.log("Received request with token data...");
	
	// console.log(req.data);
	// console.log(req.body);
	// console.log(JSON.parse(body));
	// console.log("req.body.userIDToken: " + req.body.userIDToken);
	// console.log("req.body.imageURL: " + req.body.imageURL);
	// console.log("req.body.emailAddress: " + req.body.emailAddress);
	
	// Get JWK Keys and perform token verifcation
	https.get("https://www.googleapis.com/oauth2/v2/certs",(res2) => {
		let newbody = "";
		res2.on("data", (chunk) => {
			newbody += chunk;
			// console.log("body: ", body);
		});
		res2.on("end", () => {
			try {
				// console.log(JSON.parse(body));
				
				let parts = req.body.userIDToken.split('.');
				let headerBuf = new Buffer.from(parts[0], 'base64');
				let bodyBuf = new Buffer.from(parts[1], 'base64');
				let header = JSON.parse(headerBuf.toString());
				let body = JSON.parse(bodyBuf.toString());
				
				let keysFromRequest = newbody;
				
				// Display User ID Token
				console.log("header: ", header);
				console.log("body: ", body);
				
				// Keys from server
				console.log("Keys from Request: ", newbody);
				
				
				let currentTime = Math.floor(Date.now() / 1000);
				
				console.log("Current time: ", currentTime);
				console.log("Expires on  : ", body.exp);
				
				// sendInitialVerifyRequest(jws.verify(req.body.userIDToken, JSON.parse(keysFromRequest)), sendVerifyRequest); // Way #1 (Which is the best way???)
				
				// sendInitialVerifyRequest(jws.verify(req.body.userIDToken, JSON.parse(keysFromRequest)), function (result) {  // Way #2
					// let obj = {
						// email: req.body.emailAddress,
						// imageURL: req.body.imageURL,
						// tokenVerified: result
					// }
					// console.log("Sending request...");
					// console.log(obj);
					// res.json(obj);
				// });
				
				(function IIFE(func, cb) { // Way #3 (probably the best way)
					if (func){
						cb(true);
					}else{
						cb(false);
					}
				}(jws.verify(req.body.userIDToken, JSON.parse(keysFromRequest)), function (result) {
					
					let obj = {
						email: req.body.emailAddress,
						imageURL: req.body.imageURL,
						tokenVerified: result
					}
							
					if(result === true && body.aud === clientID && body.iss === "accounts.google.com"){
						console.log("Token Verified!");
						
						console.log("Adding User to Database...");
						
						let insertUserIntoDB = (async function() {
							let userIP = req.headers['x-forwarded-for'];

							let q = "BEGIN IF NOT EXISTS (SELECT 1 FROM dbo." + currentTable + " WHERE userid = " + body.sub + ") BEGIN INSERT INTO dbo." + currentTable + " (id, name, email, ip, userid, picture, emailVerified, tokenVerified, exp) VALUES (NEXT VALUE FOR dbo.MySequence" + currentTable +", '" + body.name +"', '" + body.email +"', '" + userIP + "', '" + body.sub + "', '" + body.picture + "', '" + body.email_verified + "', '" + obj.tokenVerified + "', '" + body.exp + "') END END";
							console.log("Trying query: ", q);
							await sql.connect(sqlConfig); 
							let request = new sql.Request();
							// console.log("request.query(q) [insertUserIntoDB]:", request.query(q));
							let theQuery = request.query(q);
							return theQuery;
						})();
						
						Promise.all([insertUserIntoDB]).then((values) => { // After promise fulfilled, send object we created earlier.
							console.log("Result after inserting user into DB: ", values);
							res.json(obj); // Send object to browser
							// res.redirect('/facemash'); // I knew this wouldn't work
						});
						
					}else{
						console.log("Token Failed Verification!");
					}
				}));
				
				function Final(func, cb){
					if (func){
						cb(true);
					}else{
						cb(false);
					}
				}
				// Final(jws.verify(req.body.userIDToken, JSON.parse(keysFromRequest)), sendVerifyRequest); // Way #4
				
				function Final2(func){
					let result = false;
					if (func){
						result = true;
					}else{
						result = false;
					}
					let obj = {
						email: req.body.emailAddress,
						imageURL: req.body.imageURL,
						tokenVerified: result
					}
					console.log("Sending request...");
					console.log(obj);
					res.json(obj);
				}
				// Final2(jws.verify(req.body.userIDToken, JSON.parse(keysFromRequest))); // Way #5 (This might be okay too)
				
				// if (jws.verify(req.body.userIDToken, JSON.parse(keysFromRequest))){ // Way #6
					// console.log("Token VERIFIED!");
					// sendVerifyRequest(true);
				// }else{
					// console.log("Token NOT verified!");
					// sendVerifyRequest(false);
				// }
				
			} catch (error) {
				console.error(error.message);
			};
		});
	}).on("error", (error) => {
		console.error(error.message);
	});
	
	function sendInitialVerifyRequest (func, callback) {
		if (func){
			callback(true); // Why does this *NOT* work?
			// sendVerifyRequest(true); // BUT THIS *DOES*? (see function below this one)
		}else{
			callback(false);
			// sendVerifyRequest(false);
		}
		// callback(func); // This also **doesn't** work under any conditions (func returns true when successful).
	}
	
	function sendVerifyRequest (result) {
		let obj = {
			email: req.body.emailAddress,
			imageURL: req.body.imageURL,
			tokenVerified: result
		}
		// console.log("Sending request...");
		// console.log(obj);
		res.json(obj);
	}
	
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