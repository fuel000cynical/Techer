const mongo = require('mongoose');

const studentSchema = new mongo.Schema({
    s_Id : {},
    Name : {},
    Email : {},
    Username : {},
    Password : {}  
})
let student = mongo.model('students', studentSchema);


const teacherSchema = new mongo.Schema({
    t_Id : {},
    Name : {},
    Email : {},
    Username : {},
    Password: {},
    Admin : {}
})
let teacher = mongo.model('teachers', teacherSchema);


const Class = new mongo.Schema({
    c_Id : {},
    Title : {},
    titleImg : {},
    createdOn : {},
    createdBy : {},
    Teachers : {},
    Students : {}
})
let techerClass = mongo.model('classes', Class);


module.exports = { student, teacher, techerClass};