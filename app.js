const express = require('express');
const app = express();
const router = require('./controller/router');
const connection = require('./controller/connection');
// const variables = require('./variables');
app.set('view engine', 'ejs');

connection();

app.use(express.static('views'));
app.use(router);

app.listen(8000);