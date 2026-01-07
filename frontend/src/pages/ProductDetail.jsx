import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronRight,
    Star,
    ShoppingCart,
    Heart,
    Truck,
    ShieldCheck,
    RotateCcw,
    Headphones,
    Plus,
    Minus
} from 'lucide-react';
import ReviewSection from '../components/ReviewSection';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import api from '../utils/api';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedStorage, setSelectedStorage] = useState("");
    const [quantity, setQuantity] = useState(1);

    const fetchProduct = React.useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);

            // Fetch all products for similar items (temporary solution)
            const { data: allProducts } = await api.get('/products');
            const similar = allProducts
                .filter(p => p.category === data.category && p._id !== data._id)
                .slice(0, 4);
            setSimilarProducts(similar);

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id, fetchProduct]);

    useEffect(() => {
        if (product) {
            if (product.colors && product.colors.length > 0) setSelectedColor(product.colors[0]);
            if (product.storage && product.storage.length > 0) setSelectedStorage(product.storage[0]);
            window.scrollTo(0, 0);
        }
    }, [product]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                <div className="text-center text-xl dark:text-white">Chargement...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold dark:text-white">Produit non trouvé</h2>
                    <Link to="/category" className="text-primary hover:underline mt-4 block">Retour aux catégories</Link>
                </div>
            </div>
        );
    }

    const productImages = (product.images && product.images.length > 0) ? product.images : [product.image];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link to="/" className="hover:text-primary">Accueil</Link>
                    <ChevronRight size={14} />
                    <Link to="/category" className="hover:text-primary">Catégories</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-800 dark:text-white font-medium">{product.name}</span>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 md:p-10">
                        {/* Image Gallery */}
                        <div className="space-y-6">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                                {product.badge && (
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className={`${product.badgeColor} text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md`}>
                                            {product.badge}
                                        </span>
                                        {product.discount && (
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                                                {product.discount}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {productImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {productImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="flex bg-yellow-400/10 px-2 py-1 rounded-lg">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {product.rating} <span className="text-gray-400">({product.numReviews} commentaires)</span>
                                </span>
                            </div>

                            {/* Price */}
                            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-6 mb-8">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-3xl font-bold text-primary">{product.price.toLocaleString('fr-FR')} {product.currency || '€'}</span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-400 line-through">{product.originalPrice.toLocaleString('fr-FR')} {product.currency || '€'}</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    TVA incluse • Livraison gratuite
                                </p>
                            </div>

                            {/* Options */}
                            <div className="space-y-6 mb-8">
                                {/* Color Selection */}
                                {product.colors && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                            Couleur: <span className="text-gray-500 font-normal">{selectedColor}</span>
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {product.colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-4 py-2 rounded-xl border-2 transition-all font-medium whitespace-nowrap cursor-pointer ${selectedColor === color
                                                        ? 'border-primary bg-orange-50 dark:bg-orange-900/20 text-primary'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Storage Selection */}
                                {product.storage && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                            Stockage: <span className="text-gray-500 font-normal">{selectedStorage}</span>
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {product.storage.map(cap => (
                                                <button
                                                    key={cap}
                                                    onClick={() => setSelectedStorage(cap)}
                                                    className={`px-4 py-2 rounded-xl border-2 transition-all font-medium cursor-pointer ${selectedStorage === cap
                                                        ? 'border-primary bg-orange-50 dark:bg-orange-900/20 text-primary'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {cap}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                        Quantité
                                    </label>
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 cursor-pointer"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 cursor-pointer"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {product.stock} en stock
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button
                                    onClick={() => addToCart({ ...product, quantity })}
                                    className="flex-1 bg-primary hover:bg-orange-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-orange-500/25 cursor-pointer"
                                >
                                    <ShoppingCart size={20} />
                                    Ajouter au Panier
                                </button>
                                <button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/25 cursor-pointer"
                                >
                                    Acheter Maintenant
                                </button>
                                <button
                                    onClick={() => toggleFavorite(product)}
                                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-90 cursor-pointer ${isFavorite(product._id)
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-500'
                                        : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500'
                                        }`}
                                >
                                    <Heart size={24} className={isFavorite(product._id) ? 'fill-current' : ''} />
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-800">
                                    <div className="text-primary"><Truck size={20} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">Livraison Rapide</p>
                                        <p className="text-[10px] text-gray-500">2-3 jours ouvrés</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-800">
                                    <div className="text-primary"><ShieldCheck size={20} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">Garantie 2 ans</p>
                                        <p className="text-[10px] text-gray-500">Protection complète</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-800">
                                    <div className="text-primary"><RotateCcw size={20} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">Retour Gratuit</p>
                                        <p className="text-[10px] text-gray-500">30 jours</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-800">
                                    <div className="text-primary"><Headphones size={20} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">Support 24/7</p>
                                        <p className="text-[10px] text-gray-500">Assistance rapide</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description & Reviews Section */}
                    <div className="border-t border-gray-100 dark:border-gray-700">
                        <div className="p-6 md:p-10 space-y-16">
                            {/* Description Section */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                                    Description du produit
                                </h3>
                                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                    <p className="leading-relaxed text-lg">{product.description}</p>
                                    {product.features && (
                                        <ul className="mt-8 space-y-3 list-none">
                                            {product.features.map((f, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
                                <ReviewSection productId={product._id} onReviewAdded={fetchProduct} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Produits Similaires</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarProducts.map((p) => (
                            <Link
                                key={p._id}
                                to={`/product/${p._id}`}
                                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {p.badge && (
                                        <div className="absolute top-3 left-3">
                                            <span className={`${p.badgeColor} text-white px-3 py-1 rounded-lg text-xs font-bold`}>
                                                {p.badge}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{p.name}</h3>
                                    <div className="flex items-center space-x-1 mb-3">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{p.rating} ({p.numReviews})</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-primary">{p.price.toLocaleString('fr-FR')} {p.currency || '€'}</span>
                                        {p.originalPrice && (
                                            <span className="text-xs text-gray-400 line-through">{p.originalPrice.toLocaleString('fr-FR')} {p.currency || '€'}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
