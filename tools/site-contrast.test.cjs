'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// WCAG 2.2 SC 1.4.3: normal-sized text requires at least 4.5:1, without rounding.
// https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
const css = fs.readFileSync(path.join(__dirname, '../site/styles.css'), 'utf8');
function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255);
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear.reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

for (const [name, variable] of [['navigation links', 'paper'], ['contact map link', 'lime']]) {
  test(`${name} retain normal-text contrast while hovered`, () => {
    const foreground = css.match(/nav a:hover\s*,\s*\.text-link:hover\s*\{[^}]*color:\s*(#[0-9a-f]{6})/i)?.[1];
    const background = css.match(new RegExp(`--${variable}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
    assert.ok(foreground && background, 'Expected hover and background colors must be declared');
    const [dark, light] = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
    const ratio = (light + 0.05) / (dark + 0.05);
    assert.ok(ratio >= 4.5, `${name}: contrast ${ratio.toFixed(3)}:1 is below 4.5:1`);
  });
}
