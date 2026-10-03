'use strict';
const config = window.EDUSTART || {};
const lang = document.documentElement.lang;
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
if (config.brand) document.querySelectorAll('[data-brand]').forEach(el => el.textContent = config.brand);
for (const key of ['address', 'hours']) if (config[key]?.[lang]) document.querySelectorAll(`[data-${key}]`).forEach(el => el.textContent = config[key][lang]);
if (config.demo === false) document.querySelectorAll('[data-demo]').forEach(el => el.hidden = true);
const dialog = document.querySelector('dialog');
document.querySelector('[data-close]').addEventListener('click', () => dialog.close());
function targetFor(kind) {
  if (kind === 'telegram' && /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(config.telegram || '')) return `https://t.me/${config.telegram}`;
  if (kind === 'phone' && /^\+[1-9]\d{7,14}$/.test(config.phone || '')) return `tel:${config.phone}`;
  if (kind === 'map') { try { const u = new URL(config.map); if (u.protocol === 'https:') return u.href; } catch (_) {} }
  return null;
}
document.querySelectorAll('[data-contact]').forEach(a => {
  const target = config.demo === false ? targetFor(a.dataset.contact) : null;
  if (target) { a.href = target; if (!target.startsWith('tel:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } }
  else a.addEventListener('click', e => { e.preventDefault(); dialog.showModal(); });
});
