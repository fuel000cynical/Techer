const socketIo = io();

const classStudentsBox = document.getElementById("studentsShowTable")
const classTeachersBox = document.getElementById('teachersShowTable');


function startData() {
    socketIo.emit('getAllData', {classId, userType, userId});
}

startData();

function removeStudent(studentId) {
    socketIo.emit('removeStudent', {idGiven: String(studentId), classId});
    socketIo.emit('getAllData', {classId, userType, userId});
}

function removeTeacher(teacherId) {
    socketIo.emit('removeTeacher', {idGiven: String(teacherId), classId});
    socketIo.emit('getAllData', {classId, userType, userId});
}


socketIo.on('sendAllData', (data) => {
    let adminStatus = data.stat;
    try{
        var element = document.getElementById("teacherAddBtn");
        element.parentNode.removeChild(element);
    }catch{};
    while (classStudentsBox.firstChild) {
        classStudentsBox.removeChild(classStudentsBox.firstChild);
    }
    try{
        var element = document.getElementById("studentAddBtn");
        element.parentNode.removeChild(element);
    }catch{}
    while (classTeachersBox.firstChild) {
        classTeachersBox.removeChild(classTeachersBox.firstChild);
    }
    data.students.forEach(dataGot => {
        const tableRowStudents = document.createElement('tr');
        const tableDataStudents0 = document.createElement('td');
        tableDataStudents0.innerHTML = dataGot.Name;
        const tableDataStudents = document.createElement('td');
        tableDataStudents.innerHTML = dataGot.Email;
        tableRowStudents.appendChild(tableDataStudents0);
        tableRowStudents.appendChild(tableDataStudents);
        if (userType === 'teach') {
            const tableDataStudents2 = document.createElement('td');
            const aLink = document.createElement('button');
            aLink.setAttribute('onClick', `removeStudent('${dataGot.s_Id}')`);
            aLink.classList.add("btn");
            aLink.classList.add("btn-outline-danger");
            aLink.style.cursor = 'pointer';
            const icon = document.createElement('i');
            icon.classList.add('fa');
            icon.classList.add('fa-remove');
            aLink.appendChild(icon);
            tableDataStudents2.appendChild(aLink);
            tableRowStudents.appendChild(tableDataStudents2);
        }
        classStudentsBox.appendChild(tableRowStudents);
    })
    if(userType === 'teach'){
        const addStudentToClassBtn = document.createElement("button");
        addStudentToClassBtn.classList.add('btn');
        addStudentToClassBtn.classList.add('btn-success');
        addStudentToClassBtn.setAttribute('id', 'studentAddBtn');
        addStudentToClassBtn.style.width = "100%";
        addStudentToClassBtn.innerHTML = "Add Student To Class";
        addStudentToClassBtn.setAttribute('onclick', `location.href="/classroom/${userType}/${userId}/${classId}/addPeople"`);
        document.getElementById('studentsTable').appendChild(addStudentToClassBtn);
    }

    data.teachers.forEach(dataGot => {
        const tableRowTeachers = document.createElement('tr');
        const tableDataTeachers0 = document.createElement('td');
        tableDataTeachers0.innerHTML = dataGot.Name;
        const tableDataTeachers = document.createElement('td');
        tableDataTeachers.innerHTML = dataGot.Email;
        tableRowTeachers.appendChild(tableDataTeachers0);
        tableRowTeachers.appendChild(tableDataTeachers);
        if (adminStatus) {
            const tableDataTeachers2 = document.createElement('td');
            const aLink = document.createElement('button');
            aLink.setAttribute('onClick', `removeTeacher('${dataGot.t_Id}')`)
            aLink.classList.add("btn");
            aLink.classList.add("btn-outline-danger");
            aLink.style.cursor = 'pointer';
            const icon = document.createElement('i');
            icon.classList.add('fa');
            icon.classList.add('fa-remove');
            aLink.appendChild(icon);
            tableDataTeachers2.appendChild(aLink);
            tableRowTeachers.appendChild(tableDataTeachers2);
        }
        classTeachersBox.appendChild(tableRowTeachers);
    })
    if(userType === 'teach'){
        const addTeacherToClassBtn = document.createElement("button");
        addTeacherToClassBtn.classList.add('btn');
        addTeacherToClassBtn.classList.add('btn-success');
        addTeacherToClassBtn.style.width = "100%";
        addTeacherToClassBtn.setAttribute('id', 'teacherAddBtn');
        addTeacherToClassBtn.innerHTML = "Add Teacher To Class";
        addTeacherToClassBtn.setAttribute('onclick', `location.href="/classroom/${userType}/${userId}/${classId}/addPeople"`);
        document.getElementById('teachersTable').appendChild(addTeacherToClassBtn);
    }
})
