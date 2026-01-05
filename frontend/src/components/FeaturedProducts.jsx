import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const FeaturedProducts = ({ products = [], loading = false }) => {
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    // Use the first 8 products as featured
    const featuredProducts = products.slice(0, 8);

    if (loading) {
        return <div className="py-20 text-center">Chargement des produits en vedette...</div>;
    }

    return (
        <section className="py-20 bg-white dark:bg-gray-900 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Produits en vedette</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Découvrez notre sélection de produits premium soigneusement choisis</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col"
                        >
                            {/* Image Container - Full bleed layout */}
                            <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900/50">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`${product.badgeColor} text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md`}>
                                        {product.badge}
                                    </span>
                                </div>

                                {/* Hover Icons */}
                                {product.showHoverIcons && (
                                    <div className="absolute top-3 right-3 flex flex-col space-y-2 translate-x-0 opacity-100 transition-all duration-300">
                                        <button
                                            onClick={() => toggleFavorite(product)}
                                            className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-600 hover:text-primary transition-colors cursor-pointer"
                                        >
                                            <Heart
                                                size={16}
                                                className={isFavorite(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-900 dark:text-white'}
                                            />
                                        </button>
                                        <button className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm p-2 rounded-full shadow-md text-gray-900 dark:text-white border border-gray-100 dark:border-gray-600 hover:text-primary transition-colors cursor-pointer">
                                            <ShoppingCart size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Info Container */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className={`text-base font-semibold mb-3 line-clamp-2 leading-snug ${product.showHoverIcons ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
                                    {product.name}
                                </h3>

                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                fill={i < product.rating ? "currentColor" : "none"}
                                                className={i < product.rating ? "" : "text-gray-200"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium font-sans">({product.reviews})</span>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-xl font-bold text-gray-800 dark:text-white">{product.price}€</span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-primary text-white p-2.5 rounded-lg hover:bg-orange-600 transition-all active:scale-95 shadow-md shadow-primary/20 cursor-pointer"
                                    >
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer Link */}
                <div className="mt-16 flex justify-center">
                    <button className="bg-primary hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold flex items-center space-x-3 transition-all shadow-lg shadow-primary/20 active:scale-95">
                        <span>Voir tous les produits</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
