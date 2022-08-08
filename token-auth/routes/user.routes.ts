import express from 'express'
const router = express.Router()

import { authJwt } from '../middlewares'
import {
  adminBoard,
  allAccess,
  moderatorBoard,
  userBoard,
} from '../controllers/user.controller'

router.route('/all').get(allAccess)
router.route('/user').get([authJwt.verifyToken], userBoard)
router
  .route('/mod')
  .get([authJwt.verifyToken, authJwt.isModerator], moderatorBoard)
router.route('/admin').get([authJwt.verifyToken, authJwt.isAdmin], adminBoard)

export default router
