(function (HJ) {
  'use strict';
  function boot(){const bootRoot=document.getElementById('boot-screen');bootRoot.textContent=HJ.t('common.loading');try{HJ.seed.load();HJ.charts.init();const user=HJ.auth.restore();HJ.components.sidebar.mount(document.getElementById('app-sidebar'),user);HJ.components.assistant.mount();if(user){document.getElementById('login-root').hidden=true;document.getElementById('app-shell').hidden=false;}HJ.router.start();HJ.events.on(HJ.config.EVENTS.AUTH_LOGIN,(event)=>HJ.components.sidebar.mount(document.getElementById('app-sidebar'),event.detail.user));bootRoot.remove();}catch(error){bootRoot.textContent='تعذر تشغيل المنصة. يرجى تحديث الصفحة والتأكد من تفعيل التخزين المحلي.';console.error(error);}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})(window.HJ);
