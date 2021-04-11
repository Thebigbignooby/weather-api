import { Router } from 'express'

const router = Router()

router.get('/', function (req, res) {
  res.send('Addresssssssss')
})

router.post('/check', function (req, res) {
  console.log('req.body', req.body)
  res.send('checking this address')
})

export default router
