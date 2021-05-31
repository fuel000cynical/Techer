const express = require('express');
const router = express.Router();
const AUDcontroller = require('../controller/AUDcontroller');
const AUview = require('../controller/AUview');
const CLASScontroller = require('../controller/CLASScontroller');
const validator = require('./../services/validationMiddleware');
const schema = require('../model/schema');
const uid = require('uniqid');


router.get('/login', async (req, res) => {
    res.render('login');
});
router.post('/login/:idType', async (req, res) => {
    let idType = String(req.params.idType);
    if ("teach" === idType) {
        await schema.teacher.find({
            Username: req.body.Username,
            Password: req.body.Password
        }).then(data => {
            if (!(!data) && data[0] !== undefined && data !== []) {
                if (data[0].Username === req.body.Username) {
                    res.redirect(`/classes/teach/${data[0].t_Id}`)
                } else {
                    res.redirect('/login');
                }
            } else {
                res.redirect('/login');
            }
        }).catch(err => {
            console.log(err);
            res.redirect(`/error?msg=${encodeURIComponent('There was an error logging you in, please don not retry')}`);
        });
    } else if (idType === 'learn') {
        await schema.student.find({
            Username: req.body.Username,
            Password: req.body.Password
        }).then(data => {
            if (!(!data) && data[0] !== undefined && data !== []) {
                if (data[0].Username === req.body.Username) {
                    res.redirect(`/classes/learn/${data[0].s_Id}`)
                } else {
                    res.redirect('/login');
                }
            } else {
                res.redirect('/login');
            }
        }).catch(err => {
            console.log(err);
            res.redirect(`/error?msg=${encodeURIComponent('There was an error logging in, please don not try again')}`);
        });
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('id type used in url not found.')}`);
    }
});


router.get('/classes/:idType/:id', validator.valId, CLASScontroller.classMenuView);
router.get('/classroom/:idType/:id/:classId/people', validator.valId, CLASScontroller.classRoomPeopleView);
router.get('/classroom/:idType/:id/:classId/work', validator.valId, CLASScontroller.classRoomPeopleView);
router.get('/classroom/:idType/:id/:classId/addPeople', validator.valId, CLASScontroller.classRoomPeopleAddView);
router.post('/classroom/:idType/:id/:classId/addPeople', validator.valId, CLASScontroller.classRoomPeopleAddPost);


router.get('/add/:what/:idType/:id', validator.valId, AUview.viewAdd);
router.post('/add/:what/:idType/:id', validator.valId, AUDcontroller.controllerAdd);


router.get('/update/:what/:idType/:id/:whatId', validator.valId, validator.validateAndFind, AUview.viewUpdate);
router.post('/update/:what/:idType/:id/:whatId', validator.valId, validator.validateAndFind, AUDcontroller.controllerUpdate);


router.post('/delete/:what/:idType/:id/:whatId', validator.valId, validator.validateAndFind, AUDcontroller.controllerDelete);


router.get('/error', (req, res) => {
    let message = req.query.msg;
    res.render('error', {errorMsg: message});
});


module.exports = router;
