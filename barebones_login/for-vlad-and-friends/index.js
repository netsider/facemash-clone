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
//const config = require("../config.js");

//app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.json());

const publicDir = "files";

app.use(express.static(__dirname + "/" + publicDir));
app.set("view engine", "ejs");
app.listen(3000);

//const k = 32;
const startingScore = "1500";
//const scorePath = publicDir + "/Selfie_Score/";
//const photoPath = publicDir + "/Selfies/";
//const dlength = fs.readdirSync(photoPath).length - 1;
//const obj = fs.readdirSync(photoPath);

// const sqlConfig = config.configFunc();
const currentTable = "users13";
const clientID = "26309264302-68ubosoca7b6g9vrvl9mu6gpa74044p6.apps.googleusercontent.com";
// const workingTable = "facemash_clone_3";

console.log("Starting...");
	
app.get('/login', function(req, res){
    res.render("node-dopple-login", {});
});

app.get('/loggedin', function(req, res, next){ // Milddeware token vertification directly in express route/endpoint.
	console.log("/loggedin POST called...");
	
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
				// console.log("Keys from Request: ", newbody);

				let currentTime = Math.floor(Date.now() / 1000);
				
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

							let q = "BEGIN IF NOT EXISTS (SELECT 1 FROM dbo." + currentTable + " WHERE userid = " + body.sub + ") BEGIN INSERT INTO dbo." + currentTable + " (id, name, email, ip, userid, picture, emailVerified, tokenVerified, exp) OUTPUT INSERTED.* VALUES (NEXT VALUE FOR dbo.MySequence" + currentTable +", '" + body.name +"', '" + body.email +"', '" + userIP + "', '" + body.sub + "', '" + body.picture + "', '" + body.email_verified + "', '" + obj.tokenVerified + "', '" + body.exp + "') END END";
							//console.log("Trying query: ", q);
							//await sql.connect(sqlConfig); 
							let request = new sql.Request();
							// console.log("request.query(q) [insertUserIntoDB]:", request.query(q));
							let theQuery = request.query(q);
							console.log("Query Result:", theQuery);
							return theQuery;
						})();
						
						Promise.all([insertUserIntoDB]).then((values) => { // After promise fulfilled, send object we created earlier.
							console.log("Result after inserting user into DB: ", values);
							// res.json(obj); // Send object to browser
							console.log("Should be trying next() function: ");
							// FUCK JAVSSHIT
							// next();
							//return res.render("node-dopple-login-success", {});
							//return next(); // no error, continue to next function
							// res.redirect('/facemash'); // I knew this wouldn't work
							res.redirect('/loggedin');
						});
						
					}else{
						console.log("Token Failed Verification!");
					}
				}));
				
				//}
				
			} catch (error) {
				console.log("ERROR!");
				console.error(error.message);
			};
		});
	}).on("error", (error) => {
		console.log("ERROR!");
		console.error(error.message);
	});

	
	
}, function(req, res){
    return res.render("node-dopple-login-success", {});
});

