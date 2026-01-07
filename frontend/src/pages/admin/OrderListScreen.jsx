import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, ChevronRight, Filter } from 'lucide-react';
import api from '../../utils/api';

const OrderListScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="pt-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <Package className="text-primary" />
                        Commandes
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez les commandes clients</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Filter size={18} />
                        <span>Filtrer</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">Chargement...</div>
            ) : error ? (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6">
                    {error}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payé</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Livré</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            #{order._id.substring(20, 24).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {order.user && order.user.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                            {order.totalPrice} €
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${order.isPaid ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {order.isPaid ? 'Oui' : 'Non'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${order.isDelivered ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {order.isDelivered ? 'Oui' : 'Non'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                                <ChevronRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderListScreen;
