const express = require('express');
const router = express.Router();
const AUDcontroller = require('./../controller/AUDcontroller');
const AUview = require('../controller/AUview');
const CLASScontroller = require('./../controller/CLASScontroller');
const schema = require('../model/schema');
const validator = require('./../controller/validate');
const uid = require('uniqid');


router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login/:idType', async (req, res) => {
    let idType = String(req.params.idType);
    if ("teach" === idType) {
        schema.teacher.find({
            Username: req.body.Username,
            Password: req.body.Password
        }).then(data => {
            if (data[0].Username === req.body.Username) {
                res.redirect(`/classes/${idType}/${data[0].t_Id}`)
            } else {
                res.redirect('/login');
            }
        }).catch(err => {
            res.redirect(`/error?msg=${err.msg}`);
        });
    } else if (idType === 'learn') {
        await schema.student.find({
            Username: req.body.Username,
            Password: req.body.Password
        }).then(data => {
            if (data[0].Username === req.body.Username) {
                res.redirect(`/classes/${idType}/${data[0].s_Id}`)
            } else {
                res.redirect('/login');
            }
        }).catch(err => {
            if (err) return handleError(err);
            res.redirect(`/error?msg=${err.msg}`);
        });
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('id type used in url not found.')}`);
    }
});


router.get('/classes/:idType/:id', CLASScontroller.classMenuView)
router.get('/classroom/:idType/:id/:classId/people', CLASScontroller.classRoomPeopleView);
router.get('/classroom/:idType/:id/:classId/work', CLASScontroller.classRoomPeopleView);


router.get('/add/:what/:idType/:id', AUview.viewAdd);
router.post('/add/:what/:idType/:id', AUDcontroller.controllerAdd);


router.get('/update/:what/:idType/:id/:whatId', AUview.viewUpdate);
router.post('/update/:what/:idType/:id/:whatId', AUDcontroller.controllerUpdate);


router.post('/delete/:what/:idType/:id/:whatId', AUDcontroller.controllerDelete);


router.get('/error', (req, res) => {
    let message = req.query.msg;
    res.render('error', {errorMsg: message});
});


module.exports = router;