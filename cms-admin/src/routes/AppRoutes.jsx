import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import ContentPages from '../pages/ContentPages';
import Categories from '../pages/Categories';
import Media from '../pages/Media';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/"           element={<Dashboard />} />
        <Route path="/users"      element={<Users />} />
        <Route path="/content"    element={<ContentPages />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/media"      element={<Media />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
