import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import FlashDeals from '../components/FlashDeals';
import FeaturedProducts from '../components/FeaturedProducts';
import TrendingNow from '../components/TrendingNow';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import api from '../utils/api';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Helper to get Featured items (first 8)
    // Helper to get Trending items (random or specific slice)

    return (
        <>
            <Hero />
            <CategorySection />
            <FlashDeals products={products} loading={loading} />
            <FeaturedProducts products={products} loading={loading} />
            <TrendingNow products={products} loading={loading} />
            <Testimonials />
            <Features />
        </>
    );
}

export default Home;
