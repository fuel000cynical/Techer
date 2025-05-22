const mongo = require('mongoose');
const uid = require('uniqid');

const studentSchema = new mongo.Schema({
    s_Id: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }
})

studentSchema.pre('save', async function preSave() {
    this.s_Id = uid()
});
let student = mongo.model('students', studentSchema);


const teacherSchema = new mongo.Schema({
    t_Id: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Admin: {
        type: Boolean,
        required: true,
        default: false
    }
})
teacherSchema.pre('save', async function preSave() {
    this.t_Id = uid()
});
let teacher = mongo.model('teachers', teacherSchema);


const Class = new mongo.Schema({
    c_Id: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    titleImg: {
        type: Number,
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    Teachers: {
        type: Array,
        required: true
    },
    Students: {
        type: Array,
        required: true
    }
})
Class.pre('save', async function preSave() {
    this.c_Id = uid()
});
let techerClass = mongo.model('classes', Class);

const sessionSchema = new mongo.Schema({
    userType: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
})

let sessionModel = mongo.model('sessionstores', sessionSchema);

const assignmentSchema = new mongo.Schema({
    title : {
        required : true,
        type : String
    },note : {
        type : String
    },meetCode : {
        type : String
    },class : {
        type : String,
        required : true
    }
    ,fileData : [String]
});

let assignmentModel = mongo.model('assignmentNotes', assignmentSchema);

module.exports = {sessionModel, student, teacher, techerClass, assignmentModel};