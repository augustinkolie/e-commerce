import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Shield, Zap, Award, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import aboutSeller from '../assets/about-seller.png';
import aboutHero from '../assets/about-hero.png';

const About = () => {
    const { user } = useAuth();
    const stats = [
        { label: 'Utilisateurs Actifs', value: '50K+' },
        { label: 'Produits Livrés', value: '1M+' },
        { label: 'Vendeurs Partenaires', value: '5K+' },
        { label: 'Note Moyenne', value: '4.9/5' },
    ];

    const values = [
        {
            icon: <Shield className="text-primary w-8 h-8" />,
            title: 'Sécurité & Confiance',
            description: 'Nous garantissons des transactions 100% sécurisées et une protection complète de vos données personnelles.'
        },
        {
            icon: <Zap className="text-primary w-8 h-8" />,
            title: 'Rapidité Exceptionnelle',
            description: 'Une plateforme fluide et des services de livraison optimisés pour vous faire gagner du temps.'
        },
        {
            icon: <Award className="text-primary w-8 h-8" />,
            title: 'Qualité Premium',
            description: 'Nous sélectionnons rigoureusement nos partenaires pour vous offrir uniquement le meilleur du marché.'
        },
        {
            icon: <Globe className="text-primary w-8 h-8" />,
            title: 'Impact Local',
            description: 'Nous soutenons les commerçants locaux tout en offrant une expérience de shopping internationale.'
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header Section with Background Image */}
            <div className="relative py-32 md:py-48 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={aboutHero}
                        alt="Boutique KolieShop"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center lg:text-left">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            Redéfinir le <span className="text-primary italic">E-commerce</span> de Demain
                        </h1>
                        <p className="text-xl text-gray-200 mb-8 leading-relaxed font-medium">
                            KolieShop n'est pas seulement une place de marché, c'est un écosystème conçu pour connecter les passionnés de qualité aux meilleurs produits, tout en garantissant simplicité et sécurité.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <section className="py-12 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                                <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                                <Target size={18} /> Notre Mission
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Créer des opportunités infinies pour acheteurs et vendeurs
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                Notre objectif est de supprimer les barrières du commerce traditionnel en offrant une plateforme intuitive, accessible n'importe où et n'importe quand. Nous croyons que chaque transaction est le début d'une relation de confiance.
                            </p>
                            <div className="space-y-4">
                                {['Innovation constante', 'Transparence totale', 'Satisfaction client prioritaire'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-semibold">
                                        <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                                            ✓
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="aspect-square bg-gradient-to-br from-primary to-orange-400 rounded-xl rotate-3 absolute inset-0 -z-10 opacity-20"></div>
                            <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
                                <img
                                    src={aboutSeller}
                                    alt="Notre expertise"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Les valeurs qui nous animent
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Notre culture d'entreprise repose sur des piliers solides qui guident chacune de nos décisions.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((v, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-2 transition-transform">
                                <div className="mb-6">{v.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{v.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {v.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-primary rounded-[2rem] p-12 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Prêt à vivre l'expérience KolieShop ?</h2>
                            <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
                                Rejoignez des milliers de clients satisfaits et commencez votre voyage dès aujourd'hui.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to={user ? "/profile" : "/register"} className="px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-xl inline-block">
                                    {user ? "Accéder à mon espace" : "Créer mon compte"}
                                </Link>
                                <Link to="/category" className="px-8 py-4 bg-primary-dark text-white rounded-xl font-bold border border-white/20 hover:bg-white/10 transition-colors inline-block text-center">
                                    Découvrir le catalogue
                                </Link>
                            </div>
                        </div>
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
