import React from 'react';
import { Link } from 'react-router-dom';
import {
    Smartphone,
    Shirt,
    Home,
    Heart,
    Watch,
    Footprints,
    ArrowRight,
    Dumbbell,
    BookOpen
} from 'lucide-react';

const categories = [
    {
        id: 1,
        title: "Électronique",
        products: "2,450+ produits",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800",
        icon: Smartphone,
        color: "bg-blue-600",
    },
    {
        id: 2,
        title: "Beauté",
        products: "1,900+ produits",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800",
        icon: Heart,
        color: "bg-purple-600",
    },
    {
        id: 3,
        title: "Chaussures",
        products: "3,100+ produits",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800",
        icon: Footprints,
        color: "bg-orange-600",
    },
    {
        id: 4,
        title: "Maison",
        products: "3,800+ produits",
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800",
        icon: Home,
        color: "bg-green-600",
    },
    {
        id: 5,
        title: "Vêtements",
        products: "5,200+ produits",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800",
        icon: Shirt,
        color: "bg-pink-600",
    },
    {
        id: 6,
        title: "Accessoires",
        products: "1,200+ produits",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800",
        icon: Watch,
        color: "bg-indigo-600",
    },
    {
        id: 7,
        title: "Sportif",
        products: "850+ produits",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
        icon: Dumbbell,
        color: "bg-red-600",
    },
    {
        id: 8,
        title: "Livres",
        products: "1,200+ produits",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800",
        icon: BookOpen,
        color: "bg-yellow-600",
    }
];

const CategorySection = () => {
    return (
        <section className="py-16 bg-white dark:bg-gray-900 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Explorez nos catégories</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-base">Trouvez exactement ce que vous cherchez parmi nos collections</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to="/category"
                            state={{ category: category.title }}
                            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer flex flex-col items-start"
                        >
                            <div className="w-full aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-900/50 relative flex items-center justify-center">
                                <img
                                    src={category.image}
                                    alt={category.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Hover Arrow Button */}
                                <div className="absolute top-6 right-6 w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                    <ArrowRight size={20} className="text-red-500" />
                                </div>
                            </div>

                            <div className="p-8 w-full flex flex-col items-start">
                                <div className={`w-14 h-14 rounded-2xl ${category.color} text-white mb-6 flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                                    <category.icon size={28} />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                                    {category.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-base">
                                    {category.products}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
