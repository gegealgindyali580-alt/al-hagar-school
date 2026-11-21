(function (HJ) {
  'use strict';
  const prefix = HJ.config.STORAGE_PREFIX;
  function key(name) { return prefix + name; }
  function read(name, fallback, session) {
    try {
      const store = session ? window.sessionStorage : window.localStorage;
      const raw = store.getItem(key(name));
      return raw == null ? fallback : JSON.parse(raw);
    } catch (error) { throw new HJ.errors.StorageError(error); }
  }
  function write(name, value, session) {
    try {
      const store = session ? window.sessionStorage : window.localStorage;
      store.setItem(key(name), JSON.stringify(value));
      return true;
    } catch (error) { throw new HJ.errors.StorageError(error); }
  }
  function remove(name, session) {
    try { (session ? window.sessionStorage : window.localStorage).removeItem(key(name)); }
    catch (error) { throw new HJ.errors.StorageError(error); }
  }
  function clearAppData() {
    try {
      [window.localStorage, window.sessionStorage].forEach((store) => {
        Object.keys(store).filter((item) => item.indexOf(prefix) === 0).forEach((item) => store.removeItem(item));
      });
    } catch (error) { throw new HJ.errors.StorageError(error); }
  }
  HJ.storage = { read, write, remove, clearAppData, key };
})(window.HJ);
