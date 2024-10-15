const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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

// Route for processing payment form
app.post('/process-payment', upload.single('receipt'), (req, res) => {
    const { email, software } = req.body;
    const receipt = req.file;  // Uploaded file

    if (!receipt) {
        return res.status(400).send('Receipt not uploaded');
    }

    // Process the transaction (this is a placeholder, actual logic for validating the transaction should go here)

    // Set up email transport to send confirmation
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'exesoftware010@gmail.com',
            pass: 'ummy crqw fcyq rgos',
        }
    });

    // Email options for user confirmation
    const mailOptions = {
        from: 'sales@cbelko.net',
        to: email,  // User email from form
        subject: 'Order Confirmation',
        text: `Thank you for your purchase of ${software}. Your transaction has been processed successfully.`,
        attachments: [
            {
                filename: receipt.originalname,
                path: receipt.path,  // Attach uploaded receipt
            }
        ]
    };

    // Email options for admin notification
    const adminMailOptions = {
        from: 'exesoftware010@gmail.com',
        to: 'sales@cbelko.net',  // Admin email address
        subject: `New Order: ${software}`,
        text: `A new order has been placed by ${email}.\n\nSoftware: ${software}\n\nAttached is the receipt.`,
        attachments: [
            {
                filename: receipt.originalname,
                path: receipt.path,  // Attach uploaded receipt
            }
        ]
    };

    // Send user confirmation email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending user confirmation email:', error);
        } else {
            console.log('User confirmation email sent: ' + info.response);

            // Send admin notification email
            transporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
                if (adminError) {
                    return console.error('Error sending admin email:', adminError);
                } else {
                    console.log('Admin notification email sent: ' + adminInfo.response);
                    res.send(`
                        <h2>Order Processed</h2>
                        <p>Your order has been processed. You will receive a confirmation email shortly.</p>
                        <p>Order Number: ${Date.now()}</p>
                        <script>
                            setTimeout(function(){
                                window.location.href = 'index.html';
                            }, 30000);
                        </script>
                    `);
                }
            });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
