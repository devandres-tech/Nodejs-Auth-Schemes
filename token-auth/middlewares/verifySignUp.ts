import { Request, Response, NextFunction } from 'express'
import db from '../models'
const ROLES = db.ROLES
const User = db.user

const checkDuplicateUsernameOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user
  try {
    user = await User.findOne({ username: req.body.username }).exec()
  } catch (error) {
    return res.status(500).send({ message: error })
  }
  if (user)
    return res.status(400).send({ message: 'Username is already in use' })

  try {
    user = await User.findOne({ email: req.body.email }).exec()
  } catch (error) {
    return res.status(500).send({ message: error })
  }
  if (user) return res.status(400).send({ message: 'Email is already in user' })
  next()
}

const checkRolesExisted = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.roles) {
    req.body.roles.forEach((role: any) => {
      if (!ROLES.includes(role)) {
        return res.status(400).send({ message: `Role ${role} des not exist` })
      }
    })
  }
  next()
}

export default { checkDuplicateUsernameOrEmail, checkRolesExisted }
