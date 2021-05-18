const express = require('express');
const router = express.Router();
const schema = require('./../model/schema');
const validator = require('./validate');
const uid = require('uniqid');



router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login/:idType', (req, res) => {
    let idType = req.params.idType;
    if (idType === 'teacher') {
        schema.teacher.findOne({
            Username: req.body.username,
            Password: req.body.password
        }, 't_Id', function (err, teacher) {
            if (err) return handleError(err);
            if (teacher !== null) {
                res.redirect(`/classes/${idType}/${teacher.t_Id}`);
            } else {
                res.redirect('/login');
            }
        });
    } else if (idType === 'student') {
        schema.student.findOne({
            Username: req.body.username,
            Password: req.body.password
        }, 's_Id', function (err, student) {
            if (err) return handleError(err);
            if (student !== null) {
                res.redirect(`/classes/${idType}/${student.s_Id}`);
            } else {
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/error');
    }
})


router.get('/classes/:idType/:id', (req, res) => {
    let idType = req.params.idType;
    let id = req.params.id;
    if (idType === 'student') {
        if (validator.valId(idType, id)) {
            res.render('classMenu');
        } else {
            res.redirect('/error');
        }
    } else if (id === 'teacher') {
        if (validator.valId(idType, id)) {
            res.render('classMenu');
        } else {
            res.redirect('/error');
        }
    } else {
        res.redirect('/error')
    }
})

router.get('/classroom/:idType/:id/:classId/:where', (req, res) => {})


router.get('/add/:what/:idType/:id', (req, res) => {
    let idType = req.params.idType;
    let id = req.params.id;
    let what = req.params.what;

    if (idType === 'student') {
        res.redirect('/error');
    } else if (idType === 'teacher') {
        if (validator.valId(idType, id)) {
            if (what === 'class') {
                res.render('addForm', {type: 'techerClass'});
            } else if (what === 'student') {
                res.render('addForm', {type: 'student'});
            } else if (what === 'teacher') {
                if (validator.valTeacherAdmin(id)) {
                    res.render('addForm', {type: 'teacher'});
                } else {
                    res.redirect('/error');
                }
            } else {
                res.redirect('/error');
            }
        }
    } else {
        res.redirect('/error');
    }
})

router.post('/add/:what/:idType/:id', (req, res) => {
    let data;
    let id = req.params.id;
    let what = req.params.what;
    let idType = req.params.idType;
    if (idType === 'student') {
        res.redirect('/error');
    } else if (idType === 'teacher') {
        if (validator.valId(idType, id)) {
            if (what === 'class') {
                data = new schema.techerClass({
                    c_Id: uid(),
                    Title: req.body.title,
                    titleImg: Math.floor(Math.random() * 9) + 1,
                    createdOn: Date.now(),
                    createdBy: id,
                    Teachers: [],
                    Students: []
                });
                data.save().then(res.redirect(`/classes/${idType}/${id}`)).catch(err => {
                    if (err) return handleError(err);
                    res.redirect('/error')
                });
            } else if (what === 'student') {
                data = new schema.student({
                    s_Id: uid(),
                    Name: req.body.name,
                    Email: req.body.email,
                    Username: req.body.username,
                    Password: req.body.password
                });
                data.save().then(res.redirect(`/classes/${idType}/${id}`)).catch(err => {
                    if (err) return handleError(err);
                    res.redirect('/error')
                });
            } else if (what === 'teacher') {
                if (validator.valTeacherAdmin(id)) {
                    data = new schema.teacher({
                        t_Id: uid(),
                        Name: req.body.name,
                        Email: req.body.email,
                        Username: req.body.username,
                        Password: req.body.password,
                        Admin: req.body.admin
                    });
                    data.save().then(res.redirect(`/classes/${idType}/${id}`)).catch(err => {
                        if (err) return handleError(err);
                        res.redirect('/error')
                    });
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
    let data;
    let idType = req.params.idType;
    let id = req.params.id;
    let what = req.params.what;
    let whatId = req.params.whatId;
    if (idType === 'student') {
        res.redirect('/error');
    } else if (idType === 'teacher') {
        if (validator.valId(idType, id)) {
            if (what === 'class') {
                data = validator.validateAndFind('class', whatId);
                if (data === 'error') {
                    res.redirect('/error');
                } else {
                    res.render('updateForm', {type: 'techerClass', dataShow: data});
                }
            } else if (what === 'student') {
                data = validator.validateAndFind('student', whatId);
                if (data === 'error') {
                    res.redirect('/error');
                } else {
                    res.render('updateForm', {type: 'student', dataShow: data});
                }
            } else if (what === 'teacher') {
                if (validator.valTeacherAdmin(id)) {
                    data = validator.validateAndFind('student', whatId);
                    if (data === 'error') {
                        res.redirect('/error');
                    } else {
                        res.render('updateForm', {type: 'teacher', dataShow: data});
                    }
                } else {
                    res.redirect('/error');
                }
            } else {
                res.redirect('/error');
            }
        }
    }else{
        res.redirect('/error');
    }
})

router.post('/update/:what/:idType/:id/:whatId', (req, res) => {
    if (idType === 'student') {
        res.redirect('/error');
    } else if (idType === 'teacher') {
        if (validator.valId(idType, id)) {
            if (what === 'class') {
                schema.techerClass.findOneAndUpdate({c_Id: whatId}, {
                    Title: req.body.title
                }, null, function (err) {
                    if (err) return handleError(err);
                })
            } else if (what === 'student') {
                schema.student.findOneAndUpdate({s_Id: whatId}, {
                    Name: req.body.name,
                    Email: req.body.email,
                    Username: req.body.username,
                    Password: req.body.password
                }, null, function (err) {
                    if (err) return handleError(err);
                });
            } else if (what === 'teacher') {
                if (validator.valTeacherAdmin(id)) {
                    schema.teacher.findOneAndUpdate({t_Id: whatId}, {
                        Name: req.body.name,
                        Email: req.body.email,
                        Username: req.body.username,
                        Password: req.body.password,
                        Admin: req.body.admin
                    }, null, function (err) {
                        if (err) return handleError(err);
                    })
                } else {
                    res.redirect('/error');
                }
            } else {
                res.redirect('/error');
            }
        }
    }else{
        res.redirect('/error');
    }
})


router.post('/delete/:what/:idType/:id/:whatId', (req, res) => {
    let id = req.params.id;
    let idType = req.params.idType;
    let whatId = req.params.whatId;
    let what = req.params.what;
    if (idType === 'student') {
        res.redirect('/error');
    } else if (idType === 'teacher') {
        if (validator.valId(idType, id)) {
            if (what === 'class') {
                schema.techerClass.findOneAndDelete({c_Id: whatId}, function (err, data) {
                    if (err) return handleError(err);
                    if (!data) {
                        res.redirect('/error');
                    } else {
                        res.redirect(`/classes/${idType}/${id}`)
                    }
                })
            } else if (what === 'student') {
                schema.techerClass.findOneAndDelete({s_Id: whatId}, function (err, data) {
                    if (err) return handleError(err);
                    if (!data) {
                        res.redirect('/error');
                    } else {
                        res.redirect(`/classes/${idType}/${id}`)
                    }
                })
            } else if (what === 'teacher') {
                if (validator.valTeacherAdmin(id)) {
                    schema.techerClass.findOneAndDelete({t_Id: whatId}, function (err, data) {
                        if (err) return handleError(err);
                        if (!data) {
                            res.redirect('/error');
                        } else {
                            res.redirect(`/classes/${idType}/${id}`)
                        }
                    })
                } else {
                    res.redirect('/error');
                }
            } else {
                res.redirect('/error');
            }
        }
    } else {
        res.redirect('/error');
    }
})


router.get('/error', (req, res) => {})



module.exports = router;