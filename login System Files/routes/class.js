const studentSchema = require('./../models/student');
const classSchema = require('./../models/classes');
const express = require('express');
const app = express.Router();

app.get('/classes/teacher/:id', (req, res) => {
    res.render('menu');
})

app.get('/classes/student/:id', (req, res) => {
    studentSchema.findeOne({ s_Id : req.params.id}, 's_Id Class' , function(err, student){
        if (err) return handleError(err);
        if(student !== null){
            classSchema.findeOne({className : student.Class}, 'className c_Id createdBy createdOn', function(err, studentClass){
                if(err) return handleError(err);
                if(studentClass !== null){
                    res.render('menu');
                }else{
                    res.redirect('/login');
                }
            })
        }else{
            res.redirec('/login');
        }
    })
})

app.get('/classroom/student/:id/:classId', (req, res) => {})

module.exports = app;