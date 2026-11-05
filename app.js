if (document.body && document.querySelector('.splash-screen')) {
  const currentUser = window.VerdeVivoDB?.getCurrentUser?.();
  if (currentUser) {
    window.location.href = './pages/menu.html';
  }
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