import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './tailwind.css';
import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Members from './pages/admin/Members.jsx';
import Employees from './pages/admin/Employees.jsx';
import Plans from './pages/admin/Plans.jsx';
import Payments from './pages/admin/Payments.jsx';
import CheckIn from './pages/admin/CheckIn.jsx';
import Settings from './pages/admin/Settings.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="employees" element={<Employees />} />
            <Route path="plans" element={<Plans />} />
            <Route path="payments" element={<Payments />} />
            <Route path="checkin" element={<CheckIn />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
