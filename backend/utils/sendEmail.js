const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if SMTP config is present
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log('----------------------------------------------------');
        console.log('WARNING: SMTP not configured. Printing email to console.');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message}`);
        console.log('----------------------------------------------------');
        return Promise.resolve(); // Return resolved promise to simulate success
    }

    const transporterOptions = {
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: process.env.SMTP_PORT || 2525,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    };

    // Special handling for Gmail to make it more robust
    if (process.env.SMTP_HOST === 'smtp.gmail.com') {
        transporterOptions.service = 'gmail';
        // When using service: 'gmail', host and port are usually handled automatically by nodemailer
    }

    const transporter = nodemailer.createTransport(transporterOptions);

    const message = {
        from: `${process.env.FROM_NAME || 'KolieShop'} <${process.env.FROM_EMAIL || 'noreply@kolieshop.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
