import { getAuthErrorMessage, registerUser } from './auth.js';

const signupForm = document.querySelector('#signup-form');
const signupPassword = document.querySelector('#signup-password');
const confirmPassword = document.querySelector('#confirm-password');
const signupMessage = document.querySelector('#signup-message');

function validatePasswordMatch() {
    if (!confirmPassword || !signupPassword) {
        return;
    }

    confirmPassword.setCustomValidity(
        confirmPassword.value === signupPassword.value
            ? ''
            : 'As palavras-passe não coincidem.'
    );
}

if (signupPassword) {
    signupPassword.addEventListener('input', validatePasswordMatch);
}

if (confirmPassword) {
    confirmPassword.addEventListener('input', validatePasswordMatch);
}

if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        signupMessage.textContent = '';

        const name = signupForm.elements.name.value.trim();
        const email = signupForm.elements.email.value.trim();
        const password = signupForm.elements.password.value;

        if (signupPassword && confirmPassword && signupPassword.value !== confirmPassword.value) {
            signupMessage.textContent = 'As palavras-passe não coincidem.';
            return;
        }

        try {
            await registerUser({ name, email, password });
            window.location.href = 'menu.html';
        } catch (error) {
            console.error('[VerdeVivo Auth] Falha ao criar conta:', error);
            signupMessage.textContent = getAuthErrorMessage(error, 'register');
        }
    });
}
