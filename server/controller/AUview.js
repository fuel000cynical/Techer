const schema = require('./../model/schema');
const validator = require('./validate');

exports.viewAdd = async (req, res) => {
    let idType = req.params.idType;
    let id = req.params.id;
    let what = req.params.what;
    let valId = false;
    let adminStats;
    if (idType === 'learn') {
        res.redirect(`/error?msg=${encodeURIComponent('Students can not make accounts')}`);
    } else if (idType === 'teach') {
        await schema.teacher.find({t_Id: id}).then(data => {
            valId = data[0].t_Id === id;
            adminStats = data[0].Admin;
        }).catch(err => {
            console.log(err);
            res.redirect(`/error?msg=${encodeURIComponent('Can not find teacher with the specified id')}`);
        });
        if (valId) {
            if (what === 'class') {
                res.render('addForm', {type: 'techerClass', idType: idType, id: id});
            } else if (what === 'stu') {
                res.render('addForm', {type: 'stu', idType: idType, id: id});
            } else if (what === 'instru') {
                if (adminStats) {
                    res.render('addForm', {type: 'instru', idType: idType, id: id});
                } else {
                    res.redirect(`/error?msg=${encodeURIComponent('Only admins can make teacher accounts')}`);
                }
            } else {
                res.redirect(`/error?msg=${encodeURIComponent('The thing you are trying to add does not exist')}`);
            }
        }
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('The specified type of ID does not exist')}`);
    }
};

exports.viewUpdate = async (req, res) => {
    let data;
    let idType = req.params.idType;
    let id = req.params.id;
    let what = req.params.what;
    let whatId = req.params.whatId;
    if (idType === 'student') {
        res.redirect(`/error?msg=${encodeURIComponent('Students can not change accounts')}`);
    } else if (idType === 'teacher') {
        if (validator.valId(idType, id)) {
            if (what === 'class') {
                data = validator.validateAndFind('class', whatId);
                if (data === 'error') {
                    res.redirect(`/error?msg=${encodeURIComponent('Their was an error finding a class with the specified id')}`);
                } else {
                    res.render('updateForm', {type: 'techerClass', dataShow: data});
                }
            } else if (what === 'student') {
                data = validator.validateAndFind('student', whatId);
                if (data === 'error') {
                    res.redirect(`/error?msg=${encodeURIComponent('Their was an error finding a student account with the specified id')}`);
                } else {
                    res.render('updateForm', {type: 'student', dataShow: data});
                }
            } else if (what === 'teacher') {
                if (validator.valTeacherAdmin(id)) {
                    data = validator.validateAndFind('student', whatId);
                    if (data === 'error') {
                        res.redirect(`/error?msg=${encodeURIComponent('Their was an error finding a teacher account with the specified id')}`);
                    } else {
                        res.render('updateForm', {type: 'teacher', dataShow: data});
                    }
                } else {
                    res.redirect(`/error?msg=${encodeURIComponent('Only admin can change teacher accounts')}`);
                }
            } else {
                res.redirect(`/error?msg=${encodeURIComponent('The specified account type does not exist')}`);
            }
        }
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('The specified account type does not exist')}`);
    }
};
