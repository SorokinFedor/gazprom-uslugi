const Router = require('express')
const router = new Router()
const organizationController = require('../controllers/organizationController') 
router.post('/', organizationController.create)
router.get('/', organizationController.getAll)
router.get('/:id', organizationController.getOne)
router.put('/:id', organizationController.update) 
router.delete('/:id', organizationController.delete) 
module.exports = router