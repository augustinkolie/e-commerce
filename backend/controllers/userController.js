const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js');
const User = require('../models/User.js');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail.js');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user with Google
// @route   POST /api/users/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
    const { token } = req.body;

    try {
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const { name, email } = data;

        let user = await User.findOne({ email });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                profilePicture: user.profilePicture,
                phone: user.phone,
                address: user.address,
                postalCode: user.postalCode,
                city: user.city,
                token: generateToken(user._id),
            });
        } else {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            user = await User.create({
                name,
                email,
                password: randomPassword,
            });

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    profilePicture: user.profilePicture,
                    phone: user.phone,
                    address: user.address,
                    postalCode: user.postalCode,
                    city: user.city,
                    token: generateToken(user._id),
                });
            } else {
                res.status(400);
                throw new Error('Invalid user data');
            }
        }
    } catch (error) {
        res.status(401);
        throw new Error('Google authentication failed');
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePicture: user.profilePicture,
            phone: user.phone,
            address: user.address,
            postalCode: user.postalCode,
            city: user.city,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePicture: user.profilePicture,
            phone: user.phone,
            address: user.address,
            postalCode: user.postalCode,
            city: user.city,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePicture: user.profilePicture,
            phone: user.phone,
            address: user.address,
            postalCode: user.postalCode,
            city: user.city,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Get available users for messaging
// @route   GET /api/users/available
// @access  Private
const getAvailableUsers = asyncHandler(async (req, res) => {
    // Get all users except current user, prioritize admins
    const users = await User.find({ _id: { $ne: req.user._id } })
        .select('name email profilePicture isAdmin')
        .sort({ isAdmin: -1, name: 1 }); // Admins first, then alphabetically
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            profilePicture: updatedUser.profilePicture,
            phone: updatedUser.phone,
            address: updatedUser.address,
            postalCode: updatedUser.postalCode,
            city: updatedUser.city,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        user.postalCode = req.body.postalCode !== undefined ? req.body.postalCode : user.postalCode;
        user.city = req.body.city !== undefined ? req.body.city : user.city;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            profilePicture: updatedUser.profilePicture,
            phone: updatedUser.phone,
            address: updatedUser.address,
            postalCode: updatedUser.postalCode,
            city: updatedUser.city,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});



// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Get reset code
    const resetCode = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const message = `Vous recevez cet email car vous avez demandé la réinitialisation de votre mot de passe.\n\nVotre code de réinitialisation est : ${resetCode}\n\nCe code expirera dans 10 minutes.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Code de réinitialisation de mot de passe',
            message,
        });

        res.status(200).json({ success: true, data: 'Code envoyé' });
    } catch (err) {
        console.error("SMTP ERROR DETAIL:", err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error(`L'email n'a pas pu être envoyé: ${err.message}`);
    }
});

// @desc    Verify Reset Code
// @route   POST /api/users/verifycode
// @access  Public
const verifyResetCode = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(code)
        .digest('hex');

    const user = await User.findOne({
        email,
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Code invalide ou expiré');
    }

    res.status(200).json({ success: true, message: 'Code valide' });
});

// @desc    Reset Password
// @route   PUT /api/users/resetpassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, code, password } = req.body;

    // Get hashed version of the provided code
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(code)
        .digest('hex');

    const user = await User.findOne({
        email,
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Code invalide ou expiré');
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
        success: true,
        token: generateToken(user._id),
    });
});

module.exports = {
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
};
