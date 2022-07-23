import { Request, Response } from 'express'
import config from '../config/auth.config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import db from '../models'
const User = db.user
const Role = db.role

const signUp = async (req: Request, res: Response) => {
  if (!req.body.username || !req.body.email) {
    return res
      .status(200)
      .send({ message: 'Please enter a username and password' })
  }
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })

  let userResult
  try {
    userResult = await user.save()
  } catch (error) {
    return res.status(500).send({ message: error })
  }

  if (!req.body.roles) {
    let userRole
    try {
      userRole = await Role.findOne({ name: 'user' })
    } catch (error) {
      return res.status(500).send({ message: error })
    }
    userResult.roles = [userRole._id]
    try {
      await userResult.save()
    } catch (error) {
      res.send({ message: error })
    }
    return res
      .status(200)
      .send({ message: 'User was registered successfully!' })
  }

  const roles = await Role.find({ name: { $in: req.body.roles } })
  userResult.roles = roles.map((role: any) => role._id)
  try {
    await userResult.save()
  } catch (error) {
    return res.status(500).send({ message: error })
  }
  return res.status(200).send({ message: 'User was registered successfully!' })
}
