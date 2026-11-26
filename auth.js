import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

export function observeAuthState(onUser, onError) {
  return onAuthStateChanged(auth, onUser, onError);
}

export async function registerUser({ name, email, password }) {
  const cleanName = name.trim();
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  try {
    await updateProfile(credential.user, { displayName: cleanName });
  } catch (error) {
    throw Object.assign(new Error('A conta foi criada, mas a atualização do perfil falhou.'), {
      code: 'auth/profile-update-failed',
      cause: error
    });
  }

  return credential.user;
}

export async function loginUser({ email, password }) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  return credential.user;
}

export function logoutUser() {
  return signOut(auth);
}

export function getAuthErrorMessage(error, operation) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'O endereço de e-mail não é válido.';
    case 'auth/email-already-in-use':
      return 'Já existe uma conta com este e-mail.';
    case 'auth/weak-password':
      return 'A palavra-passe não cumpre os requisitos definidos no Firebase.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'E-mail ou palavra-passe incorretos.';
    case 'auth/too-many-requests':
      return 'Demasiadas tentativas. Aguarda um pouco e tenta novamente.';
    case 'auth/network-request-failed':
      return 'Sem ligação à Internet. Verifica a ligação e tenta novamente.';
    case 'auth/operation-not-allowed':
      return 'Ativa o método E-mail/palavra-passe nas definições do Firebase Authentication.';
    case 'auth/profile-update-failed':
      return 'A conta foi criada, mas o nome não foi guardado. A sessão já está iniciada.';
    default:
      if (operation === 'logout') {
        return 'Não foi possível terminar sessão. Verifica a ligação e tenta novamente.';
      }

      return operation === 'register'
        ? 'Não foi possível criar a conta. Tenta novamente.'
        : 'Não foi possível iniciar sessão. Tenta novamente.';
  }
}
