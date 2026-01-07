const asyncHandler = require('express-async-handler');
const Product = require('../models/Product.js');
const Review = require('../models/Review.js');
const Notification = require('../models/Notification.js');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const currentCurrency = (await Product.findOne().select('currency'))?.currency || '€';

    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
        currency: currentCurrency,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
        currency,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const EXCHANGE_RATES = {
            'GNF': 9300,
            '$': 1.08,
            '€': 1,
            'Fonctionnel': 1
        };

        const oldCurrency = product.currency || '€';

        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;
        product.currency = currency;

        const updatedProduct = await product.save();
        console.log(`Product updated: ${updatedProduct.name}, New Currency: ${currency}, Old Currency: ${oldCurrency}`);

        // Update all products to use the same currency and convert their prices
        if (currency && currency !== oldCurrency) {
            const conversionFactor = EXCHANGE_RATES[currency] / EXCHANGE_RATES[oldCurrency];
            console.log(`Global update triggered. Factor: ${conversionFactor}`);

            try {
                // Using aggregation pipeline in updateMany for field-based calculations
                const result = await Product.updateMany({ _id: { $ne: product._id } }, [
                    {
                        $set: {
                            currency: currency,
                            price: { $round: [{ $multiply: ["$price", conversionFactor] }, 2] }
                        }
                    }
                ]);
                console.log(`Global update result:`, result);
            } catch (err) {
                console.error("Global update failed via pipeline, trying fallback:", err);
                // Fallback: Fetch and update for compatibility with older MongoDB
                const productsToUpdate = await Product.find({ _id: { $ne: product._id } });
                for (let p of productsToUpdate) {
                    p.currency = currency;
                    p.price = Number((p.price * conversionFactor).toFixed(2));
                    await p.save();
                }
                console.log(`Fallback global update finished.`);
            }
        } else if (currency) {
            console.log(`Currencies match (${currency}), just ensuring sync...`);
            await Product.updateMany({ _id: { $ne: product._id } }, { currency: currency });
        }

        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        res.status(400);
        throw new Error('Veuillez fournir une note et un commentaire');
    }

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            product: req.params.id
        });

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Vous avez déjà laissé un commentaire pour ce produit');
        }

        const review = new Review({
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            product: req.params.id,
        });

        await review.save();

        const reviews = await Review.find({ product: req.params.id });

        product.numReviews = reviews.length;

        // Safe calculation of rating
        const totalRating = reviews.reduce((acc, item) => (item.rating || 0) + acc, 0);
        product.rating = totalRating / reviews.length;

        await product.save();
        res.status(201).json({ message: 'Commentaire ajouté avec succès' });
    } else {
        res.status(404);
        throw new Error('Produit non trouvé');
    }
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
});

// @desc    Like a review
// @route   PUT /api/products/:id/reviews/:reviewId/like
// @access  Private
const likeProductReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);

    if (review) {
        if (review.user.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('Vous ne pouvez pas aimer votre propre commentaire');
        }

        const alreadyLiked = review.likes.find(
            (r) => r.toString() === req.user._id.toString()
        );

        if (alreadyLiked) {
            review.likes = review.likes.filter(
                (r) => r.toString() !== req.user._id.toString()
            );
        } else {
            review.likes.push(req.user._id);
        }

        await review.save();
        res.json({ message: 'Commentaire mis à jour', likes: review.likes });
    } else {
        res.status(404);
        throw new Error('Commentaire non trouvé');
    }
});

// @desc    Reply to a review
// @route   POST /api/products/:id/reviews/:reviewId/reply
// @access  Private
const replyToProductReview = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const review = await Review.findById(req.params.reviewId);

    if (review) {
        if (review.user.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('Vous ne pouvez pas répondre à votre propre commentaire');
        }

        const reply = {
            name: req.user.name,
            comment,
            user: req.user._id,
        };

        review.replies.push(reply);

        await review.save();

        // Create notification for the review author
        await Notification.create({
            user: review.user,
            type: 'REPLY',
            message: `${req.user.name} a répondu à votre commentaire`,
            product: req.params.id,
            review: review._id
        });

        res.status(201).json({ message: 'Réponse ajoutée', replies: review.replies });
    } else {
        res.status(404);
        throw new Error('Commentaire non trouvé');
    }
});

// @desc    Like a review reply
// @route   PUT /api/products/:id/reviews/:reviewId/replies/:replyId/like
// @access  Private
const likeProductReviewReply = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);

    if (review) {
        const reply = review.replies.id(req.params.replyId);
        if (!reply) {
            res.status(404);
            throw new Error('Réponse non trouvée');
        }

        if (reply.user.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('Vous ne pouvez pas aimer votre propre réponse');
        }

        const alreadyLiked = reply.likes.find(
            (r) => r.toString() === req.user._id.toString()
        );

        if (alreadyLiked) {
            reply.likes = reply.likes.filter(
                (r) => r.toString() !== req.user._id.toString()
            );
        } else {
            reply.likes.push(req.user._id);
        }

        await review.save();
        res.json({ message: 'Like de la réponse mis à jour', likes: reply.likes });
    } else {
        res.status(404);
        throw new Error('Commentaire non trouvé');
    }
});

// @desc    Get all reviews
// @route   GET /api/products/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({})
        .populate('user', 'name email')
        .populate('product', 'name image')
        .sort({ createdAt: -1 });
    res.json(reviews);
});

// @desc    Delete a review
// @route   DELETE /api/products/reviews/:id
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (review) {
        // Update product statistics before deleting
        const product = await Product.findById(review.product);
        if (product) {
            await Review.deleteOne({ _id: review._id });

            const remainingReviews = await Review.find({ product: product._id });
            product.numReviews = remainingReviews.length;

            if (remainingReviews.length > 0) {
                const totalRating = remainingReviews.reduce((acc, item) => (item.rating || 0) + acc, 0);
                product.rating = totalRating / remainingReviews.length;
            } else {
                product.rating = 0;
            }

            await product.save();
        } else {
            await Review.deleteOne({ _id: review._id });
        }

        res.json({ message: 'Commentaire supprimé' });
    } else {
        res.status(404);
        throw new Error('Commentaire non trouvé');
    }
});

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getProductReviews,
    likeProductReview,
    replyToProductReview,
    likeProductReviewReply,
    getAllReviews,
    deleteReview,
};
