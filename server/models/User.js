const {Schema, model} = require('mongoose')

const User = new Schema({
  username: {type: String, unique: true, required: true},
  user_id: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  roles: [{type: String, ref: 'Role'}],
  accessToken: {type: String, unique: true, required: false},
  refreshToken: {type: String, unique: true, required: false}
})

module.exports = model('User', User)