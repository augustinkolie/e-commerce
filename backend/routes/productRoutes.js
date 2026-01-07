const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
    createProductReview,
    getProductReviews,
    likeProductReview,
    replyToProductReview,
    likeProductReviewReply,
    getAllReviews,
    deleteReview,
} = require('../controllers/productController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/').get(getProducts).post(protect, admin, createProduct);

// Global review routes (Admin only)
router.route('/reviews').get(protect, admin, getAllReviews);
router.route('/reviews/:id').delete(protect, admin, deleteReview);

router
    .route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct);

router.route('/:id/reviews').post(protect, createProductReview).get(getProductReviews);
router.route('/:id/reviews/:reviewId/like').put(protect, likeProductReview);
router.route('/:id/reviews/:reviewId/reply').post(protect, replyToProductReview);
router.route('/:id/reviews/:reviewId/replies/:replyId/like').put(protect, likeProductReviewReply);

module.exports = router;
