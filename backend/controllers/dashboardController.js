const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const Product = require('../models/Product.js');
const Review = require('../models/Review.js');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const recentUsers = await User.find()
        .select('name email createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

    // Get product statistics
    const totalProducts = await Product.countDocuments();
    const productsByCategory = await Product.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    // Get review statistics
    const totalReviews = await Review.countDocuments();
    const avgRating = await Review.aggregate([
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    // Get most reviewed products
    const mostReviewedProducts = await Review.aggregate([
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
    ]);

    // Get products with most likes (favorites would require a separate model)
    // For now, we'll use products with highest ratings
    const topRatedProducts = await Product.find()
        .select('name image rating numReviews')
        .sort({ rating: -1, numReviews: -1 })
        .limit(5);

    res.json({
        users: {
            total: totalUsers,
            admins: adminUsers,
            regular: totalUsers - adminUsers,
            recent: recentUsers
        },
        products: {
            total: totalProducts,
            byCategory: productsByCategory,
            topRated: topRatedProducts
        },
        reviews: {
            total: totalReviews,
            averageRating: avgRating.length > 0 ? avgRating[0].averageRating : 0,
            mostReviewed: mostReviewedProducts
        }
    });
});

module.exports = {
    getDashboardStats
};
