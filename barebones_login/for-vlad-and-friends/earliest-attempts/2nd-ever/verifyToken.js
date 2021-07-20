// const jwt = require("jsonwebtoken");

// THIS HAS ACCESS TO REQ AND RES (SINCE IT'S MIDDLEWARE), WHICH IS WHY THIS WORKS.


module.exports = function(req, res, next) {

	// const token = req.header('auth-token');		
	// if (!token) return res.status(401).send('Access Denied');

	const tokenVerified = true;

	if (tokenVerified === true){
		next();
	}else{
		res.status(400).send('Invalid Token');
	}
	

};