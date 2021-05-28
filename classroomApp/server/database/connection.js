const mongo = require('mongoose');

function connection() {
    mongo.connect('mongodb://localhost:27017/techer', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => console.log('connected to Mongo DB'));
}

module.exports = connection;