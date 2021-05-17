const express = require('express');
const router = express.Router();
const schema = require('./../model/schema');
const validater = require('./validate');



router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login/:idType', (req, res) => {
    if(req.params.idType === 'teacher'){
        schema.teacher.findOne({Username : req.body.username, Password : req.body.password }, 't_Id', function(err, teacher){
            if(err) return handleError(err);
            if(teacher !== null){
                res.redirect(`/classes/${req.params.idType}/${teacher.t_Id}`);
            }else{
                res.redirect('/login');
            }
        });
    }else if(req.params.idType === 'student'){
        schema.student.findOne({Username : req.body.username, Password : req.body.password }, 's_Id', function(err, student){
            if(err) return handleError(err);
            if(student !== null){
                res.redirect(`/classes/${req.params.idType}/${student.s_Id}`);
            }else{
                res.redirect('/login');
            }
        });
    }else{
        res.redirect('/error');
    }
})


router.get('/classes/:idType/:id', (req, res) => {
    if(req.params.idType == 'student'){
        if(validater.valId(req.params.idType, req.params.id)){
            res.render('classMenu');
        }
        else{
            res.redirect('/error');
        }
    }else if(req.params.id == 'teacher'){
        if(validater.valId(req.params.idType, req.params.id)){
            res.render('classMenu');
        }
        else{
            res.redirect('/error');
        }
    }else{
        res.redirect('/error')
    }
})

router.get('/classroom/:idType/:id/:classId/:where', (req, res) => {})



router.get('/add/:what/:idType/:id', (req, res) => {})

router.post('/add/:what/:idType/:id', (req, res) => {})



router.get('/update/:what/:idType/:id/:whatId', (req, res) => {})

router.post('/update/:what/:idType/:id/:whatId', (req, res) => {})



router.get('/delete/:what/:idType/:id/:whatId', (req, res) => {})

router.post('/delete/:what/:idType/:id/:whatId', (req, res) => {})



router.get('/error', (req, res) => {})



module.exports = router;