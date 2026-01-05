import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Home, User } from 'lucide-react';
import { GoogleIcon, FacebookIcon } from '../components/SocialIcons';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/kolieshop (2).png';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
            {/* Left Section ... */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* ... */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#4169e1]/90 via-[#9370db]/80 to-[#ff6b6b]/90" />
                <div className="relative z-10 flex flex-col justify-center items-center px-24 text-white text-center w-full">
                    <Link to="/" className="mb-8 hidden lg:block">
                        <img src={logo} alt="KolieShop" className="h-[180px] w-auto object-contain brightness-0 invert" />
                    </Link>
                    {/* ... content ... */}
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
                        Rejoignez KolieShop
                    </h1>
                    <p className="text-lg text-white font-normal mb-16 max-w-md opacity-90 leading-relaxed">
                        Créez votre compte et profitez d'avantages <br /> exclusifs
                    </p>
                    {/* Benefits */}
                    <div className="space-y-6 w-full max-w-sm">
                        <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-base mb-1">Livraison Gratuite</h3>
                                <p className="text-sm text-white/80">Sur toutes vos commandes</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-base mb-1">Offres Exclusives</h3>
                                <p className="text-sm text-white/80">Réductions membres uniquement</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-base mb-1">Support 24/7</h3>
                                <p className="text-sm text-white/80">Assistance à tout moment</p>
                            </div>
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
                        <h2 className="text-[2.2rem] font-bold text-gray-800 dark:text-white mb-2">Créer un compte</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-normal text-md">Inscrivez-vous pour commencer vos achats</p>
                        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                    </div>

                    <form className="space-y-6" onSubmit={submitHandler}>
                        {/* Full Name */}
                        <div>
                            <label className="block text-[0.9rem] font-medium text-gray-700 dark:text-gray-300 mb-2">Nom complet</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Jean Dupont"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 pl-11 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-gray-800 dark:text-white font-normal placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[0.9rem] font-medium text-gray-700 dark:text-gray-300 mb-2">Adresse email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 pl-11 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-gray-800 dark:text-white font-normal placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[0.9rem] font-medium text-gray-700 dark:text-gray-300 mb-2">Mot de passe</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 pl-11 pr-11 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-gray-800 dark:text-white font-normal placeholder-gray-400 dark:placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-[0.9rem] font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmer le mot de passe</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 pl-11 pr-11 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-gray-800 dark:text-white font-normal placeholder-gray-400 dark:placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start space-x-2">
                            <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary focus:ring-primary/20" />
                            <label className="text-[0.85rem] font-normal text-gray-600 dark:text-gray-400">
                                J'accepte les <a href="#" className="text-primary font-medium hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-primary font-medium hover:underline">politique de confidentialité</a>
                            </label>
                        </div>

                        {/* Submit */}
                        <button className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-sm transition-all text-base">
                            Créer mon compte
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400 font-normal mb-8 text-[0.9rem]">
                            Vous avez déjà un compte ? <Link to="/login" className="text-primary font-medium hover:underline">Se connecter</Link>
                        </p>

                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-normal transition-colors duration-300">Ou continuer avec</span>
                            </div>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-300 text-[0.9rem]">
                                <GoogleIcon size={20} />
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-300 text-[0.9rem]">
                                <FacebookIcon size={22} />
                                <span>Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar items (Home link centered) */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors font-medium text-sm cursor-pointer whitespace-nowrap">
                    <Home size={16} />
                    <Link to="/">Retour à l'accueil</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
