import React, { useState, useEffect } from 'react';
import { Flame, Star, ShoppingCart, Heart, Eye, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAnimation } from '../context/AnimationContext';
import { Link } from 'react-router-dom';

const CountdownBox = ({ value, label }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 w-24 flex flex-col items-center border border-gray-100 dark:border-gray-700">
        <span className="text-3xl font-semibold text-gray-800 dark:text-white">{value.toString().padStart(2, '0')}</span>
        <span className="text-xs text-gray-500 font-medium uppercase mt-1 tracking-wider">{label}</span>
    </div>
);


const FlashDeals = ({ products = [], loading = false }) => {
    // Select specific products for flash deals or first 4
    const flashProducts = [
        products.find(p => p.name.includes("iPad")) || products[0],
        products.find(p => p.name.includes("iPhone")) || products[1],
        products.find(p => p.name.includes("Nike")) || products[2],
        products.find(p => p.name.includes("Sony")) || products[3],
    ].filter(Boolean);
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { triggerFlyToCart } = useAnimation();
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 20,
        seconds: 6
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else {
                    if (minutes > 0) {
                        minutes--;
                        seconds = 59;
                    } else {
                        if (hours > 0) {
                            hours--;
                            minutes = 59;
                            seconds = 59;
                        }
                    }
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-20 bg-[#fff5f2] dark:bg-gray-900 px-4 overflow-hidden transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-14">
                    <div className="flex items-center space-x-2 bg-primary text-white px-4 py-1.5 rounded-full font-semibold text-xs mb-5 shadow-lg shadow-primary/20">
                        <Flame size={16} />
                        <span className="uppercase tracking-widest">Deals du jour</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">Offres flash limitées</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl mb-10">
                        Profitez de réductions exceptionnelles avant qu'il ne soit trop tard
                    </p>

                    {/* Countdown */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <CountdownBox value={timeLeft.hours} label="Heures" />
                        <span className="text-2xl font-semibold text-primary">:</span>
                        <CountdownBox value={timeLeft.minutes} label="Minutes" />
                        <span className="text-2xl font-semibold text-primary">:</span>
                        <CountdownBox value={timeLeft.seconds} label="Secondes" />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {flashProducts.map((product) => (
                        <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col"
                        >
                            {/* Image Container - No padding at top and sides */}
                            <div className="relative aspect-square overflow-hidden bg-white dark:bg-gray-900">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Badges - Adjusted positioning */}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-primary text-white w-8 h-8 rounded-full font-bold text-[10px] flex items-center justify-center shadow-md border-2 border-white/20">
                                        {product.discount}
                                    </span>
                                </div>

                                {/* Quick Actions */}
                                <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => toggleFavorite(product)}
                                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:text-primary transition-colors cursor-pointer"
                                    >
                                        <Heart
                                            size={18}
                                            className={isFavorite(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                                        />
                                    </button>
                                    <button className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-lg shadow-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer">
                                        <Eye size={18} />
                                    </button>
                                </div>

                                {/* Stock Warning - Pill style at bottom of image area */}
                                {product.stock && (
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-primary/95 text-white py-2 px-4 rounded-xl text-xs font-bold text-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            Plus que {product.stock} en stock !
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Container */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className={`text-sm font-semibold mb-2 line-clamp-2 leading-tight transition-colors ${product.highlight ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
                                    {product.name}
                                </h3>

                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                fill={i < product.rating ? "currentColor" : "none"}
                                                className={i < product.rating ? "" : "text-gray-200"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-normal font-sans">({product.reviews})</span>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-baseline space-x-2 mb-4">
                                        <span className="text-xl font-bold text-primary">{product.price.toLocaleString('fr-FR')} {product.currency || '€'}</span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-300 line-through font-normal">{product.originalPrice.toLocaleString('fr-FR')} {product.currency || '€'}</span>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            triggerFlyToCart(rect, product.image);
                                            addToCart(product);
                                        }}
                                        className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer text-sm"
                                    >
                                        <ShoppingCart size={18} />
                                        <span>Ajouter</span>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer Link */}
                <div className="mt-16 flex justify-center">
                    <button className="flex items-center space-x-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 transition-all shadow-sm hover:shadow-md active:scale-95">
                        <span className="text-primary group-hover:underline">Voir tous les deals</span>
                        <ArrowRight size={20} className="text-primary" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FlashDeals;
