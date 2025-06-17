// server/utils/mailService.js
require('dotenv').config();
const nodemailer = require('nodemailer');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendActivationEmail = async (toEmail, activationCode) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: toEmail,
            subject: 'Активация аккаунта на GAZPROM-USLUGI',
            text: `Для активации вашего аккаунта используйте следующий код: ${activationCode}`, 
            html: `
                <h2>Активация аккаунта</h2>
                <p>Здравствуйте!</p>
                <p>Благодарим вас за регистрацию на сайте GAZPROM-USLUGI.</p>
                <p>Для активации вашего аккаунта, пожалуйста, введите следующий код на странице активации:</p>
                <h3>${activationCode}</h3>
                <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
                <p>С уважением,<br>Команда GAZPROM-USLUGI</p>
            `,
        };

        
        const info = await transporter.sendMail(mailOptions);
        console.log('Activation email sent: %s', info.messageId);
        return true; 

    } catch (error) {
        console.error('Error sending activation email:', error);
        throw new Error('Не удалось отправить письмо активации.');
    }
};
module.exports = {
    sendActivationEmail,
};