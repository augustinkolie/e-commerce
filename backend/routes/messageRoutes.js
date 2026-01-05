const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getConversations,
    getMessages,
    getUnreadCount,
} = require('../controllers/messageController.js');
const { protect } = require('../middleware/authMiddleware.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const dir = 'uploads/messages/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const upload = multer({ storage });

router.use(protect);

router.route('/').post(upload.single('file'), sendMessage);
router.route('/conversations').get(getConversations);
router.route('/unread-count').get(getUnreadCount);
router.route('/:conversationId').get(getMessages);

module.exports = router;
