import React, { useEffect, useState } from 'react';
import { Trash2, Star, MessageSquare, Package, User, Calendar, Loader2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ReviewListScreen = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products/reviews');
            setReviews(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
            try {
                await api.delete(`/products/reviews/${id}`);
                setReviews(reviews.filter((r) => r._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Erreur lors du chargement</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
                <button onClick={fetchReviews} className="mt-6 px-4 py-2 bg-primary text-white rounded-xl">Réessayer</button>
            </div>
        );
    }

    return (
        <div className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                            <MessageSquare size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Commentaires</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{reviews.length}</h3>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl text-yellow-600">
                            <Star size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Note Moyenne</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)} ⭐
                    </h3>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                            <Calendar size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dernier 24h</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {reviews.filter(r => new Date(r.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
                    </h3>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Produit</th>
                                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                                <th className="px-6 py-4 font-semibold">Commentaire</th>
                                <th className="px-6 py-4 font-semibold text-center">Note</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={review.product?.image}
                                                    alt=""
                                                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                />
                                                <span className="text-sm font-medium text-gray-900 dark:text-white max-w-[150px] truncate">
                                                    {review.product?.name || 'Produit supprimé'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{review.name}</span>
                                                <span className="text-xs text-gray-500">{review.user?.email || 'Inconnu'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={review.comment}>
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1 text-yellow-400">
                                                <span className="text-sm font-bold">{review.rating}</span>
                                                <Star size={14} fill="currentColor" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {format(new Date(review.createdAt), 'dd MMM yyyy', { locale: fr })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteHandler(review._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        Aucun commentaire trouvé
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReviewListScreen;
