const User = require('../../models/User')
const Role = require('../../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
require("dotenv").config()
const { generateAccessToken } = require('../../tools/accesTokenCreator')

const secret = process.env.secret

class AuthController {
  async signup(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({message: 'Registration error', errors})
      }
      const {username, user_id, password} = req.body
      const candidate = await User.findOne({username: 'User with this username already exists'})
      if (candidate) {
        return res.status(400).json({message})
      }
      const hashPassword = bcrypt.hashSync(password, 5)
      const userRole = await Role.findOne({value: 'USER'})
      const user = new User({
        username, 
        user_id, 
        password: hashPassword, 
        roles: [userRole.value],
        accessToken: 'deleted ' +Date.now(),
        refreshToken: 'deleted ' +Date.now()
      })
      await user.save()
      const token = await generateAccessToken(secret, true, user_id, user.password, '5m')
      return res.json({token})
    } catch(e) {
      console.log(e);
      res.status(400).json({message: 'Registration error'})
    }
  }

  async login(req, res) {
    try {
      const {username, password} = req.body
      const user = await User.findOne({username})
      if (!user) {
        return res.status(400).json({message: 'User not found'})
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(400).json({message: 'Wrong password'})
      }
      const token = await generateAccessToken(secret, true, user.user_id, password, '5m')
      return res.json({token})
    } catch(e) {
      console.log(e);
      res.status(400).json({message: 'Login error'})
    }
  }

  async logout(req, res) {
    try {
      const currentToken = req.headers.authorization.split(' ')[1]
      let user = await User.findOne({ accessToken: currentToken })
      if (!user) {
        user = await User.findOne({ refreshToken: currentToken })
      }
      const full = JSON.parse(req.query.full)
      if (full) {
        await User.updateOne(
          { 'user_id': user.user_id },
          { $set: 
              { 
                'accessToken': 'deleted ' + user.accessToken,
                'refreshToken': 'deleted ' + user.refreshToken,
              } 
          }
        )
      } else {
        if (user.refreshToken) {
          await User.updateOne(
            { 'user_id': user.user_id },
            { $set:{ 'refreshToken': 'deleted ' + user.refreshToken} }
          )
        } else {
          await User.updateOne(
            { 'user_id': user.user_id },
            { $set:{ 'accessToken': 'deleted ' + user.accessToken} }
          )
        }
      }
      res.json({message: 'Logout'})
    } catch(e) {
      console.log(e);
    }
  }
}

module.exports = new AuthController()