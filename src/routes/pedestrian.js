const express = require('express')
let router = express.Router()

const auth = require('./../services/verify_token')
const jwt = require('jsonwebtoken')
const get_data = require('./../services/get_people_density_data')
const globalVar = require('./../globalVar')

router.get('/peopleData', auth, (req,res) => {
	let secretkey = process.env.SECRET_KEY
	let data = get_data.getPeopleDensity()
	try {
		jwt.verify(req.token, secretkey, (err, authD) => {
			if (err) {
				res.status(403).send({
					'message':'JWT Verify Error, Token Invalid',
					'err':err
				})
			} else {
				
				res.status(200).send({
					"message": "JWT Auth Successfull, GET peopleData",
					"data": {
						'peopleCount':data.peopleCount,
						'peopleDensity':data.peopleDensity,
					}
				});
			}	
		})
	} catch (err) {
		res.status(500).send({
			"message": "Error GET /peopleData",
			"err": err
		});
	}
})

router.get('/getPeopleData', auth, (req,res) => {
	let secretkey = process.env.SECRET_KEY
	
	try {
		jwt.verify(req.token, secretkey, (err, authD) => {
			if (err) {
				res.status(403).send({
					'message':'JWT Verify Error, Token Invalid',
					'err':err
				})
			} else {
				res.status(200).send({
					"message": "JWT Auth Successfull, GET peopleData",
					"data": {
						'peopleCount_L1': globalVar.peopleCount_L1,
						'peopleDensity_L1': globalVar.peopleDensity_L1,
						'peopleCount_L2': globalVar.peopleCount_L2,
						'peopleDensity_L2': globalVar.peopleDensity_L2,
					}
				});
			}	
		})
	} catch (err) {
		res.status(500).send({
			"message": "Error GET /getPeopleData",
			"err": err
		});
	}
})

router.post('/setPeopleData', auth, (req,res) => {
	let secretkey = process.env.SECRET_KEY

	try {
		jwt.verify(req.token, secretkey, (err, authD) => {
			if (err) {
				res.status(403).send({
					'message':'JWT Verify Error, Token Invalid',
					'err':err
				})
			} else {
				globalVar.peopleCount_L1 = req.body.peopleCount_L1
				globalVar.peopleCount_L2 = req.body.peopleCount_L2
				globalVar.peopleDensity_L1 = get_data.convertDensity(globalVar.peopleCount_L1)
				globalVar.peopleDensity_L2 = get_data.convertDensity(globalVar.peopleCount_L2)

				res.status(200).send({
					"message": "JWT Auth Successfull, POST setPeopleData",
					"data": {
						'peopleCount_L1': globalVar.peopleCount_L1,
						'peopleDensity_L1': globalVar.peopleDensity_L1,
						'peopleCount_L2': globalVar.peopleCount_L2,
						'peopleDensity_L2': globalVar.peopleDensity_L2,
					}
				});
			}	
		})
	} catch (err) {
		res.status(500).send({
			"message": "Error POST /setPeopleData",
			"err": err
		});
	}

})

router.get('/', (req, res) => {
	try {
		res.status(200).send({
			"message":"to get people density and people count data : URL/pedestrian/peopleData"
		})
	} catch (error) {
		res.status(500).send({
			"message": "Get Status Error"
		});
	}
})

module.exports = router