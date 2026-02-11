# 🌍 ATP - AideTonProchain

**Plateforme d'entraide locale sécurisée** | Asnières

Une application web pour connecter les personnes qui ont besoin d'aide avec des prestataires qualifiés. Frontend moderne en React, Backend sécurisé en Node.js.

---

## 🚀 Démarrage Rapide

### Installation Sécurisée

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Générer des secrets JWT forts dans .env

# Frontend  
cd frontend
npm install
cp .env.example .env
```

### Lancer le projet

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- 🔗 Frontend: <http://localhost:5173>
- 🔗 Backend API: <http://localhost:5000/api>

---

## 🔒 Sécurité Implémentée

✅ **Authentication:** JWT avec tokens courts (1h) + refresh longs (7j)  
✅ **Passwords:** Hachés bcrypt 12 rounds  
✅ **Rate Limiting:** 5 login/15min, 3 register/1h  
✅ **Validation:** Tous les inputs vérifiés strictement  
✅ **Headers:** Helmet.js pour protection HTTP  
✅ **Tokens:** sessionStorage (pas localStorage)  
✅ **CORS:** Restrictif au domaine frontend  

👉 **Consultez [SECURITE.md](./SECURITE.md) pour le guide complet**
