import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, RefreshCw, Code2, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/BGR_logo.png';

const API_URL = "https://34896ba195465a.lhr.life";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [formData, setFormData] = useState({
        nik: '',
        password: '',
        captcha: ''
    });

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('blink_token');
        if (token) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    // --- REAL LOGIN (Connects to Database) ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            console.log(`Attempting login to: ${API_URL}/login`);
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nik: formData.nik,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login Success!");
                localStorage.setItem('blink_token', data.token);
                localStorage.setItem('blink_user', JSON.stringify(data.user));
                navigate('/');
            } else {
                setErrorMsg(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Connection Error:", error);
            setErrorMsg("Cannot connect to the server. Is backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    // --- DEMO LOGIN ---
    const { login } = useAuth();

    const handleDemoLogin = (role: any) => {
        login(role);
        navigate('/');
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-10 space-y-8">

            {/* Header / Logo */}
            <div className="flex flex-col items-center text-center space-y-6">
                <img src={logo} alt="BGR Logistik Indonesia" className="h-12 w-auto object-contain" />
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                    BLINK <span className="mx-2">|</span> PT. BGR Logistik Indonesia
                </h1>
            </div>

            {/* Error Message Display */}
            {errorMsg && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-sm">
                    {errorMsg}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="NIK"
                        value={formData.nik}
                        onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                        className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 text-slate-700"
                        required
                    />
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Kata Sandi"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 text-slate-700 pr-12"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full px-3 text-white bg-teal-500 hover:bg-teal-600 rounded-r-md transition-colors flex items-center justify-center w-12"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Captcha (Visual) */}
                <div className="flex flex-col gap-1">
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Kode Captcha"
                            className="flex-1 px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 text-slate-700"
                        />
                        <div className="h-12 bg-slate-100 border border-slate-200 rounded px-4 flex items-center justify-center relative overflow-hidden w-32 select-none">
                            <span className="font-mono text-2xl font-bold tracking-widest text-slate-600 rotate-3 transform skew-x-6">AXVSU</span>
                        </div>
                        <button type="button" className="text-slate-800 hover:text-primary transition-colors">
                            <RefreshCw size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-2 sp
                ace-y-4 text-center">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 text-white font-medium rounded-full shadow-lg transition-all duration-300 transform 
                            ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-cyan-400 hover:bg-cyan-500 hover:-translate-y-0.5 shadow-cyan-400/30'}
                        `}
                    >
                        {isLoading ? 'Memuat...' : 'Masuk'}
                    </button>

                    <div className="text-center">
                        <a href="#" className="font-medium text-slate-600 hover:text-primary transition-colors">
                            Lupa Kata Sandi / Akun Terblokir ?
                        </a>
                    </div>
                </div>
            </form>

            {/* DEMO ACCESS (For Testing RBAC) */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Demo Access</p>
                <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={() => handleDemoLogin('super_admin')}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg transition-colors border border-indigo-200"
                    >
                        <Code2 size={16} /> Login as Super Admin (All Access)
                    </button>
                    <button
                        onClick={() => handleDemoLogin('admin')}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg transition-colors border border-emerald-200"
                    >
                        <Shield size={16} /> Login as Admin (Docs Only)
                    </button>
                    <button
                        onClick={() => handleDemoLogin('user')}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200"
                    >
                        <User size={16} /> Login as User (Dashboard Only)
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-2 text-center text-sm text-slate-500">
                <p>&copy; 2026 Powered By <span className="font-bold text-teal-600">BGR Access</span>.</p>
            </div>
        </div>
    );
};

export default Login;