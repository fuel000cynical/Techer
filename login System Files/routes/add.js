const studentSchema = require('./../models/student');
const jsonify = require('./../database/json');
const express = require('express');
const app = express.Router();

app.get('/classes/teacher/addClass/:id', (req, res) => {
    res.render('addClass');
})

app.get('/addStudent/teacher/:valId', (req, res) => {
    res.render('addStudent', { student : {
        s_Id : "", 
        Name: "",
        Email: "",
        Class: "",
        Password : ""
    }});
})

app.post('/addStudent/teacher/:valId', async(req, res) =>{
    var data = await new studentSchema(jsonify(req.body.username, req.body.name, req.body.class, req.body.email, req.body.password))
    data.save().then(item => {
        res.send("item saved to database");
    }).catch(err => {
        console.log(err);
        res.status(400).send("unable to save to database");
    });
})