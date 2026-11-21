(function (HJ) {
  'use strict';
  function isConfigured() { return false; }
  function status() { return { configured: isConfigured(), mode: 'local' }; }
  HJ.ai = { isConfigured, status };
})(window.HJ);
