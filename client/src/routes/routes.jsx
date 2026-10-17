import { Routes, Route } from 'react-router';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Price from '@/pages/Price';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/iniciar-sesion" element={<Login />} />
      <Route path="/registrarse" element={<Register />} />
      <Route path="/precios" element={<Price />} />
    </Routes>
  );
}