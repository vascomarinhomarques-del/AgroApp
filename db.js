(function () {
  const STORAGE_KEYS = {
    users: 'verdevivo-users',
    session: 'verdevivo-session'
  };

  const DEMO_ACCOUNT = {
    name: 'Teste',
    email: 'teste@teste.pt',
    password: 'teste123'
  };

  function normalizeEmail(value = '') {
    return String(value).trim().toLowerCase();
  }

  function readStorage(key, fallback) {
    try {
      const rawValue = localStorage.getItem(key);
      if (rawValue === null) return fallback;
      return JSON.parse(rawValue);
    } catch (error) {
      console.warn('[VerdeVivo DB] Não foi possível ler o armazenamento local.', error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('[VerdeVivo DB] Não foi possível guardar o armazenamento local.', error);
      return false;
    }
  }

  function getUsers() {
    const users = readStorage(STORAGE_KEYS.users, []);
    return Array.isArray(users) ? users : [];
  }

  function ensureDemoAccount() {
    const users = getUsers();
    const hasDemoUser = users.some(
      (user) => normalizeEmail(user.email) === normalizeEmail(DEMO_ACCOUNT.email)
    );

    if (!hasDemoUser) {
      users.push({ ...DEMO_ACCOUNT });
      writeStorage(STORAGE_KEYS.users, users);
    }
  }

  function getCurrentUser() {
    const session = readStorage(STORAGE_KEYS.session, null);
    if (!session || !session.email) return null;

    return {
      name: session.name || 'Utilizador',
      email: normalizeEmail(session.email)
    };
  }

  function setCurrentUser(user) {
    if (!user || !user.email) return false;

    return writeStorage(STORAGE_KEYS.session, {
      name: user.name || 'Utilizador',
      email: normalizeEmail(user.email)
    });
  }

  function clearCurrentUser() {
    try {
      localStorage.removeItem(STORAGE_KEYS.session);
      return true;
    } catch (error) {
      console.warn('[VerdeVivo DB] Não foi possível limpar a sessão ativa.', error);
      return false;
    }
  }

  function registerUser({ name, email, password }) {
    const cleanName = String(name || '').trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = String(password || '');

    if (!cleanName) {
      return { ok: false, message: 'Indica o teu nome.' };
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { ok: false, message: 'Indica um e-mail válido.' };
    }

    if (cleanPassword.length < 8) {
      return { ok: false, message: 'A palavra-passe deve ter pelo menos 8 caracteres.' };
    }

    const users = getUsers();
    const existingUser = users.some((user) => normalizeEmail(user.email) === cleanEmail);

    if (existingUser) {
      return { ok: false, message: 'Já existe uma conta com este e-mail.' };
    }

    users.push({
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword
    });

    const saved = writeStorage(STORAGE_KEYS.users, users);
    if (!saved) {
      return { ok: false, message: 'Não foi possível guardar a conta. Tenta novamente.' };
    }

    return {
      ok: true,
      message: 'Conta criada com sucesso.',
      user: { name: cleanName, email: cleanEmail }
    };
  }

  function loginUser({ email, password }) {
    ensureDemoAccount();

    const cleanEmail = normalizeEmail(email);
    const cleanPassword = String(password || '');

    if (!cleanEmail || !cleanPassword) {
      return { ok: false, message: 'Preenche o e-mail e a palavra-passe.' };
    }

    const users = getUsers();
    const user = users.find(
      (storedUser) =>
        normalizeEmail(storedUser.email) === cleanEmail &&
        String(storedUser.password) === cleanPassword
    );

    if (!user) {
      return { ok: false, message: 'E-mail ou palavra-passe incorretos.' };
    }

    return {
      ok: true,
      message: 'Sessão iniciada com sucesso.',
      user: { name: user.name || 'Utilizador', email: cleanEmail }
    };
  }

  ensureDemoAccount();

  window.VerdeVivoDB = {
    DEMO_ACCOUNT,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    registerUser,
    loginUser
  };
})();
