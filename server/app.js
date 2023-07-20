const instrument = require('@aspecto/opentelemetry');
instrument({aspectoAuth: '55e99609-4dd1-41ae-9df3-09a6ad14b0cf'});
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');


const app = express();

app.use(express.json());

app.use(morgan(':method :url :status - :response-time ms'));

app.use('/qa', routes);

app.get(`/${process.env.LOADER_TOKEN}`, (req, res) => {
  res.send(process.env.LOADER_TOKEN);
});

// Handles unknown endpoints
app.all('*', (req, res) => {
  var status = 404;
  console.log(status, req.url);
  res.status(status).send();
});

const PORT = process.env.PORT || 3001;
module.exports = app.listen(PORT);
console.log(`Listening on port ${PORT}`);