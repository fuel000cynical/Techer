const schema = require('./../model/schema');

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
            if (err) return handleError(err);
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
};

exports.viewDelete = async (req, res) => {
};