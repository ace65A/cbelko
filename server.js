const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file if available

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the public directory

// File upload settings for receipt
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save files with current timestamp
    }
});

const upload = multer({ storage: storage });

// Route for serving the index HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'cbelko', 'index.html')); // Adjust path if needed
});

// Route for processing payment form
app.post('/process-payment', upload.single('receipt'), (req, res) => {
    const { email, software } = req.body;
    const receipt = req.file;

    // Validate input
    if (!email || !software) {
        return res.status(400).send('Email and software are required');
    }

    if (!receipt) {
        return res.status(400).send('Receipt not uploaded');
    }

    // Email transport setup
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'exesoftware010@gmail.com', // Your Gmail address
            pass: 'ummy craw feyq rgos',  // Your app password
        }
    });

    // User confirmation email options
    const mailOptions = {
        from: 'sales@cbelko.net',
        to: email,
        subject: 'Order Confirmation',
        text: Thank you for your purchase of ${software}. Your transaction has been processed successfully.,
        attachments: [{
            filename: receipt.originalname,
            path: receipt.path,
        }]
    };

    // Admin notification email options
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: 'sales@cbelko.net',  // Admin email address
        subject: New Order: ${software},
        text: A new order has been placed by ${email}.\n\nSoftware: ${software}\n\nAttached is the receipt.,
        attachments: [{
            filename: receipt.originalname,
            path: receipt.path,
        }]
    };

    // Send user confirmation email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending user confirmation email:', error);
            return res.status(500).send('Error sending email');
        }

        // Send admin notification email
        transporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
            if (adminError) {
                console.error('Error sending admin email:', adminError);
                return res.status(500).send('Error sending admin email');
            }

            // Redirect to confirmation page after successful email sends
            res.redirect('/order-confirmation');
        });
    });
});

// Route for order confirmation page
app.get('/order-confirmation', (req, res) => {
    res.send(`
        <h2>Order Processed</h2>
        <p>Your order has been processed. You will receive a confirmation email shortly.</p>
        <p>Order Number: ${Date.now()}</p>
        <script>
            setTimeout(function(){
                window.location.href = '/';
            }, 30000);
        </script>
    `);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
