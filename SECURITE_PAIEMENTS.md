# Sécurité Backend & Système de Paiements

## 🔒 Sécurité Implémentée

### 1. **Authentification JWT**
- Tous les endpoints sensibles requièrent un token JWT valide
- Le token est envoyé dans le header `Authorization: Bearer <token>`
- Durée d'expiration: 24 heures
- Secret key configurable via `.env` (`JWT_SECRET`)

### 2. **Middleware d'authentification** (`middleware/auth.js`)
- `authenticateToken` - Vérifie la validité du token
- `authorizeProvider` - Vérifie que l'utilisateur est prestataire
- `authorizeAdmin` - Vérifie que l'utilisateur est administrateur

### 3. **Validation des données** (`utils/validators.js`)
- Validation stricte des emails
- Mot de passe minimum 6 caractères
- Vérification des rôles valides
- Montants de paiement positifs
- Tous les champs requis vérifiés

### 4. **Hash des mots de passe**
- Utilise `bcryptjs` avec salt de 10 rounds
- Les mots de passe ne sont jamais stockés en clair
- Comparaison sécurisée lors de la connexion

### 5. **CORS Sécurisé**
- Uniquement le frontend autorisé (`http://localhost:5173`)
- Configurable via `FRONTEND_URL` en `.env`
- Headers spécifiques autorisés

---

## 💳 Système de Paiements

### Routes Protégées

#### `GET /api/payments`
Récupère l'historique des paiements de l'utilisateur
```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/payments
```

#### `POST /api/payments`
Crée un nouveau paiement
```json
{
  "serviceId": 1,
  "amount": 99.99,
  "paymentMethod": "CARD",
  "description": "Nettoyage maison",
  "quantity": 1
}
```

#### `GET /api/payments/:id`
Récupère un paiement spécifique (propriétaire ou admin uniquement)

#### `PUT /api/payments/:id`
Modifie un paiement (admin seulement)
```json
{ "status": "COMPLETED|PENDING|FAILED|CANCELLED" }
```

#### `DELETE /api/payments/:id`
Supprime un paiement (propriétaire ou admin uniquement)

---

## 📋 Modèle Payment

```javascript
{
  id: Integer (auto-increment),
  userId: Integer (ID de l'utilisateur),
  serviceId: Integer (ID du service),
  amount: Decimal(10,2) (montant >= 0.01),
  paymentMethod: ENUM('CARD', 'PAYPAL', 'TRANSFER', 'CASH'),
  status: ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'),
  transactionId: String (unique, auto-généré),
  description: Text,
  quantity: Integer (défaut: 1),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 🎯 Frontend Intégration

### Service API (`src/services/api.js`)
```javascript
// Tous les paiements
const payments = await paymentsAPI.getAll();

// Créer un paiement
await paymentsAPI.create({
  serviceId: 1,
  amount: 100,
  paymentMethod: 'CARD',
  description: 'Service ABC'
});

// Récupérer un paiement
const payment = await paymentsAPI.getById(1);

// Modifier un paiement (admin)
await paymentsAPI.update(1, { status: 'COMPLETED' });

// Supprimer un paiement
await paymentsAPI.delete(1);
```

### Page Paiements (`src/pages/Payment.jsx`)
- Interface complète du panier
- Sélection de la méthode de paiement
- Historique des transactions
- Statut des paiements en temps réel
- Intégration avec `CartContext`

---

## 🚀 Déploiement Sécurisé

### Variables d'environnement critique (.env)
```
JWT_SECRET=votre_clé_secrète_très_complexe_ici
NODE_ENV=production
DATABASE_URL=votre_bd_securisée
FRONTEND_URL=votre_domaine_frontend
PORT=5000
```

### Recommandations
1. ✅ Changer `JWT_SECRET` en production
2. ✅ Utiliser HTTPS en production
3. ✅ Intégrer un vrai système de paiement (Stripe, PayPal)
4. ✅ Rate limiting sur les endpoints
5. ✅ Logs de sécurité des transactions
6. ✅ Chiffrement de la base de données sensible
7. ✅ 2FA pour les comptes sensibles

---

## 🧪 Test des Endpoints

### 1. Inscription sécurisée
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@test.com",
    "password": "SecurePass123",
    "role": "CLIENT"
  }'
```

### 2. Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@test.com",
    "password": "SecurePass123"
  }'
```

### 3. Créer paiement (authentifié)
```bash
curl -X POST http://localhost:5000/api/payments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": 1,
    "amount": 50.00,
    "paymentMethod": "CARD",
    "description": "Service test"
  }'
```

---

## 📱 Frontend - Utiliser les Paiements

La page `/payment` est protégée par `ProtectedRoute`, donc accessible seulement si connecté.

**Lien dans NavBar:** 💳 Paiements (visible seulement si authentifié)

