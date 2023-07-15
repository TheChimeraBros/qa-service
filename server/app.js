require('dotenv').config();
const express = require('express');
const routes = require('./routes');


const app = express();

app.use(express.json());

app.use('/qa', routes);

// Handles unknown endpoints
app.all('*', (req, res) => {
  console.log(status, req.url);
  res.status(404).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Listening on port ${PORT}`);