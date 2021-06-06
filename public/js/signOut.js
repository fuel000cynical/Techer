const socket = io(); 
document.addEventListener('DOMContentLoaded', async event => {
    socket.emit('signOut', {sesionId : await localStorage.getItem('techer_sesion')});
    await localStorage.removeItem('techer_sesion');
})
