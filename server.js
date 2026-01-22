/**
 * Stripe Checkout Server
 * Run this server to handle checkout sessions for CGN products
 *
 * Install dependencies first:
 * npm install express stripe cors dotenv
 *
 * Then run:
 * node server.js
 */

// Load environment variables
require('dotenv').config();

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Stripe webhook endpoint needs raw body
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        console.log('Payment successful:', session.id);

        try {
            // Get customer details
            const customerEmail = session.customer_details?.email;
            const customerName = session.customer_details?.name;
            const productCode = session.metadata?.product_code || 'unknown';

            if (customerEmail) {
                // Save registration
                await saveWebinarRegistration({
                    email: customerEmail,
                    name: customerName,
                    productCode: productCode,
                    sessionId: session.id,
                    purchaseDate: new Date().toISOString(),
                    amount: session.amount_total / 100,
                    currency: session.currency
                });

                // Send confirmation email
                await sendWebinarConfirmationEmail({
                    email: customerEmail,
                    name: customerName,
                    productCode: productCode,
                    sessionId: session.id
                });

                console.log(`Webinar registration processed for ${customerEmail}`);
            }
        } catch (error) {
            console.error('Error processing webhook:', error);
        }
    }

    res.json({received: true});
});

// Regular JSON parsing for other routes
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, productCode, successUrl, cancelUrl, embedded } = req.body;

        if (!priceId) {
            return res.status(400).json({ error: 'Price ID is required' });
        }

        // Create Stripe checkout session
        const sessionParams = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                product_code: productCode || 'unknown'
            },
            billing_address_collection: 'auto',
        };

        // If embedded mode, use different URL format
        if (embedded) {
            sessionParams.ui_mode = 'embedded';
            sessionParams.return_url = successUrl || `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`;
        } else {
            sessionParams.success_url = successUrl || `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`;
            sessionParams.cancel_url = cancelUrl || `${req.headers.origin}/checkout.html?product=${productCode}`;
            sessionParams.customer_email = undefined; // Will show email field in checkout
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        res.json({
            id: session.id,
            url: session.url,
            clientSecret: session.client_secret
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create subscription checkout session endpoint (for memberships)
app.post('/create-subscription-session', async (req, res) => {
    try {
        const { priceId, productCode, successUrl, cancelUrl } = req.body;

        if (!priceId) {
            return res.status(400).json({ error: 'Price ID is required' });
        }

        // Create Stripe checkout session for subscription
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl || `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${req.headers.origin}/checkout.html?product=${productCode}`,
            metadata: {
                product_code: productCode || 'unknown'
            },
            customer_email: undefined,
            billing_address_collection: 'auto',
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating subscription session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Retrieve session details (for success page)
app.get('/session/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        res.json(session);
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'CGN Stripe Server Running' });
});

// Helper function to save webinar registration
async function saveWebinarRegistration(registration) {
    const registrationsFile = path.join(__dirname, 'webinar-registrations.json');

    try {
        let registrations = [];

        // Try to read existing registrations
        try {
            const data = await fs.readFile(registrationsFile, 'utf8');
            registrations = JSON.parse(data);
        } catch (err) {
            // File doesn't exist yet, start with empty array
        }

        // Add new registration
        registrations.push(registration);

        // Save back to file
        await fs.writeFile(registrationsFile, JSON.stringify(registrations, null, 2));

        console.log('Registration saved successfully');
    } catch (error) {
        console.error('Error saving registration:', error);
        throw error;
    }
}

// Helper function to send webinar confirmation email
async function sendWebinarConfirmationEmail({ email, name, productCode, sessionId }) {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
        console.log('⚠️  RESEND_API_KEY not configured. Email would be sent to:', email);
        console.log('Email preview:');
        console.log('---');
        console.log(`To: ${email}`);
        console.log(`Subject: Welcome to the SEEDS™ Strategy Webinar!`);
        console.log(`Body: Hi ${name || 'there'},\n\nThank you for registering for the SEEDS™ Strategy webinar!\n\nWebinar Details:\n- Topic: Strategy - The Foundation of Consistent Sales\n- Duration: 90 minutes\n- Access: You'll receive a Zoom link 24 hours before the event\n\nNext Steps:\n1. Check your email for your receipt\n2. Mark your calendar for the webinar\n3. Download your bonus materials (coming soon)\n\nWe're excited to have you!\n\nBest regards,\nCharmaine Powell, MBA\nCultivated Growth Network`);
        console.log('---');
        return;
    }

    try {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const webinarDetails = getWebinarDetails(productCode);

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Cultivated Growth Network <onboarding@resend.dev>',
            to: [email],
            subject: `Welcome to ${webinarDetails.title}!`,
            html: generateWebinarEmailHTML({ name, webinarDetails }),
        });

        if (error) {
            console.error('Error sending email:', error);
            throw error;
        }

        console.log('Email sent successfully:', data);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw error;
    }
}

