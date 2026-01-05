import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, ClipboardList, LogOut, Package, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/kolieshop (2).png';

const AdminLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(true);

    const isActive = (path) => {
        return location.pathname === path ? "bg-primary text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
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
                        to="/admin/orderlist"
                        title={isCollapsed ? "Commandes" : ""}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive('/admin/orderlist')} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                        <ClipboardList size={20} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">Commandes</span>}
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
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
