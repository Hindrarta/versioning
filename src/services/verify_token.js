function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization']
	
	if(typeof bearerHeader !== 'undefined') {
		const bearerToken = bearerHeader.split(' ')[1]
		
		req.token = bearerToken
		next();
	} else {
		//  Send Forbidden Message
		res.status(403).send({
			"message": "Please Insert Token",
		});
	}
}

module.exports = verifyToken