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
const config = require("../config.js");

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

console.log("Starting...");
	
app.get('/login', function(req, res){
	console.log("/login called");
	res.render("node-dopple-login-2", {});
});

app.post('/initialVerify', function(req, res, next){ // Milddeware token vertification directly in express route/endpoint.
	console.log("/initialVerify POST called...");
	
	// Get JWK Keys and perform token verifcation
	https.get("https://www.googleapis.com/oauth2/v2/certs",(res2) => {
		let newbody = "";
		res2.on("data", (chunk) => {
			newbody += chunk;
			// console.log("body: ", body);
		});
		res2.on("end", () => {
			try {
				
				let parts = req.body.userIDToken.split('.');
				let headerBuf = new Buffer.from(parts[0], 'base64');
				let bodyBuf = new Buffer.from(parts[1], 'base64');
				let header = JSON.parse(headerBuf.toString());
				let body = JSON.parse(bodyBuf.toString());
				let keysFromRequest = newbody;
				
				let debugVAR = true;
				
				// Display User ID Token
				if(debugVAR === true){
					console.log("req.params (from /initialVerify): ", req.params);
					console.log("---------------------");
					console.log("header (from /initialVerify): ", header);
					console.log("---------------------");
					console.log("body (from /initialVerify): ", body);
					console.log("---------------------");
					console.log("Keys from Request (from /initialVerify): ", newbody);
					console.log("---------------------");
				}
				let currentTime = Math.floor(Date.now() / 1000);
				
				(function IIFE(func, cb) { 
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
					
					console.log("obj (from /initialVerify):", obj);
					// Array.from(Object.keys(obj)).forEach(function(key){
						// console.log("obj (from /initialVerify):" + key + ":" + obj[key]);
					// });
					// console.log("Result is (from /initialVerify): " + result);
					
					console.log("Trying to verify...");
					if(result === true && body.aud === clientID && body.iss === "accounts.google.com"){
						console.log("Token Verified (Server Side)!");
						
						let insertUserIntoDB = (async function() {
							console.log("Adding User to Database...");
							// let userIP = req.headers['x-forwarded-for'];
							let userIP = '5.5.5.5';

							let q = "BEGIN IF NOT EXISTS (SELECT 1 FROM dbo." + currentTable + " WHERE userid = " + body.sub + ") BEGIN INSERT INTO dbo." + currentTable + " (id, name, email, ip, userid, picture, emailVerified, tokenVerified, exp) OUTPUT INSERTED.* VALUES (NEXT VALUE FOR dbo.MySequence" + currentTable +", '" + body.name +"', '" + body.email +"', '" + userIP + "', '" + body.sub + "', '" + body.picture + "', '" + body.email_verified + "', '" + obj.tokenVerified + "', '" + body.exp + "') END END";
							console.log("Trying query: ", q);
							await sql.connect(sqlConfig); 
							let request = new sql.Request();
							console.log("request.query(q) [insertUserIntoDB]:", request.query(q));
							let theQuery = request.query(q);
							console.log("Query Result:", theQuery);
							return theQuery;
						})();
						
						Promise.all([insertUserIntoDB]).then((values) => { // After promise fulfilled, send object we created earlier.
							console.log("Result after inserting user into DB: ", values);
							console.log("Trying next() function: ");
							res.locals.obj = obj;
							return next();
						});
						
					}else{
						console.log("Token Failed Verification!");
					}
				}));
				
			} catch (error) {
				console.error(error.message);
				console.log("ERROR 1!");
			};
		});
	}).on("error", (error) => {
		console.error(error.message);
		console.log("ERROR 2!");
	});

}, function(req, res){
	console.log("Next function successfully called! (from /initialVerify)");
	console.log("Trying to render node-dopple-login-success (from /initialVerify)...");
   res.set('Content-Type', 'application/json');
	// console.log("res.locals.obj: ", res.locals.obj);
	res.json(res.locals.obj); // Return JSON to satisfy XHR request.
});



