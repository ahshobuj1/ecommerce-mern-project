const nodemailer = require('nodemailer');
const {smtpUsername, smtpPassword} = require('../secret');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: smtpUsername,
        pass: smtpPassword,
    },
});

const sendEmailActivationURL = async (prepareEmailData) => {
    try {
        const mailOptions = {
            from: smtpUsername,
            to: prepareEmailData.email,
            subject: prepareEmailData.subject,
            html: prepareEmailData.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.response);
    } catch (error) {
        console.error('Error occurred while sending email: ', error);
        throw error;
    }
};

module.exports = sendEmailActivationURL;
