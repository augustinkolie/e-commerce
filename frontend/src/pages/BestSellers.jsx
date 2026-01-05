import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const { data } = await api.get('/products');
                // Filter for 'Top' items and sort by rating/reviews
                const bestSellers = data
                    .filter(p => p.badge === 'Top' || p.rating >= 4.5)
                    .sort((a, b) => b.numReviews - a.numReviews);

                setProducts(bestSellers);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching best sellers:", error);
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    if (loading) return <div className="text-center py-20 dark:text-white">Chargement des meilleures ventes...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="text-orange-500">🏆</span> Meilleures Ventes
                    </h1>
                    <span className="text-gray-500 dark:text-gray-400">Classés par popularité</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full group">
                            <Link to={`/product/${product._id}`} className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 block">
                                <img
                                    src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {product.badge && (
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        <span className={`${product.badgeColor} text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md`}>
                                            {product.badge}
                                        </span>
                                    </div>
                                )}
                            </Link>

                            <div className="p-5 flex flex-col flex-grow">
                                <Link to={`/product/${product._id}`} className="block">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="flex items-center space-x-1 mb-4">
                                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {product.rating} <span className="text-gray-400 font-normal">({product.reviews})</span>
                                    </span>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-primary">{product.price}€</span>
                                            {product.originalPrice && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    {product.originalPrice}€
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white hover:bg-primary hover:text-white transition-all transform active:scale-95 shadow-sm hover:shadow-lg hover:shadow-orange-500/30"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BestSellers;
