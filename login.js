const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = (loginForm.elements.email.value || '').trim();
        const password = String(loginForm.elements.password.value || '');

        const result = window.VerdeVivoDB.loginUser({ email, password });

        if (!result.ok) {
            loginMessage.textContent = result.message;
            return;
        }

        window.VerdeVivoDB.setCurrentUser(result.user);
        window.location.href = 'menu.html';
    });
}
