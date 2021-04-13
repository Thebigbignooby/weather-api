import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt, { VerifyCallback } from 'jsonwebtoken'

export const hashPassword = async (pw: string) : Promise<string> => {
  return await bcrypt.hash(pw, 10)
}

// create access token
interface IUser {
  email: string
}
export const createAccessToken = (user: IUser) : string => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string)
}

// verify access tocken
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers['authorization']
  const token = authHeaders?.split(' ')[1]
  if (!token) res.sendStatus(401)

  jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET as string, {}, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// refresh access token
// Todo...
