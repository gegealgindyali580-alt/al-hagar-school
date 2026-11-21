(function (HJ) {
  'use strict';
  function toast(message, type) {
    const root = document.getElementById('toast-root');
    const item = document.createElement('div');
    item.className = 'toast mb-2 rounded-xl px-4 py-3 shadow-lg text-white ' + (type === 'error' ? 'bg-red-600' : 'bg-violet-900');
    item.textContent = message;
    root.appendChild(item);
    setTimeout(() => item.remove(), 4000);
  }
  function handleError(error) {
    console.error(error);
    toast(error && error.name === 'ValidationError' ? HJ.t('login.invalid') : HJ.t('common.error'), 'error');
  }
  function button(label, classes) { return '<button type="button" class="' + (classes || 'rounded-xl bg-violet-900 px-4 py-2.5 text-white hover:bg-violet-800') + '">' + HJ.utils.escapeHTML(label) + '</button>'; }
  HJ.ui = { toast, handleError, button };
})(window.HJ);
