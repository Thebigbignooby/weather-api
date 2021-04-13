import { connect } from 'mongoose'

// TODO: move this DB_ENV to .env or package.json scripts or something
const DB_ENV = process.env.NODE_ENV
const DB_CONNECTION_STRING = `mongodb://mongo:27017/${DB_ENV}` 

export function connectDB () :void {
  connect(
      DB_CONNECTION_STRING,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      }
    )
    .then(() => {
      console.info(`Successfully connected to ${DB_CONNECTION_STRING}`);
    })
    .catch(error => {
      console.error('Error connecting to database: ', error);
      process.exit(1);
    });
}
