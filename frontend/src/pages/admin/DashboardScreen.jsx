import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, Star, TrendingUp, Heart, MessageCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const DashboardScreen = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/dashboard/stats');
            console.log('Dashboard stats:', data); // Debug log
            setStats(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            console.error('Error response:', err.response?.data);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Impossible de charger les statistiques</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Tableau de bord</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Utilisateurs</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.users.total}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {stats.users.admins} admin{stats.users.admins > 1 ? 's' : ''}, {stats.users.regular} utilisateur{stats.users.regular > 1 ? 's' : ''}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Produits</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.products.total}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {stats.products.byCategory.length} catégorie{stats.products.byCategory.length > 1 ? 's' : ''}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                            <MessageCircle size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Commentaires</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.reviews.total}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Note moyenne: {stats.reviews.averageRating.toFixed(1)} ⭐
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Engagement</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stats.reviews.total > 0 ? ((stats.reviews.total / stats.products.total) * 100).toFixed(0) : 0}%
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Taux de commentaires
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Rated Products */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Star className="text-yellow-500" size={20} />
                        Produits Mieux Notés
                    </h2>
                    <div className="space-y-3">
                        {stats.products?.topRated && stats.products.topRated.length > 0 ? (
                            stats.products.topRated.map((product, index) => (
                                <div key={product._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-yellow-500 font-semibold">{product.rating.toFixed(1)} ⭐</span>
                                            <span className="text-gray-500 dark:text-gray-400">({product.numReviews} avis)</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Aucun produit noté</p>
                        )}
                    </div>
                </div>

                {/* Most Reviewed Products */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <MessageCircle className="text-blue-500" size={20} />
                        Produits Plus Commentés
                    </h2>
                    <div className="space-y-3">
                        {stats.reviews?.mostReviewed && stats.reviews.mostReviewed.length > 0 ? (
                            stats.reviews.mostReviewed.map((item, index) => (
                                <div key={item._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                                    <img
                                        src={item.productInfo.image}
                                        alt={item.productInfo.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">{item.productInfo.name}</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-blue-500 font-semibold">{item.reviewCount} commentaires</span>
                                            <span className="text-gray-500 dark:text-gray-400">({item.avgRating.toFixed(1)} ⭐)</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Aucun commentaire</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="text-purple-500" size={20} />
                        Nouveaux Utilisateurs
                    </h2>
                    <div className="space-y-3">
                        {stats.users?.recent && stats.users.recent.length > 0 ? (
                            stats.users.recent.map((user) => (
                                <div key={user._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: fr })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Aucun utilisateur récent</p>
                        )}
                    </div>
                </div>

                {/* Products by Category */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <ShoppingBag className="text-orange-500" size={20} />
                        Produits par Catégorie
                    </h2>
                    <div className="space-y-3">
                        {stats.products?.byCategory && stats.products.byCategory.length > 0 ? (
                            stats.products.byCategory.slice(0, 5).map((category) => (
                                <div key={category._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <span className="font-semibold text-gray-900 dark:text-white">{category._id}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full"
                                                style={{ width: `${(category.count / stats.products.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400 w-8 text-right">
                                            {category.count}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Aucune catégorie</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
