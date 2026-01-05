import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, ChevronRight, Loader2 } from 'lucide-react';
import logo from '../assets/kolieshop (2).png';
import api from '../utils/api';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const { data } = await api.post('/subscribers', { email });
            setStatus({ type: 'success', message: data.message });
            setEmail('');
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || "Une erreur est survenue lors de l'inscription"
            });
        } finally {
            setLoading(false);
            // Hide message after 5 seconds
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        }
    };

    return (
        <footer className="bg-[#111827] text-gray-400 transition-colors duration-300">
            {/* Newsletter Section */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Restez informé des dernières offres
                            </h2>
                            <p className="text-gray-500 font-medium">
                                Inscrivez-vous à notre newsletter et recevez 10% de réduction sur votre première commande
                            </p>
                        </div>
                        <div className="flex flex-col items-center lg:items-end gap-3">
                            <form onSubmit={handleSubscribe} className="relative w-full lg:w-[420px]">
                                <input
                                    type="email"
                                    placeholder="Votre adresse email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg pl-4 pr-32 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-all text-sm font-medium"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-1 top-1 bottom-1 bg-primary hover:bg-orange-600 text-white font-bold px-6 rounded-md transition-all whitespace-nowrap cursor-pointer text-sm shadow-sm flex items-center justify-center min-w-[100px] disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : "S'inscrire"}
                                </button>
                            </form>
                            {status.message && (
                                <p className={`text-sm mt-2 transition-all duration-300 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {status.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand & Socials */}
                    <div className="space-y-6 flex flex-col">
                        <div className="h-[40px] flex items-center"> {/* Alignment dummy container or match header height */}
                            <img
                                src={logo}
                                alt="KolieShop"
                                className="h-[120px] md:h-[160px] my-[-50px] ml-[-48px] w-auto object-contain brightness-0 invert"
                            />
                        </div>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Votre marketplace premium de confiance. Des milliers de produits de qualité, une livraison rapide et un service client exceptionnel.
                        </p>
                        <div className="flex space-x-3">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm border border-transparent"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-xl font-bold mb-8">Liens rapides</h3>
                        <ul className="space-y-4 font-medium">
                            <li key="about">
                                <a href="/about" className="flex items-center group hover:text-primary transition-colors">
                                    <ChevronRight size={14} className="mr-2 text-gray-400 group-hover:text-primary transition-colors" />
                                    À propos
                                </a>
                            </li>
                            <li key="contact">
                                <a href="/contact" className="flex items-center group hover:text-primary transition-colors">
                                    <ChevronRight size={14} className="mr-2 text-gray-400 group-hover:text-primary transition-colors" />
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white text-xl font-bold mb-8">Service client</h3>
                        <ul className="space-y-4 font-medium">
                            {["Centre d'aide", "Suivre ma commande", "Retours & Remboursements", "Livraison", "Nous contacter"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="flex items-center group hover:text-primary transition-colors">
                                        <ChevronRight size={14} className="mr-2 text-gray-400 group-hover:text-primary transition-colors" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Information */}
                    <div>
                        <h3 className="text-white text-xl font-bold mb-8">Informations légales</h3>
                        <ul className="space-y-4 font-medium">
                            {["Conditions d'utilisation", "Politique de confidentialité", "Politique des cookies", "Mentions légales"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="flex items-center group hover:text-primary transition-colors">
                                        <ChevronRight size={14} className="mr-2 text-gray-400 group-hover:text-primary transition-colors" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-sm font-medium text-gray-500">
                            © 2025 KolieShop. Tous droits réservés.
                        </p>
                        <div className="flex items-center space-x-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Google_Pay_logo.svg" alt="Google Pay" className="h-5" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
