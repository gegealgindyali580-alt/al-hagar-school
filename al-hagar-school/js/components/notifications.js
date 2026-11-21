(function (HJ) {
  'use strict';
  function visible(user){const db=HJ.storage.read('database',{});return (db.announcements||[]).filter((item)=>item.published&&(!item.audience||item.audience.includes(user.role)));}
  function render(root,user){const items=visible(user);if(!items.length){root.innerHTML='';return;}root.innerHTML='<section class="ticker mx-4 mt-5 overflow-hidden rounded-xl border border-violet-100 bg-white py-3 md:mx-8" aria-label="إعلانات وتنبيهات المدرسة"><div class="flex items-center gap-3"><span class="shrink-0 px-4 font-bold text-violet-900">إعلانات وتنبيهات المدرسة</span><div class="min-w-0 flex-1 overflow-hidden"><div class="ticker-track gap-12">'+items.concat(items).map((item)=>'<span class="whitespace-nowrap text-sm text-gray-700"><b class="text-violet-800">●</b> '+HJ.utils.escapeHTML(item.title)+' <small class="text-gray-400">'+HJ.utils.escapeHTML(item.date)+'</small></span>').join('')+'</div></div></div></section>';}
  HJ.components.notifications={render,visible};
})(window.HJ);
