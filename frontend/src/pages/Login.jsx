import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
import { GoogleIcon, FacebookIcon } from '../components/SocialIcons';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../utils/api';
import logo from '../assets/kolieshop (2).png';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register, googleLogin } = useAuth();
    // Actually, safer to manually handle backend call here then set user in context
    // Or add googleLogin to context. Let's do it manually first for simplicity then set user.
    // AuthContext usually exposes setUser or similar? Let's check AuthContext.
    // Assuming AuthContext has a way to update state or we just use login/register.
    // We can manually set localstorage and then window.location.reload() or better, add a set user method.
    // Let's check AuthContext again. For now, I'll rely on the backend response to effectively "log in" and then update the context/local storage.

    // Easier approach: The AuthContext reads from localStorage on mount. If we write to localStorage and set user state.
    // But better to check AuthContext content again.
    // Re-reading AuthContext... it has `setUser`.
    // Wait, `useAuth` returns `{ user, login, register, logout, loading }`. It doesn't expose `setUser`.
    // However, `login` function sets user.
    // I should probably add a `googleLogin` function to AuthContext or just mimic what `login` does here: api call -> setUser -> localStorage.
    // Since I cannot easily modify AuthContext in this same step without multiple calls, I will look at how `login` is implemented.
    // It does: `const { data } = await api.post('/users/login', ...); setUser(data); localStorage...`
    // I can't access `setUser` from here.
    // I will add `googleLogin` to `Login.jsx` which does the API call, writes to localStorage, and then I will force a reload OR I will edit AuthContext in a next step to expose a cleaner method.
    // Actually, the user asked to make the button work.
    // I will try to implement it here by calling a helper that I will add to AuthContext in a sec.
    // Or I can just reload the page after success if I can't access setUser.
    // Let's modify AuthContext first? No, parallel calls.
    // I will implement the logic here and assumes I will expose `googleLogin` or `handleSocialLogin` in AuthContext.
    // Wait, I can make `googleLogin` inside the component if I can access `setUser`. I can't.
    // Okay, I will modify `Login.jsx` to import `useGoogleLogin` and define the handler, BUT I will also need to update `AuthContext` to handle the state update.
    // Let's do the AuthContext update in the next step to be clean.
    // For now, I'll allow the google button to get the token. 

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                await googleLogin(tokenResponse.access_token);
                navigate('/');
            } catch (err) {
                console.error(err);
                setError('Erreur connexion Google');
            }
        },
        onError: errorResponse => {
            console.error(errorResponse);
            setError("Échec de l'authentification Google");
        },
    });

    // Backend implementation verification:
    // I implemented `verifyIdToken`. This expects a JWT.
    // If `useGoogleLogin` returns access_token, verifyIdToken will fail.
    // I should change backend to `axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${token}` } })`
    // This is much easier.

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
            {/* Left Section ... */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* ... */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200')" }}
                />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                <div className="relative z-10 flex flex-col justify-center items-center px-24 text-white text-center">
                    <Link to="/" className="mb-8 hidden lg:block">
                        <img src={logo} alt="KolieShop" className="h-[180px] w-auto object-contain brightness-0 invert" />
                    </Link>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight">
                        Bienvenue sur KolieShop
                    </h1>
                    <p className="text-2xl text-white font-normal mb-20 max-w-md opacity-90 leading-relaxed">
                        Découvrez des milliers de produits à prix <br /> imbattables
                    </p>

                    {/* Metrics */}
                    <div className="flex items-center space-x-12">
                        <div className="text-center">
                            <span className="block text-4xl font-bold mb-2 tracking-tighter">10K+</span>
                            <span className="text-sm text-white font-medium opacity-70 uppercase tracking-widest">Produits</span>
                        </div>
                        <div className="w-[1px] h-16 bg-white opacity-20" />
                        <div className="text-center">
                            <span className="block text-4xl font-bold mb-2 tracking-tighter">50K+</span>
                            <span className="text-sm text-white font-medium opacity-70 uppercase tracking-widest">Clients</span>
                        </div>
                        <div className="w-[1px] h-16 bg-white opacity-20" />
                        <div className="text-center">
                            <span className="block text-4xl font-bold mb-2 tracking-tighter">4.8</span>
                            <span className="text-sm text-white font-medium opacity-70 uppercase tracking-widest">Note Moyenne</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-44 py-12 relative bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-[420px] w-full mx-auto">
                    <div className="mb-10">
                        <Link to="/" className="inline-block mb-8 lg:hidden">
                            <img src={logo} alt="KolieShop" className="h-[140px] w-auto object-contain" />
                        </Link>
                        <h2 className="text-[2.2rem] font-bold text-[#111827] dark:text-white mb-2">Connexion</h2>
                        <p className="text-[#4b5563] dark:text-gray-400 font-normal text-md">Connectez-vous à votre compte</p>
                        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                    </div>

                    <form className="space-y-6" onSubmit={submitHandler}>
                        {/* Email */}
                        <div>
                            <label className="block text-[0.9rem] font-medium text-[#374151] dark:text-gray-300 mb-2">Adresse email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-[#d1d5db] dark:border-gray-700 rounded-lg py-2.5 pl-11 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-[#111827] dark:text-white font-normal placeholder-[#9ca3af] dark:placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[0.9rem] font-medium text-[#374151] dark:text-gray-300 mb-2">Mot de passe</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-[#d1d5db] dark:border-gray-700 rounded-lg py-2.5 pl-11 pr-11 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-[#111827] dark:text-white font-normal placeholder-[#9ca3af] dark:placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9ca3af] hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#d1d5db] dark:border-gray-600 bg-white dark:bg-gray-700 text-primary focus:ring-primary/20" />
                                <span className="text-[0.85rem] font-normal text-[#4b5563] dark:text-gray-400">Se souvenir de moi</span>
                            </label>
                            <Link to="/forgot-password" className="text-[0.85rem] font-medium text-primary hover:text-orange-600 transition-colors">Mot de passe oublié ?</Link>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="w-full bg-primary hover:bg-[#f97316] text-white font-semibold py-3 rounded-lg shadow-sm transition-all text-[1rem]">
                            Se connecter
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[#4b5563] dark:text-gray-400 font-normal mb-8 text-[0.9rem]">
                            Vous n'avez pas de compte ? <Link to="/register" className="text-primary font-medium hover:underline">Créer un compte</Link>
                        </p>

                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#e5e7eb] dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-900 text-[#6b7280] dark:text-gray-500 font-normal transition-colors duration-300">Ou continuer avec</span>
                            </div>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleGoogleLogin()}
                                className="flex items-center justify-center space-x-2 border border-[#d1d5db] dark:border-gray-700 rounded-lg py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-[#374151] dark:text-gray-300 text-[0.9rem]"
                            >
                                <GoogleIcon size={20} />
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center space-x-2 border border-[#d1d5db] dark:border-gray-700 rounded-lg py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-[#374151] dark:text-gray-300 text-[0.9rem]">
                                <FacebookIcon size={22} />
                                <span>Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar items (Home link centered) */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-[#6b7280] dark:text-gray-500 hover:text-primary dark:hover:text-primary transition-colors font-medium text-sm cursor-pointer whitespace-nowrap">
                    <Home size={16} />
                    <Link to="/">Retour à l'accueil</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
