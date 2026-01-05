import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, MessageCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/notifications');
            setNotifications(data);
            setLoading(false);
        } catch (err) {
            setError('Impossible de charger les notifications.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
                        <Bell className="text-primary" />
                        Notifications
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Restez informé des interactions sur vos commentaires
                    </p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                        <Check size={16} />
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Vous n'avez aucune notification pour le moment.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-6 rounded-2xl border transition-all ${notification.read
                                    ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-75'
                                    : 'bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-sm'
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notification.read ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 'bg-primary text-white shadow-lg shadow-primary/20'
                                    }`}>
                                    <MessageCircle size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className={`font-bold ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                                                {format(new Date(notification.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                                title="Marquer comme lu"
                                            >
                                                <Check size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-4 flex items-center gap-4">
                                        <Link
                                            to={`/product/${notification.product}`}
                                            className="text-sm font-bold text-primary hover:underline flex items-center gap-1.5"
                                        >
                                            Voir le commentaire
                                            <ExternalLink size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
