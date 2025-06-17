const ApiError = require('../error/ApiError');

function checkRole(requiredRoles) {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(ApiError.unauthorized('Пользователь не авторизован'));
        }
        if (!requiredRoles.includes(req.user.role)) {
            return next(ApiError.forbidden('Доступ запрещен'));
        }
        next();
    };
}

module.exports = checkRole;