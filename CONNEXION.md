# Guide de connexion Backend-Frontend

## Configuration

### Backend
Le serveur Express écoute sur `http://localhost:5000` (configurable via `.env`)

**Fichiers importants:**
- `server.js` - Configuration CORS et routes API
- `.env` - Variables d'environnement (PORT, FRONTEND_URL, JWT_SECRET, etc.)
- `routes/auth.js` - Endpoints d'authentification
- `routes/service.js` - Endpoints des services

### Frontend
L'application React (Vite) tourne sur `http://localhost:5173`

**Fichiers importants:**
- `.env` - Variable `VITE_API_URL` pointant vers le backend
- `src/services/api.js` - Service centralisé pour tous les appels API
- `src/contexts/AuthContext.jsx` - Gestion de l'authentification

## Endpoints API disponibles

### Authentification (`/api/auth`)
- `POST /api/auth/register` - Inscription
  ```json
  { "name": "string", "email": "string", "password": "string", "role": "client|provider" }
  ```
- `POST /api/auth/login` - Connexion
  ```json
  { "email": "string", "password": "string" }
  ```

### Services (`/api/services`)
- `GET /api/services` - Récupérer tous les services
- `GET /api/services/:id` - Récupérer un service
- `POST /api/services` - Créer un service (authentifié)
- `PUT /api/services/:id` - Modifier un service (authentifié)
- `DELETE /api/services/:id` - Supprimer un service (authentifié)

## Lancement

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

## Utiliser l'API depuis le frontend

Exemple avec le service API centralisé:

```jsx
import { authAPI, servicesAPI } from '../services/api';

// Authentification
await authAPI.login('user@email.com', 'password');
await authAPI.register({ name: 'John', email: 'john@email.com', password: 'pass' });
authAPI.logout();

// Services
const services = await servicesAPI.getAll();
const service = await servicesAPI.getById(1);
await servicesAPI.create({ title: 'New Service', description: 'Description' });
```

## Authentification

Le token JWT est stocké dans `localStorage` avec la clé `token`.
Il est automatiquement inclus dans les en-têtes des requêtes authentifiées via le header `Authorization: Bearer <token>`.

## Variables d'environnement

### Backend (`.env`)
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_key
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```
