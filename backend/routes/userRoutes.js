const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    getUsers,
    getAvailableUsers,
    deleteUser,
    getUserById,
    updateUser,
    updateUserProfile,
    googleAuth,
    forgotPassword,
    verifyResetCode,
    resetPassword,
} = require('../controllers/userController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);
router.post('/forgotpassword', forgotPassword);
router.post('/verifycode', verifyResetCode);
router.put('/resetpassword', resetPassword);

// Profile routes (Must be BEFORE /:id)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Available users for messaging
router.get('/available', protect, getAvailableUsers);

// Admin routes
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;