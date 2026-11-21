(function (HJ) {
  'use strict';
  const definitions = [];
  let activeDispose = null;
  function register(page) {
    if (!page || !page.id || !Array.isArray(page.routes)) throw new Error('Invalid page definition');
    if (definitions.some((item) => item.id === page.id)) throw new Error('Duplicate page');
    definitions.push(page);
  }
  function parse() {
    const raw = location.hash.replace(/^#/, '') || '/dashboard';
    const [path, queryString] = raw.split('?');
    const query = Object.fromEntries(new URLSearchParams(queryString || ''));
    for (const page of definitions) {
      for (const pattern of page.routes) {
        const names = [];
        const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, (part) => { names.push(part.slice(1)); return '([^/]+)'; }) + '$');
        const match = path.match(regex);
        if (match) return { path, params: Object.fromEntries(names.map((name, index) => [name, decodeURIComponent(match[index + 1])])), query, page };
      }
    }
    return { path, params: {}, query, page: null };
  }
  function go(path, options) {
    const opts = options || {};
    const query = opts.query ? '?' + new URLSearchParams(opts.query).toString() : '';
    const hash = '#' + path + query;
    if (opts.replace) location.replace(hash); else location.hash = hash;
  }
  function href(pattern, params, query) {
    let path = pattern;
    Object.keys(params || {}).forEach((key) => { path = path.replace(':' + key, encodeURIComponent(params[key])); });
    return '#' + path + (query ? '?' + new URLSearchParams(query).toString() : '');
  }
  function replaceQuery(patch) {
    const currentRoute = current();
    go(currentRoute.path, { replace: true, query: Object.assign({}, currentRoute.query, patch) });
  }
  function current() { return parse(); }
  function back() { history.back(); }
  function render() {
    const route = parse();
    const user = HJ.auth.current();
    if (!route.path || route.path === '/') return go(user ? '/dashboard' : '/login', { replace: true });
    if (!user && route.path !== '/login') return go('/login', { replace: true });
    if (user && route.path === '/login') return go('/dashboard', { replace: true });
    if (!route.page) {
      const login = definitions.find((item) => item.id === 'login');
      const dashboard = definitions.find((item) => item.id === 'dashboard');
      return route.path === '/login' ? mount(login, route) : mount(dashboard, route);
    }
    if (user && route.page.id !== 'login' && route.page.roles && !route.page.roles.includes(user.role)) return go('/forbidden', { replace: true });
    mount(route.page, route);
  }
  function mount(page, route) {
    if (!page) return;
    HJ.charts.destroyAll();
    if (activeDispose) activeDispose();
    const main = document.getElementById('app-main');
    if (page.id === 'login') {
      document.getElementById('login-root').hidden = false;
      document.getElementById('app-shell').hidden = true;
      activeDispose = page.mount({ root: document.getElementById('login-root'), user: null, path: route.path, params: route.params, query: route.query }) || null;
    } else {
      document.getElementById('login-root').hidden = true;
      document.getElementById('app-shell').hidden = false;
      main.innerHTML = '';
      main.classList.remove('page-enter'); void main.offsetWidth; main.classList.add('page-enter');
      activeDispose = page.mount({ root: main, user: HJ.auth.current(), path: route.path, params: route.params, query: route.query }) || null;
    }
    document.title = (HJ.t(page.titleKey, page.id) + ' — ' + HJ.t('common.school'));
    HJ.events.emit(HJ.config.EVENTS.ROUTE_CHANGED, { path: route.path, page: page.id });
  }
  function start() { window.addEventListener('hashchange', render); render(); }
  HJ.router = { register, start, go, href, replaceQuery, current, back };
})(window.HJ);
