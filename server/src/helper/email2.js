/* const nodemailer = require('nodemailer');
const {smtpUsername, smtpPassword} = require('../secret');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: smtpUsername,
        pass: smtpPassword,
    },
});

const getEmailData = (prepareEmailData) => {
    const mailOptions = {
        from: smtpUsername,
        to: prepareEmailData.email,
        subject: 'Sending Email using Node.js',
        html: prepareEmailData.html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = getEmailData; */
