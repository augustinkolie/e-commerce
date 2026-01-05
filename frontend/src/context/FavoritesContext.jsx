import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        // Load favorites from localStorage on init
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    // Save to localStorage whenever favorites change
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (product) => {
        setFavorites(prevFavorites => {
            // Check if product already in favorites
            const exists = prevFavorites.find(item => item._id === product._id);
            if (exists) {
                return prevFavorites; // Don't add duplicates
            }
            return [...prevFavorites, product];
        });
    };

    const removeFromFavorites = (productId) => {
        setFavorites(prevFavorites =>
            prevFavorites.filter(item => item._id !== productId)
        );
    };

    const toggleFavorite = (product) => {
        const isFavorite = favorites.some(item => item._id === product._id);
        if (isFavorite) {
            removeFromFavorites(product._id);
        } else {
            addToFavorites(product);
        }
    };

    const isFavorite = (productId) => {
        return favorites.some(item => item._id === productId);
    };

    const getFavoritesCount = () => {
        return favorites.length;
    };

    const clearFavorites = () => {
        setFavorites([]);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addToFavorites,
            removeFromFavorites,
            toggleFavorite,
            isFavorite,
            getFavoritesCount,
            clearFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};
