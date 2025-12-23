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

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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
