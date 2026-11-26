import { observeAuthState } from './auth.js';

if (document.body && document.querySelector('.splash-screen')) {
  observeAuthState(
    (user) => {
      if (user) window.location.href = './pages/menu.html';
    },
    (error) => console.error('[VerdeVivo Auth] Falha ao verificar a sessão:', error)
  );
}

// Registo do Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('[Service Worker] Registado com sucesso no escopo:', registration.scope);
      })
      .catch((error) => {
        console.error('[Service Worker] Falha ao registar:', error);
      });
  });
}