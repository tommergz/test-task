const Router = require('express')
const router = new Router()
const controller = require('./userController')
const verifyToken = require('../../middleware/verifyToken')

router.get('/users', verifyToken, controller.getUsers)
router.get('/info', verifyToken, controller.info)

module.exports = router