const express = require('express');
const app = express();
const router = require('./server/routes/router');
const connection = require('./server/database/connection');
const parser = require('body-parser');
app.set('view engine', 'ejs');
app.use(parser.urlencoded({extended: false}));

connection();

app.use(router);

app.listen(8000);