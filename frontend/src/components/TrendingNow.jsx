import React from 'react';
import { Star, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrendingNow = ({ products = [] }) => {
    // Arbitrary slice for trending
    const trendingProducts = products.length > 20 ? products.slice(20, 26) : products.slice(0, 6);
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 font-display">Tendances du moment</h2>
                        <p className="text-gray-400 text-lg font-medium">Les produits les plus populaires cette semaine</p>
                    </div>
                    <button className="flex items-center space-x-2 text-primary font-bold hover:underline group">
                        <span>Voir tout</span>
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {trendingProducts.map((product) => (
                        <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            className="group cursor-pointer border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col"
                        >
                            <div className="aspect-[4/5] bg-gray-50 dark:bg-gray-800 overflow-hidden relative flex items-center justify-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-4 space-y-1.5 flex flex-col flex-grow">
                                <h3 className="text-[13px] font-semibold text-gray-800 dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors h-8">
                                    {product.name}
                                </h3>

                                <div className="flex items-center space-x-1 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={10}
                                            fill={i < product.rating ? "currentColor" : "none"}
                                            className={i < product.rating ? "" : "text-gray-200"}
                                        />
                                    ))}
                                </div>

                                <div className="mt-auto pt-2">
                                    <div className="mb-1">
                                        <span className="text-base font-bold text-gray-800 dark:text-white">
                                            {product.price.toLocaleString('fr-FR')} {product.currency || '€'}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-1 text-orange-500">
                                        <Flame size={12} />
                                        <span className="text-[10px] font-bold text-gray-400">1.5k vendus</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingNow;
