const schema = require('../model/schema');

exports.classMenuView = async (req, res) => {
    let idType = String(req.params.idType);
    let id = String(req.params.id);
    let allClasses
    let userClasses = []
    await schema.techerClass.find().then(data => {
        allClasses = data
    }).catch(err => {
        console.log(err);
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

exports.classRoomPeopleView = async (req, res) => {
    let idType = String(req.params.idType);
    let id = String(req.params.id);
    let allStudents, allTeachers, classTeachers, classStudents, classTeachersData = [], classStudentsData = [];
    let classId = String(req.params.classId);
    let valid, adminValid;

    await schema.teacher.find().then(data => {
        allTeachers = data
    }).catch(err => {
        console.log(err);
        res.redirect(`/error?msg=${encodeURIComponent(err.message)}`)
    });
    await schema.student.find().then(data => {
        allStudents = data
    }).catch(err => {
        console.log(err);
        res.redirect(`/error?msg=${encodeURIComponent(err.message)}`)
    });
    await schema.techerClass.find({c_Id: classId}).then(data => {
        classTeachers = data[0].Teachers;
        classStudents = data[0].Students;
    }).catch(err => {
        console.log(err);
        res.redirect(`/error?msg=${encodeURIComponent(err.message)}`)
    });

    for (let i = 0; i < allStudents.length; i++) {
        for (let j = 0; j < classStudents.length; j++) {
            if (allStudents[i].s_Id === classStudents[j]) {
                classStudentsData.push(allStudents[i]);
            }
        }
    }
    for (let i = 0; i < allTeachers.length; i++) {
        for (let j = 0; j < classTeachers.length; j++) {
            if (allTeachers[i].t_Id === classTeachers[j]) {
                classTeachersData.push(allTeachers[i]);
            }
        }
    }

    if (idType === 'teach') {
        await schema.teacher.find({t_Id: id}).then(data => {
            valid = data[0].t_Id === id;
            adminValid = data[0].Admin;
        }).catch(err => {
            console.log(err);
            res.redirect(`/error?msg=${encodeURIComponent(err.message)}`);
        });
        if (valid) {
            res.render('classroomPeople', {
                teacherDataInClass: classTeachersData,
                studentDataInClass: classStudentsData,
                instruct: true,
                idType: idType,
                userId: id,
                adminNav: adminValid,
                classId: classId
            });
        } else {
            res.redirect(`/error?msg=${encodeURIComponent('The Teacher Id specified is not found')}`);
        }
    } else if (idType === 'learn') {
        await schema.student.find({s_Id: id}).then(data => {
            valid = data[0].s_Id === id;
        }).catch(err => {
            console.log(err);
            res.redirect(`/error?msg=${encodeURIComponent(err.message)}`);
        });
        if (valid) {
            res.render('classroomPeople', {
                teacherDataInClass: classTeachersData,
                studentDataInClass: classStudentsData,
                instruct: false,
                idType: idType,
                userId: id,
                adminNav: false,
                classId: classId
            });
        } else {
            res.redirect(`/error?msg=${encodeURIComponent('The Student Id specified is not found')}`);
        }
    } else {

    }
};

exports.classRoomPeopleAddView = (req, res) => {
  res.render('searchAddPeopleToClass', {classId : req.params.classId, userType : req.params.idType, userId : req.params.id});
};
