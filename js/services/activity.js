(function (HJ) {
  'use strict';
  function log(action, entity, details) {
    const rows = HJ.storage.read('activity', []);
    const user = HJ.auth.current() || {};
    rows.unshift({ id: HJ.utils.uid('act_'), action, entity, details: details || '', userId: user.id || null, userName: user.name || 'النظام', role: user.role || 'system', at: new Date().toISOString() });
    HJ.storage.write('activity', rows.slice(0, HJ.config.DEFAULTS.activityMax));
    HJ.events.emit(HJ.config.EVENTS.ACTIVITY_NEW, rows[0]);
    return rows[0];
  }
  function list(limit) { return HJ.storage.read('activity', []).slice(0, limit || 30).map((x) => Object.assign({}, x)); }
  HJ.services.activity = { log, list };
})(window.HJ);
