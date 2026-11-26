import { observeAuthState } from './auth.js';

const menuGreeting = document.querySelector('#menu-user-greeting');

if (menuGreeting) {
    observeAuthState(
        (user) => {
            if (user) {
                menuGreeting.textContent =
                    `Olá, ${user.displayName || 'Utilizador'}! Bom dia!`;
            }
        },
        (error) => {
            console.error('[VerdeVivo Auth] Falha ao verificar a sessão:', error);
            menuGreeting.textContent = 'Não foi possível verificar a sessão.';
        }
    );
}

