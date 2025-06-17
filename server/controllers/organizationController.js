const { Organization } = require('../models/models'); 

class OrganizationController {
    // создание новой организации
    async create(req, res) {
        try {
            const { name, address, phone_number, contact_person } = req.body;

            // проверка на обязательные поля (например, name)
            if (!name) {
                return res.status(400).json({ message: 'Поле "Наименование" является обязательным.' });
            }

            // проверка на уникальность наименования организации
            const existingOrganization = await Organization.findOne({ where: { name } });
            if (existingOrganization) {
                return res.status(400).json({ message: 'Организация с таким наименованием уже существует.' });
            }

            const organization = await Organization.create({ name, address, phone_number, contact_person });
            return res.status(201).json(organization);
        } catch (e) {
            console.error('Ошибка при создании организации:', e);
            if (e.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: e.errors.map(err => err.message).join(', ') });
            }
            return res.status(500).json({ message: 'Произошла ошибка при создании организации.' });
        }
    }

    // получение всех организаций
    async getAll(req, res) {
        try {
            const organizations = await Organization.findAll();
            return res.json(organizations);
        } catch (e) {
            console.error('Ошибка при получении всех организаций:', e);
            return res.status(500).json({ message: 'Произошла ошибка при получении списка организаций.' });
        }
    }

    // получение одной организации по ID
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const organization = await Organization.findByPk(id);

            if (!organization) {
                return res.status(404).json({ message: 'Организация не найдена.' });
            }

            return res.json(organization);
        } catch (e) {
            console.error(`Ошибка при получении организации с ID ${req.params.id}:`, e);
            return res.status(500).json({ message: 'Произошла ошибка при получении организации.' });
        }
    }

    // обновление организации по ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, address, phone_number, contact_person } = req.body;

            const organization = await Organization.findByPk(id);

            if (!organization) {
                return res.status(404).json({ message: 'Организация не найдена.' });
            }

            // проверка на уникальность наименования при обновлении, если оно меняется
            if (name && name !== organization.name) {
                const existingOrganization = await Organization.findOne({ where: { name } });
                if (existingOrganization) {
                    return res.status(400).json({ message: 'Организация с таким наименованием уже существует.' });
                }
            }

            await organization.update({ name, address, phone_number, contact_person });
            return res.json(organization); // Возвращаем обновленную организацию
        } catch (e) {
            console.error(`Ошибка при обновлении организации с ID ${req.params.id}:`, e);
             // Обработка ошибок валидации Sequelize
             if (e.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: e.errors.map(err => err.message).join(', ') });
            }
            return res.status(500).json({ message: 'Произошла ошибка при обновлении организации.' });
        }
    }

    // удаление организации по ID
    async delete(req, res) {
        try {
            const { id } = req.params;
            const organization = await Organization.findByPk(id);

            if (!organization) {
                return res.status(404).json({ message: 'Организация не найдена.' });
            }

            await organization.destroy();
            return res.json({ message: 'Организация успешно удалена.' });
        } catch (e) {
            console.error(`Ошибка при удалении организации с ID ${req.params.id}:`, e);
            return res.status(500).json({ message: 'Произошла ошибка при удалении организации.' });
        }
    }
}

module.exports = new OrganizationController();