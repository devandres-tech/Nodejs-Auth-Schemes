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

const isAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) return res.status(500).send({ message: err })
    Role.find(
      { _id: { $in: user?.roles } },
      (err: any, roles: [{ name: string }]) => {
        if (err) return res.status(500).send({ message: err })
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next()
            return
          }
        }
        res.status(403).send({ message: 'Required Admin Role!' })
      }
    )
  })
}

const isModerator = (req: CustomRequest, res: Response, next: NextFunction) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) return res.status(500).send({ message: err })
    Role.find(
      { _id: { $in: user?.roles } },
      (err: any, roles: [{ name: string }]) => {
        if (err) return res.status(500).send({ message: err })
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'moderator') next()
          return
        }
        return res.status(403).send({ message: 'Require Moderator Role!' })
      }
    )
  })
}

export default { verifyToken, isAdmin, isModerator }
