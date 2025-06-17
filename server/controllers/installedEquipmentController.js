const {
    InstalledEquipment,
    Subscriber,
    EquipmentType,
    EquipmentStatus,
    Equipment,
    Verification,
    Organization 
} = require('../models/models'); 
const ApiError = require('../error/ApiError');
const { Sequelize, Op } = require('sequelize'); 
class InstalledEquipmentController {
    // создание установленного оборудования
    async create(req, res, next) {
        try {
            const {
                installation_date,
                installation_location,
                last_inspection_date,
                next_inspection_date,
                notes,
                subscriber_id, 
                equipment_type_id, 
                status_id, 
                equipment_id 
            } = req.body;

            const installedEquipment = await InstalledEquipment.create({
                installation_date,
                installation_location,
                last_inspection_date,
                next_inspection_date,
                notes,
                subscriber_id,
                equipment_type_id,
                status_id,
                equipment_id
            });
            return res.status(201).json(installedEquipment);
        } catch (e) {
            next(ApiError.badRequest('Ошибка при создании установленного оборудования: ' + e.message));
        }
    }
    // вывод информации о всех установленных оборудованиях
    async getAll(req, res, next) {
        try {
            let {
                subscriber_id, 
                equipment_type_id, 
                status_id, 
                equipment_id, 
                installation_date,
                installation_location,
                limit,
                page
            } = req.query;

            page = page || 1;
            limit = limit || 10;
            let offset = limit * (page - 1);
            let whereCondition = {};

            if (subscriber_id) {
                whereCondition.subscriber_id = subscriber_id;
            }
            if (equipment_type_id) {
                whereCondition.equipment_type_id = equipment_type_id;
            }
            if (status_id) {
                whereCondition.status_id = status_id;
            }
            if (equipment_id) {
                whereCondition.equipment_id = equipment_id;
            }
            if (installation_date) {
                whereCondition.installation_date = installation_date;
            }
            if (installation_location) {
                whereCondition.installation_location = { [Op.iLike]: `%${installation_location}%` };
            }

            const installedEquipments = await InstalledEquipment.findAndCountAll({
                where: whereCondition,
                limit,
                offset,
                include: [
                    { model: Subscriber }, 
                    { model: EquipmentType }, 
                    { model: EquipmentStatus }, 
                    { model: Equipment }, 
                    {
                        model: Verification, 
                        include: [{ model: Organization }] 
                    }
                ],
                order: [['installation_date', 'DESC']]
            });
            return res.status(200).json(installedEquipments);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении списка установленного оборудования: ' + e.message));
        }
    }
    // получение установленного оборудования по его ID
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const installedEquipment = await InstalledEquipment.findOne({
                where: { installed_equipment_id: id },
                include: [
                    { model: Subscriber },
                    { model: EquipmentType },
                    { model: EquipmentStatus },
                    { model: Equipment },
                    {
                        model: Verification,
                        include: [{ model: Organization }]
                    }
                ]
            });
            if (!installedEquipment) {
                return next(ApiError.notFound('Установленное оборудование с таким ID не найдено.'));
            }
            return res.status(200).json(installedEquipment);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении установленного оборудования: ' + e.message));
        }
    }
    // обновление информации об установленном оборудовании
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const {
                installation_date,
                installation_location,
                last_inspection_date,
                next_inspection_date,
                notes,
                subscriber_id,
                equipment_type_id,
                status_id,
                equipment_id
            } = req.body;

            const [updatedRowsCount, updatedInstalledEquipments] = await InstalledEquipment.update({
                installation_date,
                installation_location,
                last_inspection_date,
                next_inspection_date,
                notes,
                subscriber_id,
                equipment_type_id,
                status_id,
                equipment_id
            }, {
                where: { installed_equipment_id: id },
                returning: true
            });

            if (updatedRowsCount === 0) {
                return next(ApiError.notFound('Установленное оборудование с таким ID не найдено для обновления.'));
            }

            return res.status(200).json(updatedInstalledEquipments[0]);
        } catch (e) {
            next(ApiError.badRequest('Ошибка при обновлении установленного оборудования: ' + e.message));
        }
    }
    // удаление информации об установленном оборудовании
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deletedRowsCount = await InstalledEquipment.destroy({
                where: { installed_equipment_id: id }
            });

            if (deletedRowsCount === 0) {
                return next(ApiError.notFound('Установленное оборудование с таким ID не найдено для удаления.'));
            }

            return res.status(200).json({ message: 'Установленное оборудование успешно удалено.' });
        } catch (e) {
            next(ApiError.internal('Ошибка при удалении установленного оборудования: ' + e.message));
        }
    }
    async createMultiple(req, res) {
        try {
            const { equipment_items } = req.body;

            if (!Array.isArray(equipment_items) || equipment_items.length === 0) {
                return res.status(400).json({ message: 'Нет оборудования для добавления.' });
            }
            for (const item of equipment_items) {
                if (!item.subscriber_id) {
                    return res.status(400).json({ message: 'subscriber_id обязателен в каждом элементе equipment_items' });
                }
            }

            const createdRecords = [];

                for (const item of equipment_items) {
                    const record = await InstalledEquipment.create(item);
                    createdRecords.push(record);
                }

                return res.status(201).json({
                    message: `Создано ${createdRecords.length} записей установленного оборудования.`,
                    data: createdRecords
                });
        } catch (e) {
            console.error('Ошибка при создании нескольких записей установленного оборудования:', e);
            return res.status(500).json({ message: 'Ошибка при создании оборудования.' });
        }
    }
async getAgreementBySubscriber(req, res, next) {
  try {
    const { subscriber_id } = req.params;
    const equipmentItems = await InstalledEquipment.findAll({
      where: { subscriber_id },
      include: [
        { model: EquipmentType },
        { model: EquipmentStatus },
        { model: Equipment },
        {
          model: Verification,
          include: [{ model: Organization }]
        }
      ],
      order: [['installation_date', 'DESC']]
    });
    if (!equipmentItems.length) {
      return next(ApiError.notFound('Договор с таким subscriber_id не найден.'));
    }
    return res.status(200).json({
      subscriber_id,
      equipment_items: equipmentItems
    });
  } catch (e) {
    next(ApiError.internal('Ошибка при получении договора: ' + e.message));
  }
}
 async updateMultiple(req, res, next) {
  try {
    console.log('updateMultiple req.body:', req.body);
    const { equipment_items } = req.body;

    if (!Array.isArray(equipment_items) || equipment_items.length === 0) {
      return res.status(400).json({ message: 'Нет данных для обновления.' });
    }

    const updatedRecords = [];

    for (const item of equipment_items) {
      const { installed_equipment_id, ...updateData } = item;

      if (!installed_equipment_id) {
        console.warn('Пропущен installed_equipment_id в элементе:', item);
        continue; 
      }

      const [updatedCount, [updatedRecord]] = await InstalledEquipment.update(updateData, {
        where: { installed_equipment_id },
        returning: true
      });

      if (updatedCount > 0) {
        updatedRecords.push(updatedRecord);
      } else {
        console.warn(`Не найдено оборудование с id ${installed_equipment_id} для обновления.`);
      }
    }

    return res.status(200).json({
      message: `Обновлено ${updatedRecords.length} записей.`,
      data: updatedRecords
    });
  } catch (e) {
    console.error('Ошибка в updateMultiple:', e);
    next(ApiError.internal('Ошибка при массовом обновлении оборудования: ' + e.message));
  }
}
}
module.exports = new InstalledEquipmentController();