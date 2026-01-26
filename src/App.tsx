import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SiteConfig from './pages/admin/SiteConfig';
import DocumentManager from './pages/admin/DocumentManager';
import Login from './pages/Login';
import UserManagement from './pages/admin/UserManagement';
import { AdminProvider } from './context/AdminContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';

// 1. Create a "Guard" component
// This checks if the user has a token. If not, kicks them to /login
const ProtectedRoute = ({ children }: { children?: any }) => {
    const token = localStorage.getItem('blink_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Layout><Outlet /></Layout>;
};

function App() {
    return (
        <SettingsProvider>
            <AuthProvider>
                <AdminProvider>
                    <Routes>
                        {/* Auth Routes - Public */}
                        <Route path="/login" element={
                            <Layout variant="auth">
                                <Login />
                            </Layout>
                        } />

                        {/* Dashboard Routes - Protected (Locked) */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/admin/users" element={<UserManagement />} />
                            <Route path="/admin/config" element={<SiteConfig />} />
                            <Route path="/admin/documents" element={<DocumentManager />} />
                        </Route>

                        {/* Fallback to login if no route matches */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AdminProvider>
            </AuthProvider>
        </SettingsProvider>
    );
}

export default App;