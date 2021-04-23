const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require('express-validator')
const verifyToken = require('../../middleware/verifyToken')

router.post('/signup', [
  check('username', "Username can't be empty").notEmpty(),
  check('user_id', "Mail can't be empty").notEmpty(),
  check('password', 'Password have to be either more then 4 or less then 10 symbals').isLength({min:4, max:10})
], controller.signup)
router.post('/login', controller.login)
router.get('/logout', verifyToken, controller.logout)

module.exports = router