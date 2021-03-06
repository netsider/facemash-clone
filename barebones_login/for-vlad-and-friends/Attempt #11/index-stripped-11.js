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
const cookieParser = require("cookie-parser");

// 1621747322
// 1621750922
// Diff = 

app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.json());
app.use(cookieParser());

const config = require("../config.js");
const publicDir = "files";

app.use(express.static(__dirname + "/" + publicDir));
app.set("view engine", "ejs");

const sqlConfig = config.configFunc();
const currentTable = "users13";
const clientID = "26309264302-68ubosoca7b6g9vrvl9mu6gpa74044p6.apps.googleusercontent.com";
const workingTable = "facemash_clone_3";

console.log("Starting...");
app.listen(3000);
	
app.get('/login', function(req, res){
	console.log("/login called");
	res.render("node-dopple-login-2", {});
});

app.post('/initialVerify', function(req, res, next){
	console.log("/initialVerify (POST) called...");
	
	https.get("https://www.googleapis.com/oauth2/v2/certs",(res2) => { // Get JWK keys
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
				
				let debugVAR = false;
				if(debugVAR === true){
					console.log("---------------------");
					console.log("req.query.id_token (from /initialVerify): ", req.query.id_token);
					console.log("---------------------");
					console.log("header (from /initialVerify): ", header);
					console.log("---------------------");
					console.log("body (from /initialVerify): ", body);
					console.log("---------------------");
					console.log("Keys from Request (from /initialVerify): ", newbody);
					console.log("---------------------");
				}
				
				(function IIFE(func, cb) { 
					if (func){
						cb(true);
					}else{
						cb(false);
					}
				}(jws.verify(req.body.userIDToken, JSON.parse(keysFromRequest)), function (result) {
					
					let obj = {
						email: req.body.emailAddress,
						// imageURL: req.body.imageURL,
						imageURL: body.picture, // Use the one from token (instead of the request) so user can't mess with it.
						tokenVerified: result
					}
					console.log("obj (from /initialVerify):", obj);
					
					
					console.log("Trying to verify...");
					if(result === true && body.aud === clientID && body.iss === "accounts.google.com"){
						console.log("Token Verified! (on /initialVerify)!");
						
						let insertUserIntoDB = (async function() {
							console.log("Adding User to Database...");
							let userIP = req.headers['x-forwarded-for'];

							let q = "BEGIN IF NOT EXISTS (SELECT 1 FROM dbo." + currentTable + " WHERE userid = " + body.sub + ") BEGIN INSERT INTO dbo." + currentTable + " (id, name, email, ip, userid, picture, emailVerified, tokenVerified, exp) OUTPUT INSERTED.* VALUES (NEXT VALUE FOR dbo.MySequence" + currentTable +", '" + body.name +"', '" + body.email +"', '" + userIP + "', '" + body.sub + "', '" + body.picture + "', '" + body.email_verified + "', '" + obj.tokenVerified + "', '" + body.exp + "') END END";
							// console.log("Trying Query: ", q);
							await sql.connect(sqlConfig); 
							let request = new sql.Request();
							// console.log("request.query(q) [insertUserIntoDB]:", request.query(q));
							let theQuery = request.query(q);
							// console.log("Query Result:", theQuery);
							return theQuery;
						})();
						
						Promise.all([insertUserIntoDB]).then((values) => {
							console.log("Result after inserting user into DB: ", values);
							// console.log("Trying next() function: ");
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
   res.set('Content-Type', 'application/json');
	// console.log("res.locals.obj: ", res.locals.obj);
	res.json(res.locals.obj);
});

app.get('/reVerifyAndLoadPage', function(req, res, next){
	console.log("/reVerifyAndLoadPage (GET) called...");
	
	https.get("https://www.googleapis.com/oauth2/v2/certs",(res2) => {
		let newbody = "";
		res2.on("data", (chunk) => {
			newbody += chunk;
		});
		res2.on("end", () => {
			try {
				// console.log("JSON.parse(body) (from /reVerifyAndLoadPage): ", JSON.parse(body));
				// console.log("req.query (from /reVerifyAndLoadPage): " + req.query);
				
				let parts = req.query.id_token.split('.');
				let headerBuf2 = new Buffer.from(parts[0], 'base64');
				let bodyBuf = new Buffer.from(parts[1], 'base64');
				let header = JSON.parse(headerBuf2.toString());
				let body = JSON.parse(bodyBuf.toString());
				let keysFromRequest = newbody;
				res.locals.id_token = req.query.id_token;
				
				let debugVAR = false;
				if(debugVAR === true){
					console.log("---------------------");
					console.log("req.query.id_token (from /reVerifyAndLoadPage): ", req.query.id_token);
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
				
				(function IIFE(func, cb) { 
					if (func){
						cb(true);
					}else{
						cb(false);
					}
				}(jws.verify(req.query.id_token, JSON.parse(keysFromRequest)), function (result) {
					console.log("Running verifcation process (on /reVerifyAndLoadPage)... ");
					let obj = {
						email: body.email,
						imageURL: body.picture,
						tokenVerified: result
					}
					
					console.log("obj (from /reVerifyAndLoadPage):", obj);
					console.log("Result is (from /reVerifyAndLoadPage): " + result);
					
					if(result === true && body.aud === clientID && body.iss === "accounts.google.com"){
						console.log("Token Verified! (/reVerifyAndLoadPage)");
						
						let insertUserIntoDB = (async function() {
							console.log("Adding User to Database...(from /reVerifyAndLoadPage)");
							let userIP = req.headers['x-forwarded-for'];

							let q = "BEGIN IF NOT EXISTS (SELECT 1 FROM dbo." + currentTable + " WHERE userid = " + body.sub + ") BEGIN INSERT INTO dbo." + currentTable + " (id, name, email, ip, userid, picture, emailVerified, tokenVerified, exp) OUTPUT INSERTED.* VALUES (NEXT VALUE FOR dbo.MySequence" + currentTable +", '" + body.name +"', '" + body.email +"', '" + userIP + "', '" + body.sub + "', '" + body.picture + "', '" + body.email_verified + "', '" + obj.tokenVerified + "', '" + body.exp + "') END END";
							console.log("Trying query (from /reVerifyAndLoadPage): ", q);
							await sql.connect(sqlConfig); 
							let request2 = new sql.Request();
							// console.log("request.query(q) [insertUserIntoDB] (from /reVerifyAndLoadPage):", request2.query(q));
							let theQuery2 = request2.query(q);
							// console.log("Query Result - theQuery2 - (from /reVerifyAndLoadPage):", theQuery2);
							return theQuery2;
						})();
						
						Promise.all([insertUserIntoDB]).then((values) => {
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
	
   console.log("Setting User Cookie...");
	res.cookie("user_cookie_id", res.locals.id_token);
	
	console.log("Trying to render node-dopple-login-success...(from /reVerifyAndLoadPage)");
	res.set('Content-Type', 'text/html');
	return res.render("node-dopple-login-success");
});

app.get("/private2", (req, res) => {
	console.log("/private2 (GET) called...");
	if (!req.cookies.user_cookie_id){
		console.log("Cookie not found!");
		return res.status(401).send();
	}
	
	https.get("https://www.googleapis.com/oauth2/v2/certs",(res2) => {
		let newbody = "";
		res2.on("data", (chunk) => {
			newbody += chunk;
		});
		res2.on("end", () => {	
			
			let id_token = req.cookies.user_cookie_id;
			let parts = id_token.split('.');
			let headerBuf2 = new Buffer.from(parts[0], 'base64');
			let bodyBuf = new Buffer.from(parts[1], 'base64');
			let header = JSON.parse(headerBuf2.toString());
			let body = JSON.parse(bodyBuf.toString());
			let keysFromRequest = newbody;
			
			let debugVAR = true;
			if(debugVAR === true){
				console.log("---------------------");
				console.log("parts:", parts);
				console.log("---------------------");
				console.log("header (from /P2): ", header);
				console.log("---------------------");
				console.log("body (from /P2): ", body);
				console.log("---------------------");
				console.log("Keys from Request (from /P2): ", JSON.parse(newbody));
				console.log("---------------------");
				console.log("Current Time (/P2): ", Math.floor(Date.now() / 1000));
				console.log("---------------------");
			}
			
			(function IIFE(func, cb) {
				if (func){
					cb(true);
				}else{
					cb(false);
				}
			}(jws.verify(req.cookies.user_cookie_id, JSON.parse(keysFromRequest)), function (result) {
				console.log("Running verifcation process (on /P2)... ");
				let obj = {
					email: body.email,
					imageURL: body.picture,
					tokenVerified: result
				}
					
				console.log("obj (from /P2):", obj);
				
				if(result === true && body.aud === clientID && body.iss === "accounts.google.com"){
					console.log("Token Verified (Server Side) (from /P2)!");
					
					if(checkTime(body.exp) === true){
						console.log("Rendering secure page...");
						res.set('Content-Type', 'text/html');
						// Why can't I just set a cookie with a new id token each time, right here?  Can I? (instead of doing it via AJAX?).  It would make a lot more sense just to do it right here, now that I think about it.
						return res.render("node-dopple-login-success-2", {});
					}else{
						console.log("Token passed verification, but is expired!");	
						return res.status(401).send();
					}
						
				}else{
					console.log("Token Failed Verification! (from /P2)");
					return res.status(401).send();
				}
			}));	
		});
	});
});

app.post("/refreshToken", function (req, res) { // Figure out how to do it this way
	console.log("/refeshToken called...");
	
	https.get("https://www.googleapis.com/oauth2/v2/certs", (res2) => {
		let newbody = "";
		res2.on("data", (chunk) => {
			newbody += chunk;
		});
		res2.on("end", () => {
			console.log("Got keys (on /refeshToken)");
		
			let parts = req.body.userIDToken.split('.');
			let headerBuf2 = new Buffer.from(parts[0], 'base64');
			let bodyBuf = new Buffer.from(parts[1], 'base64');
			let header = JSON.parse(headerBuf2.toString());
			let body = JSON.parse(bodyBuf.toString());
			let keysFromRequest = newbody;
			
			let debugVAR = true;
			if(debugVAR === true){
				console.log("---------------------");
				console.log("parts:", parts);
				console.log("---------------------");
				console.log("header (from /refeshToken): ", header);
				console.log("---------------------");
				console.log("body (from /refeshToken): ", body);
				console.log("---------------------");
				console.log("Keys from Request (from /refeshToken): ", newbody);
				console.log("---------------------");
			}
			
			console.log("Trying verification (on /refeshToken)...");
			(function IIFE(func, cb) {
				if (func){
					cb(true);
				}else{
					cb(false);
				}
			}(jws.verify(req.body.userIDToken, JSON.parse(keysFromRequest)), function (result) {
				console.log("Running verifcation process (on /refeshToken)... ");
				console.log("Result is (from /refreshToken): " + result);
				
				if(result === true && body.aud === clientID && body.iss === "accounts.google.com"){
					console.log("Token Verified (on /refeshToken)!");
					
					if(checkTime(body.exp) === true){ // issue new token
						console.log("Token passed Verification (on /refeshToken).");
						let obj = {
							email: body.email,
							imageURL: body.picture,
							tokenVerified: true,
							id_token: req.body.userIDToken
						}
						console.log("obj (from /refeshToken):", obj);
						res.set('Content-Type', 'application/json');
						return res.json(obj);
					}else{ // don't issue new token
						console.log("Token passed verification, BUT IS EXPIRED! (on /refeshToken)");
						return res.status(467).send();
					}
				}else{
					console.log("Token Failed JWS Verification! (from /refeshToken)");
					return res.status(467).send();
				}
			}));			
		});
	});
});

app.get("/getcookies", function (req, res) {
    res.send(req.cookies);
});

// Functions
function checkTime(t){
	if(t >= Math.floor(Date.now() / 1000)){
		return true;
	}else{
		return false;
	}
};

// Removed Code: ---------

// res.writeHead(200, { // find out how to do it this way
// "Set-Cookie": "user_cookie_id=" + id_token + "; HttpOnly",
// "Access-Control-Allow-Credentials": "true"
// }).send(); 


// Array.from(Object.keys(obj)).forEach(function(key){
// console.log("obj (from /initialVerify):" + key + ":" + obj[key]);
// });
// console.log("Result is (from /initialVerify): " + result);


// app.get("/private", (req, res) => { // works if cookie set, but doesn't revalidate token (insecure).
  // if (!req.cookies.user_cookie_id) return res.status(401).send();
  // res.render("node-dopple-login-success-2", {});
// });


// app.get("/anotherPage", function(req, res, next){ // Secure page to stay logged in for
	// console.log("/anotherPage called...");
// }, function(req, res){
	// res.render("node-dopple-login-3", {});
// });