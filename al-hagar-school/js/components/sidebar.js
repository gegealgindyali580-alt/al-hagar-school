(function (HJ) {
  'use strict';
  const items = [
    ['dashboard','dashboard'],['classes','classes'],['students','students'],['teachers','teachers'],
    ['attendance','attendance'],['grades','grades'],['finance','finance'],['library','library'],['settings','settings']
  ];
  function mount(root, user) {
    const visible = items.filter(([id]) => HJ.permissions.can('read', id));
    const current = HJ.router.current().path;
    const collapsed = HJ.storage.read('sidebarCollapsed', false);
    root.className = collapsed ? 'is-collapsed bg-gray-900 text-white' : 'bg-gray-900 text-white';
    root.innerHTML = '<div class="flex h-full flex-col p-4"><div class="mb-7 flex items-center justify-between gap-2"><div class="flex items-center gap-3"><div class="grid h-10 w-10 place-items-center rounded-xl bg-violet-700 font-heading text-xl">ح</div><div class="school-name"><div class="font-heading text-sm font-bold">مدرسة الحجر</div><div class="text-xs text-gray-400">الثانوية المشتركة</div></div></div><button id="sidebar-toggle" class="rounded-lg p-2 hover:bg-white/10" aria-label="طي أو توسيع القائمة">' + HJ.icons.render('chevron') + '</button></div><nav aria-label="القائمة الرئيسية" class="flex-1 space-y-1">' +
      visible.map(([id, icon]) => '<a class="sidebar-link flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-white/10 ' + (current.indexOf('/'+id)===0 ? 'bg-violet-900' : '') + '" href="#/' + id + '" title="' + HJ.t('shell.'+id) + '" ' + (current.indexOf('/'+id)===0 ? 'aria-current="page"' : '') + '>' + HJ.icons.render(icon) + '<span class="sidebar-label">' + HJ.t('shell.'+id) + '</span></a>').join('') +
      '</nav><div class="border-t border-white/10 pt-3"><button id="sidebar-logout" class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-white/10">' + HJ.icons.render('logout') + '<span class="sidebar-label">' + HJ.t('shell.logout') + '</span></button></div></div>';
    root.querySelector('#sidebar-toggle').addEventListener('click', () => { const next = !root.classList.contains('is-collapsed'); root.classList.toggle('is-collapsed', next); HJ.storage.write('sidebarCollapsed', next); });
    root.querySelector('#sidebar-logout').addEventListener('click', () => { HJ.auth.logout(); HJ.router.go('/login', { replace: true }); });
  }
  HJ.components.sidebar = { mount };
})(window.HJ);
