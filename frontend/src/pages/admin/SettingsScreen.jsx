import React from 'react';
import { Settings, Bell, Shield, Globe, Mail } from 'lucide-react';

const SettingsScreen = () => {
    return (
        <div className="space-y-6 pt-2">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6 font-semibold text-gray-900 dark:text-white">
                        <Globe className="text-primary" size={20} />
                        <h3>Général</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de la boutique</label>
                            <input type="text" defaultValue="KolieShop" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email de contact</label>
                            <input type="email" defaultValue="contact@kolieshop.com" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6 font-semibold text-gray-900 dark:text-white">
                        <Shield className="text-green-500" size={20} />
                        <h3>Sécurité</h3>
                    </div>
                    <div className="space-y-4">
                        <button className="w-full text-left px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between">
                            <span>Changer le mot de passe admin</span>
                            <Settings size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
