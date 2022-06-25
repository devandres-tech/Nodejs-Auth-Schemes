import dotenv from 'dotenv'
import { Secret } from 'jsonwebtoken'
dotenv.config()

export default {
  secret: process.env.SECRET as Secret,
}
