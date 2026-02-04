import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import SiteConfig from './pages/admin/SiteConfig';
import DocumentManager from './pages/admin/DocumentManager';
import Login from './pages/Login';
import { AdminProvider } from './context/AdminContext';

function App() {
    return (
        <AdminProvider>
            <Routes>
                {/* Auth Routes - No Sidebar/Topbar */}
                <Route path="/login" element={
                    <Layout variant="auth">
                        <Login />
                    </Layout>
                } />

                {/* Dashboard Routes - With Sidebar/Topbar */}
                <Route path="*" element={
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/admin/config" element={<SiteConfig />} />
                            <Route path="/admin/documents" element={<DocumentManager />} />
                        </Routes>
                    </Layout>
                } />
            </Routes>
        </AdminProvider>
    );
}

export default App;
