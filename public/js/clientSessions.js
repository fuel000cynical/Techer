const socketIOclientsessions = io();

document.addEventListener('DOMcontentloaded', checkSesion(event));

async function checkSesion(e){
    if(!!localStorage.getItem('techer_sesion')){
        await socketIOclientsessions.emit('checkSesion', {sessionId : localStorage.getItem('techer_sesion')});
    }else{
        location.href='/login';
    }
}

socketIOclientsessions.on('checkSesionResult', (check) => {
    if(check.error === false){
        if(!check.status){
            location.href='/login';
        }
    }else{
        location.href=`/error?msg=${check.error}`;
    }
})