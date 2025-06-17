const { Equipment } = require('../models/models'); 
class EquipmentController {
    // создание нового оборудования
    async create(req, res) {
        try {
            const { name, description, power, inspectionPeriod, serviceLife, hasThermometer } = req.body;

            // проверка на обязательные поля (например, name)
            if (!name) {
                return res.status(400).json({ message: 'Поле "Наименование" является обязательным.' });
            }

            const equipment = await Equipment.create({ 
                name, 
                description, 
                power: power === '' ? null : power, 
                inspectionPeriod: inspectionPeriod === '' ? null : inspectionPeriod,
                serviceLife: serviceLife === '' ? null : serviceLife,
                hasThermometer 
            });

            return res.status(201).json(equipment);
        } catch (e) {
            console.error('Ошибка при создании оборудования:', e);
            // обработка ошибок валидации Sequelize
            if (e.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: e.errors.map(err => err.message).join(', ') });
            }
            return res.status(500).json({ message: 'Произошла ошибка при создании оборудования.' });
        }
    }

    // получение всего оборудования
    async getAll(req, res) {
        try {
            const equipments = await Equipment.findAll();
            return res.json(equipments);
        } catch (e) {
            console.error('Ошибка при получении всего оборудования:', e);
            return res.status(500).json({ message: 'Произошла ошибка при получении списка оборудования.' });
        }
    }

    // получение одного оборудования по ID
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const equipment = await Equipment.findByPk(id);

            if (!equipment) {
                return res.status(404).json({ message: 'Оборудование не найдено.' });
            }

            return res.json(equipment);
        } catch (e) {
            console.error(`Ошибка при получении оборудования с ID ${req.params.id}:`, e);
            return res.status(500).json({ message: 'Произошла ошибка при получении оборудования.' });
        }
    }

    // обновление оборудования по ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, power, inspectionPeriod, serviceLife, hasThermometer } = req.body;

            const equipment = await Equipment.findByPk(id);

            if (!equipment) {
                return res.status(404).json({ message: 'Оборудование не найдено.' });
            }

            await equipment.update({ 
                name, 
                description, 
                power: power === '' ? null : power, 
                inspectionPeriod: inspectionPeriod === '' ? null : inspectionPeriod,
                serviceLife: serviceLife === '' ? null : serviceLife,
                hasThermometer 
            });

            return res.json(equipment); 
        } catch (e) {
            console.error(`Ошибка при обновлении оборудования с ID ${req.params.id}:`, e);
             // обработка ошибок валидации Sequelize
             if (e.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: e.errors.map(err => err.message).join(', ') });
            }
            return res.status(500).json({ message: 'Произошла ошибка при обновлении оборудования.' });
        }
    }

    // удаление оборудования по ID
    async delete(req, res) {
        try {
            const { id } = req.params;
            const equipment = await Equipment.findByPk(id);

            if (!equipment) {
                return res.status(404).json({ message: 'Оборудование не найдено.' });
            }

            await equipment.destroy();
            return res.json({ message: 'Оборудование успешно удалено.' });
        } catch (e) {
            console.error(`Ошибка при удалении оборудования с ID ${req.params.id}:`, e);
            return res.status(500).json({ message: 'Произошла ошибка при удалении оборудования.' });
        }
    }
}

module.exports = new EquipmentController();