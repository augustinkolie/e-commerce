import React from 'react';
import { Truck, ShieldCheck, Headphones, RotateCcw } from 'lucide-react';

const features = [
    {
        id: 1,
        title: "Livraison rapide",
        description: "Livraison gratuite dès 50€ d'achat et expédition sous 24h",
        icon: Truck,
        color: "bg-blue-600",
        shadow: "shadow-blue-200"
    },
    {
        id: 2,
        title: "Paiement sécurisé",
        description: "Transactions 100% sécurisées avec cryptage SSL",
        icon: ShieldCheck,
        color: "bg-green-600",
        shadow: "shadow-green-200"
    },
    {
        id: 3,
        title: "Support 24/7",
        description: "Notre équipe est disponible pour vous aider à tout moment",
        icon: Headphones,
        color: "bg-purple-600",
        shadow: "shadow-purple-200"
    },
    {
        id: 4,
        title: "Retours gratuits",
        description: "30 jours pour changer d'avis, retours sans frais",
        icon: RotateCcw,
        color: "bg-orange-600",
        shadow: "shadow-orange-200"
    }
];

const Features = () => {
    return (
        <section className="py-16 bg-white dark:bg-gray-900 px-4 border-t border-gray-50 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.id} className="flex flex-col items-center text-center group">
                            <div className={`${feature.color} text-white p-4 rounded-2xl mb-5 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-[200px]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
