import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, X } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

const Favorites = () => {
    const { favorites, removeFromFavorites, getFavoritesCount } = useFavorites();
    const { addToCart } = useCart();

    if (favorites.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <Heart size={80} className="mx-auto text-gray-300 dark:text-gray-600 mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Aucun favori pour le moment</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Ajoutez des produits à vos favoris pour les retrouver facilement</p>
                        <Link
                            to="/"
                            className="inline-flex items-center space-x-2 bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all"
                        >
                            <ArrowLeft size={20} />
                            <span>Découvrir les produits</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Mes favoris</h1>
                    <p className="text-gray-500 dark:text-gray-400">{getFavoritesCount()} produit{getFavoritesCount() > 1 ? 's' : ''}</p>
                </div>

                {/* Favorites Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {favorites.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromFavorites(product.id)}
                                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>

                                {/* Badge if exists */}
                                {product.badge && (
                                    <div className="absolute top-3 left-3">
                                        <span className={`${product.badgeColor} text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md`}>
                                            {product.badge}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Info Container */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-base font-semibold mb-3 line-clamp-2 leading-snug text-gray-800 dark:text-white">
                                    {product.name}
                                </h3>

                                {/* Rating if exists */}
                                {product.rating && (
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-3.5 h-3.5 ${i < product.rating ? 'fill-current' : 'fill-gray-200'}`}
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                </svg>
                                            ))}
                                        </div>
                                        {product.reviews && (
                                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">({product.reviews})</span>
                                        )}
                                    </div>
                                )}

                                <div className="mt-auto flex items-center justify-between">
                                    <div>
                                        <span className="text-xl font-bold text-gray-800 dark:text-white">{product.price}€</span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-400 line-through ml-2">{product.originalPrice}€</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-primary text-white p-2.5 rounded-lg hover:bg-orange-600 transition-all active:scale-95 shadow-md shadow-primary/20 cursor-pointer"
                                    >
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Back Button */}
                <div className="mt-12 flex justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-8 py-3 rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <ArrowLeft size={20} />
                        <span>Continuer mes achats</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Favorites;
