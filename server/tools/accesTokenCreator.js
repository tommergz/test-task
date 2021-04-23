const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateAccessToken = async (secret, login, user_id, password='password', time='5m') => {
  const payload = {
    user_id,
    password
  }

  const token = jwt.sign(payload, secret, {expiresIn: time})
  if (login) {
    await User.updateOne(
      { 'user_id': user_id },
      { $set: { 'accessToken': token } }
    )
  }
  return token
}

const refreshAccessToken = async (secret, currentToken, id) => {
  const token = await generateAccessToken(secret, false, id)
  let user = await User.findOne({ accessToken: currentToken })
  if (!user) {
    user = await User.findOne({ refreshToken: currentToken })
  }
  await User.updateOne(
    { 'user_id': user.user_id },
    { $set: { 'refreshToken': token } }
  )
  return user
}

module.exports = {
  generateAccessToken,
  refreshAccessToken
}