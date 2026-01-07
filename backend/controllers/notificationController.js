const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification.js');
const User = require('../models/User.js');
const Product = require('../models/Product.js');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20);
    res.json(notifications);
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ count });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        if (notification.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Non autorisé');
        }
        notification.read = true;
        await notification.save();
        res.json({ message: 'Notification marquée comme lue' });
    } else {
        res.status(404);
        throw new Error('Notification non trouvée');
    }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, read: false },
        { read: true }
    );
    res.json({ message: 'Toutes les notifications marquées comme lues' });
});

// @desc    Broadcast new product notification to all users
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
const broadcastProductNotification = asyncHandler(async (req, res) => {
    // Find the latest product
    const latestProduct = await Product.findOne().sort({ createdAt: -1 });

    if (!latestProduct) {
        res.status(404);
        throw new Error('Aucun produit trouvé à notifier');
    }

    // Find all non-admin users (or all users)
    const users = await User.find({ isAdmin: false });

    // Create notifications for everyone
    const notifications = users.map(user => ({
        user: user._id,
        type: 'NEW_PRODUCT',
        message: `Nouveauté ! Découvrez notre nouveau produit : ${latestProduct.name}`,
        product: latestProduct._id,
        read: false
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
        message: `Notification envoyée à ${users.length} clients`,
        productName: latestProduct.name
    });
});

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    broadcastProductNotification,
};
