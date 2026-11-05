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
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = signupForm.elements.name.value.trim();
        const email = signupForm.elements.email.value.trim();
        const password = signupForm.elements.password.value;

        if (signupPassword && confirmPassword && signupPassword.value !== confirmPassword.value) {
            signupMessage.textContent = 'As palavras-passe não coincidem.';
            return;
        }

        const result = window.VerdeVivoDB.registerUser({ name, email, password });

        if (!result.ok) {
            signupMessage.textContent = result.message;
            return;
        }

        window.VerdeVivoDB.setCurrentUser(result.user);
        signupMessage.textContent = result.message;
        window.location.href = 'menu.html';
    });
}
