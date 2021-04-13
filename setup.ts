import { MongoClient } from 'mongodb'

let client

export default async function setup () {
  const CONNECTION_STRING = 'mongodb://localhost:27017/test'
  client = new MongoClient(CONNECTION_STRING)
}

export { client }
