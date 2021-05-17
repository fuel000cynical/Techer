const studentSchema = require('./../models/student');
const express = require('express');
const app = express.Router();

app.get('/updateStudent/teacher/:valId/:id', async(req, res) => {
    await studentSchema.findOne({s_Id : req.params.id },'Username Name Class Email Password', function (err, found) {
        if (err) return handleError(err);
        if(found !== null){
            res.render('updateStudent', { student : {
                s_Id : req.query.id,
                Name : found.Name,
                Class: found.Class,
                Email: found.Email,
                Password: found.Password,
                Username: found.Username
            }});
        }else{
            res.redirect('/login');
        }
    })
})

app.post('/updateStudent/teacher/:valId/:id', async(req, res) => {
    await studentSchema.findOneAndUpdate({ s_Id:req.body.id }, {
        Username: req.body.username,
        Name: req.body.name,
        Class: req.body.class,
        Email: req.body.email,
        Password: req.body.password 
    }, null, function(err){if(err) return handleError(err);})
})