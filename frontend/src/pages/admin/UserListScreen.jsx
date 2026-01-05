import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit, Check, X } from 'lucide-react';
import api from '../../utils/api';

const UserListScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users');
                console.log('Users fetched:', data);
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                console.error("Error response:", error.response?.data);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter((user) => user._id !== id));
            } catch (error) {
                console.error("Error deleting user", error);
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Utilisateurs</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-4 font-medium text-sm">ID</th>
                                <th className="px-6 py-4 font-medium text-sm">NOM</th>
                                <th className="px-6 py-4 font-medium text-sm">EMAIL</th>
                                <th className="px-6 py-4 font-medium text-sm">ADMIN</th>
                                <th className="px-6 py-4 font-medium text-sm">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        Aucun utilisateur trouvé
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{user._id.substring(0, 10)}...</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            <a href={`mailto:${user.email}`} className="hover:text-primary transition-colors">{user.email}</a>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {user.isAdmin ? (
                                                <Check className="text-green-500" size={18} />
                                            ) : (
                                                <X className="text-red-500" size={18} />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => deleteHandler(user._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserListScreen;
