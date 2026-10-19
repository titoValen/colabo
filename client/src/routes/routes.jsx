import { Routes, Route } from 'react-router';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Price from '@/pages/Price';
import Landing from '@/pages/Landing';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/iniciar-sesion" element={<Login />} />
      <Route path="/registrarse" element={<Register />} />
      <Route path="/precios" element={<Price />} />
    </Routes>
  );
}