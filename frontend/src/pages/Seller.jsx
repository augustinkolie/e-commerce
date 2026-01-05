import React from 'react';
import { Store, CheckCircle, TrendingUp, Shield, Users } from 'lucide-react';

const Seller = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block p-4 bg-orange-100 dark:bg-orange-900/30 rounded-2xl mb-6">
                        <Store size={48} className="text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Devenez Vendeur sur KolieShop</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Rejoignez des milliers de vendeurs et développez votre activité avec notre plateforme e-commerce leader.
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-6 text-green-600">
                            <TrendingUp size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Croissance Rapide</h3>
                        <p className="text-gray-500 dark:text-gray-400">Accédez à des millions de clients potentiels dès le premier jour.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                            <Shield size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Paiements Sécurisés</h3>
                        <p className="text-gray-500 dark:text-gray-400">Garantie de paiement et protection contre la fraude pour chaque vente.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-6 text-purple-600">
                            <Users size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Support Dédié</h3>
                        <p className="text-gray-500 dark:text-gray-400">Une équipe d'experts à votre disposition pour vous aider à réussir.</p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Commencez votre inscription</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prénom</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Professionnel</label>
                                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom de la boutique</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type de produits</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                                    <option>Électronique</option>
                                    <option>Mode & Vêtements</option>
                                    <option>Maison & Déco</option>
                                    <option>Beauté & Santé</option>
                                    <option>Sport & Loisirs</option>
                                    <option>Autre</option>
                                </select>
                            </div>

                            <button type="button" className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all transform active:scale-95">
                                Envoyer ma candidature
                            </button>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                En cliquant sur envoyer, vous acceptez nos conditions générales de vente.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Seller;
