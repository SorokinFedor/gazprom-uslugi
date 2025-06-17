const ApiError = require('../error/ApiError'); 
module.exports = function (err, req, res, next) {
    // проверка: является ли ошибка экземпляром ApiError
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }
    console.error('Непредвиденная ошибка сервера:', err);
    return res.status(500).json({ message: 'Непредвиденная ошибка сервера!' });
}