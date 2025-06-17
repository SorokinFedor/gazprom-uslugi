const { Router } = require('express');
const router = Router();
const { Subscriber } = require('../models/models');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { activationCode } = req.body;

  try {
    const subscriber = await Subscriber.findOne({ where: { activationCode } });

    if (!subscriber) {
      return res.status(400).json({ message: 'Неверный код активации.' });
    }

    if (subscriber.isActivated) {
      return res.status(400).json({ message: 'Абонент уже активирован.' });
    }

    subscriber.isActivated = true;
    await subscriber.save();

    const token = jwt.sign({ id: subscriber.subscriber_id, role: subscriber.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сервера.' });
  }
});
module.exports = router;