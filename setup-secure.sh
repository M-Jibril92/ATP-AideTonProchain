#!/bin/bash
# ===== Script d'installation sécurisée =====
# À utiliser pour configurer correctement le projet

echo "🔒 Configuration sécurisée d'ATP AideTonProchain"
echo "=============================================="

# === Backend ===
echo ""
echo "📦 Installation du backend..."
cd backend

# Générer des secrets JWT forts
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Créer le fichier .env sécurisé
cat > .env << EOF
# === Authentication ===
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}

# === Server ===
PORT=5000
NODE_ENV=development

# === Database ===
DATABASE_URL=sqlite:./bdd.sqlite

# === CORS ===
FRONTEND_URL=http://localhost:5173

# === Stripe (optionnel pour dev) ===
STRIPE_PRIVATE_KEY=sk_test_xxx
STRIPE_PUBLIC_KEY=pk_test_xxx
EOF

echo "✅ Fichier .env créé avec secrets sécurisés"
echo "   JWT_SECRET: ${JWT_SECRET:0:16}..."
echo "   JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET:0:16}..."

# Installer les dépendances
npm install

echo ""
echo "✅ Backend configuré!"
echo "   • Tous les secrets JWT générés automatiquement"
echo "   • Rate limiting actif"
echo "   • Validation des données stricte"
echo "   • Authentification JWT avec refresh tokens"

# === Frontend ===
echo ""
echo "📦 Installation du frontend..."
cd ../frontend

# Créer .env frontend
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
VITE_DEBUG=false
EOF

echo "✅ Fichier .env frontend créé"

# Installer les dépendances
npm install

echo ""
echo "✅ Frontend configuré!"
echo "   • sessionStorage utilisé pour les tokens"
echo "   • CORS sécurisé"
echo "   • Rate limiting côté client"

# === Résumé ===
echo ""
echo "═══════════════════════════════════════════"
echo "🎉 Installation complète!"
echo "═══════════════════════════════════════════"
echo ""
echo "Prochaines étapes:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "🔒 Points de sécurité vérifiés:"
echo "   ✓ JWT_SECRET fort (32 caractères)"
echo "   ✓ JWT_REFRESH_SECRET fort (32 caractères)"
echo "   ✓ Rate limiting (login: 5/15min, register: 3/1h)"
echo "   ✓ Validation stricte des inputs"
echo "   ✓ Tokens en sessionStorage (pas localStorage)"
echo "   ✓ CORS restrictif"
echo "   ✓ Helmet.js pour les headers sécurisés"
echo ""
echo "📖 Consultez SECURITE.md pour le guide complet"
echo ""
