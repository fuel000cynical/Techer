const socket = io();

let adminStat = false;

if(userType === 'teach'){
    socket.emit('getAdminStatus', {userId});
    socket.on('resultAdminStatus', (data => {
        adminStat = data.adminStat;
    }));
}

async function emitSearch() {
    let searchValue = document.getElementById('searchAllNavBar').value;
    await socket.emit('searchQuery', {querySearched: searchValue});
    await socket.on('searchResult', (query) => {
        addSearchElements(query.result);
    })
}

function focusSearch() {
    document.getElementById('nonFocusSearch').style.visibility = 'hidden';
    document.getElementById('nonFocusSearch').style.opacity = 0;
    document.getElementById('nonBlurSearch').style.visibility = '';
    document.getElementById('nonBlurSearch').style.opacity = 100;
    document.getElementById('body').style['overflow-y'] = "scroll";
}

function blurSearch() {
    document.getElementById('nonFocusSearch').style.visibility = '';
    document.getElementById('nonFocusSearch').style.opacity = 100;
    document.getElementById('nonBlurSearch').style.visibility = 'hidden';
    document.getElementById('nonBlurSearch').style.opacity = 0;
    document.getElementById('body').style['overflow-y'] = "hidden";
}

function addSearchElements(elementData) {
    const urlArray = window.location.pathname.split('/');
    let userType = urlArray[2];
    let userId = urlArray[3];

    let teacherShowResultBox = document.getElementById('teacherShowSearchResult');
    while (teacherShowResultBox.firstChild) {
        teacherShowResultBox.removeChild(teacherShowResultBox.firstChild)
    }
    for (let i = 0; i < elementData.teachersSearched.length; i++) {
        const teacherCard = document.createElement('div');
        teacherCard.classList.add('col-md-12');
        var html =  `
        <div class="card bg-dark text-light mr-5 mt-2">
            <div class="card-body">
                <h2 class="card-title">${elementData.teachersSearched[i].Name}</h2>
                <p class="card-subtitle text-muted">${elementData.teachersSearched[i].Username}</p>
                <p class="card-subtitle text-muted">${elementData.teachersSearched[i].Email}</p>`

        if(adminStat){
            html = html +  `<a href="/update/instru/${userType}/${userId}/${elementData.teachersSearched[i].t_Id}" class="btn btn-primary mt-2" style="width: 100%" >Edit Teacher Account</a>
            <form action="/delete/instru/${userType}/${userId}/${elementData.teachersSearched[i].t_Id}" method="POST" >
                <button type="submit" class="btn btn-danger mt-2" style="width: 100%;">Delete Teacher</button>
            </form>`
        }
        html = html + `</div>
        </div>`
        teacherCard.innerHTML = html;

        teacherShowResultBox.appendChild(teacherCard);
    }
    let studentShowResultBox = document.getElementById('studentShowSearchResult');
    while (studentShowResultBox.firstChild) {
        studentShowResultBox.removeChild(studentShowResultBox.firstChild)
    }
    for (let i = 0; i < elementData.studentsSearched.length; i++) {
        const studentCard = document.createElement('div');
        studentCard.classList.add('col-md-12');
        studentCard.innerHTML = `
                <div class="card bg-dark text-light mr-5 mt-2">
                    <div class="card-body">
                        <h2 class="card-title">${elementData.studentsSearched[i].Name}</h2>
                        <p class="card-subtitle text-muted">${elementData.studentsSearched[i].Username}</p>
                        <p class="card-subtitle text-muted">${elementData.studentsSearched[i].Email}</p>
                        <a href="/update/stu/${userType}/${userId}/${elementData.studentsSearched[i].s_Id}" class="btn btn-primary mt-2" style="width: 100%" >Edit Student Account</a>
                        <form action="/delete/stu/${userType}/${userId}/${elementData.studentsSearched[i].s_Id}" method="POST">
                            <button type="submit" class="btn btn-danger mt-2" style="width: 100%;">Delete Student</button>
                        </form>
                    </div>
                </div>`;

        studentShowResultBox.appendChild(studentCard);
    }
    let classesShowResultBox = document.getElementById('classShowSearchResult');
    while (classesShowResultBox.firstChild) {
        classesShowResultBox.removeChild(classesShowResultBox.firstChild)
    }

    for (let i = 0; i < elementData.classesSearched.length; i++) {
        const classCard = document.createElement('div');
        classCard.classList.add('col-md-12');
        classCard.innerHTML = `
                <div class="card bg-dark text-light mr-5 mt-2">
                    <div class="card-body">
                        <h2 class="card-title">${elementData.classesSearched[i].Title}</h2>
                        <p class="card-subtitle text-muted">${new Date(elementData.classesSearched[i].createdOn).getDate()}-${new Date(elementData.classesSearched[i].createdOn).getMonth() + 1}-${new Date(elementData.classesSearched[i].createdOn).getFullYear()}</p>
                        <p class="card-subtitle text-muted">${elementData.classesSearched[i].createdBy}</p>
                        <a href="/classroom/${userType}/${userId}/${elementData.classesSearched[i].c_Id}/work" class="btn btn-success" style="width: 100%">Go To Class</a>
                        <a href="/update/class/${userType}/${userId}/${elementData.classesSearched[i].c_Id}" class="btn btn-warning mt-2" style="width: 100%">Edit Class</a>
                        <form action="/delete/class/${userType}/${userId}/${elementData.classesSearched[i].c_Id}" method="POST">
                            <button type="submit" class="btn btn-danger mt-2" style="width: 100%;">Delete Class</button>
                        </form>
                    </div>
                </div>`;

        classesShowResultBox.appendChild(classCard);
    }
}
