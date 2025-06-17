const Router = require('express')
const router = new Router()
const addressController = require('../controllers/addressController') 
router.post('/', addressController.create)
router.get('/', addressController.getAll)
router.get('/:id', addressController.getOne)
router.put('/:id', addressController.update) 
router.delete('/:id', addressController.delete) 
module.exports = router