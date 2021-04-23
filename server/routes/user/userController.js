const User = require('../../models/User')
const Role = require('../../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
require("dotenv").config()
const { refreshAccessToken } = require('../../tools/accesTokenCreator')
const request = require('request')

const secret = process.env.secret

class UserController {
  async getUsers(req, res) {
    try {
      // const userRole = new Role()
      // const adminRole = new Role({value: 'ADMIN'})
      // await userRole.save()
      // await adminRole.save()

      const users = await User.find()
      const currentToken = req.headers.authorization.split(' ')[1]
      refreshAccessToken(secret, currentToken, uuidv4())
      res.json(users)
    } catch(e) {
      console.log(e);
    }
  }

  async info(req, res) {
    try {
      const currentToken = req.headers.authorization.split(' ')[1]
      const {user_id, roles} = await refreshAccessToken(secret, currentToken, uuidv4())
      const info = {user_id, roles}
      res.json(info)
    } catch(e) {
      console.log(e);
    }
  }
}

module.exports = new UserController()