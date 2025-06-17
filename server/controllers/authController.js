const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendActivationEmail } = require('../utils/mailService'); 
const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError');
const { Subscriber } = require('../models/models'); 
const { registrationSchema, loginSchema, resendActivationSchema, activateSchema } = require('../validators/authValidators'); // joi-библиотека ( для внесения дополнительной валидации )
const secretKey = process.env.SECRET_KEY || 'your_default_secret_key';

const generateJwt = (id, email, role, firstName, lastName) => {
    return jwt.sign(
        { id, email, role, firstName, lastName },
        secretKey,
        { expiresIn: '1y' }
    );
};
class AuthController {
    // Регистрация нового пользователя
    async registration(req, res, next) {
        try {
            const { error, value } = registrationSchema.validate(req.body);
            if(error){
                return next(ApiError.badRequest(error.details.map(d=>d.message).join(', ')));
            }
            const {
                first_name,
                last_name,
                middle_name,
                date_of_birth,
                phone_number,
                email,
                snils,
                password
            } = value;

            if (!email || !password || !first_name || !last_name) {
                return next(ApiError.badRequest('Некорректные email, пароль, имя или фамилия'));
            }

            const existingSubscriber = await Subscriber.findOne({ where: { email } });
            if (existingSubscriber) {
                return next(ApiError.badRequest(`Пользователь с email ${email} уже существует`));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const activationCode = uuidv4();
            const activationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа

            const subscriber = await Subscriber.create({
                first_name,
                last_name,
                middle_name,
                date_of_birth,
                phone_number,
                email,
                snils,
                password: hashPassword,
                activationCode,
                activationCodeExpires,
                role: 'USER',
                isActivated: false,
                activationEmailStatus: 'pending'
            });

            try {
                await sendActivationEmail(email, activationCode);
                console.log(`Activation email sent to ${email}`);
                subscriber.activationEmailStatus = 'sent';
                await subscriber.save();
            } catch (emailError) {
                console.error('Failed to send activation email:', emailError);
                subscriber.activationEmailStatus = 'failed';
                await subscriber.save();
            }

            return res.json({
                message: 'Регистрация успешна. Пожалуйста, проверьте вашу почту для активации аккаунта.'
            });
        } catch (e) {
            console.error('Error in registration:', e);
            if (e.name === 'SequelizeValidationError') {
                return next(ApiError.badRequest(e.errors.map(err => err.message).join(', ')));
            }
            if (e.name === 'SequelizeUniqueConstraintError') {
                const fieldName = e.errors[0].path;
                const fieldMap = { email: 'email', snils: 'СНИЛС' };
                const displayFieldName = fieldMap[fieldName] || fieldName;
                return next(ApiError.badRequest(`Запись с таким ${displayFieldName} уже существует.`));
            }
            next(e);
        }
    }

    // Повторная отправка письма активации
    async resendActivationEmail(req, res, next) {
        try {
            const { error, value } = resendActivationSchema.validate(req.body);
            if(error){
                 return next(ApiError.badRequest(error.details.map(d => d.message).join(', ')));
            }
            const { email } = value;
            const subscriber = await Subscriber.findOne({ where: { email } });
            if (!subscriber || subscriber.isActivated) {
                return next(ApiError.badRequest('Пользователь не найден или уже активирован'));
            }

            if (subscriber.activationEmailStatus === 'sent') {
                return res.json({ message: 'Письмо уже отправлено' });
            }

            const activationCode = subscriber.activationCode || uuidv4();
            subscriber.activationCode = activationCode;
            subscriber.activationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            subscriber.activationEmailStatus = 'pending';
            await subscriber.save();

            try {
                await sendActivationEmail(email, activationCode);
                subscriber.activationEmailStatus = 'sent';
            } catch (err) {
                subscriber.activationEmailStatus = 'failed';
            }
            await subscriber.save();

            res.json({ message: 'Повторная отправка письма выполнена' });
        } catch (e) {
            next(e);
        }
    }

    // Вход в систему
    async login(req, res, next) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                return next(ApiError.badRequest(error.details.map(d => d.message).join(', ')));
            }
            const { email, password } = value;

            if (!email || !password) {
                return next(ApiError.badRequest('Некорректные email или пароль'));
            }

            const subscriber = await Subscriber.findOne({ where: { email } });
            if (!subscriber) {
                return next(ApiError.unauthorized('Неверный email или пароль'));
            }

            const comparePassword = await bcrypt.compare(password, subscriber.password);
            if (!comparePassword) {
                return next(ApiError.unauthorized('Неверный email или пароль'));
            }

            if (!subscriber.isActivated) {
                return next(ApiError.forbidden('Аккаунт не активирован. Пожалуйста, проверьте вашу почту.'));
            }

            const token = generateJwt(subscriber.subscriber_id, subscriber.email, subscriber.role, subscriber.first_name, subscriber.last_name);


            return res.json({
                token,
                user: {
                    id: subscriber.subscriber_id,
                    email: subscriber.email,
                    role: subscriber.role,
                    first_name: subscriber.first_name,
                    last_name: subscriber.last_name,
                    middle_name: subscriber.middle_name,
                    date_of_birth: subscriber.date_of_birth,
                    phone_number: subscriber.phone_number,
                    snils: subscriber.snils
                }
            });
        } catch (e) {
            console.error('Error in login:', e);
            next(e);
        }
    }

    // Активация аккаунта по коду
    async activate(req, res, next) {
        try {
            const { error, value } = activateSchema.validate(req.body);
            if(error){
                return next(ApiError.badRequest(error.details.map(d => d.message).join(', ')));
            }
            const { activationCode } = value;
            if (!activationCode) {
                return next(ApiError.badRequest('Код активации не предоставлен'));
            }

            const subscriber = await Subscriber.findOne({ where: { activationCode } });
            if (!subscriber) {
                return next(ApiError.badRequest('Неверный код активации'));
            }

            if (new Date() > new Date(subscriber.activationCodeExpires)) {
                subscriber.activationCode = null;
                subscriber.activationCodeExpires = null;
                await subscriber.save();
                return next(ApiError.badRequest('Срок действия кода истек. Пожалуйста, запросите новый код.'));
            }

            // Активация аккаунта
            subscriber.isActivated = true;
            subscriber.activationCode = null;
            subscriber.activationCodeExpires = null;
            await subscriber.save();

            const token = generateJwt(subscriber.subscriber_id, subscriber.email, subscriber.role);
            return res.json({
                message: 'Аккаунт успешно активирован!',
                token
            });
        } catch (e) {
            console.error('Error in activate:', e);
            next(e);
        }
    }

    // Проверка токена и пользователя
    async check(req, res, next) {
        try {
            const userId = req.user.id;
            const subscriber = await Subscriber.findByPk(userId);

            if (!subscriber) {
                return next(ApiError.unauthorized('Пользователь не найден'));
            }

            if (!subscriber.isActivated) {
                return next(ApiError.forbidden('Аккаунт не активирован.'));
            }

            const newToken = generateJwt(subscriber.subscriber_id, subscriber.email, subscriber.role);
            return res.json({
                token: newToken,
                user: {
                    id: subscriber.subscriber_id,
                    email: subscriber.email,
                    role: subscriber.role,
                    first_name: subscriber.first_name,
                    last_name: subscriber.last_name,
                    middle_name: subscriber.middle_name,
                    date_of_birth: subscriber.date_of_birth,
                    phone_number: subscriber.phone_number,
                    snils: subscriber.snils
                }
            });
        } catch (e) {
            console.error('Error in check:', e);
            next(e);
        }
    }
}
module.exports = new AuthController();