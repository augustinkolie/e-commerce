import {
    Menu,
    ChevronDown,
    Flame,
    Star,
    Trophy,
    Store,
    Smartphone,
    Shirt,
    Home,
    Heart,
    Dribbble,
    Book,
    ChevronRight,
    Search
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const categories = [
    {
        id: 1,
        title: "Électronique",
        description: "Smartphones, Ordinateurs, Tablettes, Accessoires",
        icon: Smartphone,
        color: "text-[#e63917]",
        bgColor: "bg-red-50"
    },
    {
        id: 2,
        title: "Mode",
        description: "Homme, Femme, Enfants, Chaussures",
        icon: Shirt,
        color: "text-[#e63917]",
        bgColor: "bg-red-50"
    },
    {
        id: 3,
        title: "Maison",
        description: "Meubles, Décoration, Cuisine, Jardin",
        icon: Home,
        color: "text-[#e63917]",
        bgColor: "bg-orange-50"
    },
    {
        id: 4,
        title: "Beauté",
        description: "Maquillage, Soins, Parfums, Cheveux",
        icon: Heart,
        color: "text-[#e63917]",
        bgColor: "bg-pink-50"
    },
    {
        id: 5,
        title: "Sportif",
        description: "Fitness, Outdoor, Vêtements, Équipements",
        icon: Dribbble,
        color: "text-[#e63917]",
        bgColor: "bg-orange-50"
    },
    {
        id: 6,
        title: "Livres",
        description: "Romans, BD, Jeunesse, Scolaire",
        icon: Book,
        color: "text-[#e63917]",
        bgColor: "bg-red-50"
    }
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
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

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navClasses = isHome && !isScrolled
        ? "bg-transparent py-2 absolute top-[92px] left-0 w-full z-40 transition-all duration-300 font-medium border-b border-white/10"
        : "bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-2 shadow-sm sticky top-[92px] z-40 transition-all duration-300";

    const textClasses = isHome && !isScrolled ? "text-white" : "text-gray-700 dark:text-gray-200";
    const linkHoverClasses = isHome && !isScrolled ? "hover:text-white/80" : "hover:text-primary";

    return (
        <nav className={navClasses}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
                {/* Categories Toggle */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                >
                    <button className="flex items-center space-x-2.5 bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors cursor-pointer text-sm">
                        <Menu size={18} />
                        <span>Toutes les catégories</span>
                        <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-b-xl border border-gray-100 dark:border-gray-700 mt-1 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to="/category"
                                    state={{ category: cat.title }}
                                    className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer group transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <div className="flex items-center space-x-3.5">
                                        <div className={`p-2 rounded-lg ${cat.bgColor} ${cat.color}`}>
                                            <cat.icon size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{cat.title}</h4>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{cat.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="flex items-center space-x-8">
                    <Link to="/deals" className={`flex items-center space-x-1.5 ${textClasses} ${linkHoverClasses} transition-colors font-medium text-sm`}>
                        <Flame size={16} className="text-primary" />
                        <span>Deals du jour</span>
                    </Link>
                    <Link to="/new-arrivals" className={`flex items-center space-x-1.5 ${textClasses} ${linkHoverClasses} transition-colors font-medium text-sm`}>
                        <Star size={16} className="text-green-500" />
                        <span>Nouveautés</span>
                    </Link>
                    <Link to="/best-sellers" className={`flex items-center space-x-1.5 ${textClasses} ${linkHoverClasses} transition-colors font-medium text-sm`}>
                        <Trophy size={16} className="text-orange-500" />
                        <span>Meilleures ventes</span>
                    </Link>
                    <Link to="/seller" className={`flex items-center space-x-1.5 ${textClasses} ${linkHoverClasses} transition-colors font-medium text-sm`}>
                        <Store size={16} className={isHome && !isScrolled ? "text-white" : "text-gray-600 dark:text-gray-300"} />
                        <span>Devenir vendeur</span>
                    </Link>
                </div>

                {/* Empty space to balance or additional links if needed */}
                <div className="hidden lg:block"></div>
            </div>
        </nav>
    );
};

export default Navbar;
