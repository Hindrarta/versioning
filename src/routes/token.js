const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

router.get('/jwt', (req, res) => {
	let username = process.env.JWT_USERNAME || 'iot'
	let password = process.env.JWT_PASSWORD || 'iot1234'
	let secretkey = process.env.SECRET_KEY
	
	let iss = process.env.ISS;
	let sub = process.env.SUB;
	let aud = process.env.AUD;
	let exp = process.env.EXP;
	let algorithms = process.env.ALG_TOKEN;
	let payload = {
		issuer: iss,
		subject: sub,
		audience: aud,
		expiresIn: exp,
		algorithm: algorithms,
	}
	let p_username = req.body.username;
	let p_password = req.body.password;
	
	if(p_username == username && p_password == password) {
		jwt.sign(payload, secretkey, (err, token) => {
			res.json({
				"status":true,
				"message":"Login Successfull",
				"type":"Bearer Token",
				"token":token
			})
		})
	} else {
		res.send({
			"status":false,
			"message":"Wrong Username or Password",
		})
	}
})

module.exports = router