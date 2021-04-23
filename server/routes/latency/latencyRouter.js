const Router = require('express')
const router = new Router()
const controller = require('./latencyController')
const verifyToken = require('../../middleware/verifyToken')

router.get('/latency', verifyToken, controller.latency)

module.exports = router