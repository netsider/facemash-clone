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
//const config = require("./config.js");

//app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.json());

const publicDir = "files";

app.use(express.static(__dirname + "/" + publicDir));
app.set("view engine", "ejs");
app.listen(3000);

const clientID = "26309264302-68ubosoca7b6g9vrvl9mu6gpa74044p6.apps.googleusercontent.com";


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

app.get('/login', function(req, res){
    res.render("login", {});
});

// const verify = require("./verifyToken");
// app.get('/loggedin', verify, function(req, res){
    // res.json({LoggedInAndVerified: Yes}):
// });

app.get('/loggedin', function(req, res){
	//Verify Token Logic goes here
	
	// next();
}, function(req, res){
    res.json({LoggedInAndVerified: Yes}):
});

app.post('/verifyToken', function(req, res){
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
				
				// See if there's any difference between #1 and #2
				
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
				}(jws.verify(req.body.userIDToken, JSON.parse(keysFromRequest)), function (result) { // (func, cb)
					
					let obj = {
						email: req.body.emailAddress,
						imageURL: req.body.imageURL,
						tokenVerified: result
					}
					
					console.log("obj from IFFE CB: ", obj);
							
					if(result === true && body.aud === clientID && body.iss === "accounts.google.com"){
						console.log("Token Verified!");
						
						console.log("Adding User to Database...");
						
						let insertUserIntoDB = (async function() {
							let userIP = req.headers['x-forwarded-for'];

							// let q = "BEGIN IF NOT EXISTS (SELECT 1 FROM dbo." + currentTable + " WHERE userid = " + body.sub + ") BEGIN INSERT INTO dbo." + currentTable + " (id, name, email, ip, userid, picture, emailVerified, tokenVerified, exp) VALUES (NEXT VALUE FOR dbo.MySequence" + currentTable +", '" + body.name +"', '" + body.email +"', '" + userIP + "', '" + body.sub + "', '" + body.picture + "', '" + body.email_verified + "', '" + obj.tokenVerified + "', '" + body.exp + "') END END";
							let q = "BEGIN IF NOT EXISTS (SELECT 1 FROM dbo." + currentTable + " WHERE userid = " + body.sub + ") BEGIN INSERT INTO dbo." + currentTable + " (id, name, email, ip, userid, picture, emailVerified, tokenVerified, exp) OUTPUT INSERTED.* VALUES (NEXT VALUE FOR dbo.MySequence" + currentTable +", '" + body.name +"', '" + body.email +"', '" + userIP + "', '" + body.sub + "', '" + body.picture + "', '" + body.email_verified + "', '" + obj.tokenVerified + "', '" + body.exp + "') END END";
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