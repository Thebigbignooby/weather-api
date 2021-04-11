import { Router } from 'express'
import bcrypt from 'bcrypt'

import { hashPassword } from '../lib/auth/auth'
import UserModel, { User } from '../models/user.model' 

const router = Router()

router.post('/signup', async (req, res) => {
  console.log('req.body', req.body)
  const { email, password, firstName, lastName } = req.body

  try {
    if (!email) throw new Error('email is required')
    if (!password) throw new Error('password is required')

    const emailIsTaken = await UserModel.findOne({ email })
    if (emailIsTaken) throw new Error('email is already taken')

    const hashedPassword = await hashPassword(password)

    const user = await UserModel.create({
      password: hashedPassword,
      email,
      firstName,
      lastName
    })

    res.json(user)
  } catch (e) {
    console.error(e)
    res
      .status(418) // I'm a teapot, because I'm out of coffee
      .json(e.message)
  }
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email) throw new Error('email is required')
    if (!password) throw new Error('password is required')

    const user = await UserModel.findOne({ email })
    if (!user) throw new Error('user doesn\'t exist, please signup')

    if (await bcrypt.compare(password, user.password)) {
      
      res.json(user)
    } else {
      throw new Error('wrong password bro')
    }

  } catch(e) {
    console.error(e)
    res.status(418).json(e.message)
  }
})

router.post('/refresh-token', (req, res) => {
  console.log('req.body', req.body)
  res.send('refreshing token')
})

export default router
