import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/auth.config'
import db from '../models'
const Role = db.role
const User = db.user

type CustomRequest = Request & { userId?: string }

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  let token = req.headers['x-access-token'] as string
  if (!token) {
    return res.status(403).send({ message: 'No token provided' })
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Unauthorized!' })
    req.userId = decoded?.id
    next()
  })
}

const isAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let user: any
  try {
    user = User.findById(req.userId).exec()
  } catch (error) {
    return res.status(500).send({ message: error })
  }

  let roles
  try {
    roles = await Role.find({ _id: { $in: user?.roles } })
  } catch (error) {
    return res.status(500).send({ message: error })
  }
  roles.forEach((role: any) => {
    if (role.name === 'admin') return next()
  })
  return res.status(403).send({ message: 'Admin role required' })
}

const isModerator = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let user
  try {
    user = await User.findById(req.userId).exec()
  } catch (error) {
    return res.status(500).send({ message: error })
  }

  let roles
  try {
    roles = await Role.find({ _id: { $in: user?.roles } })
  } catch (error) {
    return res.status(500).send({ message: error })
  }
  roles.forEach((role: any) => {
    if (role.name === 'moderator') return next()
  })
  return res.status(403).send({ message: 'Moderator role required' })
}

export default { verifyToken, isAdmin, isModerator }
