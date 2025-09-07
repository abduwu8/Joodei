import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import Aurora from '../components/aurora';
import Loader from '../components/Loader';
import dashboardImage from '../images/Dashboardexample-modified.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simple validation - accept any email for now
        if (email.trim()) {
            setIsLoading(true);
            // Simulate API call delay
            setTimeout(() => {
                setIsLoading(false);
                navigate('/dashboard');
            }, 2000);
        }
    };

    const handleGoogleSignIn = () => {
        // Mock Google sign in - redirect to dashboard
        navigate('/dashboard');
    };

    return (
        <div className={`h-screen overflow-hidden relative ${isDark ? 'bg-[#020617]' : 'bg-white'}`}>
            {/* Aurora Background for Dark Mode */}
            {isDark && (
                <div className="absolute inset-0 z-0">
                    <Aurora 
                        colorStops={["#00FFFF", "#00CED1", "#40E0D0"]}
                        amplitude={0.8}
                        blend={0.6}
                    />
                </div>
            )}
            
            {/* Grid Background for Light Mode */}
            {!isDark && (
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                        `,
                        backgroundSize: "20px 30px",
                        WebkitMaskImage:
                            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                        maskImage:
                            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                    }}
                />
            )}
            
            {/* Fade overlay across entire width */}
            <div className="absolute inset-0 z-5">
                <div className={`w-full h-full ${isDark ? 'bg-gradient-to-r from-[#020617] via-[#020617]/80 via-[#020617]/40 via-[#020617]/10 to-transparent' : 'bg-gradient-to-r from-white via-white/80 via-white/40 via-white/10 to-transparent'}`}></div>
            </div>
            
            {/* Left Side - Login Form */}
            <div className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center px-8 py-12 z-10">
                <div className="w-full max-w-md space-y-6">
                    {/* Logo and Header */}
                    <div className="text-center">
                        
                        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Login
                        </h1>
                        <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    isDark 
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    isDark 
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                />
                                <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Remember for 30 days
                                </span>
                            </label>
                            <button
                                type="button"
                                className={`text-sm font-medium hover:underline ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}
                            >
                                Forgot password
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                                isDark 
                                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600' 
                                    : 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-700 hover:to-teal-700'
                            } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <Loader size={20} color="white" speed={1.5} />
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg border font-medium transition-colors ${
                                isDark 
                                    ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Sign in with Google
                        </button>

                        <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Don't have an account?{' '}
                            <button
                                type="button"
                                className={`font-medium hover:underline ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}
                            >
                                Sign up
                            </button>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side - Dashboard Preview */}
            <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:flex items-center justify-center z-10">
                
                {/* Dashboard Preview - Centered application window */}
                <div className="absolute top-[70%] right-[-120%] transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] z-10">
                    <div className={`w-full h-full rounded-[5rem] shadow-2xl ${isDark ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'} overflow-hidden p-4`}>
                        <div className={`w-full h-full rounded-[4rem] ${isDark ? 'border border-gray-600' : 'border border-gray-300'} overflow-hidden`}>
                            <img 
                                src={dashboardImage} 
                                alt="Dashboard Preview" 
                                className="w-full h-full object-cover object-left-top"
                            />
                        </div>
                    </div>
                </div>

               
            </div>
        </div>
    );
};

export default LoginPage;