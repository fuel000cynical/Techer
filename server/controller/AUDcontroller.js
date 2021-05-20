const schema = require('./../model/schema');
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
};

exports.controllerDelete = async (req, res) => {
};