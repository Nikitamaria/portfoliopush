const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const validator = require('validator')
const mongoose = require('mongoose');
const Enquiry = mongoose.model('Enquiry', {
	name: String,
	email: String,
	phone: String,
	message: String
});

mongoose.connect('mongodb://localhost/contact_form');
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/contact', (req, res) => {
	const { name, email, phone, message } = req.body

	const enquiry = new Enquiry({
		name,
		email,
		phone,
		message
	})

	if (!name) {
		return res.status(422).send('Missing name')
	}
	if (!email) {
		return res.status(422).send('Missing email')
	}
	if (!phone) {
		return res.status(422).send('Missing phone')
	}
	if (!message) {
		return res.status(422).send('Missing message')
	}

	if (!validator.isEmail(email)) {
		return res.status(422).send('Invalid email')
	}

	if (!/^[0-9 -]*$/.test(phone) && !/([0-9][ -]*) {8-}/.test(phone)) {
		return res.status(422).send('Invalid phone')
	}

	enquiry.save().then(() => {
		res.send('Thank you for your message. I will get back to you soon!')
	}).catch((err) => {
		res.status(500).send(`Something went wrong: ${err}`)
	});
})

app.get('/enquiries', (req, res) => {
	Enquiry.find(function (err, enquiries) {
		if (err) return console.error(err);
		console.log(enquiries);
		let output = `<script src="vendor/jquery/jquery.min.js"></script>
			<script>
				function removeEnquiry(id) {
						$.get("/enquiries/" + id + "/delete", function() {
							$("#" + id).remove()
						})
						.fail(function (error) {
							alert("fail!")
						})
				}
			</script>
		`
		for (let i = 0; i < enquiries.length; i++) {
			const e = enquiries[i]
			output += `<div id="${e._id}">Enquiry from <a href="mailto:${e.email}"><strong>${e.name}</strong></a>: <i>${e.message} </i><button onClick="removeEnquiry('${e._id}')">-</button><br></div>`;
		}
		res.send(output);
	})
});

app.get('/enquiries/:id/delete', (req, res) => {
	Enquiry.findById(req.params.id, (err, enquiry) => {
		if (err) {
			return res.status(500).send('500 Internal Server Error' + err)
		}
		res.send('Enquiry removed')

		if (enquiry) {
			enquiry.remove()
		}
	})
})

app.use('/', express.static('../client'))
app.get('/hello-world', (req, res) => res.send('Hello World!'))
app.get('*', (req, res) => res.send('page does not exist'))
app.listen(3000, '0.0.0.0', () => console.log('Example app listening on port 3000! uwu!'))

//0.0.0.0 is a special ip address which listens on all devices~! That also includes a phone!
//const is like var: except you can't reassign again - this helps to show errors instead of potentially encountring bugs in your program
//it also has to be initialzed/declared before you can use it: compared to var which can be used constantly 
//req, res is short for request and response
//if the website is localhost:3000, there is a secret /! it's hidden after the 3000 
