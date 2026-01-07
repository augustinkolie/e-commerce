import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, Package, DollarSign, AlertCircle, Layers } from 'lucide-react';
import api from '../../utils/api';

const ProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter((product) => product._id !== id));
            } catch (error) {
                console.error("Error deleting product", error);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Voulez-vous créer un nouveau produit ?')) {
            try {
                setCreateLoading(true);
                const { data: createdProduct } = await api.post('/products', {});
                setCreateLoading(false);
                navigate(`/admin/product/${createdProduct._id}/edit`);
            } catch (error) {
                console.error("Error creating product", error);
                setCreateLoading(false);
            }
        }
    };

    // Calculate stats
    const totalProducts = products.length;
    const totalValue = products.reduce((acc, product) => acc + (product.price * (product.countInStock || 0)), 0);
    const outOfStock = products.filter(p => p.countInStock === 0).length;
    const categories = [...new Set(products.map(p => p.category))].length;

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="pt-2">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                            <Package size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Produits</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalProducts}</h3>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valeur du Stock</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {totalValue.toLocaleString('fr-FR')} {products[0]?.currency || '€'}
                    </h3>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                            <Layers size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Catégories</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{categories}</h3>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rupture de Stock</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{outOfStock}</h3>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    onClick={createProductHandler}
                    disabled={createLoading}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50"
                >
                    <Plus size={18} />
                    Créer un produit
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-4 font-medium text-sm">ID</th>
                                <th className="px-6 py-4 font-medium text-sm">NOM</th>
                                <th className="px-6 py-4 font-medium text-sm">PRIX</th>
                                <th className="px-6 py-4 font-medium text-sm">CATÉGORIE</th>
                                <th className="px-6 py-4 font-medium text-sm">MARQUE</th>
                                <th className="px-6 py-4 font-medium text-sm">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{product._id.substring(0, 10)}...</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">{product.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {product.price.toLocaleString('fr-FR')} {product.currency || '€'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{product.brand}</td>
                                    <td className="px-6 py-4 text-sm flex items-center gap-2">
                                        <Link
                                            to={`/admin/product/${product._id}/edit`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductListScreen;
