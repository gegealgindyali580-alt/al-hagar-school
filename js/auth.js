(function (HJ) {
  'use strict';
  let currentUser = null;
  let idleTimer = null;
  function database() { return HJ.storage.read('database', { users: [] }); }
  function digest(text) {
    if (!window.crypto || !window.crypto.subtle) return Promise.reject(new HJ.errors.StorageError(new Error('Secure context required')));
    return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then((buffer) =>
      Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join(''));
  }
  function findUser(username) { return database().users.find((user) => user.username === username && user.active); }
  function setSession(user, remember) {
    const safe = Object.assign({}, user);
    delete safe.passwordHash; delete safe.salt;
    currentUser = safe;
    HJ.storage.write('session', { user: safe, expiresAt: Date.now() + (remember ? 7 : 1) * 86400000 }, !remember);
    HJ.events.emit(HJ.config.EVENTS.AUTH_LOGIN, { user: safe });
    watchIdle();
    return safe;
  }
  async function login(username, password, remember) {
    const user = findUser(username);
    if (!user) throw new HJ.errors.ValidationError({ credentials: 'login.invalid' });
    const hash = await digest(user.salt + password);
    if (hash !== user.passwordHash) throw new HJ.errors.ValidationError({ credentials: 'login.invalid' });
    return setSession(user, Boolean(remember));
  }
  function quickLogin(role) {
    const user = database().users.find((item) => item.role === role);
    if (!user || !database().demoMode) throw new HJ.errors.PermissionError('demo.login');
    return setSession(user, true);
  }
  function restore() {
    const session = HJ.storage.read('session', null) || HJ.storage.read('session', null, true);
    if (!session || session.expiresAt < Date.now()) return null;
    currentUser = session.user; watchIdle(); return currentUser;
  }
  function current() { return currentUser; }
  function logout() {
    HJ.storage.remove('session'); HJ.storage.remove('session', true);
    currentUser = null;
    if (idleTimer) clearTimeout(idleTimer);
    HJ.events.emit(HJ.config.EVENTS.AUTH_LOGOUT, {});
  }
  function watchIdle() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { logout(); HJ.router.go('/login', { replace: true }); }, HJ.config.DEFAULTS.idleMinutes * 60000);
  }
  ['click', 'keydown', 'touchstart'].forEach((eventName) => document.addEventListener(eventName, () => { if (currentUser) watchIdle(); }, { passive: true }));
  HJ.auth = { login, quickLogin, restore, current, logout };
})(window.HJ);
