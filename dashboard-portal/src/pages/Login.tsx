import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import logo from '../assets/BGR_logo.png';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        nik: '',
        password: '',
        captcha: ''
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Login
        if (formData.nik && formData.password) {
            navigate('/');
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-10 space-y-8">

            {/* Header / Logo */}
            <div className="flex flex-col items-center text-center space-y-6">
                <img src={logo} alt="BGR Logistik Indonesia" className="h-12 w-auto object-contain" />
                <h1 className="text-xl md:text-2xl font-normal text-slate-800">
                    SISKA <span className="mx-2">|</span> PT. BGR Logistik Indonesia
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">

                {/* NIK Input */}
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

                {/* Password Input */}
                <div className="space-y-1 relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
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

                {/* Captcha Section */}
                <div className="flex flex-col gap-1">
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Captcha Words"
                            value={formData.captcha}
                            onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                            className="flex-1 px-4 py-3 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 text-slate-700"
                            required
                        />

                        {/* Mock Captcha Image */}
                        <div className="h-12 bg-slate-100 border border-slate-200 rounded px-4 flex items-center justify-center relative overflow-hidden w-32 select-none">
                            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_6px)]" />
                            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,#000_5px,#000_6px)]" />
                            <span className="font-mono text-2xl font-bold tracking-widest text-slate-600 rotate-3 transform skew-x-6">AXVSU</span>
                        </div>

                        <button type="button" className="text-slate-800 hover:text-primary transition-colors">
                            <RefreshCw size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                    <span className="text-sm text-slate-500">Masukan captcha</span>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-6 text-center">
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-cyan-400 hover:bg-cyan-500 text-white font-medium rounded-full shadow-lg shadow-cyan-400/30 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Login
                    </button>

                    <div className="text-center">
                        <a href="#" className="font-medium text-slate-600 hover:text-primary transition-colors">
                            Lupa Password / Akun Terblokir ?
                        </a>
                    </div>
                </div>
            </form>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
                <p>&copy; 2026 Powered By <span className="font-bold text-teal-600">BGR Access</span>. All rights reserved.</p>
            </div>

        </div>
    );
};

export default Login;
