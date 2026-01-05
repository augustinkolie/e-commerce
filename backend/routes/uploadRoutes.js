const express = require('express');
const multer = require('multer');
const path = require('path');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/profiles/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', protect, upload.single('image'), asyncHandler(async (req, res) => {
    console.log('UPLOAD ROUTE HIT');
    if (!req.file) {
        console.log('NO FILE IN REQUEST');
        res.status(400);
        throw new Error('No file uploaded');
    }

    console.log('FILE UPLOADED:', req.file.filename);
    try {
        const imagePath = `/uploads/profiles/${req.file.filename}`;

        console.log('UPDATING USER IN DB:', req.user._id, 'WITH PIX:', imagePath);

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { profilePicture: imagePath },
            { new: true, runValidators: false } // runValidators: false to be safe during this specific update
        );

        if (updatedUser) {
            console.log('USER UPDATED SUCCESSFULLY:', updatedUser.email);
            res.json({
                message: 'Image uploaded successfully',
                profilePicture: imagePath,
            });
        } else {
            console.log('USER NOT FOUND DURING UPDATE');
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('DATABASE UPDATE ERROR:', error);
        res.status(500).json({
            message: 'Database update failed',
            error: error.message
        });
    }
}));

module.exports = router;
