const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer'); // New for sending emails

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to the SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});


// --------------------- Email Configuration ---------------------

// Configure Nodemailer (Update with your email and SMTP details)
const transporter = nodemailer.createTransport({
    service: 'gmail', // true for 465, false for other ports
    auth: {
        user: 'Kowshikyalavarthi2520@gmail.com', // Replace with your email
        pass: 'rzrz iwyt vzor eurk'   // Replace with your app-specific password
    }
});

// Routes for donation CRUD
app.get('/donations', (req, res) => {
    db.all('SELECT * FROM donations', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create a new donation
app.post('/donations', (req, res) => {
    const { donor_name, email, phone_number, address, campaign_id, amount } = req.body;
    const currentDate = new Date().toISOString();

    db.run(
        `INSERT INTO donations (donor_name, email, phone_number, address, campaign_id, created_date, amount) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [donor_name, email, phone_number, address, campaign_id, currentDate, amount], 
        function (err) {
            if (err) return res.status(400).json({ error: err.message });

            const donationId = this.lastID;

            // Send Thank You Email
            sendThankYouEmail(email, donor_name, amount);

            // Update the campaign's reached_amount
            updateCampaignAmount(campaign_id, amount, 'add');

            res.json({ id: donationId });
        }
    );
});

// Update a donation
app.put('/donations/:id', (req, res) => {
    const { donor_name, email, phone_number, address, campaign_id, amount } = req.body;

    // Get the existing amount of the donation to adjust the campaign's reached_amount
    db.get('SELECT amount, campaign_id FROM donations WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });

        const previousAmount = row.amount;
        const previousCampaignId = row.campaign_id;

        db.run(
            `UPDATE donations 
             SET donor_name = ?, email = ?, phone_number = ?, address = ?, campaign_id = ?, amount = ? 
             WHERE id = ?`,
            [donor_name, email, phone_number, address, campaign_id, amount, req.params.id],
            function (err) {
                if (err) return res.status(400).json({ error: err.message });

                // Update the campaign reached_amount
                if (campaign_id === previousCampaignId) {
                    // If campaign_id is the same, just adjust the difference
                    const difference = amount - previousAmount;
                    updateCampaignAmount(campaign_id, difference, 'add');
                } else {
                    // If campaign_id has changed, revert from the old campaign and add to the new one
                    updateCampaignAmount(previousCampaignId, previousAmount, 'subtract');
                    updateCampaignAmount(campaign_id, amount, 'add');
                }

                res.json({ updatedID: req.params.id });
            }
        );
    });
});

// Delete a donation
app.delete('/donations/:id', (req, res) => {
    db.get('SELECT amount, campaign_id FROM donations WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });

        const amount = row.amount;
        const campaign_id = row.campaign_id;

        db.run('DELETE FROM donations WHERE id = ?', [req.params.id], function (err) {
            if (err) return res.status(400).json({ error: err.message });

            // Update the campaign reached_amount
            updateCampaignAmount(campaign_id, amount, 'subtract');

            res.json({ deletedID: req.params.id });
        });
    });
});

// --------------------- Helper Functions -------------------------

/**
 * Send a Thank You Email to the donor
 * @param {string} email - Email address of the donor
 * @param {string} donor_name - Name of the donor
 * @param {number} amount - Amount donated
 */
function sendThankYouEmail(email, donor_name, amount) {
    const mailOptions = {
        from: 'your_email@gmail.com', // Replace with your email
        to: email,
        subject: 'Thank You for Your Donation!',
        text: `Dear ${donor_name},\n\nThank you for your generous donation of $${amount.toFixed(2)}. 
        Your support is greatly appreciated.\n\nBest Regards,\nCharity Organization`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
}

/**
 * Update the campaign's reached_amount
 * @param {number} campaignId - ID of the campaign
 * @param {number} amount - Amount to adjust
 * @param {string} operation - 'add' or 'subtract'
 */
function updateCampaignAmount(campaignId, amount, operation) {
    const operator = operation === 'add' ? '+' : '-';
    db.run(
        `UPDATE campaigns 
         SET reached_amount = reached_amount ${operator} ? 
         WHERE id = ?`,
        [amount, campaignId],
        function (err) {
            if (err) console.error('Error updating campaign amount:', err.message);
        }
    );
}


// Get all campaigns
app.get('/campaigns', (req, res) => {
    db.all('SELECT * FROM campaigns', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create a new campaign
app.post('/campaigns', (req, res) => {
    const { name, description, goal_amount } = req.body;

    // Set created_date and updated_date as the current timestamp
    const currentDate = new Date().toISOString();

    db.run(
        `INSERT INTO campaigns (name, description, goal_amount, created_date, updated_date) VALUES (?, ?, ?, ?, ?)`,
        [name, description, goal_amount, currentDate, currentDate],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});


// Update a campaign
app.put('/campaigns/:id', (req, res) => {
    const { name, description, goal_amount } = req.body;

    // Set updated_date as the current timestamp
    const updatedDate = new Date().toISOString();

    db.run(
        `UPDATE campaigns 
         SET name = ?, description = ?, goal_amount = ?, updated_date = ? 
         WHERE id = ?`,
        [name, description, goal_amount, updatedDate, req.params.id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ updatedID: req.params.id });
        }
    );
});


// Delete a campaign
app.delete('/campaigns/:id', (req, res) => {
    db.run('DELETE FROM campaigns WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deletedID: req.params.id });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

