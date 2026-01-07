const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    broadcastProductNotification,
} = require('../controllers/notificationController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.use(protect);

router.post('/broadcast', admin, broadcastProductNotification);
router.route('/').get(getNotifications);
router.route('/unread-count').get(getUnreadCount);
router.route('/read-all').put(markAllAsRead);
router.route('/:id/read').put(markAsRead);

module.exports = router;
