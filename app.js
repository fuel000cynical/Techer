const express = require('express');
const app = express();
const router = require('./controller/router');
const connection = require('./controller/connection');
const parser = require('body-parser');
app.set('view engine', 'ejs');
app.use(parser.urlencoded({extended: false}));

connection();

app.use(express.static('views'));
app.use(router);

app.listen(8000);