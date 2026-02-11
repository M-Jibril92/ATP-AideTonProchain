# 🔒 GUIDE DE SÉCURITÉ - ATP AideTonProchain

## Améliorations de Sécurité Implémentées

### 🛡️ Backend

#### 1. **Authentification & Tokens**
- ✅ JWT avec secret sécurisé (minimum 32 caractères)
- ✅ Tokens d'accès courts (1h) + tokens de rafraîchissement longs (7 jours)
- ✅ Vérification stricte des tokens avec algorithme HS256
- ✅ Endpoint `/api/auth/refresh` pour rafraîchir les tokens

#### 2. **Protection des Headers HTTP**
- ✅ **Helmet.js** : Protection contre les attaques communes
  - `X-Frame-Options: DENY` - Protection contre le clickjacking
  - `X-Content-Type-Options: nosniff` - Prévention du MIME sniffing
  - `Strict-Transport-Security` - Force HTTPS en production
  - `Content-Security-Policy` - Prévention XSS

#### 3. **Rate Limiting**
- ✅ Limite générale: 100 requêtes par 15 minutes
- ✅ Login: 5 tentatives par 15 minutes
- ✅ Register: 3 tentatives par 1 heure
- ✅ Prévention des attaques par force brute

#### 4. **Validation des Données**
- ✅ Email : Format RFC compliant + limité à 254 caractères
- ✅ Mot de passe : Minimum 8 caractères avec majuscule, minuscule, chiffre, caractère spécial
- ✅ Sanitisation XSS : Tous les inputs échappent les caractères HTML/JS
- ✅ Validation des rôles : Énumération stricte (CLIENT, PROVIDER, ADMIN)
- ✅ Vérification des montants de paiement (max 10 000€)

#### 5. **Authentification Sécurisée**
- ✅ Mots de passe hachés avec bcrypt (12 rounds, salt fort)
- ✅ Gestion appropriée des erreurs (messages génériques)
- ✅ Pas d'énumération d'utilisateurs possible
- ✅ Logs des tentatives suspectes

#### 6. **Autorisation & Contrôle d'Accès**
- ✅ Middleware d'authentification sur routes protégées
- ✅ Contrôle RBAC (Role-Based Access Control):
  - Services : Création/modification/suppression pour PROVIDER/ADMIN seulement
  - Paiements : Utilisateur voit ses paiements, seul ADMIN peut changer le statut
  - Seed : ADMIN seulement
- ✅ Vérification du propriétaire de la ressource

#### 7. **CORS Sécurisé**
- ✅ Origine restrictive (URL du frontend unique)
- ✅ Credentials : true (permet l'envoi de cookies)
- ✅ Méthodes limitées (GET, POST, PUT, DELETE)
- ✅ Headers blancs listés explicitement

#### 8. **Protection des Données**
- ✅ Aucun mot de passe retourné dans les réponses
- ✅ Messages d'erreur génériques (pas de stack trace)
- ✅ Logging des violations de sécurité

---

### 🎨 Frontend

#### 1. **Gestion Sécurisée des Tokens**
- ✅ Stockage en **sessionStorage** (pas localStorage vulnérable aux XSS)
- ✅ Tokens de refresh automatiques
- ✅ Clearing au logout
- ✅ Pas d'exposition des tokens en console ou en logs

#### 2. **Interception des Erreurs**
- ✅ Détection des erreurs 401 (token expiré)
- ✅ Rafraîchissement automatique du token
- ✅ Redirection vers login si token invalide
- ✅ Gestion des messages d'erreur utilisateur

#### 3. **Communication Sécurisée**
- ✅ HTTPS en production (nécessaire)
- ✅ Headers `Authorization: Bearer <token>` sur toutes les requêtes protégées
- ✅ Content-Type: application/json validé

#### 4. **Contexte d'Authentification**
- ✅ Vérification de l'existence du contexte
- ✅ État `isAuthenticated` basé sur la présence du token
- ✅ Gestion centralisée des erreurs d'auth

---

## 🔐 Installation & Configuration

### Backend

#### 1. Installer les dépendances
```bash
cd backend
npm install
```

#### 2. Configurer les variables d'environnement
Créer un fichier `.env` basé sur `.env.example` :

```bash
# Générer des secrets forts
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Puis dans `.env` :
```
JWT_SECRET=votre_secret_tres_long_minimum_32_caracteres
JWT_REFRESH_SECRET=votre_autre_secret_tres_long_minimum_32_caracteres
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

#### 3. Lancer le serveur
```bash
npm run dev  # Development
npm start    # Production
```

### Frontend

#### 1. Vérifier la configuration
Dans `vite.config.js`, l'URL backend est définie :
```javascript
VITE_API_URL=http://localhost:5000/api
```

#### 2. NE JAMAIS exposer les tokens
- ❌ Ne pas les mettre dans localStorage
- ❌ Ne pas les logguer en console
- ❌ Ne pas les mettre en URL
- ✅ sessionStorage seulement
- ✅ HTTP-only cookies (en production avec infrastructure appropriée)

---

## ⚠️ Sécurité en Production

### Essentiels
1. **HTTPS obligatoire** - Configurer SSL/TLS
2. **CORS restrictif** - Mettre l'URL frontend exacte
3. **JWT_SECRET unique et fort** - Minimum 64 caractères
4. **NODE_ENV=production** - Désactiver les stack traces
5. **Base de données** - Utiliser PostgreSQL/MySQL, pas SQLite
6. **Variables d'environnement** - Jamais commitées dans Git

### Recommandations
- [ ] Activer HSTS (Strict-Transport-Security)
- [ ] Configurer CSP approprié
- [ ] Ajouter logging/monitoring (Sentry, DataDog)
- [ ] Implémenter 2FA (Google Authenticator, Email)
- [ ] Audit de sécurité régulier
- [ ] Backup régulier de la BDD
- [ ] WAF (Web Application Firewall) en production
- [ ] Rate limiting au niveau CDN/LB

---

## 🧪 Tests de Sécurité

### Vérifier la validation des entrées
```bash
# Test XSS
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"<script>alert(1)</script>","lastName":"Test","email":"test@test.com","password":"Test123!@#"}'
# Résultat: Le script doit être échappé

# Test injection SQL (Sequelize protégé par défaut)
# Test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Résultat: Après 5, erreur 429 (Too Many Requests)
```

---

## 📋 Checklist de Vérification

- [ ] JWT_SECRET et JWT_REFRESH_SECRET définis et forts
- [ ] FRONTEND_URL correspond à l'URL réelle du frontend
- [ ] Base de données configurée (pas de BDD default en prod)
- [ ] Rate limiting actif
- [ ] Helmet.js actif
- [ ] Validation des inputs sur toutes les routes
- [ ] Authentification sur toutes les routes sensibles
- [ ] Tests de token expiré passent
- [ ] Errors génériques (pas de stack trace)
- [ ] HTTPS en production
- [ ] CORS restrictif
- [ ] sessionStorage utilisé au lieu de localStorage

---

## 🚨 Signaler une Vulnérabilité

Si vous découvrez une faille de sécurité:
1. NE PAS créer de GitHub issue publique
2. Contacter: [email de sécurité]
3. Fournir: Description, étapes de reproduction, impact potentiel

---

**Dernière mise à jour:** 10 février 2026
**Version:** 1.0 (Sécurisé)
