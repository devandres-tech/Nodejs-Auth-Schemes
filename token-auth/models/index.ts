import mongoose from 'mongoose'
mongoose.Promise = global.Promise

export default {
  mongoose: mongoose,
  user: require('./user.model'),
  role: require('./role.model'),
  ROLES: ['user', 'admin', 'moderator'],
}
