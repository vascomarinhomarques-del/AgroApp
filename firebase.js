import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

try {
  localStorage.removeItem('verdevivo-users');
  localStorage.removeItem('verdevivo-session');
} catch (error) {
  console.warn('[VerdeVivo Auth] Não foi possível remover os dados locais antigos.', error);
}

const firebaseConfig = {
  apiKey: 'AIzaSyBfzPHcg23mjZf2k2JnEcgKtZPLmNEBE4g',
  authDomain: 'agroapp-bd511.firebaseapp.com',
  projectId: 'agroapp-bd511',
  storageBucket: 'agroapp-bd511.firebasestorage.app',
  messagingSenderId: '500272974735',
  appId: '1:500272974735:web:d8d3dc513ac9794f5419fa'
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
