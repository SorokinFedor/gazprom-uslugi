const { Subscriber, Address } = require('../models/models');
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
class SubscriberController {
    async create(req, res, next) {
        try {
            const { first_name, last_name, middle_name, date_of_birth, phone_number, email, snils, address_id } = req.body;

            if (!first_name || !last_name || !address_id) {
                return next(ApiError.badRequest('Отсутствуют обязательные поля: имя, фамилия и ID адреса.'));
            }

            const existingAddress = await Address.findByPk(address_id);
            if (!existingAddress) {
                return next(ApiError.badRequest('Адрес с указанным ID не найден.'));
            }

            const newSubscriber = await Subscriber.create({
                first_name,
                last_name,
                middle_name,
                date_of_birth,
                phone_number,
                email,
                snils,
                address_id,
            });

            return res.json({
                subscriber_id: newSubscriber.subscriber_id,
                first_name: newSubscriber.first_name,
                last_name: newSubscriber.last_name,
            });
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Такой абонент уже существует.'));
            }
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            if (req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Доступ запрещен'));
            }
            const subscribers = await Subscriber.findAll();
            res.json(subscribers);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const subscriber = await Subscriber.findByPk(id);
            if (!subscriber) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
            if (req.user.role !== 'ADMIN' && req.user.id !== subscriber.subscriber_id) {
                return next(ApiError.forbidden('Доступ запрещен'));
            }

            res.json(subscriber);
        } catch (e) {
            next(e);
        }
    }
    async update(req, res, next) {
    try {
        const { id } = req.params;
        const { phone_number, ...updatedData } = req.body;
        const subscriber = await Subscriber.findByPk(id);
        
        if (!subscriber) {
            return next(ApiError.notFound('Абонент не найден.'));
        }
        
        if (req.user.role !== 'ADMIN' && req.user.id !== subscriber.subscriber_id) {
            return next(ApiError.forbidden('Доступ запрещен'));
        }
        
        if (phone_number && !/^\+7\d{10}$/.test(phone_number)) {
            return next(ApiError.badRequest('Некорректный номер телефона'));
        }
        if (phone_number) {
            subscriber.phone_number = phone_number;
            updatedData.phone_number = phone_number; 
        }
        console.log('Subscriber before update:', subscriber);
        console.log('Updated data:', updatedData);
        await subscriber.update(updatedData);
        await subscriber.save();

        console.log('Update request body:', req.body);
        return res.json(subscriber);
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const subscriber = await Subscriber.findByPk(id);
            if (!subscriber) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
            if (req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Доступ запрещен'));
            }
            await subscriber.destroy();
            res.json({ message: 'Абонент удален' });
        } catch (e) {
            next(e);
        }
    }
   async changePassword(req, res, next) {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    try {
        const subscriber = await Subscriber.findByPk(id);
        if (!subscriber) {
            return next(ApiError.notFound('Пользователь не найден'));
        }
        const isMatch = await bcrypt.compare(currentPassword, subscriber.password);
        if (!isMatch) {
            return next(ApiError.badRequest('Неверный текущий пароль.'));
        }
        if (newPassword.length < 10) {
            return next(ApiError.badRequest('Новый пароль должен содержать не менее 10 символов.'));
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        subscriber.password = hashedPassword;
        await subscriber.save();

        return res.json({ message: 'Пароль успешно изменён' });
    } catch (e) {
        console.error(e); 
        return next(ApiError.internal('Произошла ошибка при смене пароля.'));
    }
}
    async deleteAccount(req, res, next) {
        const { id } = req.params;
        try {
            const subscriber = await Subscriber.findByPk(id);
            if (!subscriber) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
            if (req.user.role !== 'ADMIN' && req.user.id !== subscriber.subscriber_id) {
                return next(ApiError.forbidden('Доступ запрещен'));
            }

            await subscriber.destroy();
            return res.json({ message: 'Учётная запись удалена' });
        } catch (e) {
            next(e);
        }
    }
}
module.exports = new SubscriberController();