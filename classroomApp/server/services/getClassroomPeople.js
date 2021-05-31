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

async function removeFromClass(type, data){
  await schema.techerClass.find({c_Id : data.classId}).then( async classData => {
    if(type === "teacher"){
      classOldData = classData[0].Teachers;
      classNewData = classOldData.filter(id => id !== data.idGiven);
      await schema.techerClass.findOneAndUpdate({c_Id : data.classId}, {Teachers : classNewData}).catch(err => {console.log(err)});
    }else if(type === "student"){
      classOldData = classData[0].Students;
      classNewData = classOldData.filter(id => id !== data.idGiven);
      await schema.techerClass.findOneAndUpdate({c_Id : data.classId}, {Students : classNewData}).catch(err => {console.log(err)});
    }
  }).catch(err => {
    console.log(err);
  })
}

async function addPeopleToClassSearch(query){
  let searchKeyword = String(query.searchQuery).toLowerCase();
  let classId = String(query.classId);
  console.log(searchKeyword);
  console.log(classId);
  let searchResultTeachers = [];
  let searchResultStudents = [];
  schema.techerClass.find({c_Id : classId}).then(classData => {
    schema.teacher.find().then(data => {
      data.forEach(teacher => {
        if(!(classData[0].Teachers.includes(teacher.t_Id))){
          if(teacher.Name.toLowerCase().includes(searchKeyword) || teacher.Email.toLowerCase().includes(searchKeyword) || teacher.Username.toLowerCase().includes(searchKeyword)){
            console.log('T');
            searchResultTeachers.push({
              t_Id : teacher.t_Id,
              Name : teacher.Name,
              Email : teacher.Email,
              Username : teacher.Username
            });
          }
        }
      })
    }).catch(err => {
      console.log(err);
    });

    schema.student.find().then(data => {
      data.forEach(student => {
        if(!(classData[0].Students.includes(student.s_Id))){
          if(student.Name.toLowerCase().includes(searchKeyword) || student.Email.toLowerCase().includes(searchKeyword) || student.Username.toLowerCase().includes(searchKeyword)){
            console.log("S");
            searchResultStudents.push({
              s_Id : student.s_Id,
              Name : student.Name,
              Email : student.Email,
              Username : student.Username
            });
          }
        }
      })
    }).catch(err => {
      console.log(err);
    });
  }).catch(err => {
    console.log(err);
  });
  console.log({
    teachersToBeAdded : searchResultTeachers,
    studentsToBeAdded : searchResultStudents
  })
  return({
    teachersToBeAdded : searchResultTeachers,
    studentsToBeAdded : searchResultStudents
  })
}
module.exports = {allDataGiver, removeFromClass, addPeopleToClassSearch};