// Get webinar details based on product code
function getWebinarDetails(productCode) {
    const webinars = {
        'seeds-strategy': {
            title: 'SEEDS™ Strategy Deep Dive',
            topic: 'Strategy - The Foundation of Consistent Sales',
            duration: '90 minutes',
            description: 'Master the first pillar of the SEEDS Method™',
            bonuses: [
                'Strategic Sales Planning Workbook (Digital Download)',
                'Strategic Sales Audit Template',
                '30-Day Strategy Implementation Checklist',
                'Lifetime access to webinar recording',
                'Monthly SEEDS™ Series Community Group invitation',
                'Early-bird notification for upcoming SEEDS™ webinars'
            ]
        },
        // Add more webinars as they're created
        'default': {
            title: 'SEEDS™ Series Webinar',
            topic: 'Sales Leadership Training',
            duration: '90 minutes',
            description: 'Transform your sales approach',
            bonuses: [
                'Lifetime access to webinar recording',
                'Bonus materials and workbooks'
            ]
        }
    };

    return webinars[productCode] || webinars['default'];
}

// Generate HTML email template
function generateWebinarEmailHTML({ name, webinarDetails }) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ECA310; padding: 30px; text-align: center; }
        .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; }
        .content { background-color: #FFFFFF; padding: 30px; }
        .content h2 { color: #099437; font-size: 22px; margin-top: 0; }
        .webinar-box { background-color: #f8f9fa; border-left: 4px solid #099437; padding: 20px; margin: 20px 0; }
        .bonus-list { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .bonus-list ul { margin: 10px 0; padding-left: 20px; }
        .bonus-list li { margin: 8px 0; }
        .cta-button { display: inline-block; background-color: #099437; color: #FFFFFF; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { background-color: #333333; color: #FFFFFF; padding: 20px; text-align: center; font-size: 14px; }
        .checkmark { color: #099437; font-weight: bold; margin-right: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌱 Welcome to the SEEDS™ Series!</h1>
        </div>

        <div class="content">
            <h2>Hi ${name || 'there'},</h2>

            <p>Thank you for registering for <strong>${webinarDetails.title}</strong>! We're excited to have you join us.</p>

            <div class="webinar-box">
                <h3 style="color: #099437; margin-top: 0;">📅 Webinar Details</h3>
                <p><strong>Topic:</strong> ${webinarDetails.topic}</p>
                <p><strong>Duration:</strong> ${webinarDetails.duration}</p>
                <p><strong>Format:</strong> Live interactive training with Q&A</p>
            </div>

            <h3 style="color: #099437;">What Happens Next?</h3>
            <ol>
                <li><strong>Check Your Email</strong> - You'll receive your Zoom access link 24 hours before the event</li>
                <li><strong>Mark Your Calendar</strong> - We'll send a calendar invite soon</li>
                <li><strong>Download Your Bonuses</strong> - Access your exclusive materials (link coming in next email)</li>
                <li><strong>Prepare Questions</strong> - Think about your biggest sales strategy challenges</li>
            </ol>

            <div class="bonus-list">
                <h3 style="color: #099437; margin-top: 0;">🎁 Your Exclusive Bonus Materials</h3>
                <p>As a registered participant, you'll receive:</p>
                <ul>
                    ${webinarDetails.bonuses.map(bonus => `<li><span class="checkmark">✓</span>${bonus}</li>`).join('')}
                </ul>
            </div>

            <h3 style="color: #099437;">Need Help?</h3>
            <p>If you have any questions before the webinar, reply to this email or reach out to us at <a href="mailto:charmaine@cultivatedgrowthnetwork.com">charmaine@cultivatedgrowthnetwork.com</a></p>

            <p style="margin-top: 30px;">We're looking forward to seeing you at the webinar!</p>

            <p><strong>Growth isn't accidental. It's cultivated.</strong></p>

            <p>Best regards,<br>
            <strong>Charmaine Powell, MBA</strong><br>
            Sales Leadership Strategist<br>
            Cultivated Growth Network</p>
        </div>

        <div class="footer">
            <p>Cultivated Growth Network</p>
            <p>You're receiving this email because you registered for a SEEDS™ Series webinar.</p>
            <p><a href="https://cultivatedgrowthnetwork.com" style="color: #ECA310;">cultivatedgrowthnetwork.com</a></p>
        </div>
    </div>
</body>
</html>
    `;
}

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║   CGN Stripe Checkout Server                             ║
║   Status: Running ✓                                      ║
║   Port: ${PORT}                                              ║
║   Mode: LIVE                                             ║
╚═══════════════════════════════════════════════════════════╝

Server is ready to handle checkout requests.
Open your browser to: http://localhost:${PORT}
    `);
});

module.exports = app;
