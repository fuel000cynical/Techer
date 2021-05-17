const studentSchema = require('./../models/student');
const teacherSchema = require('./../models/teacher');
const express = require('express');
const app = express.Router();

app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/login/student',(req, res) => {
    studentSchema.findOne({Username:req.body.username, Password: req.body.password },'s_Id Username Name Class Email Password', function (err, student) {
        if (err) return handleError(err);
        if(student !== null){
            res.redirect(`/classes/student/${student.s_Id}`);
        }
        else{
            res.redirect('/login');
        }
    })
})

app.post('/login/teacher', (req, res) => {
    teacherSchema.findOne({Username:req.body.username, Password: req.body.password },'t_Id Username Name Classes Email Password Admin', function (err, teacher) {
        if (err) return handleError(err);
        if(teacher !== null){
            res.redirect(`/classes/teacher/${teacher.t_Id}`);
        }
        else{
            res.redirect('/login');
        }
    })
})

module.exports = app;