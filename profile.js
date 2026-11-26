import { logoutUser } from './auth.js';

const logoutButton = document.querySelector('#profile-logout');

logoutButton?.addEventListener('click', async () => {
    try {
        await logoutUser();
        window.location.href = '../index.html';
    } catch (error) {
        console.error('[VerdeVivo Auth] Falha ao terminar sessão:', error);
        logoutButton.textContent = 'Não foi possível terminar sessão';
    }
});
