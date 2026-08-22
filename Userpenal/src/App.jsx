import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ChangePassword from './pages/auth/ChangePassword';
import Dashboard from './pages/Dashboard/Dashboard';

function ProtectedRoute({ children }) {
  return localStorage.getItem('userToken')
    ? children
    : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
