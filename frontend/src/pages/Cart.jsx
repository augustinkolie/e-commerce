import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, ArrowLeft, Check, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    const handleApplyPromo = () => {
        // Simulate promo code validation
        if (promoCode.trim()) {
            setPromoApplied(true);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <ShoppingBag size={80} className="mx-auto text-gray-300 dark:text-gray-600 mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Votre panier est vide</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Ajoutez des produits pour commencer vos achats</p>
                        <Link
                            to="/"
                            className="inline-flex items-center space-x-2 bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all"
                        >
                            <ArrowLeft size={20} />
                            <span>Continuer mes achats</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Mon panier</h1>
                    <p className="text-gray-500 dark:text-gray-400">{getCartCount()} article{getCartCount() > 1 ? 's' : ''}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-6"
                            >
                                {/* Product Image */}
                                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        {item.price.toLocaleString('fr-FR')} {item.currency || '€'} / unité
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                        >
                                            <Minus size={16} className="text-gray-600 dark:text-gray-300" />
                                        </button>
                                        <span className="w-12 text-center font-semibold text-gray-800 dark:text-white">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                        >
                                            <Plus size={16} className="text-gray-600 dark:text-gray-300" />
                                        </button>
                                    </div>
                                </div>

                                {/* Price & Remove */}
                                <div className="flex flex-col items-end space-y-4">
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <X size={20} />
                                    </button>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {(item.price * item.quantity).toLocaleString('fr-FR')} {item.currency || '€'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Récapitulatif</h2>

                            {/* Summary Details */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Sous-total</span>
                                    <span className="font-semibold">{subtotal.toFixed(2)}€</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Livraison</span>
                                    <span className="font-semibold text-green-600">
                                        {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="flex justify-between text-lg">
                                        <span className="font-bold text-gray-800 dark:text-white">Total</span>
                                        <span className="font-bold text-gray-800 dark:text-white text-2xl">
                                            {total.toFixed(2)}€
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">TVA incluse</p>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Code promo"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary mb-3"
                                />
                                <button
                                    onClick={handleApplyPromo}
                                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer"
                                >
                                    Appliquer le code
                                </button>
                            </div>

                            {/* Checkout Button */}
                            <Link
                                to="/checkout"
                                className="block w-full text-center bg-primary hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 mb-4 cursor-pointer"
                            >
                                Passer la commande
                            </Link>

                            <Link
                                to="/"
                                className="block text-center text-primary hover:text-orange-600 font-medium transition-colors"
                            >
                                Continuer mes achats
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Check size={18} className="text-green-500" />
                                    <span>Paiement 100% sécurisé</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Truck size={18} className="text-green-500" />
                                    <span>Livraison rapide 2-3 jours</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                    <RotateCcw size={18} className="text-green-500" />
                                    <span>Retours gratuits sous 30 jours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
