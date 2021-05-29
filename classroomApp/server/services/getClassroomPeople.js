const schema = require('./../model/schema');

async function allDataGiver(data) {
    let check;
    let teacherDataInClass = [];
    let studentDataInClass = [];
    if (data["userType"] === 'teach') {
        await schema.teacher.find({t_Id: data.userId}).then(d => {
            if (!d) {
                check = false;
            } else {
                check = d[0].Admin;
            }
        }).catch(err => {
            console.log('error');
            check = false;
        })
    } else if (data.userType === 'learn') {
        check = false;
    } else {
        check = false;
    }
    await schema.techerClass.find({c_Id: String(data['classId'])}).then(async classData => {
        if (!classData || classData === []) {
            teacherDataInClass = [];
            studentDataInClass = [];
        } else {
            await schema.teacher.find().then(teacherData => {
                if (!teacherData || teacherData === []) {
                    teacherDataInClass = [];
                } else {
                    teacherData.forEach(teacherDataFound => {
                        if (classData[0].Teachers.includes(teacherDataFound.t_Id)) {
                            teacherDataInClass.push({
                                t_Id: teacherDataFound.t_Id,
                                Name: teacherDataFound.Name,
                                Email: teacherDataFound.Email,
                                Admin: teacherDataFound.Admin
                            })
                        }
                    })
                }
            }).catch(err => {
                console.log(err);
            })

            await schema.student.find().then(studentData => {
                if (!studentData || studentData === []) {
                    studentDataInClass = [];
                } else {
                    studentData.forEach(studentDataFound => {
                        if (classData[0].Students.includes(studentDataFound.s_Id)) {
                            studentDataInClass.push({
                                s_Id: studentDataFound.s_Id,
                                Name: studentDataFound.Name,
                                Email: studentDataFound.Email
                            })
                        }
                    })
                }
            })
        }
    })
    return {adminStat: check, teacherDataInClass, studentDataInClass}
}

module.exports = {allDataGiver};