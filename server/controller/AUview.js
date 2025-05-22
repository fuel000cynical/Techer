const schema = require('../model/schema');

exports.viewAdd = async (req, res) => {
    let idType = req.params.idType;
    let id = req.params.id;
    let what = req.params.what;
    let valId = req.validated;
    let adminStats = req.adminStatus;
    if (idType === 'learn') {
        res.redirect(`/error?msg=${encodeURIComponent('Students can not make accounts')}`);
    } else if (idType === 'teach') {
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
    if (idType === 'learn') {
        res.redirect(`/error?msg=${encodeURIComponent('Students can not change accounts')}`);
    } else if (idType === 'teach') {
        if (req.validated) {
            if (what === 'class') {
                if (req.foundWhat) {
                    res.render('updateForm', {type: 'techerClass', dataShow: req.whatData});
                }
            } else if (what === 'stu') {
                if (req.foundWhat) {
                    res.render('updateForm', {type: 'stu', dataShow: req.whatData[0]});
                }
            } else if (what === 'instru') {
                if (req.adminStatus) {
                    if (req.foundWhat) {
                        res.render('updateForm', {type: 'instru', dataShow: req.whatData[0]});
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
