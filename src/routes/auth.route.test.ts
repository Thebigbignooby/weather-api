import { MongoClient, Collection,  } from 'mongodb'
import request, { Response } from 'supertest'

// Todo: extact these into env variables
const CONNECTION_STRING = 'mongodb://localhost:27017'
const api = request('http://localhost:3000')

let client: MongoClient
let users: Collection

beforeAll(async () => {
  client = await MongoClient.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  users = await client.db('test').collection('users')
})

afterAll(async () => {
  await client.close()
})


describe('/auth', () => {
  describe('/auth/signup POST', () => {
    describe('supplied arguments are correct', () => {
      const body = {
        email: 'john.doe@example.com',
        password: '123456'
      }
      let res: Response
      let user: any

      beforeAll(async () => {
        res = await api
          .post('/auth/signup')
          .set('Accept', 'application/json')
          .send(body)

        user = await users.find().toArray().then(arr => arr[0])
      })
      afterAll(async () => {
        await users.deleteMany({})
      })

      describe('email is available', () => {
        it('creates a user in the database', () => {
          expect(user).not.toBe(null)
          expect(user.email).toEqual(body.email)
        })
        it('stores a hashed version of a users password', () => {
          expect(user.password).not.toEqual(body.password)
        })
        it('returns statusCode: 201', () => {
          expect(res.status).toBe(201)
        })
      })

      describe('user with that email already exists', () => {
        beforeAll(async () => {
          res = await api
            .post('/auth/signup')
            .set('Accept', 'application/json')
            .send(body)
  
          user = await users.find().toArray().then(arr => arr[0])
        })

        it('returns statusCode: 418 because its past midnight and Im reaching diminishing returns of productivity', () => {
          expect(res.status).toBe(418)
        })
      })
    })

    describe('supplied arguments are incorrect', () => {
      it('returns a status: 4xx', () => {
  
      })
    })
  })

  describe('/auth/signi POST', () => {
    describe('user exists', () => {
      describe('supplied password is correct', () => {
        it('returns a JWT', () => {
          
        })
      })
      describe('supplied password is incorrect', () => {
        it('returns an error', () => {
          
        })
      })
    })
    describe('user does not exist', () => {
      it('returns an error', () => {
        
      })
    })
  })
})