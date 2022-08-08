import express from 'express'
const router = express.Router()

import { verifySignUp } from '../middlewares'
import { signIn, signUp } from '../controllers/auth.controller'

router
  .route('/signup')
  .post(
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    signUp
  )

router.route('/signin').post(signIn)

export default router