app.get('/reVerifyAndLoadPage', function(req, res, next){ // Milddeware token vertification directly in express route/endpoint.
	console.log("/reVerifyAndLoadPage GET called...");
	
	// Get JWK Keys and perform token verifcation
	https.get("https://www.googleapis.com/oauth2/v2/certs",(res2) => {
		let newbody = "";
		res2.on("data", (chunk) => {
			newbody += chunk;
			// console.log("body: ", body);
		});
		res2.on("end", () => {
			try {
				// console.log("JSON.parse(body) (from /reVerifyAndLoadPage): ", JSON.parse(body));
				// console.log("req.query (from /reVerifyAndLoadPage): " + req.query);
				
				// let parts = req.body.userIDToken.split('.');
				let parts = req.query.id_token.split('.');
				let headerBuf2 = new Buffer.from(parts[0], 'base64');
				let bodyBuf = new Buffer.from(parts[1], 'base64');
				let header = JSON.parse(headerBuf2.toString());
				let body = JSON.parse(bodyBuf.toString());
				let keysFromRequest = newbody;
				let IDTOKEN = req.query.id_token;
				
				let debugVAR = true;
				
				// Display User ID Token
				if(debugVAR === true){
					console.log("---------------------");
					console.log("req.params (from /reVerifyAndLoadPage): ", req.params);
					console.log("---------------------");
					console.log("parts:", parts);
					console.log("---------------------");
					console.log("header (from /reVerifyAndLoadPage): ", header);
					console.log("---------------------");
					console.log("body (from /reVerifyAndLoadPage): ", body);
					console.log("---------------------");
					console.log("Keys from Request (from /reVerifyAndLoadPage): ", newbody);
					console.log("---------------------");
				}
				let currentTime = Math.floor(Date.now() / 1000);
				
				(function IIFE(func, cb) { 
					if (func){
						cb(true);
					}else{
						cb(false);
					}
				// }(jws.verify(req.body.userIDToken, JSON.parse(keysFromRequest)), function (result) {
				}(jws.verify(IDTOKEN, JSON.parse(keysFromRequest)), function (result) {
					console.log("Running verifcation process (on /reVerifyAndLoadPage)... ");
					let obj = {
						// email: req.body.emailAddress,
						email: body.email,
						// imageURL: body.imageURL,
						imageURL: body.picture,
						tokenVerified: result
					}
					
					// Array.from(Object.keys(obj)).forEach(function(key){
						// console.log("obj (from /reVerifyAndLoadPage):" + key + ":" + obj[key]);
					// });
					
					console.log("obj (from /reVerifyAndLoadPage):", obj);
					console.log("Result is (from /reVerifyAndLoadPage): " + result);
					
					if(result === true && body.aud === clientID && body.iss === "accounts.google.com"){
						console.log("Token Verified (Server Side) (from /reVerifyAndLoadPage)!");
						
						let insertUserIntoDB = (async function() {
							console.log("Adding User to Database...(from /reVerifyAndLoadPage)");
							let userIP = req.headers['x-forwarded-for'];
							// let userIP = "5.5.5.5";

							let q = "BEGIN IF NOT EXISTS (SELECT 1 FROM dbo." + currentTable + " WHERE userid = " + body.sub + ") BEGIN INSERT INTO dbo." + currentTable + " (id, name, email, ip, userid, picture, emailVerified, tokenVerified, exp) OUTPUT INSERTED.* VALUES (NEXT VALUE FOR dbo.MySequence" + currentTable +", '" + body.name +"', '" + body.email +"', '" + userIP + "', '" + body.sub + "', '" + body.picture + "', '" + body.email_verified + "', '" + obj.tokenVerified + "', '" + body.exp + "') END END";
							console.log("Trying query (from /reVerifyAndLoadPage): ", q);
							await sql.connect(sqlConfig); 
							let request2 = new sql.Request();
							console.log("request.query(q) [insertUserIntoDB] (from /reVerifyAndLoadPage):", request2.query(q));
							let theQuery2 = request2.query(q);
							console.log("Query Result - theQuery2 - (from /reVerifyAndLoadPage):", theQuery2);
							return theQuery2;
						})();
						
						Promise.all([insertUserIntoDB]).then((values) => { // After promise fulfilled, send object we created earlier.
							console.log("Result after inserting user into DB (from /reVerifyAndLoadPage): ", values);
							console.log("Trying next() function (from /reVerifyAndLoadPage): ");
							return next();
						});
						
					}else{
						console.log("Token Failed Verification! (from /reVerifyAndLoadPage)");
					}
				}));
				
			} catch (error) {
				console.error(error.message);
				console.log("ERROR 3!");
			};
		});
	}).on("error", (error) => {
		console.error(error.message);
		console.log("ERROR 4!");
	});

}, function(req, res){
	console.log("Next function successfully called! (from /reVerifyAndLoadPage)");
	console.log("Trying to render node-dopple-login-success...(from /reVerifyAndLoadPage)");
   res.set('Content-Type', 'text/html');
	return res.render("node-dopple-login-success");
	res.render("node-dopple-login-success");
});