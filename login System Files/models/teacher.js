const mongo = require('mongoose');

const teacherSchema = new mongo.Schema({
    t_Id: {
        type: String,
        required: true
    },
    Username : {
        type: String,
        required: true
    },
    Name : {
        type: String,
        required: true
    },
    Classes: {
        type: [String],
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 16
    },
    Admin : {
        type: Boolean,
        requires: true
    }
});
var teachers = mongo.model('', teacherSchema);
module.exports = teachers;