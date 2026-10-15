import { Routes, Route } from 'react-router';
import Register from '@/pages/Register';
import Login from '@/pages/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/iniciar-sesion" element={<Login />} />
      <Route path="/registrarse" element={<Register />} />
    </Routes>
  );
}