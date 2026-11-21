(function (HJ) {
  'use strict';
  const R = HJ.config.ROLES;
  function mount(ctx) {
    const root = ctx.root;
    root.innerHTML = '<div class="login-panel grid bg-white lg:grid-cols-2"><section class="hero-pattern flex flex-col justify-center bg-violet-900 px-7 py-12 text-white md:px-14"><div class="mx-auto w-full max-w-xl"><div class="mb-8 grid h-16 w-16 place-items-center rounded-2xl bg-white/15 font-heading text-3xl font-bold">ح</div><p class="mb-3 text-violet-200">بوابتك الذكية لمتابعة وإدارة الحياة المدرسية</p><h1 class="font-heading text-3xl font-bold leading-relaxed md:text-4xl">مدرسة الحجر الثانوية المشتركة</h1><p class="mt-5 max-w-lg text-violet-100">منصة واحدة تجمع الإدارة المدرسية والمتابعة الأكاديمية في تجربة عربية سهلة.</p><div class="mt-9 grid grid-cols-2 gap-3"><div class="rounded-xl bg-white/10 p-4">◈ <b>مدير المدرسة</b></div><div class="rounded-xl bg-white/10 p-4">▣ <b>مدرس</b></div><div class="rounded-xl bg-white/10 p-4">◎ <b>طالب</b></div><div class="rounded-xl bg-white/10 p-4">⌂ <b>ولي أمر</b></div></div></div></section><section class="flex items-center justify-center px-6 py-12"><div class="w-full max-w-md"><div class="mb-8"><p class="text-sm font-bold text-violet-800">أهلًا بك من جديد</p><h2 class="mt-2 font-heading text-3xl font-bold text-gray-900">' + HJ.t('login.title') + '</h2><p class="mt-2 text-gray-500">' + HJ.t('login.subtitle') + '</p></div><form id="login-form" class="space-y-5"><div><label class="mb-2 block font-medium" for="username">' + HJ.t('login.username') + '</label><input id="username" name="username" autocomplete="username" required class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-700 focus:ring-2 focus:ring-violet-100"></div><div><label class="mb-2 block font-medium" for="password">' + HJ.t('login.password') + '</label><input id="password" name="password" type="password" autocomplete="current-password" required class="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-700 focus:ring-2 focus:ring-violet-100"></div><label class="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" name="remember" class="rounded border-gray-300 text-violet-900"> ' + HJ.t('login.remember') + '</label><p id="login-error" class="hidden text-sm text-red-600" role="alert"></p><button class="w-full rounded-xl bg-violet-900 px-5 py-3 font-bold text-white transition hover:bg-violet-800" type="submit">' + HJ.t('login.submit') + '</button></form><p class="mt-5 text-xs leading-relaxed text-gray-500">' + HJ.t('login.forgot') + '</p><div class="mt-8 border-t border-gray-200 pt-5"><p class="mb-3 text-sm font-bold text-gray-700">' + HJ.t('login.demo') + '</p><div class="grid grid-cols-2 gap-2"><button data-role="admin" class="rounded-xl border border-violet-200 px-3 py-2 text-sm text-violet-900 hover:bg-violet-50">مدير المدرسة</button><button data-role="teacher" class="rounded-xl border border-violet-200 px-3 py-2 text-sm text-violet-900 hover:bg-violet-50">مدرس</button><button data-role="student" class="rounded-xl border border-violet-200 px-3 py-2 text-sm text-violet-900 hover:bg-violet-50">طالب</button><button data-role="parent" class="rounded-xl border border-violet-200 px-3 py-2 text-sm text-violet-900 hover:bg-violet-50">ولي أمر</button></div></div></div></section></div>';
    const form = root.querySelector('#login-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      try {
        await HJ.auth.login(String(data.get('username')).trim(), String(data.get('password')), data.has('remember'));
        HJ.router.go('/dashboard', { replace: true });
      } catch (error) {
        root.querySelector('#login-error').textContent = HJ.t('login.invalid');
        root.querySelector('#login-error').classList.remove('hidden');
      }
    });
    root.querySelectorAll('[data-role]').forEach((button) => button.addEventListener('click', () => {
      try { HJ.auth.quickLogin(button.dataset.role); HJ.router.go('/dashboard', { replace: true }); }
      catch (error) { HJ.ui.handleError(error); }
    }));
  }
  HJ.pages.login = { id: 'login', routes: ['/login'], roles: [R.ADMIN, R.TEACHER, R.STUDENT, R.PARENT], titleKey: 'login.title', mount };
  HJ.router.register(HJ.pages.login);
})(window.HJ);
