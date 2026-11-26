import { getAuthErrorMessage, loginUser } from './auth.js';

const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loginMessage.textContent = '';

        const email = (loginForm.elements.email.value || '').trim();
        const password = String(loginForm.elements.password.value || '');

        try {
            await loginUser({ email, password });
            window.location.href = 'menu.html';
        } catch (error) {
            console.error('[VerdeVivo Auth] Falha ao iniciar sessão:', error);
            loginMessage.textContent = getAuthErrorMessage(error, 'login');
        }
    });
}
