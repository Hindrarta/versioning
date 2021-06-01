const express = require('express')
let app = express()

const port = process.env.APP_PORT || 3000

app.listen(port, () => {
	console.log(`App listening at port ${port}`)
})

app.use(express.json())

const token = require('./token')
app.use('/auth', token)

app.get('/', (req, res) => {
	res.send({
		'title':'Template Node JS Apps',
		'version':process.env.APP_VERSION,
		'message':'This is version 1.0.0 of testing'
	})
})

module.exports = {
	token
}