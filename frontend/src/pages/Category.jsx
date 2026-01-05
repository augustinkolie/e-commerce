import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Star, ShoppingCart, Eye, Heart, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import api from '../utils/api';

const categories = [
    "Tous les Produits",
    "Électronique",
    "Vêtements",
    "Chaussures",
    "Accessoires",
    "Maison",
    "Beauté",
    "Sportif",
    "Livres"
];

const Category = () => {
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const location = useLocation();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState("Tous les Produits");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedRating, setSelectedRating] = useState(null);
    const [sortBy, setSortBy] = useState("popular");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle initial category or search from navigation state
    useEffect(() => {
        if (location.state?.category) {
            setSelectedCategory(location.state.category);
        }
        if (location.state && typeof location.state.search !== 'undefined') {
            setSearchQuery(location.state.search);
        }
    }, [location.state]);

    // Filter products
    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === "Tous les Produits" || product.category === selectedCategory;
        const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
        const ratingMatch = !selectedRating || product.rating >= selectedRating;
        const searchMatch = !searchQuery ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && priceMatch && ratingMatch && searchMatch;
    });

    if (loading) return <div className="text-center py-20">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Category Hero Banner */}
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600"
                    alt="Category Banner"
                    className="w-full h-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                        {/* Breadcrumbs */}
                        <div className="flex items-center space-x-2 text-sm text-gray-200 mb-4 font-medium">
                            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
                            <ChevronRight size={14} />
                            <span className="text-white">{selectedCategory}</span>
                        </div>

                        {/* Title & Description */}
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 transition-all animate-fade-in">
                                {selectedCategory}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200">
                                Découvrez notre sélection de produits premium avec livraison rapide
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full pr-4 pl-0 py-12">


                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Sidebar */}
                    {isSidebarOpen && (
                        <div className="lg:col-span-1 lg:sticky lg:top-[140px] z-30">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-[calc(100vh-140px)] overflow-y-auto">
                                {/* Categories */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Catégories</h3>
                                    <div className="space-y-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors cursor-pointer ${selectedCategory === cat
                                                    ? 'bg-primary text-white font-semibold'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Prix</h3>
                                    <div className="space-y-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                            className="w-full accent-primary cursor-pointer"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>0€</span>
                                            <span>{priceRange[1]}€</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Note Client</h3>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                                                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${selectedRating === rating
                                                    ? 'bg-primary/10 border border-primary'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">& plus</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className={isSidebarOpen ? "lg:col-span-3" : "lg:col-span-4"}>
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-100 dark:border-gray-700"
                                    title={isSidebarOpen ? "Masquer les filtres" : "Afficher les filtres"}
                                >
                                    <Filter size={20} />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {searchQuery ? `Résultats pour "${searchQuery}"` : "Produits"}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            {filteredProducts.length} produits disponibles
                                        </p>
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="text-xs text-primary hover:underline cursor-pointer"
                                            >
                                                Effacer la recherche
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary cursor-pointer"
                                >
                                    <option value="popular">Plus Populaire</option>
                                    <option value="price-low">Prix croissant</option>
                                    <option value="price-high">Prix décroissant</option>
                                    <option value="rating">Mieux notés</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSidebarOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />

                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Link
                                                to={`/product/${product._id}`}
                                                className="w-11 h-11 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-800 dark:text-white hover:bg-primary hover:text-white transition-all transform hover:scale-110 cursor-pointer"
                                                title="Voir les détails"
                                            >
                                                <Eye size={20} />
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleFavorite(product);
                                                }}
                                                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer ${isFavorite(product._id)
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-red-500 hover:text-white'
                                                    }`}
                                                title={isFavorite(product._id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                                            >
                                                <Heart size={20} className={isFavorite(product._id) ? 'fill-current' : ''} />
                                            </button>
                                        </div>

                                        {/* Discount Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`${product.badgeColor} text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md`}>
                                                {product.discount}
                                            </span>
                                        </div>

                                        {/* Badge */}
                                        {product.badge && (
                                            <div className="absolute top-3 right-3">
                                                <span className={`${product.badgeColor} text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md`}>
                                                    {product.badge}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 leading-snug">
                                            {product.name}
                                        </h3>

                                        {/* Rating */}
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">({product.reviews})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-baseline space-x-2 mb-4">
                                            <span className="text-xl font-bold text-primary">{product.price}€</span>
                                            <span className="text-sm text-gray-400 line-through">{product.originalPrice}€</span>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
                                        >
                                            <ShoppingCart size={18} />
                                            <span>Ajouter au Panier</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    Aucun produit trouvé avec ces filtres
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;
