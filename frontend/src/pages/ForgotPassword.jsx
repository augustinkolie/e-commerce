import React, { useState } from 'react';
import { Mail, ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import logo from '../assets/kolieshop (2).png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/forgotpassword', { email });
            setMessage('Un code de réinitialisation vous a été envoyé.');
            setError('');
            // Store email in sessionStorage to pre-fill it in ResetPassword page
            sessionStorage.setItem('resetEmail', email);
            setTimeout(() => {
                navigate('/reset-password');
            }, 2000);
        } catch (error) {
            const errorMsg = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message;
            setError(errorMsg);
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
            {/* Left Section - Hero/Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200')" }}
                />
                {/* Gradient Overlay - Orange to Purple */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/90 via-[#9370db]/80 to-[#6a5acd]/90" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center px-24 text-white text-center w-full">
                    <Link to="/" className="mb-8 hidden lg:block">
                        <img src={logo} alt="KolieShop" className="h-[180px] w-auto object-contain brightness-0 invert" />
                    </Link>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
                        Bienvenue sur KolieShop
                    </h1>
                    <p className="text-lg text-white font-normal mb-20 max-w-md opacity-90 leading-relaxed">
                        Découvrez des milliers de produits à prix <br /> imbattables
                    </p>

                    {/* Metrics */}
                    <div className="flex items-center justify-center space-x-16">
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">10K+</div>
                            <div className="text-sm font-normal opacity-90">Produits</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">50K+</div>
                            <div className="text-sm font-normal opacity-90">Clients</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">4.8</div>
                            <div className="text-sm font-normal opacity-90">Note Moyenne</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-44 py-12 relative bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-[420px] w-full mx-auto">
                    {/* Back to Login Link */}
                    <Link
                        to="/login"
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-12 text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        <span>Retour à la connexion</span>
                    </Link>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-[2.2rem] font-bold text-gray-800 dark:text-white mb-3">Mot de passe oublié ?</h2>
                        <p className="text-gray-600 dark:text-gray-400 font-normal text-sm leading-relaxed">
                            Entrez votre email et nous vous enverrons un code pour réinitialiser votre mot de passe
                        </p>
                        {message && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">{message}</div>}
                        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                    </div>

                    <form className="space-y-6" onSubmit={submitHandler}>
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
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-sm transition-all text-base disabled:opacity-50">
                            {loading ? 'Envoi...' : 'Envoyer le code'}
                        </button>
                    </form>
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

export default ForgotPassword;
