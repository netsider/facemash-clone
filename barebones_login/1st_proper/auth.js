const router = require('express').Router();
console.log("auth.js");

router.post('/register', (req, res) => {
	res.send('Register');
});

router.post('/login', (req, res) => {
	router.post('/login');
});


module.exports = router;