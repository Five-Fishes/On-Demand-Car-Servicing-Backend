import express from 'express';
import {customers} from './mock_db/mock_customer.js';
import pkg from 'dotenv';

const { config } = pkg;
config()

const app = express();

app.get('/', (req, res) => {
    const responseData = JSON.stringify(customers);
    res.send(responseData);
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
