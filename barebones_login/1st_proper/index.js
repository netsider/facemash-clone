const express = require('express');

const app = express();

// const mongoose = require('mongoose');

//Connect to DB

// mongoose.connect('mongodb+srv://deved:rhino11@clustero-huueb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true },
	// () => console.log('connected to db!')
// );

//Import Routes
const authRoute = require("./auth");
const postRoute = require("./posts");

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen (3000, () => console.log('Server Up and running'));