class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message; 
        this.name = 'ApiError'; 
    }

    static badRequest(message) {
        return new ApiError(400, message); // ошибка неверного запроса
    }

    static unauthorized(message) {
        return new ApiError(401, message); // неверные учетные данные для аутентификации 
    }

    static forbidden(message) {
        return new ApiError(403, message); // доступ запрещен
    }

    static notFound(message) {
        return new ApiError(404, message); // невозможно найти ресурс
    }

    static internal(message) {
        return new ApiError(500, message); // внутренняя ошибка сервера
    }
}

module.exports = ApiError;