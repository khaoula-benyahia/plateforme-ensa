import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NouvelleDemande from './pages/NouvelleDemande';
import SuiviDemandes from './pages/SuiviDemandes';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/" />;
}

function AdminRoute({ children }) {
  return localStorage.getItem('adminToken') ? children : <Navigate to="/admin-login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/nouvelle-demande" element={<PrivateRoute><NouvelleDemande /></PrivateRoute>} />
        <Route path="/suivi" element={<PrivateRoute><SuiviDemandes /></PrivateRoute>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}