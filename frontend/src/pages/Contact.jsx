import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';
import contactHero from '../assets/contact-hero.png';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        }, 1500);
    };

    const contactInfo = [
        {
            icon: <MapPin className="text-primary" size={24} />,
            title: 'Notre Siège',
            details: "Grand Marché, N'Zérékoré, Guinée",
            description: 'Ouvert au public du Lundi au Samedi.'
        },
        {
            icon: <Phone className="text-primary" size={24} />,
            title: 'Téléphone',
            details: '+224 620 00 00 00',
            description: 'Support disponible 24h/24 par WhatsApp.'
        },
        {
            icon: <Mail className="text-primary" size={24} />,
            title: 'Email',
            details: 'support@kolieshop.com',
            description: 'Réponse sous 24 heures maximum.'
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header Section with Background Image */}
            <div className="relative py-32 md:py-48 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={contactHero}
                        alt="Contact Background"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Parlons de votre <span className="text-primary italic">Projet</span>
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-medium">
                        Vous avez une question, une suggestion ou besoin d'assistance ? Notre équipe est là pour vous accompagner à chaque étape de votre expérience.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        {contactInfo.map((info, i) => (
                            <div key={i} className="flex gap-5 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-primary/20 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    {info.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{info.title}</h3>
                                    <p className="text-primary font-semibold mb-2">{info.details}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{info.description}</p>
                                </div>
                            </div>
                        ))}

                        {/* Social & Hours */}
                        <div className="p-8 rounded-2xl bg-primary text-white overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Clock size={20} /> Heures d'ouverture
                                </h3>
                                <div className="space-y-2 opacity-90 text-sm">
                                    <div className="flex justify-between border-b border-white/20 pb-2">
                                        <span>Lundi - Vendredi</span>
                                        <span className="font-bold">08:00 - 18:00</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/20 pb-2">
                                        <span>Samedi</span>
                                        <span className="font-bold">09:00 - 15:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Dimanche</span>
                                        <span className="font-bold">Fermé</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800">
                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                    <MessageSquare className="text-primary" /> Envoyez-nous un message
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                    Nous répondons généralement en moins de 2 heures pendant les jours ouvrables.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Nom complet</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="Ex: Jean Dupont"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Adresse Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="jean@exemple.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Sujet</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Comment pouvons-nous vous aider ?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Message</label>
                                    <textarea
                                        required
                                        rows="5"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                        placeholder="Détaillez votre demande ici..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-orange-600 text-white font-extrabold py-5 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 group"
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Envoyer le message
                                            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {submitted && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-center font-bold animate-in fade-in slide-in-from-top-2">
                                        Votre message a été envoyé avec succès ! Nous reviendrons vers vous très vite.
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Map Section */}
            <section className="h-[450px] w-full bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                <iframe
                    src="https://maps.google.com/maps?q=Grand%20March%C3%A9%20de%20N'Z%C3%A9r%C3%A9kor%C3%A9&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: document.documentElement.classList.contains('dark') ? 'invert(90%) hue-rotate(180deg)' : 'none' }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Localisation N'Zérékoré"
                ></iframe>
                <div className="absolute bottom-8 left-8 right-8 lg:left-auto lg:w-96 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 pointer-events-auto">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Globe className="text-primary" /> Siège Social KolieShop
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Grand Marché, Quartier Commercial, N'Zérékoré, République de Guinée.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Contact;
