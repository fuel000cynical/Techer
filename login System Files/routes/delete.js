const studentSchema = require('./../models/student');
const express = require('express');
const app = express.Router();

app.get('/deleteStudent/teacher/:valId/:id', async(req, res) => {
    await studentSchema.findOneAndDelete({ s_Id : req.params.id}, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            res.send(data)
        }
    })
})