'use strict';
const config = window.EDUSTART || {};
const lang = document.documentElement.lang;
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() {
  const returnFocus = nav.contains(document.activeElement) && getComputedStyle(menu).display !== 'none';
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
if (config.brand) document.querySelectorAll('[data-brand]').forEach(el => el.textContent = config.brand);
for (const key of ['address', 'hours']) if (config[key]?.[lang]) document.querySelectorAll(`[data-${key}]`).forEach(el => el.textContent = config[key][lang]);
if (config.demo === false) document.querySelectorAll('[data-demo]').forEach(el => el.hidden = true);
const dialog = document.querySelector('dialog');
dialog.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const items = [...dialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
  const first = items[0], last = items[items.length - 1];
  if (!first) { e.preventDefault(); return; }
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
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
