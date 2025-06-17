const { Agreement, InstalledEquipment, EquipmentType, EquipmentStatus, Equipment } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Sequelize } = require('sequelize');

class AgreementController {
  async create(req, res, next) {
    try {
      const { subscriber_id, agreement_number, start_date, end_date, notes } = req.body;

      if (!subscriber_id || !agreement_number || !start_date) {
        return next(ApiError.badRequest('subscriber_id, agreement_number и start_date обязательны'));
      }

      const agreement = await Agreement.create({
        subscriber_id,
        agreement_number,
        start_date,
        end_date,
        notes
      });

      return res.status(201).json(agreement);
    } catch (e) {
      next(ApiError.badRequest('Ошибка при создании договора: ' + e.message));
    }
  }
  async getBySubscriber(req, res, next) {
    try {
      const { subscriber_id } = req.params;
      if (!subscriber_id) {
        return next(ApiError.badRequest('subscriber_id обязателен'));
      }

      const agreements = await Agreement.findAll({
        where: { subscriber_id },
        attributes: [
          'agreement_id',
          'agreement_number',
          'start_date',
          'end_date',
          'notes',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "InstalledEquipments" AS ie
              WHERE ie.agreement_id = "Agreement".agreement_id
            )`),
            'equipmentCount'
          ]
        ],
        order: [['start_date', 'DESC']]
      });

      return res.status(200).json(agreements);
    } catch (e) {
      next(ApiError.internal('Ошибка при получении договоров: ' + e.message));
    }
  }
  async getOne(req, res, next) {
    try {
      const { id } = req.params;

      const agreement = await Agreement.findOne({
        where: { agreement_id: id },
        include: [
          {
            model: InstalledEquipment,
            include: [
              { model: EquipmentType, attributes: ['equipment_type_id', 'name'] },
              { model: EquipmentStatus, attributes: ['status_id', 'status_name'] },
              { model: Equipment, attributes: ['equipment_id', 'name', 'description', 'power'] }
            ]
          }
        ]
      });

      if (!agreement) {
        return next(ApiError.notFound('Договор с таким ID не найден.'));
      }

      return res.status(200).json(agreement);
    } catch (e) {
      next(ApiError.internal('Ошибка при получении договора: ' + e.message));
    }
  }
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { agreement_number, start_date, end_date, notes } = req.body;

      const [updatedCount, [updatedAgreement]] = await Agreement.update(
        { agreement_number, start_date, end_date, notes },
        {
          where: { agreement_id: id },
          returning: true
        }
      );

      if (updatedCount === 0) {
        return next(ApiError.notFound('Договор с таким ID не найден для обновления.'));
      }

      return res.status(200).json(updatedAgreement);
    } catch (e) {
      next(ApiError.badRequest('Ошибка при обновлении договора: ' + e.message));
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const deletedCount = await Agreement.destroy({
        where: { agreement_id: id }
      });

      if (deletedCount === 0) {
        return next(ApiError.notFound('Договор с таким ID не найден для удаления.'));
      }

      return res.status(200).json({ message: 'Договор успешно удалён.' });
    } catch (e) {
      next(ApiError.internal('Ошибка при удалении договора: ' + e.message));
    }
  }
  async getAll(req, res, next) {
    try {
      const agreements = await Agreement.findAll({
        attributes: [
          'agreement_id',
          'subscriber_id',     // <- добавьте это поле
          'agreement_number',
          'start_date',
          'end_date',
          'notes',
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM "InstalledEquipments" AS ie
            WHERE ie.agreement_id = "Agreement".agreement_id
          )`),
          'equipmentCount'
        ] 
      ],
      order: [['start_date', 'DESC']]
      });
      return res.status(200).json(agreements);
    } catch (e) {
      next(ApiError.internal('Ошибка при получении всех договоров: ' + e.message));
    }
  }
}
module.exports = new AgreementController();