const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const Product = require('../models/Product.js');
const Review = require('../models/Review.js');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    console.log('--- FETCHING DASHBOARD STATS (DEBUG ID: ' + Date.now() + ') ---');
    try {
        // Get user statistics
        const totalUsers = await User.countDocuments() || 0;
        const adminUsers = await User.countDocuments({ isAdmin: true }) || 0;
        const recentUsers = await User.find()
            .select('name email createdAt')
            .sort({ createdAt: -1 })
            .limit(5) || [];

        // Get product statistics
        const totalProducts = await Product.countDocuments() || 0;
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]) || [];

        // Get review statistics
        const totalReviews = await Review.countDocuments() || 0;
        const avgRatingAggregation = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' }
                }
            }
        ]) || [];

        // Get most reviewed products
        let mostReviewedProducts = [];
        try {
            mostReviewedProducts = await Review.aggregate([
                {
                    $group: {
                        _id: '$product',
                        reviewCount: { $sum: 1 },
                        avgRating: { $avg: '$rating' }
                    }
                },
                { $sort: { reviewCount: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'productInfo'
                    }
                },
                { $unwind: '$productInfo' }
            ]) || [];
        } catch (error) {
            console.error('Error in mostReviewedProducts aggregation:', error);
        }

        // Get products with most likes (favorites would require a separate model)
        // For now, we'll use products with highest ratings
        const topRatedProducts = await Product.find()
            .select('name image rating numReviews')
            .sort({ rating: -1, numReviews: -1 })
            .limit(5) || [];

        // Get user registrations over the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const userTrends = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]) || [];

        // Format trends for frontend (ensuring 6 months are present)
        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
        const formattedTrends = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const m = d.getMonth() + 1;
            const y = d.getFullYear();
            const trend = userTrends.find(t => t._id && t._id.month === m && t._id.year === y);
            formattedTrends.push({
                name: months[m - 1],
                users: trend ? trend.count : 0
            });
        }

        res.json({
            users: {
                total: totalUsers,
                admins: adminUsers,
                regular: totalUsers - adminUsers,
                recent: recentUsers,
                trends: formattedTrends
            },
            products: {
                total: totalProducts,
                byCategory: productsByCategory,
                topRated: topRatedProducts
            },
            reviews: {
                total: totalReviews,
                averageRating: avgRatingAggregation.length > 0 ? (avgRatingAggregation[0].averageRating || 0) : 0,
                mostReviewed: mostReviewedProducts
            },
            currency: (await Product.findOne().select('currency'))?.currency || '€'
        });
    } catch (error) {
        console.error('Dashboard Stats Controller Error:', error);
        res.status(500).json({ message: 'Internal Server Error', detail: error.message });
    }
});

module.exports = {
    getDashboardStats
};
