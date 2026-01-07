import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Truck, ShieldCheck, HelpCircle, MapPin } from 'lucide-react';

const TopBar = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);

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

    const barClasses = isHome && !isScrolled
        ? "bg-transparent text-white py-2 px-4 text-xs absolute top-0 left-0 w-full z-50 transition-all duration-300"
        : "bg-primary dark:bg-gray-900 text-white py-2 px-4 text-xs sticky top-0 z-50 transition-all duration-300 shadow-md";

    return (
        <div className={barClasses}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-5">
                    <div className="flex items-center space-x-1.5">
                        <Truck size={14} />
                        <span>Livraison gratuite dès 50€</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <ShieldCheck size={14} />
                        <span>Paiement 100% sécurisé</span>
                    </div>
                </div>
                <div className="flex items-center space-x-5">
                    <div className="flex items-center space-x-1.5 cursor-pointer hover:opacity-80">
                        <HelpCircle size={14} />
                        <span>Aide</span>
                    </div>
                    <Link
                        to="/profile"
                        state={{ activeTab: 'orders' }}
                        className="flex items-center space-x-1.5 cursor-pointer hover:opacity-80"
                    >
                        <MapPin size={14} />
                        <span>Suivre ma commande</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
