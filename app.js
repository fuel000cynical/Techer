const express = require('express');
const app = express();
const mongo = require('mongoose');
// const variables = require('./variables');
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

app.use(express.static('views'));

app.listen(8000);