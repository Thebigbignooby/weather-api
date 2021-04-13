import express from 'express';
import dotenv from 'dotenv'
dotenv.config()

import { connectDB } from './db'
import auth from './routes/auth.route'
import address from './routes/address.route'

const app = express();

// middlewares
app.use(express.json());

// routes: public
app.use('/auth', auth);
app.use('/address', address);

app.get('/', (req, res) => {
  res.send('Welcome to this awesome weather checking API.')
})

app.listen(3000, () => {
  console.log('app running on port 3000');
});

connectDB()

export { app }
