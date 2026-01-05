import React from 'react';

const OrderListScreen = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Commandes</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">La gestion des commandes sera disponible prochainement.</p>
            </div>
        </div>
    );
};

export default OrderListScreen;
