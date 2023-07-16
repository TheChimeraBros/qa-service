const instrument = require('@aspecto/opentelemetry');
instrument({aspectoAuth: '55e99609-4dd1-41ae-9df3-09a6ad14b0cf'});
require('dotenv').config();
const express = require('express');
const routes = require('./routes');


const app = express();

app.use(express.json());

app.use('/qa', routes);

// Handles unknown endpoints
app.all('*', (req, res) => {
  var status = 404;
  console.log(status, req.url);
  res.status(status).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Listening on port ${PORT}`);