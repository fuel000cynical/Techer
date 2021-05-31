const socket = io();
const urlArray = window.location.pathname.split('/');
const classId = urlArray[4];
const toAddArray = [];
const studentResultBox = document.getElementById('studentShowSearch');
const teacherResultBox = document.getElementById('teacherShowSearch');

async function emitSearch() {
    let searchValue = document.getElementById('searchPeopleNavBar').value;
    console.log(toAddArray);
    await socket.emit('searchAddPeople', {searchQuery: searchValue, classId});
    await socket.on('searchAddPeopleResult', (query) => {
        addSearchElements(query.searchedResult);
    })
}

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
    mainCard.setAttribute('onclick', `changeStatus('${student.s_Id}')`);
    mainCard.innerHTML = `
    <div class="row">
      <div class="col-md-10">
        <h3 class="card-title" style="color: #5cb85c;">${student.Name}</h3>
        <p class="text-muted card-subtitle" style="color : #f0ad4e !important;">${student.Email}</p>
        <p class="text-muted card-subtitle" style="color : #d9534f !important;">${student.Username}</p>
      </div>
    </div>`
    studentResultBox.appendChild(mainCard);
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
    mainCard.setAttribute('onclick', `changeStatus("${teacher.t_Id}")`);
    mainCard.innerHTML = `
    <div class="row">
      <div class="col-md-10">
        <h3 class="card-title" style="color: #5cb85c;">${teacher.Name}</h3>
        <p class="text-muted card-subtitle" style="color : #f0ad4e !important;">${teacher.Email}</p>
        <p class="text-muted card-subtitle" style="color : #d9534f !important;">${teacher.Username}</p>
      </div>
    </div>`
    teacherResultBox.appendChild(mainCard);
  })
}

function changeStatus(id){
  if(toAddArray.includes(id)){

  }else{
    const tick = document.createElement('div');
    tick.classList.add("col-md-1");
    tick.classList.add("mt-2");
    tick.innerHTML = `<i class="fa fa-check" style="font-size: 60px;"></i>`;
    document.getElementById(id).children[0].appendChild(tick);
    document.getElementById(id).style.border = "solid 5px #f7f7f7";
    toAddArray.push(id);
  }
}
