import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SiteConfig from './pages/admin/SiteConfig';
import DocumentManager from './pages/admin/DocumentManager';
import Login from './pages/Login';
import { AdminProvider } from './context/AdminContext';
import { SettingsProvider } from './context/SettingsContext';

// 1. Create a "Guard" component
// This checks if the user has a token. If not, kicks them to /login
const ProtectedRoute = ({ children }: { children: any }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <SettingsProvider>
            <AdminProvider>
                <Routes>
                    {/* Auth Routes - Public */}
                    <Route path="/login" element={
                        <Layout variant="auth">
                            <Login />
                        </Layout>
                    } />

                    {/* Dashboard Routes - Protected (Locked) */}
                    <Route path="*" element={
                        <ProtectedRoute>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/admin/config" element={<SiteConfig />} />
                                    <Route path="/admin/documents" element={<DocumentManager />} />
                                </Routes>
                            </Layout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </AdminProvider>
        </SettingsProvider>
    );
}

export default App;