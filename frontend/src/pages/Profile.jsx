import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import {
    User, Package, Heart, Settings, LogOut, Camera,
    MapPin, CreditCard, Bell, ChevronRight, ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Profile = () => {
    const { user, logout, updateUserInfo } = useAuth();
    const { cartItems } = useCart();
    const { favorites } = useFavorites();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
            setPostalCode(user.postalCode || '');
            setCity(user.city || '');
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const { data } = await api.put('/users/profile', {
                name,
                phone,
                address,
                postalCode,
                city
            });

            updateUserInfo(data);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setSaveError(err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            updateUserInfo({ profilePicture: data.profilePicture });
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (err) {
            setUploadError(err.response?.data?.message || err.message || 'Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Accès refusé</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Veuillez vous connecter pour accéder à votre profil.</p>
                    <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                        Se connecter
                    </Link>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: User },
        { id: 'orders', label: 'Mes Commandes', icon: Package },
        { id: 'favorites', label: 'Mes Favoris', icon: Heart },
        { id: 'settings', label: 'Paramètres', icon: Settings },
    ];

    // Mock Data for Orders
    const mockOrders = [
        { id: '#ORD-7352', date: '21 Oct 2024', total: '145.00 €', status: 'Livré', items: 3 },
        { id: '#ORD-7351', date: '15 Oct 2024', total: '89.90 €', status: 'En cours', items: 1 },
        { id: '#ORD-7350', date: '02 Oct 2024', total: '210.50 €', status: 'Annulé', items: 4 },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Hero / Welcome */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-white dark:border-gray-700 shadow-md overflow-hidden">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={uploading}
                                    className={`absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:text-primary transition-colors cursor-pointer group-hover:scale-110 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Camera size={14} />
                                </button>
                            </div>
                            <div className="text-center md:text-left flex-1">
                                {uploadError && <p className="text-red-500 text-xs mb-2">{uploadError}</p>}
                                {uploadSuccess && <p className="text-green-500 text-xs mb-2">Image mise à jour !</p>}
                                {uploading && <p className="text-primary text-xs mb-2 animate-pulse">Téléchargement...</p>}
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Bonjour, {user.name} !</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{user.email}</p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full">
                                        Membre Premium
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                                        Vérifié
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                                        <Package size={24} />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">12</span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Commandes</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{cartItems.length}</span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Articles au Panier</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                                        <Heart size={24} />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{favorites.length}</span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Favoris</p>
                            </div>
                        </div>

                        {/* Recent Orders Preview */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Commandes Récentes</h3>
                                <button onClick={() => setActiveTab('orders')} className="text-primary text-sm font-medium hover:underline flex items-center">
                                    Voir tout <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">ID Commande</th>
                                            <th className="px-6 py-4 font-semibold">Date</th>
                                            <th className="px-6 py-4 font-semibold">Statut</th>
                                            <th className="px-6 py-4 font-semibold text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {mockOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order.date}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${order.status === 'Livré' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                            order.status === 'En cours' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">{order.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'orders':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Historique des Commandes</h2>
                        {/* Reusing table for full view - in a real app this might be paginated */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">ID Commande</th>
                                            <th className="px-6 py-4 font-semibold">Date</th>
                                            <th className="px-6 py-4 font-semibold">Articles</th>
                                            <th className="px-6 py-4 font-semibold">Statut</th>
                                            <th className="px-6 py-4 font-semibold text-right">Total</th>
                                            <th className="px-6 py-4 font-semibold text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {mockOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order.date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order.items} articles</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                        ${order.status === 'Livré' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                            order.status === 'En cours' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">{order.total}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <button className="text-primary hover:text-orange-600 text-sm font-medium">Détails</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'favorites':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mes Favoris ({favorites.length})</h2>
                        {favorites.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Votre liste est vide</h3>
                                <Link to="/" className="text-primary hover:underline">Continuer mes achats</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favorites.map((product) => (
                                    <div key={product._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
                                        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-900 relative">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-2 right-2">
                                                <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-red-500 hover:scale-110 transition-transform">
                                                    <Heart size={16} fill="currentColor" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                                            <p className="text-primary font-bold">{product.price} €</p>
                                            <Link to={`/product/${product._id}`} className="mt-3 block w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-center rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                Voir le produit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Paramètres du compte</h2>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2">
                                <User size={20} className="text-primary" /> Informations Personnelles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom Complet</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                    <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Numéro de téléphone</label>
                                    <input
                                        type="tel"
                                        placeholder="+33 6 12 34 56 78"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2">
                                <MapPin size={20} className="text-primary" /> Adresse de livraison
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adresse</label>
                                    <input
                                        type="text"
                                        placeholder="123 Rue de la République"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code Postal</label>
                                        <input
                                            type="text"
                                            placeholder="75001"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ville</label>
                                        <input
                                            type="text"
                                            placeholder="Paris"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 pt-4">
                            {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
                            {saveSuccess && <p className="text-green-500 text-sm">Profil mis à jour avec succès !</p>}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-2 pb-12 transition-colors duration-300">
            <div className="w-full pr-4 pl-0">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-[160px] z-30">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mon Compte</h2>
                            </div>
                            <nav className="p-4 space-y-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                                            ${activeTab === item.id
                                                ? 'bg-primary text-white shadow-md shadow-primary/30'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                                >
                                    <LogOut size={20} />
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
