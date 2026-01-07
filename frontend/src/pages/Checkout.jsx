import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CreditCard,
    Smartphone,
    CheckCircle2,
    ShieldCheck,
    Truck,
    Lock,
    ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [selectedPayment, setSelectedPayment] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        address: user?.address || '',
        city: user?.city || '',
        postalCode: user?.postalCode || '',
        country: 'Guinée',
        phone: user?.phone || '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    const paymentMethods = [
        { id: 'card', name: 'Carte Bancaire', icon: CreditCard, color: 'bg-blue-600' },
        { id: 'orange', name: 'Orange Money', icon: Smartphone, color: 'bg-orange-500' },
        { id: 'mobile', name: 'Mobile Money', icon: Smartphone, color: 'bg-yellow-500' },
        { id: 'paypal', name: 'PayPal', icon: ShieldCheck, color: 'bg-blue-800' },
    ];

    const handleProcessPayment = async () => {
        setIsProcessing(true);

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.quantity,
                    image: item.image,
                    price: item.price,
                    product: item._id,
                    currency: item.currency || '€'
                })),
                shippingAddress,
                paymentMethod: selectedPayment,
                itemsPrice: subtotal,
                taxPrice: 0, // Simplified
                shippingPrice: shipping,
                totalPrice: total,
            };

            await api.post('/orders', orderData);

            clearCart();
            setStep(3);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Erreur lors de la commande');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0 && step !== 3) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Bar */}
                {step < 3 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between max-w-lg mx-auto relative">
                            <div className="flex flex-col items-center z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>1</div>
                                <span className={`text-xs mt-2 font-medium ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>Livraison</span>
                            </div>
                            <div className={`flex-grow h-1 mx-4 rounded ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                            <div className="flex flex-col items-center z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
                                <span className={`text-xs mt-2 font-medium ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>Paiement</span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        {/* Shipping Form */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-4 mb-8">
                                <Link to="/cart" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all">
                                    <ArrowLeft size={20} />
                                </Link>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Livraison</h2>
                            </div>
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Prénom</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={shippingAddress.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Nom</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={shippingAddress.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Adresse complète</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={shippingAddress.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Ville</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Téléphone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingAddress.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Code Postal</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={shippingAddress.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full bg-primary hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 mt-4 cursor-pointer"
                                >
                                    Continuer vers le paiement
                                </button>
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Résumé</h3>
                                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-500 truncate mr-4">{item.name} (x{item.quantity})</span>
                                            <span className="font-semibold text-gray-800 dark:text-white flex-shrink-0">{(item.price * item.quantity).toFixed(2)}€</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Sous-total</span>
                                        <span className="font-semibold text-gray-800 dark:text-white">{subtotal.toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Livraison</span>
                                        <span className="text-green-600 font-semibold">{shipping === 0 ? 'Gratuit' : `${shipping.toFixed(2)}€`}</span>
                                    </div>
                                    <div className="flex justify-between text-lg pt-2 mt-2 border-t border-gray-50 dark:border-gray-700/50">
                                        <span className="font-bold text-gray-800 dark:text-white">Total</span>
                                        <span className="font-bold text-primary text-xl">{total.toFixed(2)}€</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        {/* Payment Selection */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Mode de paiement</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                                    {paymentMethods.map(method => (
                                        <div
                                            key={method.id}
                                            onClick={() => setSelectedPayment(method.id)}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 text-center ${selectedPayment === method.id ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-700 hover:border-primary/30'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-md ${method.id === 'card' ? 'bg-blue-600' :
                                                method.id === 'orange' ? 'bg-orange-500' :
                                                    method.id === 'mobile' ? 'bg-yellow-500' :
                                                        'bg-blue-800'
                                                }`}>
                                                <method.icon size={24} />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{method.name}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Dynamic Payment Form */}
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                    {selectedPayment === 'card' && (
                                        <div className="space-y-4 animate-fade-in">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Numéro de Carte</label>
                                                <div className="relative">
                                                    <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12" />
                                                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Expiration</label>
                                                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">CVV</label>
                                                    <div className="relative">
                                                        <input type="password" placeholder="***" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {(selectedPayment === 'orange' || selectedPayment === 'mobile') && (
                                        <div className="space-y-4 animate-fade-in">
                                            <div className="p-4 bg-primary/10 rounded-xl flex items-start gap-3 mb-4">
                                                <ShieldCheck className="text-primary mt-0.5" size={20} />
                                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    Veuillez entrer votre numéro de téléphone {selectedPayment === 'orange' ? 'Orange' : 'Mobile'} Money. Vous recevrez un push de validation sur votre téléphone pour confirmer la transaction.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Numéro de téléphone</label>
                                                <div className="relative">
                                                    <input type="tel" placeholder="+224 XXX XX XX XX" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                                    <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPayment === 'paypal' && (
                                        <div className="text-center py-6 animate-fade-in">
                                            <div className="mb-6 mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <ShieldCheck className="text-blue-600 dark:text-blue-400" size={32} />
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">
                                                Vous allez être redirigé vers l'interface sécurisée de PayPal pour finaliser votre commande.
                                            </p>
                                            <div className="bg-[#0070ba] text-white px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-[#005ea6] transition-all cursor-pointer">
                                                <Lock size={18} />
                                                <span>Payer avec PayPal</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleProcessPayment}
                                    disabled={isProcessing}
                                    className={`w-full mt-10 bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 cursor-pointer ${isProcessing ? 'opacity-70 cursor-wait' : 'hover:bg-orange-600'}`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Traitement en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={20} />
                                            <span>Confirmer le paiement ({total.toFixed(2)}€)</span>
                                        </>
                                    )}
                                </button>
                                <div className="mt-8 flex items-center justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                    <ShieldCheck size={40} />
                                    <Lock size={40} />
                                </div>
                            </div>
                        </div>

                        {/* Recap Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Total à payer</h3>
                                <div className="text-3xl font-black text-primary mb-6">
                                    {total.toFixed(2)}€
                                </div>
                                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck size={16} className="text-green-500" />
                                        </div>
                                        <span>Sécurisation SSL 256-bits activée</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <Truck size={16} className="text-blue-500" />
                                        </div>
                                        <span>Expédition prioritaire incluse</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep(1)}
                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group border border-gray-100 dark:border-gray-700"
                            >
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Modifier l'adresse</span>
                                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-[3rem] p-12 text-center shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <CheckCircle2 className="text-green-500" size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-4">Commande Confirmée !</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-medium">
                            Félicitations ! Votre paiement a été traité avec succès. Un email de confirmation a été envoyé à votre adresse.
                        </p>
                        <Link
                            to="/"
                            className="inline-block w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary/30"
                        >
                            Retour à l'accueil
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
