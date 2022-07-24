import { Request, Response } from 'express'
type CustomRequest = Request & { userId?: string }

const allAccess = (req: CustomRequest, res: Response) => {
  return res.status(200).send('Public content')
}

const userBoard = (req: CustomRequest, res: Response) => {
  return res.status(200).send('User content')
}
const adminBoard = (req: CustomRequest, res: Response) => {
  return res.status(200).send('Admin content')
}
const moderatorBoard = (req: CustomRequest, res: Response) => {
  return res.status(200).send('Moderator content')
}

export default {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
}
