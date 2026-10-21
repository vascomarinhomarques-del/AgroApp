const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');
const demoAccount = {
    email: 'teste@teste.pt',
    password: 'teste123'
};

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = loginForm.elements.email.value.trim().toLowerCase();
    const password = loginForm.elements.password.value;

    if (email !== demoAccount.email || password !== demoAccount.password) {
        loginMessage.textContent = 'E-mail ou palavra-passe incorretos.';
        return;
    }

    window.location.href = 'menu.html';
});
