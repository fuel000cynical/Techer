const schema = require('./../model/schema');
const validator = require('./validate');
const uid = require('uniqid');

exports.controllerAdd = async (req, res) => {
    let data;
    let id = req.params.id;
    let what = req.params.what;
    let idType = req.params.idType;
    let valId = false;
    let adminStats;
    let name = '';
    if (idType === 'learn') {
        res.redirect(`/error?msg=${encodeURIComponent('Students can not make accounts')}`);
    } else if (idType === 'teach') {
        await schema.teacher.find({t_Id: id}).then(data => {
            name = data[0].Name;
            adminStats = data[0].Admin;
            valId = data[0].t_Id === id;
        }).catch(err => {
            console.log(err);
            res.redirect(`/error?msg=${encodeURIComponent('Can not find teacher with the specified id')}`);
        });
        if (valId) {
            if (what === 'class') {
                data = new schema.techerClass({
                    c_Id: uid(),
                    Title: req.body.classTitle,
                    titleImg: req.body.titleImg,
                    createdOn: Date.now(),
                    createdBy: name,
                    Teachers: [id],
                    Students: []
                });
                await data.save().then(data => {
                    res.redirect(`/classes/${idType}/${id}`)
                }).catch(err => {
                    console.log(err);
                    res.redirect(`/error?msg=${encodeURIComponent('There was an error saving class to database')}`);
                });
            } else if (what === 'stu') {
                data = new schema.student({
                    s_Id: uid(),
                    Name: req.body.Name,
                    Email: req.body.Email,
                    Username: req.body.Username,
                    Password: req.body.Password
                });
                data.save().then(data => {
                    res.redirect(`/classes/${idType}/${id}`);
                }).catch(err => {
                    console.log(err);
                    res.redirect(`/error?msg=${encodeURIComponent('Their was an error saving account to database')}`);
                });
            } else if (what === 'instru') {
                if (adminStats) {
                    data = new schema.teacher({
                        t_Id: uid(),
                        Name: req.body.Name,
                        Email: req.body.Email,
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Admin: req.body.Admin === 'on'
                    });
                    data.save().then(data => {
                        res.redirect(`/classes/${idType}/${id}`)
                    }).catch(err => {
                        console.log(err);
                        res.redirect(`/error?msg=${encodeURIComponent('There was an error saving account to databse')}`);
                    });
                } else {
                    res.redirect(`/error?msg=${encodeURIComponent('Only admin can make teacher accounts')}`);
                }
            } else {
                res.redirect(`/error?msg=${encodeURIComponent('The specified account type you are trying to make does not exist')}`);
            }
        }
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('The specified account type does not exist')}`);
    }
};

exports.controllerUpdate = async (req, res) => {
    let idType = req.params.idType;
    let what = req.params.what;
    let id = req.params.id;
    let whatId = req.params.whatId;
    if (idType === 'student') {
        res.redirect(`/error?msg=${encodeURIComponent('Students can not change accounts')}`);
    } else if (idType === 'teacher') {
        if (validator.valId(idType, id)) {
            if (what === 'class') {
                schema.techerClass.findOneAndUpdate({c_Id: whatId}, {
                    Title: req.body.title
                }, null, function (err) {
                    console.log(err);
                })
            } else if (what === 'student') {
                schema.student.findOneAndUpdate({s_Id: whatId}, {
                    Name: req.body.name,
                    Email: req.body.email,
                    Username: req.body.username,
                    Password: req.body.password
                }, null, function (err) {
                    console.log(err);
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
                        console.log(err);
                    })
                } else {
                    res.redirect(`/error?msg=${encodeURIComponent('Only admin can change teacher accounts')}`);
                }
            } else {
                res.redirect(`/error?msg=${encodeURIComponent('The specified thing you are trying to change does not exist')}`);
            }
        }
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('The specified ID type does not exist')}`);
    }
};

exports.controllerDelete = async (req, res) => {
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
                    console.log(err);
                    if (!data) {
                        res.redirect(`/error?msg=${encodeURIComponent('There was an error while deleting the class')}`);
                    } else {
                        res.redirect(`/classes/${idType}/${id}`)
                    }
                })
            } else if (what === 'student') {
                schema.techerClass.findOneAndDelete({s_Id: whatId}, function (err, data) {
                    console.log(err);
                    if (!data) {
                        res.redirect(`/error?msg=${encodeURIComponent('There was an error while deleting the student account')}`);
                    } else {
                        res.redirect(`/classes/${idType}/${id}`)
                    }
                })
            } else if (what === 'teacher') {
                if (validator.valTeacherAdmin(id)) {
                    schema.techerClass.findOneAndDelete({t_Id: whatId}, function (err, data) {
                        console.log(err);
                        if (!data) {
                            res.redirect(`/error?msg=${encodeURIComponent('There was an error while deleting the teacher account')}`);
                        } else {
                            res.redirect(`/classes/${idType}/${id}`)
                        }
                    })
                } else {
                    res.redirect(`/error?msg=${encodeURIComponent('Only admin can delete teacher accounts')}`);
                }
            } else {
                res.redirect(`/error?msg=${encodeURIComponent('The specified object you are trying to delete does not exist')}`);
            }
        }
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('The specified ID type does not exist')}`);
    }
};