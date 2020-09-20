const http = require("http");
const fs = require("fs");
const express  = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

//app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.json());

const publicDir = "files";
app.use(express.static(__dirname + "/" + publicDir));
app.set("view engine", "ejs");
app.listen(3000);

console.log("Starting...");

app.get("/", function(req, res){
	fs.readFile('index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
});

app.get('/route1', function(req, res, next) {
  res.send('respond with a resource');
});

app.post("/route2", function(req, res){

});

app.get('/route3', function(req, res, next) {
  res.render('index', { title: 'Express' });
});