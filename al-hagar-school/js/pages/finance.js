(function (HJ) {
  'use strict';
  const R = HJ.config.ROLES;
  function mount(ctx) {
    const root = ctx.root;
    const title = HJ.t('finance.title');
    root.innerHTML = '<div id="page-header"></div><section class="p-4 md:p-8"><div class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"><div class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-2xl text-violet-900">✦</div><h2 class="font-heading text-xl font-bold">' + title + '</h2><p class="mt-2 text-gray-500">تم تجهيز مسار هذه الوحدة، وسيتم استكمال وظائفها في المرحلة المخصصة لها.</p></div></section>';
    HJ.components.header.mount(root.querySelector('#page-header'), ctx.user, 'compact');
    return () => {};
  }
  HJ.pages.finance = { id: 'finance', routes: ['/finance'], roles: [R.ADMIN, R.STUDENT, R.PARENT], titleKey: 'finance.title', mount };
  HJ.router.register(HJ.pages.finance);
})(window.HJ);
