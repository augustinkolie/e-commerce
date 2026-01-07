import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingCart, Moon, Sun, LogOut, LayoutDashboard, Bell, MessageCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import logo from '../assets/kolieshop (2).png';
import { useAnimation } from '../context/AnimationContext';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { getCartCount } = useCart();
    const { getFavoritesCount } = useFavorites();
    const { user, logout } = useAuth();
    const { registerCartIcon } = useAnimation();

    const location = useLocation();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        if (isHome) {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            setIsScrolled(true);
        }
    }, [isHome]);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (user) {
                try {
                    const { data } = await api.get('/notifications/unread-count');
                    setUnreadNotifications(data.count);
                } catch (err) {
                    console.error('Erreur notifications:', err);
                }
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const fetchUnreadMessageCount = async () => {
            if (user) {
                try {
                    const { data } = await api.get('/messages/unread-count');
                    setUnreadMessages(data.count);
                } catch (err) {
                    console.error('Erreur messages:', err);
                }
            }
        };

        fetchUnreadMessageCount();
        const interval = setInterval(fetchUnreadMessageCount, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, [user]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        navigate('/category', { state: { search: searchQuery.trim() } });
    };

    const headerClasses = isHome && !isScrolled
        ? "bg-transparent py-0 px-4 absolute top-[32px] left-0 w-full z-50 border-b border-white/10 transition-all duration-300"
        : `bg-white dark:bg-gray-900 py-0 px-4 sticky top-[32px] z-50 transition-all duration-300 ${isHome && isScrolled ? "border-b border-gray-100 dark:border-gray-800 shadow-sm" : ""}`;

    const textClasses = isHome && !isScrolled ? "text-white" : "text-gray-600 dark:text-gray-300";
    const iconClasses = isHome && !isScrolled ? "text-white" : "text-gray-600 dark:text-gray-300";

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 h-[60px]">
                {/* Logo */}
                <Link to="/" className="flex-shrink-0 flex items-center">
                    <img
                        src={logo}
                        alt="KolieShop"
                        className="h-[120px] md:h-[160px] my-[-50px] w-auto object-contain transition-all duration-300"
                        style={{ filter: isHome && !isScrolled ? 'brightness(0) invert(1)' : 'none' }}
                    />
                </Link>

                <div className="flex-grow max-w-2xl">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Rechercher des produits, marques, catégories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full py-2.5 px-5 rounded-full border focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all text-sm
                                ${isHome && !isScrolled
                                    ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400"}`}
                        />
                        <button
                            type="submit"
                            className="absolute right-0 top-0 bottom-0 px-7 bg-primary text-white rounded-r-full flex items-center space-x-2 hover:bg-orange-600 transition-colors cursor-pointer"
                        >
                            <Search size={20} />
                            <span className="font-semibold text-sm">Rechercher</span>
                        </button>
                    </form>
                </div>

                <div className="flex items-center space-x-6">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'dark' ? (
                            <Sun size={26} className={isHome && !isScrolled ? "text-white" : "text-gray-300"} />
                        ) : (
                            <Moon size={26} className={isHome && !isScrolled ? "text-white" : "text-gray-600"} />
                        )}
                    </button>

                    {/* Favorites */}
                    <Link to="/favorites" className="relative cursor-pointer hover:opacity-70 transition-opacity">
                        <Heart size={26} className={iconClasses} />
                        {getFavoritesCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-900">
                                {getFavoritesCount()}
                            </span>
                        )}
                    </Link>

                    {/* Messages */}
                    <Link to="/messages" className="relative cursor-pointer hover:opacity-70 transition-opacity">
                        <MessageCircle size={26} className={iconClasses} />
                        {unreadMessages > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-900">
                                {unreadMessages}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <div ref={registerCartIcon} className="relative">
                        <Link to="/cart" className="relative cursor-pointer group">
                            <ShoppingCart size={26} className={iconClasses} />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-900">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Admin Dashboard Link */}
                    {user && user.isAdmin && (
                        <Link to="/admin/dashboard" className="relative cursor-pointer hover:opacity-70 transition-opacity" title="Administration">
                            <LayoutDashboard size={26} className={iconClasses} />
                        </Link>
                    )}

                    {/* User */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-2 cursor-pointer focus:outline-none"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base overflow-hidden">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                {unreadNotifications > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 animate-pulse">
                                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                    </span>
                                )}
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <User size={16} />
                                        Mon Profil
                                    </Link>
                                    <Link
                                        to="/notifications"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Bell size={16} className="group-hover:text-primary transition-colors" />
                                            Notifications
                                        </div>
                                        {unreadNotifications > 0 && (
                                            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                {unreadNotifications}
                                            </span>
                                        )}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="cursor-pointer hover:text-primary transition-colors flex flex-col items-center">
                            <User size={26} className={`${iconClasses} hover:text-primary transition-colors`} />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
