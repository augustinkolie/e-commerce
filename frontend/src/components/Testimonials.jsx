import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Sophie Martin",
        role: "Cliente fidèle",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
        content: "Excellente expérience d'achat ! Les produits sont de qualité et la livraison est ultra rapide. Je recommande vivement cette marketplace.",
        date: "Il y a 2 jours"
    },
    {
        id: 2,
        name: "Thomas Dubois",
        role: "Acheteur régulier",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
        content: "Service client exceptionnel et prix compétitifs. J'ai trouvé exactement ce que je cherchais. Une plateforme vraiment professionnelle.",
        date: "Il y a 5 jours"
    },
    {
        id: 3,
        name: "Marie Lefebvre",
        role: "Nouvelle cliente",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
        content: "Première commande et je suis déjà conquise ! Interface intuitive, paiement sécurisé et produits conformes à la description.",
        date: "Il y a 1 semaine"
    },
    {
        id: 4,
        name: "Lucas Bernard",
        role: "Client satisfait",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
        content: "Des milliers de produits disponibles et des offres incroyables. Le système de suivi de commande est très pratique.",
        date: "Il y a 2 semaines"
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-[#fffcfb] dark:bg-gray-950 px-4 overflow-hidden transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-5">Ce que disent nos clients</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Plus de 50 000 clients satisfaits nous font confiance</p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-50 dark:border-gray-800 flex flex-col hover:shadow-xl transition-all duration-500"
                        >
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="relative">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</h4>
                                    <p className="text-xs text-gray-400 font-medium">{testimonial.role}</p>
                                </div>
                            </div>

                            <div className="flex text-yellow-400 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-8 flex-grow italic">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800 mt-auto">
                                <span className="text-xs text-gray-400 font-bold">{testimonial.date}</span>
                                <CheckCircle2 size={18} className="text-green-500" weight="fill" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Bar */}
                <div className="flex justify-center">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl px-12 py-10 shadow-2xl shadow-orange-100 dark:shadow-none flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800 max-w-3xl w-full border border-gray-50 dark:border-gray-800">
                        <div className="px-8 py-4 md:py-0 text-center w-full">
                            <span className="block text-3xl font-bold text-primary mb-1">50k+</span>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Clients satisfaits</span>
                        </div>
                        <div className="px-8 py-4 md:py-0 text-center w-full">
                            <span className="block text-3xl font-bold text-primary mb-1">4.9/5</span>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Note moyenne</span>
                        </div>
                        <div className="px-8 py-4 md:py-0 text-center w-full">
                            <span className="block text-3xl font-bold text-primary mb-1">98%</span>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Recommandations</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
