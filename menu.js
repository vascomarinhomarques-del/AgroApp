const menuGreeting = document.querySelector('#menu-user-greeting');
const menuExit = document.querySelector('.menu-exit');

if (menuGreeting) {
    const currentUser = window.VerdeVivoDB?.getCurrentUser?.();
    if (currentUser && currentUser.name) {
        menuGreeting.textContent = `Olá, ${currentUser.name}! O que gostarias de fazer hoje?`;
    }
}

if (menuExit) {
    menuExit.addEventListener('click', (event) => {
        event.preventDefault();
        window.VerdeVivoDB?.clearCurrentUser?.();
        window.location.href = '../index.html';
    });
}
