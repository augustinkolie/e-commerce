const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        required: true,
        enum: ['REPLY', 'NEW_PRODUCT'],
        default: 'REPLY'
    },
    message: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Product',
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Review',
    },
    read: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
