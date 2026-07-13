import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Ventes from './pages/Ventes';
import Location from './pages/Location';
import VehiculeDetail from './pages/VehiculeDetail';
import Contact from './pages/Contact';
import Entretien from './pages/Entretien';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Overview from './pages/admin/Overview';
import Sales from './pages/admin/Sales';
import Rentals from './pages/admin/Rentals';
import MessagesAdmin from './pages/admin/Messages';
import Reservations from './pages/admin/Reservations';
import Entretiens from './pages/admin/Entretiens';
import ServicesAdmin from './pages/admin/Services';
import Settings from './pages/admin/Settings';
import VehiculeForm from './pages/admin/VehiculeForm';

function PublicRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/ventes" element={<PageTransition><Ventes /></PageTransition>} />
        <Route path="/location" element={<PageTransition><Location /></PageTransition>} />
        <Route path="/vehicule/:id" element={<PageTransition><VehiculeDetail /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/entretien" element={<PageTransition><Entretien /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path="ventes" element={<Sales />} />
          <Route path="ventes/nouveau" element={<VehiculeForm type="vente" />} />
          <Route path="ventes/:id" element={<VehiculeForm type="vente" />} />
          <Route path="locations" element={<Rentals />} />
          <Route path="locations/nouveau" element={<VehiculeForm type="location" />} />
          <Route path="locations/:id" element={<VehiculeForm type="location" />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="entretiens" element={<Entretiens />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="parametres" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PublicRoutes />
      </main>
      <Footer />
    </div>
  );
}
