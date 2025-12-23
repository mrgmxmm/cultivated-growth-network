# Embedded Checkout Setup Guide
## Complete Implementation Guide for Stripe Embedded Checkout on Your Landing Page

---

## 📋 Table of Contents
1. [What is Embedded Checkout?](#what-is-embedded-checkout)
2. [Current vs Future Setup](#current-vs-future-setup)
3. [Prerequisites](#prerequisites)
4. [Server Deployment Options](#server-deployment-options)
5. [Step-by-Step Setup](#step-by-step-setup)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)
8. [Going Live](#going-live)

---

## What is Embedded Checkout?

**Current Setup (Direct Stripe Links):**
- When users click "SECURE YOUR SEAT NOW", they're redirected to Stripe's hosted checkout page
- ✅ Works immediately without any server
- ✅ Fully secure and PCI compliant
- ✅ No maintenance required

**Embedded Checkout (What This Guide Sets Up):**
- Checkout form appears directly on your landing page
- No redirect - users stay on your website
- More seamless user experience
- ⚠️ Requires a Node.js server running 24/7

---

## Current vs Future Setup

### Current Setup ✅
```
User clicks button → Redirected to Stripe → Completes payment → Redirected back
```

### Embedded Setup 🎯
```
User clicks button → Form appears on page → Completes payment → Thank you page
```

**When to upgrade:**
- You want a more premium, seamless checkout experience
- You have the technical resources to maintain a server
- You want full control over the checkout page design

---

## Prerequisites

Before you begin, you'll need:

### 1. Technical Requirements
- [ ] Node.js installed (version 18 or higher)
- [ ] A hosting platform that supports Node.js (see options below)
- [ ] Access to your Stripe account
- [ ] Basic command line knowledge

### 2. Files You Already Have
All necessary files are already in your project folder (`/Users/calarts/Desktop/CGN/`):
- ✅ `server.js` - Node.js server for handling checkout sessions
- ✅ `package.json` - Server dependencies configuration
- ✅ `success.html` - Order confirmation page
- ✅ `thank-you.html` - Payment completion page
- ✅ `.env.example` - Template for environment variables

### 3. Information You'll Need
- **Stripe Live Secret Key:** Available in your `.env` file or Stripe Dashboard
- **Stripe Live Publishable Key:** Available in Stripe Dashboard > Developers > API keys

---

## Server Deployment Options

You need to deploy `server.js` to a platform that runs Node.js 24/7. Here are your options:

### Option 1: Netlify Functions (Recommended - Easiest)
**Pros:**
- ✅ Your site is already on Netlify
- ✅ Free tier available
- ✅ Minimal configuration
- ✅ Automatic scaling

**Cons:**
- ⚠️ Requires converting server.js to serverless functions
- ⚠️ Cold starts may slow first request

**Cost:** Free for low traffic, ~$19/month for higher traffic

### Option 2: Vercel (Recommended - Best for Beginners)
**Pros:**
- ✅ Extremely easy deployment
- ✅ Free tier generous
- ✅ Excellent documentation
- ✅ Automatic HTTPS

**Cons:**
- ⚠️ Requires GitHub connection

**Cost:** Free for most use cases

### Option 3: Heroku
**Pros:**
- ✅ Traditional server environment
- ✅ Easy to understand
- ✅ Good documentation

**Cons:**
- ⚠️ No free tier anymore
- ⚠️ Monthly cost required

**Cost:** $5-7/month minimum

### Option 4: Railway
**Pros:**
- ✅ Simple deployment
- ✅ $5/month credit free
- ✅ Good for Node.js apps

**Cons:**
- ⚠️ Newer platform

**Cost:** ~$5/month after free credit

### Option 5: DigitalOcean App Platform
**Pros:**
- ✅ Reliable infrastructure
- ✅ Predictable pricing
- ✅ Good performance

**Cons:**
- ⚠️ More technical setup
- ⚠️ No free tier

**Cost:** $5/month minimum

---

## Step-by-Step Setup

### Step 1: Test the Server Locally (Optional but Recommended)

1. **Navigate to your project folder:**
   ```bash
   cd /Users/calarts/Desktop/CGN
   ```

2. **Create `.env` file:**
   ```bash
   echo 'STRIPE_SECRET_KEY=your_secret_key_here' > .env
   ```
   Replace `your_secret_key_here` with your actual Stripe secret key from Stripe Dashboard

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   node server.js
   ```

5. **You should see:**
   ```
   ╔═══════════════════════════════════════════════════════════╗
   ║   CGN Stripe Checkout Server                             ║
   ║   Status: Running ✓                                      ║
   ║   Port: 3000                                             ║
   ║   Mode: LIVE                                             ║
   ╚═══════════════════════════════════════════════════════════╝
   ```

6. **Test it:**
   - Open: `http://localhost:3000/health`
   - You should see: `{"status":"ok","message":"CGN Stripe Server Running"}`

✅ **If this works, your server is ready for deployment!**

---

### Step 2: Deploy to Production

#### Option A: Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd /Users/calarts/Desktop/CGN
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - Project name? `cgn-checkout-server`
   - Directory? `./` (press Enter)
   - Override settings? `N`

5. **Set environment variable:**
   ```bash
   vercel env add STRIPE_SECRET_KEY
   ```
   - Paste your secret key when prompted
   - Select: Production, Preview, Development (all three)

6. **Redeploy with environment variable:**
   ```bash
   vercel --prod
   ```

7. **Save your deployment URL:**
   - Vercel will give you a URL like: `https://cgn-checkout-server.vercel.app`
   - **Write this down!** You'll need it in Step 3.

#### Option B: Deploy to Heroku

1. **Install Heroku CLI:**
   - Download from: https://devcenter.heroku.com/articles/heroku-cli

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   cd /Users/calarts/Desktop/CGN
   heroku create cgn-checkout-server
   ```

4. **Set environment variable:**
   ```bash
   heroku config:set STRIPE_SECRET_KEY=your_stripe_secret_key_here
   ```
   Replace `your_stripe_secret_key_here` with your actual key from Stripe Dashboard

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Your server URL will be:**
   - `https://cgn-checkout-server.herokuapp.com`
   - **Write this down!** You'll need it in Step 3.

#### Option C: Deploy to Railway

1. **Go to:** https://railway.app

2. **Click "Start a New Project"**

3. **Choose "Deploy from GitHub repo"**
   - Connect your GitHub account
   - Select: `mrgmxmm/cultivated-growth-network`

4. **Add environment variable:**
   - Go to Variables tab
   - Add: `STRIPE_SECRET_KEY` = `your_stripe_secret_key_here`
   - Get your actual key from Stripe Dashboard > Developers > API keys

5. **Get your URL:**
   - Railway will assign a URL like: `https://cgn-checkout-server.up.railway.app`
   - **Write this down!** You'll need it in Step 3.

---

### Step 3: Update Your Landing Page

Now that your server is deployed, you need to add the embedded checkout back to your webinar landing page.

1. **Open `webinar-landing.html`**

2. **Add this section BEFORE the closing `</div>` tag (around line 744):**

```html
        <!-- Registration Section - Embedded Stripe Checkout -->
        <section id="register" class="section" style="margin-top: 2rem; border: 3px solid var(--cgn-green); background: white;">
            <h2 style="text-align: center; margin-bottom: 1rem;">Secure Your Seat for Strategy Deep Dive</h2>
            <p style="text-align: center; font-size: 1rem; margin-bottom: 1.5rem;">Part 1 of the SEEDS™ Series</p>
            <p style="text-align: center; font-size: 1.25rem; font-weight: 700; color: var(--cgn-green); margin-bottom: 2rem;">1/2 Price - Only $47 Until December 31st!</p>

            <!-- Embedded Checkout Container -->
            <div style="max-width: 600px; margin: 0 auto; padding: 0 1rem;">
                <!-- Loading State -->
                <div id="checkout-loading" style="text-align: center; padding: 3rem;">
                    <div style="border: 4px solid rgba(9, 148, 55, 0.1); border-top: 4px solid var(--cgn-green); border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                    <p style="color: #666;">Loading secure checkout...</p>
                </div>

                <!-- Error State -->
                <div id="checkout-error" style="display: none; background-color: #fee; color: #c33; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #c33;">
                    <p id="error-message" style="margin: 0;"></p>
                </div>

                <!-- Embedded Checkout Form -->
                <div id="checkout-container"></div>

                <!-- Fallback Button (if embedded fails) -->
                <div id="checkout-fallback" style="display: none; text-align: center; padding: 2rem; background-color: rgba(9, 148, 55, 0.1); border-radius: 12px;">
                    <p style="margin-bottom: 1.5rem; color: #666;">Having trouble loading the checkout form?</p>
                    <a href="https://buy.stripe.com/cNi4gB8i6cvL4TedRQ7AI0d" class="cta-button" style="display: inline-block;">
                        Continue to Checkout →
                    </a>
                </div>

                <!-- Trust Badges -->
                <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(0,0,0,0.1); text-align: center;">
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">✓ Instant confirmation email</p>
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">✓ 256-bit SSL encryption • PCI compliant</p>
                    <p style="font-size: 0.9rem; color: #666;">✓ Powered by Stripe</p>
                </div>
            </div>

            <p style="text-align: center; margin-top: 1.5rem; font-size: 0.85rem;">
                Questions? Email: <a href="mailto:charmaine@cultivatedgrowthnetwork.com" style="color: var(--cgn-green); font-weight: 600;">charmaine@cultivatedgrowthnetwork.com</a>
            </p>
        </section>
```

3. **Add Stripe.js and checkout script BEFORE the closing `</body>` tag:**

```html
    <!-- Stripe.js -->
    <script src="https://js.stripe.com/v3/"></script>

    <!-- Embedded Checkout Script -->
    <script>
        // Initialize Stripe
        const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY_HERE');

        // ⚠️ IMPORTANT: Replace this with your actual server URL from Step 2
        const SERVER_URL = 'https://YOUR-SERVER-URL-HERE.vercel.app';

        // Product configuration
        const PRODUCT_CONFIG = {
            priceId: 'price_1ShHJJRWzdMdZsP0vz9BPF85', // tier2 price for SEEDS-WB-STR-IND
            productCode: 'SEEDS-WB-STR-IND',
            successUrl: window.location.origin + '/success.html?session_id={CHECKOUT_SESSION_ID}',
            returnUrl: window.location.href
        };

        async function initializeEmbeddedCheckout() {
            const loadingDiv = document.getElementById('checkout-loading');
            const errorDiv = document.getElementById('checkout-error');
            const errorMessage = document.getElementById('error-message');
            const fallbackDiv = document.getElementById('checkout-fallback');
            const checkoutContainer = document.getElementById('checkout-container');

            try {
                // Create checkout session on server
                const response = await fetch(SERVER_URL + '/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        priceId: PRODUCT_CONFIG.priceId,
                        productCode: PRODUCT_CONFIG.productCode,
                        successUrl: PRODUCT_CONFIG.successUrl,
                        embedded: true
                    }),
                });

                const { clientSecret, error } = await response.json();

                if (error) {
                    throw new Error(error);
                }

                // Initialize embedded checkout
                const checkout = await stripe.initEmbeddedCheckout({
                    clientSecret: clientSecret,
                });

                // Mount the checkout
                checkout.mount('#checkout-container');

                // Hide loading, show checkout
                loadingDiv.style.display = 'none';
                checkoutContainer.style.display = 'block';

            } catch (error) {
                console.error('Error initializing checkout:', error);

                // Hide loading
                loadingDiv.style.display = 'none';

                // Show error
                errorMessage.textContent = 'Unable to load embedded checkout. Please use the button below to continue.';
                errorDiv.style.display = 'block';

                // Show fallback button
                fallbackDiv.style.display = 'block';
            }
        }

        // Initialize on page load
        if (document.getElementById('checkout-container')) {
            // Check if server is available first
            fetch(SERVER_URL + '/health')
                .then(res => {
                    if (res.ok) {
                        initializeEmbeddedCheckout();
                    } else {
                        throw new Error('Server not available');
                    }
                })
                .catch(() => {
                    // Server not available, show fallback immediately
                    document.getElementById('checkout-loading').style.display = 'none';
                    document.getElementById('error-message').textContent = 'Server temporarily unavailable. Please use the button below.';
                    document.getElementById('checkout-error').style.display = 'block';
                    document.getElementById('checkout-fallback').style.display = 'block';
                });
        }
    </script>

    <!-- Add CSS for loading animation -->
    <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
```

4. **⚠️ CRITICAL: Update the SERVER_URL**
   - Find this line in the script you just added:
     ```javascript
     const SERVER_URL = 'https://YOUR-SERVER-URL-HERE.vercel.app';
     ```
   - Replace `https://YOUR-SERVER-URL-HERE.vercel.app` with your actual server URL from Step 2
   - Examples:
     - Vercel: `https://cgn-checkout-server.vercel.app`
     - Heroku: `https://cgn-checkout-server.herokuapp.com`
     - Railway: `https://cgn-checkout-server.up.railway.app`

5. **Save the file**

---

### Step 4: Enable CORS on Your Server (Important!)

Your server needs to accept requests from your website domain.

1. **Open `server.js`**

2. **Find this line (around line 24):**
   ```javascript
   app.use(cors());
   ```

3. **Replace it with:**
   ```javascript
   app.use(cors({
       origin: [
           'https://www.cultivatedgrowthnetwork.com',
           'https://cultivatedgrowthnetwork.netlify.app',
           'http://localhost:8888'  // For local testing
       ],
       credentials: true
   }));
   ```

4. **Save and redeploy your server:**
   - Vercel: `vercel --prod`
   - Heroku: `git push heroku main`
   - Railway: Push to GitHub (auto-deploys)

---

### Step 5: Deploy Updated Landing Page

1. **Commit your changes:**
   ```bash
   cd /Users/calarts/Desktop/CGN
   git add webinar-landing.html server.js
   git commit -m "Add embedded checkout to webinar landing page"
   git push origin main
   ```

2. **Deploy to Netlify:**
   ```bash
   netlify deploy --prod
   ```

---

## Testing

### Test Checklist

1. **Visit your landing page:**
   - Go to: `https://www.cultivatedgrowthnetwork.com/webinar-landing.html`

2. **Scroll to the registration section:**
   - You should see the checkout form load within a few seconds
   - If you see "Loading secure checkout..." that never goes away, check the browser console for errors

3. **Test the checkout:**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

   ⚠️ **Wait!** You're in LIVE mode, so you'll need to use a real card or switch to test mode first.

4. **Test fallback:**
   - If the embedded checkout fails, users should see the fallback button
   - The fallback button should redirect to: `https://buy.stripe.com/cNi4gB8i6cvL4TedRQ7AI0d`

---

## Troubleshooting

### Problem: "Loading secure checkout..." never disappears

**Solution 1: Check server URL**
- Open browser Developer Tools (F12)
- Go to Console tab
- Look for errors like "Failed to fetch" or "CORS error"
- Verify `SERVER_URL` in your script matches your actual server URL

**Solution 2: Check server is running**
- Visit: `https://YOUR-SERVER-URL/health`
- You should see: `{"status":"ok","message":"CGN Stripe Server Running"}`
- If not, your server isn't running

**Solution 3: Check CORS settings**
- Make sure you updated `server.js` with CORS settings in Step 4
- Redeploy your server after making changes

### Problem: "Server connection required for embedded checkout"

**This means:**
- Your server isn't responding to the `/health` check
- The script automatically shows the fallback button (which is good!)

**To fix:**
- Check your server is deployed and running
- Visit `https://YOUR-SERVER-URL/health` to verify
- Check server logs for errors

### Problem: Checkout form appears but payment fails

**Solution:**
- Check your Stripe secret key is correct in environment variables
- Look at Stripe Dashboard > Logs to see the error
- Verify price ID `price_1ShHJJRWzdMdZsP0vz9BPF85` still exists

### Problem: CORS Error in Browser Console

**Error looks like:**
```
Access to fetch at 'https://your-server.com/create-checkout-session' from origin 'https://www.cultivatedgrowthnetwork.com' has been blocked by CORS policy
```

**Solution:**
- Update CORS settings in `server.js` (Step 4 above)
- Redeploy your server
- Clear browser cache and try again

---

## Going Live

### Pre-Launch Checklist

Before announcing embedded checkout to customers:

- [ ] Server deployed and running 24/7
- [ ] Environment variables set correctly on server
- [ ] `SERVER_URL` updated in `webinar-landing.html`
- [ ] CORS configured correctly in `server.js`
- [ ] Tested with real credit card (or test card if in test mode)
- [ ] Fallback button works if embedded checkout fails
- [ ] Success page (`success.html`) displays correctly
- [ ] Email confirmations from Stripe are being sent
- [ ] Monitored server for 24 hours to ensure uptime

### Monitoring

After launch, monitor these:

1. **Server Uptime**
   - Set up monitoring with UptimeRobot (free): https://uptimerobot.com
   - Monitor: `https://YOUR-SERVER-URL/health`
   - Get alerts if server goes down

2. **Stripe Dashboard**
   - Watch for failed payments
   - Check Logs section for errors
   - Review successful transactions

3. **Browser Console**
   - Periodically check your website in different browsers
   - Look for JavaScript errors

4. **Server Logs**
   - Vercel: `vercel logs`
   - Heroku: `heroku logs --tail`
   - Railway: Check Logs tab in dashboard

---

## Maintenance

### Monthly Tasks

1. **Check server is running**
   - Visit `/health` endpoint
   - Verify response time is fast

2. **Update dependencies**
   ```bash
   cd /Users/calarts/Desktop/CGN
   npm update
   git add package.json package-lock.json
   git commit -m "Update dependencies"
   git push origin main
   # Then redeploy to your hosting platform
   ```

3. **Review Stripe logs**
   - Check for any failed payments
   - Investigate any errors

### Annual Tasks

1. **Rotate Stripe API keys** (security best practice)
   - Generate new keys in Stripe Dashboard
   - Update environment variable on server
   - Update publishable key in HTML

---

## Cost Summary

### One-Time Costs
- **$0** - All code is already written and ready

### Monthly Costs (Choose One)

| Platform | Monthly Cost | Best For |
|----------|-------------|----------|
| **Vercel** | **$0** (for most traffic) | Small to medium traffic, easiest setup |
| **Netlify Functions** | **$0-19** | Already using Netlify |
| **Railway** | **~$5** after free credit | Simple deployment |
| **Heroku** | **$5-7** | Traditional server setup |
| **DigitalOcean** | **$5+** | Full control |

### Stripe Fees (Same for Both Setups)
- **2.9% + $0.30** per successful transaction
- No additional fees for embedded checkout

---

## Support

If you need help with any step:

1. **Technical Issues:**
   - Check troubleshooting section above
   - Review platform documentation (Vercel, Heroku, etc.)

2. **Stripe Issues:**
   - Stripe Support: https://support.stripe.com
   - Stripe Documentation: https://stripe.com/docs

3. **Questions:**
   - Email: charmaine@cultivatedgrowthnetwork.com
   - Phone: (502) 905-8718

---

## Quick Reference

### Important URLs
- **Live Site:** https://www.cultivatedgrowthnetwork.com
- **Netlify Dashboard:** https://app.netlify.com/projects/cultivatedgrowthnetwork
- **Stripe Dashboard:** https://dashboard.stripe.com
- **GitHub Repo:** https://github.com/mrgmxmm/cultivated-growth-network

### Important IDs
- **Webinar Price ID (tier2):** `price_1ShHJJRWzdMdZsP0vz9BPF85`
- **Webinar Product Code:** `SEEDS-WB-STR-IND`
- **Webinar Direct Link:** `https://buy.stripe.com/cNi4gB8i6cvL4TedRQ7AI0d`

### Important Files
- **Server:** `server.js`
- **Landing Page:** `webinar-landing.html`
- **Success Page:** `success.html`
- **Thank You Page:** `thank-you.html`
- **Environment Variables:** `.env` (not committed to git)

---

## Final Notes

Remember: **Your current setup with direct Stripe links works perfectly!**

You don't need embedded checkout to accept payments. This guide is here when you're ready to upgrade to a more premium checkout experience. Take your time, and implement it when you have the technical resources available.

**Current setup advantages:**
- ✅ Zero maintenance
- ✅ No server costs
- ✅ Always works
- ✅ Fully secure

**Embedded checkout advantages:**
- ✅ More seamless user experience
- ✅ Users stay on your website
- ✅ Full design control
- ⚠️ Requires server maintenance

Both approaches are industry-standard and equally secure. Choose based on your priorities and resources.

---

**Last Updated:** December 23, 2025
