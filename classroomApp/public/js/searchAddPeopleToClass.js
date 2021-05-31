const socket = io();
const urlArray = window.location.pathname.split('/');
const classId = urlArray[4];

async function emitSearch() {
    let searchValue = document.getElementById('searchPeopleNavBar').value;
    await socket.emit('searchAddPeople', {searchQuery: searchValue, classId});
    await socket.on('searchAddPeopleResult', (query) => {
        addSearchElements(query.result);
    })
}

function addSearchElements(query){
  console.log(query);
}
