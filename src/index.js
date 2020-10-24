import express from 'express';
import {customers} from './mock_db/mock_customer.js';

const app = express();
const port = 3000 //TODO@LUXIANZE: #5 Move this to config file 

app.get('/', (req, res) => {
    const responseData = JSON.stringify(customers);
    res.send(responseData);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
