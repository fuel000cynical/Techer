const schema = require('./../model/schema');

let classSearchResult, studentSearchResult, teacherSearchResult;
async function searchFunction(searchQueryGiven) {
    let searchQuery = searchQueryGiven.toLowerCase()
    classSearchResult = [];
    studentSearchResult = [];
    teacherSearchResult = [];
    await schema.techerClass.find().then(data => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].Title.toLowerCase().includes(searchQuery)) {
                classSearchResult.push({
                    Title: data[i].Title,
                    createdOn: data[i].createdOn,
                    createdBy: data[i].createdBy,
                    c_Id: data[i].c_Id
                });
            }
        }
    }).catch(err => {
        console.log(err)
    });
    await schema.student.find().then(dataS => {
        for (let i = 0; i < dataS.length; i++) {
            if (dataS[i].Email.toLowerCase().includes(searchQuery) || dataS[i].Name.toLowerCase().includes(searchQuery) || dataS[i].Username.toLowerCase().includes(searchQuery)) {
                studentSearchResult.push({
                    s_Id: dataS[i].s_Id,
                    Name: dataS[i].Name,
                    Email: dataS[i].Email,
                    Username: dataS[i].Username
                });
            }
        }
    }).catch(err => {
        console.log(err)
    });
    await schema.teacher.find().then(data => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].Email.toLowerCase().includes(searchQuery) || data[i].Name.toLowerCase().includes(searchQuery) || data[i].Username.toLowerCase().includes(searchQuery)) {
                teacherSearchResult.push({
                    t_Id: data[i].t_Id,
                    Name: data[i].Name,
                    Email: data[i].Email,
                    Username: data[i].Username,
                    Admin: data[i].Admin
                });
            }
        }
    }).catch(err => {
        console.log(err)
    });
    return ({
        classesSearched: classSearchResult,
        studentsSearched: studentSearchResult,
        teachersSearched: teacherSearchResult
    });
}

module.exports = {searchFunction};