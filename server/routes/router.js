const express = require('express');
const router = express.Router();
const AUDcontroller = require('./../controller/AUDcontroller');
const AUview = require('../controller/AUview');
const CLASScontroller = require('./../controller/CLASScontroller');
const schema = require('../model/schema');
const sessionsJs = require('./../services/sessions');
const validator = require('./../controller/validate');
const uid = require('uniqid');


router.get('/login', async (req, res) => {
    res.render('login');
});
router.post('/login/:idType', async (req, res) => {
    let idType = String(req.params.idType);
    if ("teach" === idType) {
        schema.teacher.find({
            Username: req.body.Username,
            Password: req.body.Password
        }).then(data => {
            try {
                if (data[0].Username === req.body.Username) {
                    res.redirect(`/addSession/teach/${data[0].t_Id}/${data[0].Username}`);
                } else {
                    res.redirect('/login');
                }
            } catch {
                res.redirect(`/error?msg=${encodeURIComponent('Their was an error in application')}`);
            }
        }).catch(err => {
            console.log(err);
            res.redirect(`/error?msg=${err.msg}`);
        });
    } else if (idType === 'learn') {
        await schema.student.find({
            Username: req.body.Username,
            Password: req.body.Password
        }).then(data => {
            if (!(!data)) {
                if (data[0].Username === req.body.Username) {
                    res.redirect(`/addSession/learn/${data[0].s_Id}/${data[0].Username}`);
                } else {
                    res.redirect('/login');
                }
            }
        }).catch(err => {
            console.log(err);
            res.redirect(`/error?msg=${err.msg}`);
        });
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('id type used in url not found.')}`);
    }
});


router.get('/classes/:idType/:id', CLASScontroller.classMenuView)
router.get('/classroom/:idType/:id/:classId/people', CLASScontroller.classRoomPeopleView);
router.get('/classroom/:idType/:id/:classId/work', CLASScontroller.classRoomPeopleView);


router.get('/addSession/:userType/:userId/:userName', sessionsJs.addSession);
router.get('/retrieveSessionData', sessionsJs.checkSession);
router.post('/retrieveSessionData', sessionsJs.checkSessionPost);
router.get('/removeSession', (req, res) => {
});


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