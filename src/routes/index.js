const express = require('express')
let app = express()

const port = process.env.APP_PORT || 3000

app.listen(port, () => {
	console.log(`App listening at port ${port}`)
})

app.use(express.json())

const token = require('./token')
app.use('/auth', token)

const pedestrian = require('./pedestrian')
app.use('/pedestrian', pedestrian)

app.get('/', (req, res) => {
	res.send({
		'title':'DTC Backend Dummy Data',
		'version':process.env.APP_VERSION
	})
})

module.exports = {
	token, 
	pedestrian
}