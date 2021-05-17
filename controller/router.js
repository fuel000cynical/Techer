const express = require('express');
const router = express.Router();
const schema = require('./../model/schema');
const validater = require('./validate');
const uid = require('uniqid');



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



router.get('/add/:what/:idType/:id', (req, res) => {
    if(req.params.idType === 'student'){
        res.redirect('/error');
    }
    else if(req.params.idType === 'teacher'){
        if(validater.valId(req.params.idType, req.params.id)){
            if(req.params.what === 'class'){
                res.render('addForm', {type : techerClass});
            }else if(req.params.what === 'student'){
                res.render('addForm', {type : student});
            }else if(req.params.what === 'teacher'){
                if(validater.valTeacherAdmin(req.params.id)){
                    res.render('addForm', {type : teacher});
                }
                else{
                    res.redirect('/error');
                }
            }else{
                res.redirect('/error');
            }
        }
    }else{
        res.redirect('/error');
    }
})

router.post('/add/:what/:idType/:id', (req, res) => {
    if(req.params.idType === 'student'){
        res.redirect('/error');
    }
    else if(req.params.idType === 'teacher'){
        if(validater.valId(req.params.idType, req.params.id)){
            if(req.params.what === 'class'){
                var data = new schema.techerClass({
                    c_Id : uid(),
                    Title : req.body.title,
                    titleImg : Math.floor(Math.random() * 9) + 1, 
                    createdOn : Date.now(),
                    createdBy : req.params.id,
                    Teachers : [],
                    Students : []
                })
                data.save().then(res.redirect(`/classes/${req.params.idType}/${req.params.id}`)).catch(err => {res.redirect('/error')});
            }else if(req.params.what === 'student'){
                var data = new schema.student({
                    s_Id : uid(),
                    Name : req.body.name,
                    Email : req.body.email,
                    Username : req.body.username,
                    Password : req.body.password  
                })
                data.save().then(res.redirect(`/classes/${req.params.idType}/${req.params.id}`)).catch(err => {res.redirect('/error')});
            }else if(req.params.what === 'teacher'){
                if(validater.valTeacherAdmin(req.params.id)){
                    var data = new schema.teacher({
                        t_Id : uid(),
                        Name : req.body.name,
                        Email : req.body.email,
                        Username : req.body.username,
                        Password: req.body.password,
                        Admin : req.body.admin
                    })
                    data.save().then(res.redirect(`/classes/${req.params.idType}/${req.params.id}`)).catch(err => {res.redirect('/error')});
                }
                else{
                    res.redirect('/error');
                }
            }else{
                res.redirect('/error');
            }
        }
    }else{
        res.redirect('/error');
    }
})



router.get('/update/:what/:idType/:id/:whatId', (req, res) => {
    if(req.params.idType === 'student'){
        res.redirect('/error');
    }
    else if(req.params.idType === 'teacher'){
        if(validater.valId(req.params.idType, req.params.id)){
            if(req.params.what === 'class'){
                var data = validater.validateAndFind('class', req.params.whatId);
                if(data == 'error'){
                    res.redirect('/error');
                }else{
                    res.render('updateForm', {type : 'techerClass', dataShow : data});
                }
            }else if(req.params.what === 'student'){
                var data = validater.validateAndFind('student', req.params.whatId);
                if(data == 'error'){
                    res.redirect('/error');
                }else{
                    res.render('updateForm', {type : 'student', dataShow : data});
                }
            }else if(req.params.what === 'teacher'){
                if(validater.valTeacherAdmin(req.params.id)){
                    var data = validater.validateAndFind('student', req.params.whatId);
                    if(data == 'error'){
                        res.redirect('/error');
                    }else{
                        res.render('updateForm', {type : 'teacher', dataShow : data});
                    }
                }
                else{
                    res.redirect('/error');
                }
            }else{
                res.redirect('/error');
            }
        }
    }else{
        res.redirect('/error');
    }
})

router.post('/update/:what/:idType/:id/:whatId', (req, res) => {
    if(req.params.idType === 'student'){
        res.redirect('/error');
    }
    else if(req.params.idType === 'teacher'){
        if(validater.valId(req.params.idType, req.params.id)){
            if(req.params.what === 'class'){
                schema.techerClass.findOneAndUpdate({c_Id : req.params.whatId},{
                    Title : req.body.title
                },null, function(err){if(err) return handleError(err);})
            }else if(req.params.what === 'student'){
                schema.student.findOneAndUpdate({s_Id : req.params.whatId},{
                    Name : req.body.name,
                    Email : req.body.email,
                    Username : req.body.username,
                    Password : req.body.password  
                },null, function(err){if(err) return handleError(err);});
``            }else if(req.params.what === 'teacher'){
                if(validater.valTeacherAdmin(req.params.id)){
                    schema.teacher.findOneAndUpdate({t_Id : req.params.whatId},{
                        Name : req.body.name,
                        Email : req.body.email,
                        Username : req.body.username,
                        Password: req.body.password,
                        Admin : req.body.admin
                    },null, function(err){if(err) return handleError(err);})
                }
                else{
                    res.redirect('/error');
                }
            }else{
                res.redirect('/error');
            }
        }
    }else{
        res.redirect('/error');
    }
})



router.get('/delete/:what/:idType/:id/:whatId', (req, res) => {})

router.post('/delete/:what/:idType/:id/:whatId', (req, res) => {})



router.get('/error', (req, res) => {})



module.exports = router;