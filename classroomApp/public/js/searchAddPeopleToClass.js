const socket = io();
let toAddArrayTeacher = [];
let toAddArrayStudent = [];
const studentResultBox = document.getElementById('studentShowSearch');
const teacherResultBox = document.getElementById('teacherShowSearch');

async function start(){
  await socket.emit('searchAddPeople', {searchQuery: '', classId});
}
start();

async function emitSearch() {
    let searchValue = document.getElementById('searchPeopleNavBar').value;
    await socket.emit('searchAddPeople', {searchQuery: searchValue, classId});
}

socket.on('searchAddPeopleResult', (query) => {
  addSearchElements(query.searchedResult);
})

function addSearchElements(query){
  while(studentResultBox.firstChild){
    studentResultBox.removeChild(studentResultBox.firstChild);
  }
  while(teacherResultBox.firstChild){
    teacherResultBox.removeChild(teacherResultBox.firstChild);
  }
  query.studentsToBeAdded.forEach(student => {
    const mainCard = document.createElement('div');
    mainCard.classList.add("card");
    mainCard.classList.add("mt-3");
    mainCard.classList.add("p-3");
    mainCard.classList.add("text-white");
    mainCard.classList.add("bg-dark");
    mainCard.style.cursor = "pointer";
    mainCard.setAttribute('id', student.s_Id);
    mainCard.setAttribute('onclick', `changeStatus('${student.s_Id}', 'student')`);
    mainCard.innerHTML = `
    <div class="row">
      <div class="col-md-10">
        <h3 class="card-title" style="color: #5cb85c;">${student.Name}</h3>
        <p class="text-muted card-subtitle" style="color : #f0ad4e !important;">${student.Email}</p>
        <p class="text-muted card-subtitle" style="color : #d9534f !important;">${student.Username}</p>
      </div>
    </div>`
    studentResultBox.appendChild(mainCard);
    if(toAddArrayStudent.includes(student.s_Id)){
      const tick = document.createElement('div');
      tick.classList.add("col-md-1");
      tick.classList.add("mt-2");
      tick.innerHTML = `<i class="fa fa-check" style="font-size: 60px;"></i>`;
      document.getElementById(student.s_Id).children[0].appendChild(tick);
      document.getElementById(student.s_Id).style.border = "solid 5px #f7f7f7";
    }
  })
  query.teachersToBeAdded.forEach(teacher => {
    const mainCard = document.createElement('div');
    mainCard.classList.add("card");
    mainCard.classList.add("mt-3");
    mainCard.classList.add("p-3");
    mainCard.classList.add("text-white");
    mainCard.classList.add("bg-dark");
    mainCard.style.cursor = "pointer";
    mainCard.setAttribute('id', teacher.t_Id)
    mainCard.setAttribute('onclick', `changeStatus("${teacher.t_Id}", 'teacher')`);
    mainCard.innerHTML = `
    <div class="row">
      <div class="col-md-10">
        <h3 class="card-title" style="color: #5cb85c;">${teacher.Name}</h3>
        <p class="text-muted card-subtitle" style="color : #f0ad4e !important;">${teacher.Email}</p>
        <p class="text-muted card-subtitle" style="color : #d9534f !important;">${teacher.Username}</p>
      </div>
    </div>`
    teacherResultBox.appendChild(mainCard);
    if(toAddArrayTeacher.includes(teacher.t_Id)){
      const tick = document.createElement('div');
      tick.classList.add("col-md-1");
      tick.classList.add("mt-2");
      tick.innerHTML = `<i class="fa fa-check" style="font-size: 60px;"></i>`;
      document.getElementById(teacher.t_Id).children[0].appendChild(tick);
      document.getElementById(teacher.t_Id).style.border = "solid 5px #f7f7f7";
    }
  })
}

function changeStatus(id, type){
  if(type === 'student'){
    if(toAddArrayStudent.includes(id)){
      document.getElementById(id).children[0].removeChild(document.getElementById(id).children[0].lastChild);
      document.getElementById(id).style.border = "0";
      toAddArrayStudent = toAddArrayStudent.filter(data => data !== id);
    }else{
      const tick = document.createElement('div');
      tick.classList.add("col-md-1");
      tick.classList.add("mt-2");
      tick.innerHTML = `<i class="fa fa-check" style="font-size: 60px;"></i>`;
      document.getElementById(id).children[0].appendChild(tick);
      document.getElementById(id).style.border = "solid 5px #f7f7f7";
      toAddArrayStudent.push(id);
    }
  }else if(type === 'teacher'){
    if(toAddArrayTeacher.includes(id)){
      document.getElementById(id).children[0].removeChild(document.getElementById(id).children[0].lastChild);
      document.getElementById(id).style.border = "0";
      toAddArrayTeacher = toAddArrayTeacher.filter(data => data !== id);
    }else{
      const tick = document.createElement('div');
      tick.classList.add("col-md-1");
      tick.classList.add("mt-2");
      tick.innerHTML = `<i class="fa fa-check" style="font-size: 60px;"></i>`;
      document.getElementById(id).children[0].appendChild(tick);
      document.getElementById(id).style.border = "solid 5px #f7f7f7";
      toAddArrayTeacher.push(id);
    }
  }
}

async function addPeople(){
  await socket.emit('addPeopleToClass', {classId, toAddArrayTeacher, toAddArrayStudent});
  alert('The people you chose to add in the class have been added. You can now go back to class by clicking the go back button');
  await socket.on('addComplete', async () => {
    let searchValue = document.getElementById('searchPeopleNavBar').value;
    await socket.emit('searchAddPeople', {searchQuery: searchValue, classId});
    await socket.on('searchAddPeopleResult', (query) => {
        addSearchElements(query.searchedResult);
    })
  })
}