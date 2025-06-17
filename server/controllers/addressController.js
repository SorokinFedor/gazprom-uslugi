const { Address } = require('../models/models');
const ApiError = require('../error/ApiError');
const { SequelizeUniqueConstraintError } = require('sequelize');

class AddressController {
    // создание адреса
    async create(req, res, next) {
        try {
            const { region, district, city, street, house_number, apartment_number, zip_code } = req.body;
            if (!city || !street || !house_number || !zip_code) {
                return next(ApiError.badRequest('Отсутствуют обязательные поля: город, улица, номер дома, почтовый индекс.'));
            }
            const address = await Address.create({
                region,
                district,
                city,
                street,
                house_number,
                apartment_number,
                zip_code
            });
            return res.status(201).json(address);
        } catch (e) {
            if (e instanceof SequelizeUniqueConstraintError) {
                return next(ApiError.badRequest('Адрес с такими данными уже существует.'));
            }
            next(ApiError.badRequest(e.message));
        }
    }

    // получение списка адресов
    async getAll(req, res, next) {
        try {
            let { city, street, limit, page } = req.query;
            // приведение limit и page к числам
            limit = parseInt(limit) || 10;
            page = parseInt(page) || 1;
            const offset = limit * (page - 1);
            let whereCondition = {};

            if (city) {
                whereCondition.city = city; // фильтр по городу
            }
            if (street) {
                whereCondition.street = street; // фильтр по улице
            }

            const addresses = await Address.findAndCountAll({
                where: whereCondition,
                limit,
                offset,
                order: [['city', 'ASC'], ['street', 'ASC'], ['house_number', 'ASC']]
            });
            return res.json(addresses);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении списка адресов: ' + e.message));
        }
    }

    // получение адреса по ID
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const idNum = parseInt(id);
            if (isNaN(idNum)) {
                return next(ApiError.badRequest('Некорректный формат ID адреса. ID должен быть числом.'));
            }
            const address = await Address.findByPk(idNum);
            if (!address) {
                return next(ApiError.notFound('Адрес с указанным ID не найден'));
            }
            return res.json(address);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении адреса: ' + e.message));
        }
    }

    // обновление адреса по ID
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const idNum = parseInt(id);
            if (isNaN(idNum)) {
                return next(ApiError.badRequest('Некорректный формат ID адреса.'));
            }

            const { region, district, city, street, house_number, apartment_number, zip_code } = req.body;

            const address = await Address.findByPk(idNum);
            if (!address) {
                return next(ApiError.notFound('Адрес с указанным ID не найден'));
            }

            await address.update({
                region,
                district,
                city,
                street,
                house_number,
                apartment_number,
                zip_code
            });
            return res.json(address);
        } catch (e) {
            if (e instanceof SequelizeUniqueConstraintError) {
                return next(ApiError.badRequest('Адрес с такими данными уже существует.'));
            }
            next(ApiError.badRequest('Ошибка при обновлении адреса: ' + e.message));
        }
    }

    // удаление адреса по ID
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const idNum = parseInt(id);
            if (isNaN(idNum)) {
                return next(ApiError.badRequest('Некорректный формат ID адреса.'));
            }

            const deletedRows = await Address.destroy({ where: { address_id: idNum } });
            if (deletedRows === 0) {
                return next(ApiError.notFound('Адрес с указанным ID не найден'));
            }
            return res.json({ message: 'Адрес успешно удален' });
        } catch (e) {
            next(ApiError.internal('Ошибка при удалении адреса: ' + e.message));
        }
    }
}

module.exports = new AddressController();