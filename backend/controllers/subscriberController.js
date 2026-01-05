const asyncHandler = require('express-async-handler');
const Subscriber = require('../models/Subscriber.js');

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
const subscribeToNewsletter = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Veuillez fournir un email');
    }

    const subscriberExists = await Subscriber.findOne({ email });

    if (subscriberExists) {
        res.status(400);
        throw new Error('Cet email est déjà inscrit à notre newsletter');
    }

    const subscriber = await Subscriber.create({
        email
    });

    if (subscriber) {
        res.status(201).json({
            success: true,
            message: 'Inscription réussie ! Merci de votre confiance.'
        });
    } else {
        res.status(400);
        throw new Error('Erreur lors de l\'inscription');
    }
});

module.exports = {
    subscribeToNewsletter
};
