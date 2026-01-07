import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, AlertCircle, RefreshCw, ShoppingCart, TrendingDown, XCircle } from 'lucide-react';
import api from '../../utils/api';

const StockScreen = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products');
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockStatus = (count) => {
        if (count === 0) return { label: 'Rupture', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' };
        if (count < 10) return { label: 'Stock Faible', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' };
        return { label: 'En Stock', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' };
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-end">
                <button
                    onClick={fetchProducts}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-all font-medium text-sm border border-primary/20"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Actualiser les données
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un produit ou catégorie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>

                {error ? (
                    <div className="py-12 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                        <AlertCircle className="mx-auto mb-3" size={48} />
                        <p className="font-medium">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="pb-4 font-semibold text-gray-600 dark:text-gray-300">Produit</th>
                                    <th className="pb-4 font-semibold text-gray-600 dark:text-gray-300">Catégorie</th>
                                    <th className="pb-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Prix</th>
                                    <th className="pb-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Quantité</th>
                                    <th className="pb-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                                                </div>
                                            </td>
                                            <td className="py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                            <td className="py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-auto" /></td>
                                            <td className="py-4"><div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto" /></td>
                                            <td className="py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-700"
                                                    />
                                                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                        {product.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {product.price.toLocaleString('fr-FR')} {product.currency || '€'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className={`font-bold ${product.countInStock < 10 ? 'text-orange-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {product.countInStock}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStockStatus(product.countInStock).color}`}>
                                                    {getStockStatus(product.countInStock).label}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-gray-500">
                                            <Package className="mx-auto mb-3 opacity-20" size={48} />
                                            <p>Aucun produit ne correspond à votre recherche.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockScreen;
