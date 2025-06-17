require('dotenv').config();
const { sendActivationEmail } = require('../server/utils/mailService');

(async () => {
  try {
    await sendActivationEmail('sorokin_fedor1997it@mail.ru', '123456');
    console.log('Письмо отправлено успешно');
  } catch (err) {
    console.error('Ошибка при отправке:', err);
  }
})();