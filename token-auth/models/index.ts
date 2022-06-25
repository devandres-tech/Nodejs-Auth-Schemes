import mongoose from 'mongoose'
import User from './user.model'
mongoose.Promise = global.Promise

export default {
  mongoose: mongoose,
  user: User,
  role: require('./role.model'),
  ROLES: ['user', 'admin', 'moderator'],
}
