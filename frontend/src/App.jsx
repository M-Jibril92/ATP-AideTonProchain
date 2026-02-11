import AdminOrders from './pages/AdminOrders';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

// Pages existantes
import Home from './pages/Home';
import About from './pages/About';
import Tasks from './pages/Tasks';
import Providers from './pages/Providers';
import Contact from './pages/Contact';
import Reservation from './pages/Reservation';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomTasks from './pages/CustomTasks';
import Payment from './pages/Payment';

// Import de la page d'activation
import Activate from './pages/Activate';

// Pages de réinitialisation du mot de passe
import PasswordReset from './pages/PasswordReset';
import PasswordResetConfirm from './pages/PasswordResetConfirm';

// Nouvelle page
import SelectTime from './pages/SelectTime';

// Composant de route protégée
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/custom-tasks" element={<CustomTasks />} />

          {/* Nouvelle étape : choix du créneau horaire */}
          <Route path="/select-time" element={<SelectTime />} />

          {/* Page de réservation protégée */}
          <Route
            path="/reservation"
            element={
              <ProtectedRoute>
                <Reservation />
              </ProtectedRoute>
            }
          />

          {/* Page de paiement protégée */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />

          {/* Route d'activation */}
          <Route path="/activate" element={<Activate />} />

          {/* Routes de réinitialisation de mot de passe */}
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />

          {/* Espace admin : commandes passées */}
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          {/* Route fallback */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </main>
    </div>
  );
}
