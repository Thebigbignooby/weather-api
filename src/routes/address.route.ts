import { Router } from 'express'

const router = Router()

router.get('/', function (req, res) {
  res.send('Addresssssssss')
})

// Todo: the following todos are present in both routes,
// so could be extracted into external functions

// Todo: check args are present and correct format
// Todo: check if address is present in cache
// Todo: if not in cache, send request to Google Maps Geocoding API

router.post('/check', function (req, res) {
  // Todo: check args are present and correct format
  // Todo: check if address is present in cache
  // Todo: if not in cache, send request to Google Maps Geocoding API
  // Todo: res.status(todo).json( true | false)
  // Todo: catch res.send(error)
  console.log('req.body', req.body)
  res.send('checking this address')
})

router.post('/weather', function (req, res) {
  // Todo: check args are present and correct format
  // Todo: check if address is present in cache
  // Todo: if not in cache, send request to Google Maps Geocoding API
  // Todo: get lat & lng
  // Todo: send request to OpenWeather API
  // Todo: res.status(todo).json( the weather )
  // Todo: catch res.send(error)
  console.log('req.body', req.body)
  res.send('getting weather')
})

export default router
