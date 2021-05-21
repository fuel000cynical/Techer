const schema = require('./../model/schema');

let classData, studentData, teacherData;
let classSearchResult, studentSearchResult, teacherSearchResult;
schema.techerClass.find().then(data => {
    classData = data
}).catch(err => {
    console.log(err)
});
schema.student.find().then(data => {
    studentData = data
}).catch(err => {
    console.log(err)
});
schema.teacher.find().then(data => {
    teacherData = data
}).catch(err => {
    console.log(err)
});

exports.searchFunction = (searchQuery) => {
    classSearchResult = [];
    studentSearchResult = [];
    teacherSearchResult = [];
    for (let i = 0; i < classData.length; i++) {
        if (classData[i].Name.includes(searchQuery)) {
            classSearchResult.push(classData[i]);
        }
    }
    for (let i = 0; i < studentData.length; i++) {
        if (studentData[i].Email.includes(searchQuery) || studentData[i].Name.includes(searchQuery) || studentData[i].Username.includes(searchQuery)) {
            studentSearchResult.push(studentData[i]);
        }
    }
    for (let i = 0; i < teacherData.length; i++) {
        if (teacherData[i].Email.includes(searchQuery) || teacherData[i].Name.includes(searchQuery) || teacherData[i].Username.includes(searchQuery)) {
            teacherSearchResult.push(studentData[i]);
        } else if (searchQuery === 'Admin') {
            if (teacherData[i].Admin) {
                teacherSearchResult.push(studentData[i]);
            }
        }
    }
    return {
        classesSearched: classSearchResult,
        studentsSearched: studentSearchResult,
        teachersSearched: teacherSearchResult
    }
};