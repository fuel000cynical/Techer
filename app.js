const express = require('express');
const app = express();
const mongo = require('mongoose');
const parse = require('body-parser');
const router = require('./server/routes/router');
const addRouter = require('./server/routes/add');
const allRouter = require('./server/routes/all');
const classRouter = require('./server/routes/class');
const delRouter = require('./server/routes/delte');
const updateRouter = require('./server/routes/update');
// const variables = require('./variables');
app.use(parse.json());
app.use(parse.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

function connection(){
    mongo.connect('mongodb://localhost:27017/techer', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    console.log('Connected With Mongo DB');
};

connection();

app.use(express.static('public'));
app.use(router);
app.use(addRouter);
app.use(allRouter);
app.use(classRouter);
app.use(delRouter);
app.use(updateRouter);

app.listen(8000);