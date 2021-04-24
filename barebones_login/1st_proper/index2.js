const express = require('express');

// const mongoose = require('mongoose');

//Connect to DB

// mongoose.connect('mongodb+srv://deved:rhino11@clustero-huueb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true },
	// () => console.log('connected to db!')
// );

//Import Routes
const authRoute = require("./auth");
const postRoute = require("./posts");

const verify = require("./verifyToken");

// Route Middlewares
// app.use('/', authRoute);
// app.use('/', postRoute);

// app.post('/register', (req, res) => {
	// res.send('Register');
// });

// app.post('/login', (req, res) => {
	// app.post('/login');
// });

express.get('/posts', verify, (req, res) => {

	res.json({
		posts: {
		title: 'my first post',
		description: 'random data you shouldnt access'
		}
	});

});

express.get('/posts2', (req, res) => {

	res.json({
		posts: {
		title: 'my first post',
		description: 'random data you shouldnt access'
		}
	});

});

app.listen (3000, () => console.log('Server Up and running'));

// https://pasteboard.co/JWDOWT6.png -- Seems to be working, or at least without error.