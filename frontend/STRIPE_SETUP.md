Quick Stripe setup for this project

1) Install server deps (in project root):

```bash
npm init -y
npm install express stripe cors dotenv
```

2) Create `.env` in project root with these variables:

```
STRIPE_SECRET_KEY=sk_test_...   # votre clé secrète Stripe (test)
```

3) Run example server (from project root):

```bash
node example-server.js
```

Server will listen on http://localhost:5000 and expose POST `/api/payments/checkout-session`.

4) Frontend setup (in `frontend` folder):

- Install Stripe JS (you said you already ran this):

```bash
cd frontend
npm install @stripe/stripe-js
```

- Create `frontend/.env` with your publishable key:

```
VITE_STRIPE_PK=pk_test_...
VITE_API_URL=http://localhost:5000/api
```

5) Test flow:
- Start example server
- Start frontend (`npm run dev`)
- Add item(s) to cart, go to `Payment` page, choose "Carte Bancaire" and click pay — you should be redirected to Stripe Checkout (mode test).

6) Next steps (recommended):
- Add webhook handling in the backend to be notified of successful payments and mark orders as paid.
- Use HTTPS in production and set real Stripe keys.
