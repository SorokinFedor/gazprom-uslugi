const Router = require('express');
const router = new Router();
const { Equipment, EquipmentType, EquipmentStatus } = require('../models/models');

router.get('/', async (req, res) => {
  const data = await Equipment.findAll({ order: [['name', 'ASC']] });
  res.json(data);
});

router.get('/types', async (req, res) => {
  const data = await EquipmentType.findAll({ order: [['name', 'ASC']] });
  res.json(data);
});

router.get('/statuses', async (req, res) => {
  const data = await EquipmentStatus.findAll({ order: [['status_name', 'ASC']] });
  res.json(data);
});

module.exports = router;