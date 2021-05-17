const mongo = require('mongoose');

const studentSchema = new mongo.Schema({
    s_Id: {
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
    Class: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 3
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
    }
});
var students = mongo.model('students', studentSchema);
module.exports = students;