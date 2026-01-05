const asyncHandler = require('express-async-handler');
const Message = require('../models/Message.js');
const Conversation = require('../models/Conversation.js');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    console.log('SEND MESSAGE BODY:', req.body);
    console.log('SEND MESSAGE FILE:', req.file);
    const { recipientId, content } = req.body;
    const file = req.file;

    if (!recipientId || (!content && !file)) {
        res.status(400);
        throw new Error('Veuillez fournir un destinataire et un contenu ou un fichier');
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, recipientId] },
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user._id, recipientId],
        });
    }

    const message = await Message.create({
        conversation: conversation._id,
        sender: req.user._id,
        content: content || '',
        fileUrl: file ? `/uploads/messages/${file.filename}` : undefined,
        fileName: file ? file.originalname : undefined,
        fileType: file ? file.mimetype : undefined,
    });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name profilePicture');

    res.status(201).json(populatedMessage);
});

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
        participants: { $in: [req.user._id] },
    })
        .populate('participants', 'name profilePicture')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });

    res.json(conversations);
});

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({
        conversation: req.params.conversationId,
    })
        .populate('sender', 'name profilePicture')
        .sort({ createdAt: 1 });

    // Mark as read for current user
    await Message.updateMany(
        { conversation: req.params.conversationId, sender: { $ne: req.user._id } },
        { $addToSet: { readBy: req.user._id } }
    );

    res.json(messages);
});

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
        participants: { $in: [req.user._id] },
    });

    const conversationIds = conversations.map(c => c._id);

    const unreadCount = await Message.countDocuments({
        conversation: { $in: conversationIds },
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id }
    });

    res.json({ count: unreadCount });
});

module.exports = {
    sendMessage,
    getConversations,
    getMessages,
    getUnreadCount,
};
