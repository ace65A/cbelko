const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Contact form submission endpoint
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;

    // Set up email transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // replace with your email
            pass: 'your-email-password', // replace with your email password
        }
    });

    const mailOptions = {
        from: email,
        to: 'admin-email@example.com', // replace with admin email
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending message');
        } else {
            console.log('Email sent: ' + info.response);
            res.redirect('/');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});