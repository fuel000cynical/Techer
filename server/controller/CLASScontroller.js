const schema = require('./../model/schema');

exports.classMenuView = async (req, res) => {
    let idType = String(req.params.idType);
    let id = String(req.params.id);
    let allClasses
    let userClasses = []
    await schema.techerClass.find().then(data => {
        allClasses = data
    }).catch(err => {
        if (err) return handleError(err);
        res.redirect(`/error?msg=${encodeURIComponent('There was an error retrieving classes data from database ')}`)
    });
    let valid = false;
    let adminStats;
    if (idType === 'learn') {
        await schema.student.find({s_Id: id}).then(data => {
            valid = data[0].s_Id === id;
        }).catch(err => {
            console.log(err);
            res.redirect(`/error?msg=${encodeURIComponent('Can not find student with the specified id')}`);
        });
        if (valid) {
            if (allClasses !== []) {
                for (let i = 0; i < allClasses.length; i++) {
                    let sClasses = allClasses[i].Students;
                    for (let j = 0; j <= sClasses.length; j++) {
                        if (sClasses[j] === id) {
                            userClasses.push(allClasses[i]);
                        }
                    }
                }
            }
            res.render('classMenu', {
                classData: userClasses,
                instruct: false,
                userId: id,
                adminNav: false,
                idType: 'learn'
            });
        } else {
            res.redirect(`/error?msg=${encodeURIComponent('Student classes from the given ID not found')}`);
        }
    } else if (idType === 'teach') {
        await schema.teacher.find({t_Id: id}).then(data => {
            if (data[0].t_Id !== id) {
                adminStats = data[0].Admin;
                valid = false;
            } else {
                adminStats = data[0].Admin;
                valid = true;
            }
        }).catch(err => {
            console.log(err);
            res.redirect(`/error?msg=${encodeURIComponent('Can not find teacher with the specified id')}`);
        });
        if (valid) {
            if (allClasses !== []) {
                for (let i = 0; i < allClasses.length; i++) {
                    let tClasses = allClasses[i].Teachers;
                    for (let j = 0; j <= tClasses.length; j++) {
                        if (tClasses[j] === id) {
                            userClasses.push(allClasses[i]);
                        }
                    }
                }
            }
            res.render('classMenu', {
                classData: userClasses,
                instruct: true,
                userId: id,
                adminNav: adminStats,
                idType: 'teach'
            });
        } else {
            res.redirect(`/error?msg=${encodeURIComponent('Teacher classes from the given ID not found')}`);
        }
    } else {
        res.redirect(`/error?msg=${encodeURIComponent('id type used in url not found. Test')}`);
    }
};