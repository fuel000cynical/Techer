const schema = require('../model/schema');
const uid = require('uniqid');

exports.controllerAdd = async (req, res) => {
    let data;
    let id = req.params.id;
    let what = req.params.what;
    let idType = req.params.idType;
    let valId = req.validated;
    let adminStats = req.adminStatus;
    if (idType === 'learn') {
        res.redirect(`/error?msg=${encodeURIComponent('Students can not make accounts')}`);
    } else if (idType === 'teach') {
        let name = req.teacherName;
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
                await data.save().then(data => {
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
                    await data.save().then(data => {
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
    if (idType === 'learn') {
        res.redirect(`/error?msg=${encodeURIComponent('Students can not change accounts')}`);
    } else if (idType === 'teach') {
        if (req.validated) {
            if (what === 'class') {
                await schema.techerClass.findOneAndUpdate({c_Id: whatId}, {
                    Title: req.body.title
                }).then(data => {
                    if (!(data)) {
                        res.redirect(`/error?msg=${encodeURIComponent('There was an error while finding the class you want to update')}`);
                    }
                }).catch(err => {
                    console.log(err);
                    res.redirect(`/error?msg=${encodeURIComponent('There was an error while updating the class details')}`);
                })
            } else if (what === 'stu') {
                await schema.student.findOneAndUpdate({s_Id: whatId}, {
                    Name: req.body.Name,
                    Email: req.body.Email,
                    Username: req.body.Username,
                    Password: req.body.Password
                }).then(data => {
                    if (!(data)) {
                        res.redirect(`/error?msg=${encodeURIComponent('There wan an error trying finding the student account you want to update')}`);
                    }
                }).catch(err => {
                    console.log(err);
                    res.redirect(`/error?msg=${encodeURIComponent('There was an error while updating the student account')}`);
                })
            } else if (what === 'instru') {
                if (req.adminStatus) {
                    await schema.teacher.findOneAndUpdate({t_Id: whatId}, {
                        Name: req.body.Name,
                        Email: req.body.Email,
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Admin: req.body.Admin === 'on'
                    }).then(data => {
                        if (!(data)) {
                            res.redirect(`/error?msg=${encodeURIComponent('There was an error updating the teacher account')}`);
                        } else {
                            res.redirect(`/classes/teach/${data.t_Id}`);
                        }
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
    if (idType === 'learn') {
        res.redirect(`/error?msg=${encodeURIComponent('Students can not delete classes and accounts')}`);
    } else if (idType === 'teach') {
        if (req.validated) {
            if (what === 'class') {
                schema.techerClass.findOneAndDelete({c_Id: whatId}).then(data => {
                    if (!data) {
                        res.redirect(`/error?msg=${encodeURIComponent('There was an error while deleting the class')}`);
                    } else {
                        res.redirect(`/classes/${idType}/${id}`)
                    }
                }).catch(err => {
                    console.log(err);
                    res.redirect(`/error?msg=${encodeURIComponent('There was an error in the database while deleting the class')}`);
                })
            } else if (what === 'stu') {
                schema.student.findOneAndDelete({s_Id: whatId}).then(data => {
                    if (!data) {
                        res.redirect(`/error?msg=${encodeURIComponent('There was an error while deleting the student account')}`);
                    } else {
                        res.redirect(`/classes/${idType}/${id}`)
                    }
                }).catch(err => {
                    console.log(err);
                    res.redirect(`/error?msg=${encodeURIComponent('There was an error in the database while deleting the student account')}`);
                })
            } else if (what === 'instru') {
                if (req.adminStatus) {
                    schema.teacher.findOneAndDelete({t_Id: whatId}).then(data => {
                        if (!data) {
                            res.redirect(`/error?msg=${encodeURIComponent('There was an error while deleting the teacher account')}`);
                        } else {
                            res.redirect(`/classes/${idType}/${id}`)
                        }
                    }).catch(err => {
                        console.log(err);
                        res.redirect(`/error?msg=${encodeURIComponent('There was an error in the database while deleting the teacher account')}`);
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