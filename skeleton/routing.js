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

app.get('/', function(req, res){
	fs.readFile('index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
});

app.get('/route1', function(req, res, next) {
  res.send('respond with a resource');
});

app.post('/route2', function(req, res){

});

app.get('/route3', function(req, res, next) {
  //res.render('index', { title: 'Express' });
});



// https://expressjs.com/en/guide/routing.html

app.get('/flights/:from-:to', function (req, res) { // http://localhost:3000/flights/LAX-SFO
  console.log(req.params); // { "userId": "34", "bookId": "8989" }
})


// An array of callback functions can handle a route
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

var cb2 = function (req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])

// More than one callback can handle a route:

app.get('/example/b', function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from B!')
})



// You can create chainable route handlers for a route path by using app.route()
// app.route('/book')
  // .get(function (req, res) {
    // res.send('Get a random book')
  // })
  // .post(function (req, res) {
    // res.send('Add a book')
  // })
  // .put(function (req, res) {
    // res.send('Update the book')
  // })