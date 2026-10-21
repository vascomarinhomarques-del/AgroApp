const signupForm = document.querySelector('#signup-form');
const signupPassword = document.querySelector('#signup-password');
const confirmPassword = document.querySelector('#confirm-password');
const signupMessage = document.querySelector('#signup-message');

function validatePasswordMatch() {
    confirmPassword.setCustomValidity(
        confirmPassword.value === signupPassword.value
            ? ''
            : 'As palavras-passe não coincidem.'
    );
}

signupPassword.addEventListener('input', validatePasswordMatch);
confirmPassword.addEventListener('input', validatePasswordMatch);

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    signupMessage.textContent = 'O registo ainda não está ligado a um serviço de contas.';
});
