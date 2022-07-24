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

const signIn = async (req: Request, res: Response) => {
  let user: any
  user = await User.findOne({ username: req.body.username }).exec()
  try {
  } catch (error) {
    return res.status(500).send({ message: error })
  }
  if (!user) return res.status(404).send({ message: 'User not found' })
  const passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password as string
  )
  if (!passwordIsValid) {
    return res
      .status(401)
      .send({ accessToken: null, message: 'Invalid password' })
  }
  const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })
  let authorities: any = []
  user.roles?.forEach((role: any) => {
    authorities.push(`Role_${role.name.toUpperCase}`)
  })
  return res.status(200).send({
    id: user._id,
    username: user.username,
    email: user.email,
    roles: authorities,
    accessToken: token,
  })
}

export default { signUp, signIn }
