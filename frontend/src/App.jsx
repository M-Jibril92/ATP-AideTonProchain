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

          <Route path="/login" element={<Login />} />

          {/* Route fallback */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </main>
    </div>
  );
}
