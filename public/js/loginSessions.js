const socket = io();

document.addEventListener('DOMcontentloaded', checkSesion(event));

async function checkSesion(e){
    if(!!localStorage.getItem('techer_sesion')){
        await socket.emit('checkSesion', {sessionId : localStorage.getItem('techer_sesion')})
    }
}

socket.on('checkSesionResult', (check) => {
    if(check.error === false){
        if(check.status){
            location.href=`/classes/${check.idType}/${check.userId}`;
        }
    }else{
        location.href=`/error?msg=${check.error}`;
    }
})

function loginStudent(){
    const Username = document.getElementById('username').value;
    const Password = document.getElementById('password').value;
    socket.emit('login', {Username, Password, loginType : 'learn'});
}

function loginTeacher(){
    const Username = document.getElementById('username').value;
    const Password = document.getElementById('password').value;
    socket.emit('login', {Username, Password, loginType : 'teach'});
}

socket.on('loginResult', async (data) => {
    if(data.error === false){
        if(data.status){
            await localStorage.setItem('techer_sesion', data.sentID );
            location.href=`/classes/${data.idType}/${data.id}`;
        }else{
            if(!!localStorage.getItem('techer_sesion')){
                await localStorage.removeItem('techer_sesion');
            }
            document.getElementById('wrongLogin').style.opacity = 1;
            document.getElementById('wrongLogin').style.visibility = 'visible';
            document.getElementById('wrongLogin').style.height = '20%';
        }
    }else{
        location.href=`/error?msg=${data.error}`;
    }
})