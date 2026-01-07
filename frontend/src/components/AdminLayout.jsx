import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, ClipboardList, LogOut, Package, ChevronRight, ChevronLeft, TrendingUp, Settings, MessageSquare, Bell, Send } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/kolieshop (2).png';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    const [sendingBroadcast, setSendingBroadcast] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? "bg-primary text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
    };

    const handleBroadcast = async () => {
        if (!window.confirm('Voulez-vous envoyer une notification à tous les clients pour le dernier produit ajouté ?')) return;

        try {
            setSendingBroadcast(true);
            const { data } = await api.post('/notifications/broadcast');
            alert(data.message);
            setShowNotifMenu(false);
        } catch (error) {
            alert(error.response?.data?.message || "Erreur lors de l'envoi");
        } finally {
            setSendingBroadcast(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 hidden md:flex flex-col transition-all duration-300 ease-in-out relative group`}
                onMouseEnter={() => setIsCollapsed(false)}
                onMouseLeave={() => setIsCollapsed(true)}
            >
                {/* Header / Logo */}
                <div className="py-6 border-b border-gray-100 dark:border-gray-700 relative overflow-hidden h-[80px] flex items-center">
                    <Link to="/admin/dashboard" className={`flex items-center gap-2 transition-all duration-300 ${isCollapsed ? 'px-4' : 'pl-0'}`}>
                        <img
                            src={logo}
                            alt="KolieShop"
                            className={`h-[120px] md:h-[160px] my-[-50px] w-auto object-contain transition-all duration-300 ${isCollapsed ? 'scale-75 origin-left' : ''}`}
                        />
                    </Link>

                    {/* Toggle Button - Top Right */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCollapsed(!isCollapsed);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                    >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
                    <Link
                        to="/admin/dashboard"
                        title={isCollapsed ? "Dashboard" : ""}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/admin/dashboard')} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <LayoutDashboard size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Dashboard</span>}
                    </Link>
                    <Link
                        to="/admin/userlist"
                        title={isCollapsed ? "Utilisateurs" : ""}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/admin/userlist')} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <Users size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Utilisateurs</span>}
                    </Link>
                    <Link
                        to="/admin/productlist"
                        title={isCollapsed ? "Produits" : ""}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/admin/productlist')} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <ShoppingBag size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Produits</span>}
                    </Link>
                    <Link
                        to="/admin/stock"
                        title={isCollapsed ? "Stock" : ""}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/admin/stock')} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <Package size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Stock</span>}
                    </Link>
                    <Link
                        to="/admin/orderlist"
                        title={isCollapsed ? "Commandes" : ""}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/admin/orderlist')} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <ClipboardList size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Commandes</span>}
                    </Link>
                    <Link
                        to="/admin/reviewlist"
                        title={isCollapsed ? "Commentaires" : ""}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/admin/reviewlist')} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <MessageSquare size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Commentaires</span>}
                    </Link>
                    <Link
                        to="/admin/statistics"
                        title={isCollapsed ? "Statistiques" : ""}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/admin/statistics')} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <TrendingUp size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Statistiques</span>}
                    </Link>
                    <Link
                        to="/admin/settings"
                        title={isCollapsed ? "Paramètres" : ""}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/admin/settings')} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <Settings size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Paramètres</span>}
                    </Link>
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    <Link
                        to="/"
                        title={isCollapsed ? "Retour au site" : ""}
                        className={`flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <Package size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Retour au site</span>}
                    </Link>
                    <button
                        onClick={logout}
                        title={isCollapsed ? "Déconnexion" : ""}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-medium transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <LogOut size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Fixed Top Header */}
                <header className="h-[90px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 sticky top-0 z-20 flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {location.pathname === '/admin/dashboard' && 'Tableau de bord'}
                            {location.pathname === '/admin/userlist' && 'Utilisateurs'}
                            {location.pathname === '/admin/productlist' && 'Catalogue Produits'}
                            {location.pathname === '/admin/stock' && 'Gestion du Stock'}
                            {location.pathname === '/admin/orderlist' && 'Commandes'}
                            {location.pathname === '/admin/reviewlist' && 'Gestion des Commentaires'}
                            {location.pathname === '/admin/statistics' && 'Statistiques'}
                            {location.pathname === '/admin/settings' && 'Paramètres'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifMenu(!showNotifMenu)}
                                className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-500 hover:text-primary transition-all relative group cursor-pointer"
                            >
                                <Bell size={26} />
                                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-gray-800"></span>
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifMenu && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowNotifMenu(false)}></div>
                                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 z-40 overflow-hidden transform animate-fade-in-up">
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900 dark:text-white">Centre de Notifications</h3>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div className="p-3 bg-primary/10 rounded-xl">
                                                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Actions Rapides</p>
                                                <button
                                                    onClick={handleBroadcast}
                                                    disabled={sendingBroadcast}
                                                    className="w-full flex items-center gap-3 p-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Send size={16} />
                                                    {sendingBroadcast ? 'Envoi...' : 'Notifier nouveaux produits'}
                                                </button>
                                                <p className="text-[10px] text-gray-500 mt-2">Envoie une notification à tous les utilisateurs enregistrés.</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-100 dark:border-gray-700">
                            <div className="relative group/avatar">
                                <div className="w-12 h-12 rounded-full border-2 border-primary/20 p-0.5 group-hover/avatar:border-primary transition-colors duration-300">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                            {user?.name?.charAt(0) || 'A'}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></div>
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-base font-bold text-gray-900 dark:text-white">
                                    {user?.name || 'Administrateur'}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
