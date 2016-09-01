const jwt = require('jwt-simple');

const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
	const timestamp = new Date().getTime();
	return jwt.encode({sub: user._id, iat: timestamp}, config.secret);
}

exports.signup = function(req, res, next){
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) res.status(422).send({error: 'You must provide email and password'});

	User.findOne({email: email}, function(err, user){
		if (err) return next(err);
		if (user) return res.status(422).send({error: 'Email is in use'});

				
		const newUser = new User({
			email: email,
			password: password
		});

		newUser.save(function(err){
			if (err) return next(err);
			res.json({token: tokenForUser(newUser)});
		});
	});
}

exports.signin = function(req, res, next){
	console.log('signin');
	res.send({token: tokenForUser(req.user)});
}