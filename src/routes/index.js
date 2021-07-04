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
	let date_obj = new Date()
	res.send({
		'title':'Template Node JS Apps',
		'version':process.env.APP_VERSION,
		'message':`This is version ${process.env.APP_VERSION} of testing`,
		'datetime':date_obj.toLocaleDateString()
	})
})

module.exports = {
	token
}