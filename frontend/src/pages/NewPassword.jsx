import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import logo from '../assets/kolieshop (2).png';

const NewPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const email = sessionStorage.getItem('resetEmail');
    const code = sessionStorage.getItem('resetCode');

    useEffect(() => {
        if (!email || !code) {
            navigate('/forgot-password');
        }
    }, [email, code, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);
        try {
            await api.put('/users/resetpassword', {
                email,
                code,
                password,
            });

            setSuccess(true);
            setMessage('Votre mot de passe a été réinitialisé avec succès !');
            sessionStorage.removeItem('resetEmail');
            sessionStorage.removeItem('resetCode');

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 font-sans">
                <div className="max-w-md w-full text-center space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                            <CheckCircle2 size={48} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Succès !</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
                        <p className="text-sm text-gray-500">Redirection vers la page de connexion...</p>
                    </div>
                    <Link
                        to="/login"
                        className="block w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg"
                    >
                        Aller à la connexion
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
            {/* Left Section - Hero/Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/90 via-[#9370db]/80 to-[#6a5acd]/90" />
                <div className="relative z-10 flex flex-col justify-center items-center px-24 text-white text-center w-full">
                    <Link to="/" className="mb-8 hidden lg:block">
                        <img src={logo} alt="KolieShop" className="h-[180px] w-auto object-contain brightness-0 invert" />
                    </Link>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
                        Bienvenue sur KolieShop
                    </h1>
                    <p className="text-lg text-white font-normal mb-8 max-w-md opacity-90 leading-relaxed">
                        Choisissez un nouveau mot de passe fort <br /> pour protéger vos accès.
                    </p>
                </div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-44 py-12 relative bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-[420px] w-full mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <Link to="/" className="inline-block mb-8 lg:hidden">
                            <img src={logo} alt="KolieShop" className="h-[60px] w-auto object-contain mx-auto" />
                        </Link>
                        <h2 className="text-[2.2rem] font-bold text-gray-800 dark:text-white mb-3">Nouveau mot de passe</h2>
                        <p className="text-gray-600 dark:text-gray-400 font-normal text-sm leading-relaxed">
                            Votre identité a été vérifiée. Veuillez choisir votre nouveau mot de passe.
                        </p>
                        {error && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-lg text-sm">{error}</div>}
                    </div>

                    <form className="space-y-6" onSubmit={submitHandler}>
                        {/* Password */}
                        <div>
                            <label className="block text-[0.9rem] font-medium text-gray-700 dark:text-gray-300 mb-2">Nouveau mot de passe</label>
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
                                    required
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
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 pl-11 pr-11 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-gray-800 dark:text-white font-normal placeholder-gray-400 dark:placeholder-gray-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 rounded-lg shadow-lg transition-all text-base disabled:opacity-50"
                        >
                            {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewPassword;
