import { Express } from 'express'

import { verifySignUp } from '../middlewares'
import { signIn, signUp } from '../controllers/auth.controller'

const authRoute = (app: Express) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Content-Type, Accept'
    )
    next()
  })
  app.post(
    '/api/auth/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    signUp
  )
  app.post('api/auth/signin', signIn)
}

export default authRoute
