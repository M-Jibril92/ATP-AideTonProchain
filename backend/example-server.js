// example-server.js
// Exemple minimal d'un backend Express pour créer une session Stripe Checkout
// Usage: set STRIPE_SECRET_KEY, puis `node example-server.js`

require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Example Stripe backend running'));

app.post('/api/payments/checkout-session', async (req, res) => {
  try {
    const { items = [], successUrl, cancelUrl } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items missing' });
    }

    const line_items = items.map(it => ({
      price_data: {
        currency: 'eur',
        product_data: { name: it.title || 'Service' },
        unit_amount: Math.round((it.amount || 0) * 100),
      },
      quantity: it.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: successUrl || `${req.protocol}://${req.get('host')}/payment-success`,
      cancel_url: cancelUrl || `${req.protocol}://${req.get('host')}/payment-cancel`,
    });

    // Return both id and url for compatibility
    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('checkout-session error', err);
    res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
});

// Example webhook handler (optional): verify signature with STRIPE_WEBHOOK_SECRET
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // Implement webhook handling here using stripe.webhooks.constructEvent
  res.status(200).send('ok');
});

app.listen(PORT, () => console.log(`Example server listening on http://localhost:${PORT}`));
