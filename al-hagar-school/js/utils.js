(function (HJ) {
  'use strict';
  const listeners = new Map();
  function t(key, fallback) {
    const parts = String(key || '').split('.');
    let value = HJ.strings;
    for (const part of parts) value = value && value[part];
    return typeof value === 'string' ? value : (fallback || key);
  }
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
  function uid(prefix) { return (prefix || 'id_') + Math.random().toString(36).slice(2, 10); }
  function formatNumber(value) { return new Intl.NumberFormat('en-EG').format(Number(value || 0)); }
  function dateLabel(date, locale) {
    return new Intl.DateTimeFormat(locale || 'ar-EG', { dateStyle: 'medium' }).format(date || new Date());
  }
  function on(name, callback) {
    if (!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name).add(callback);
    return () => listeners.get(name).delete(callback);
  }
  function emit(name, detail) {
    (listeners.get(name) || []).forEach((callback) => {
      try { callback({ type: name, detail: detail || {} }); }
      catch (error) { console.error('HJ event listener failed', error); }
    });
  }
  class ValidationError extends Error { constructor(fields) { super('Validation failed'); this.name = 'ValidationError'; this.fields = fields || {}; this.messageKey = 'common.validation'; } }
  class PermissionError extends Error { constructor(permission) { super('Permission denied'); this.name = 'PermissionError'; this.permission = permission; this.messageKey = 'common.forbidden'; } }
  class NotFoundError extends Error { constructor(entity, id) { super('Record not found'); this.name = 'NotFoundError'; this.entity = entity; this.id = id; this.messageKey = 'common.notFound'; } }
  class ConflictError extends Error { constructor(messageKey, details) { super('Conflict'); this.name = 'ConflictError'; this.messageKey = messageKey; this.details = details; } }
  class StorageError extends Error { constructor(cause) { super('Storage failure'); this.name = 'StorageError'; this.cause = cause; this.messageKey = 'common.storageError'; } }
  class AiError extends Error { constructor(code) { super('AI error'); this.name = 'AiError'; this.code = code; this.messageKey = 'common.aiError'; } }
  HJ.t = t;
  HJ.utils = { escapeHTML, uid, formatNumber, dateLabel };
  HJ.events = { on, emit };
  HJ.errors = { ValidationError, PermissionError, NotFoundError, ConflictError, StorageError, AiError };
})(window.HJ);
