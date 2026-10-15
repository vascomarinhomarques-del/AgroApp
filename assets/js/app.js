import { renderPlantList } from './modules/UI.js';
import { fetchPlants } from './modules/api.js';

// Registo do Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[Service Worker] Registado com sucesso no escopo:', registration.scope);
      })
      .catch((error) => {
        console.error('[Service Worker] Falha ao registar:', error);
      });
  });
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[AgroApp] Inicializada com sucesso.');
  const plants = await fetchPlants();
  renderPlantList(plants);
});