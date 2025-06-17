const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');

const secretKey = process.env.SECRET_KEY || 'your_default_secret_key';

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(ApiError.unauthorized('Пользователь не авторизован'));
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(ApiError.unauthorized('Пользователь не авторизован'));
        }

        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; 

        if (!decoded.id || !decoded.firstName || !decoded.lastName) {
            return next(ApiError.unauthorized('Некорректные данные токена'));
        }
        next(); 
    } catch (e) {
        console.error('Ошибка при верификации токена:', e.message);
        return next(ApiError.unauthorized('Пользователь не авторизован'));
    }
};