
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/register"
  },
  {
    "renderMode": 2,
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/torneos"
  },
  {
    "renderMode": 2,
    "route": "/equipos"
  },
  {
    "renderMode": 2,
    "route": "/partidas"
  },
  {
    "renderMode": 2,
    "route": "/perfil"
  },
  {
    "renderMode": 2,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 8494, hash: 'f80422fa2f6a355ddea04f53049559af2ba7fa5623804d938240d4f094e52099', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 947, hash: '90a12e80cd62e46378fd10fb5a05677b6ddfb4ce9d24bcbaeb8ecbe9ad308355', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'torneos/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/torneos_index_html.mjs').then(m => m.default)},
    'partidas/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/partidas_index_html.mjs').then(m => m.default)},
    'equipos/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/equipos_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 16555, hash: '49ff2382c62d36164a9fb886b77a3645bd6a84bb7f4cab49c6e88b12c7bb4ca5', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'perfil/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/perfil_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 16407, hash: '8e9f3311fc7c4567b2d90f7e8416e2be065c763d4d63e75e70a812111ba85e6b', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-OYFW422M.css': {size: 8100, hash: 'Qv7leKZnN3g', text: () => import('./assets-chunks/styles-OYFW422M_css.mjs').then(m => m.default)}
  },
};
