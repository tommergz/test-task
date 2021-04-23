const { v4: uuidv4 } = require('uuid');
require("dotenv").config()
const { refreshAccessToken } = require('../../tools/accesTokenCreator')
const request = require('request')

const secret = process.env.secret

class LatencyController {
  async latency(req, res) {
    const startTime = Date.now();
    request(
      'https://www.google.by',
      async (err, response, body) => {
        if (err) return res.status(500).send({ message: err })
        const latency = `${Date.now() - startTime}ms`
        const currentToken = req.headers.authorization.split(' ')[1]
        await refreshAccessToken(secret, currentToken, uuidv4())
        return res.json(latency)
      }
    )
  }
}

module.exports = new LatencyController()