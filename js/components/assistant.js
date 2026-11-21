(function (HJ) {
  'use strict';
  function mount() {
    const root = document.getElementById('assistant-root');
    root.innerHTML = '<button type="button" class="fixed bottom-5 left-5 z-20 rounded-full bg-violet-900 p-4 text-white shadow-lg" aria-label="' + HJ.t('assistant.title') + '" title="' + HJ.t('assistant.title') + '">✦</button>';
    root.querySelector('button').addEventListener('click', () => HJ.ui.toast(HJ.t('assistant.later')));
  }
  HJ.components.assistant = { mount };
})(window.HJ);
