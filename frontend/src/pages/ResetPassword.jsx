import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Hash, Mail, Key } from 'lucide-react';
import api from '../utils/api';
import logo from '../assets/kolieshop (2).png';

const ResetPassword = () => {
    const [email, setEmail] = useState(sessionStorage.getItem('resetEmail') || '');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return; // Only numbers

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pasteData.every(char => !isNaN(char))) {
            const newOtp = [...otp];
            pasteData.forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            // Focus last filled or next empty
            const focusIndex = pasteData.length < 6 ? pasteData.length : 5;
            inputRefs.current[focusIndex].focus();
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const code = otp.join('');
            if (code.length < 6) {
                setError('Veuillez entrer le code complet à 6 chiffres');
                setLoading(false);
                return;
            }

            await api.post(`/users/verifycode`, {
                email,
                code,
            });

            // Store code for next step
            sessionStorage.setItem('resetCode', code);

            setMessage('Code vérifié avec succès ! redirection...');
            setTimeout(() => {
                navigate('/new-password');
            }, 1500);
        } catch (error) {
            setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

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
                    <p className="text-lg text-white font-normal mb-20 max-w-md opacity-90 leading-relaxed">
                        Réinitialisez votre mot de passe pour accéder <br /> à votre compte
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
                        <h2 className="text-[2.2rem] font-bold text-gray-800 dark:text-white mb-3">Vérification</h2>
                        <p className="text-gray-600 dark:text-gray-400 font-normal text-sm leading-relaxed">
                            Veuillez entrer le code à 6 chiffres envoyé à votre adresse email.
                        </p>
                        {message && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{message}</div>}
                        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
                    </div>

                    <form className="space-y-6" onSubmit={submitHandler}>
                        {/* Email (readonly or editable) */}
                        <div>
                            <label className="block text-[0.9rem] font-medium text-gray-700 dark:text-gray-300 mb-1.5 font-sans">Adresse email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 pl-11 pr-4 focus:outline-none focus:border-primary transition-all text-gray-800 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Reset Code (6 Boxes) */}
                        <div className="mb-6">
                            <label className="block text-[0.9rem] font-medium text-gray-700 dark:text-gray-300 mb-3 text-center lg:text-left">
                                Code de réinitialisation
                            </label>
                            <div className="flex justify-between gap-2 sm:gap-4" onPaste={handleOtpPaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-800 dark:text-white"
                                        required
                                    />
                                ))}
                            </div>
                        </div>
                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3.5 rounded-lg shadow-md transition-all text-base disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Vérification...' : 'Vérifier le code'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
