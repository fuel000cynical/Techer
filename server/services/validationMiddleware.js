const schema = require('./../model/schema');

exports.valId = (req, res, next) => {
    if (req.params.idType === 'teach') {
        schema.teacher.find({t_Id: req.params.id}).then(data => {
            if (!(!(data))) {
                req.validated = true;
                req.adminStatus = data[0].Admin;
                req.teacherName = data[0].Name;
                next()
            } else {
                res.redirect(`/error?msg=${encodeURIComponent('Can not find a teacher account with the specified id')}`);
            }
        }).catch(err => {
            res.redirect(`/error?msg=${encodeURIComponent('There was an error finding an account with the specified id')}`)
        })
    } else if (req.params.idType === 'learn') {
        schema.student.find({s_Id: req.params.id}).then(data => {
            if (!(!(data))) {
                req.validated = true;
                next()
            } else {
                res.redirect(`/error?msg=${encodeURIComponent('Can not find a teacher account with the specified id')}`);
            }
        }).catch(err => {
            res.redirect(`/error?msg=${encodeURIComponent('There was an error finding an account with the specified id')}`)
        })
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('Can not find the type of account specified')}`);
    }
}

exports.validateAndFind = (req, res, next) => {
    let whatType = req.params.what;
    let whatId = req.params.whatId;
    if (String(whatType) === 'stu') {
        schema.student.find({s_Id: whatId}).then(data => {
            if (!(!(data))) {
                req.foundWhat = true;
                req.whatData = data;
                next()
            } else {
                res.redirect(`/error?msg=${encodeURIComponent('Can not find the student you want to update')}`);
            }
        }).catch(err => {
            res.redirect(`/error?msg=${encodeURIComponent('There was a problem finding the data of the student you want to update')}`);
        })
    } else if (String(whatType) === 'instru') {
        schema.teacher.find({t_Id: whatId}).then(data => {
            if (!(!(data))) {
                req.foundWhat = true;
                req.whatData = data;
                next()
            } else {
                res.redirect(`/error?msg=${encodeURIComponent('Can not find the teacher you want to update')}`);
            }
        }).catch(err => {
            res.redirect(`/error?msg=${encodeURIComponent('There was a problem finding the data of the teacher you want to update')}`);
        })
    } else if (String(whatType) === 'class') {
        schema.techerClass.find({c_Id: whatId}).then(data => {
            if (!(!(data))) {
                req.foundWhat = true;
                req.whatData = data;
                next()
            } else {
                res.redirect(`/error?msg=${encodeURIComponent('Can not find the class you want to update')}`);
            }
        }).catch(err => {
            res.redirect(`/error?msg=${encodeURIComponent('There was a problem finding the data of the class you want to update')}`);
        })
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('Can not find the object type you want to update')}`);
    }
}
