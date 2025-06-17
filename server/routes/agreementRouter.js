const Router = require('express');
const router = new Router();
const agreementController = require('../controllers/agreementController');

router.get('/', agreementController.getAll);
router.get('/by-subscriber/:subscriber_id', agreementController.getBySubscriber);
router.get('/:id', agreementController.getOne);
router.post('/create', agreementController.create);
router.put('/:id', agreementController.update);
router.delete('/:id', agreementController.delete);

module.exports = router;