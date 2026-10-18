// Jour inchangé, preuve par les styles calculés : chaque élément visible des écrans #platform, #landing, #kit,
// build d'avant (8793) contre build d'après (8794), plus deux captures successives du build d'avant (bruit des animations).
const { chromium } = require('/Users/maximeschifflers/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
const PROPS = ['color', 'background-color', 'background-image', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'box-shadow', 'outline-color', 'fill', 'stroke', 'stop-color', 'opacity', 'filter', 'display', 'visibility', 'font-family', 'font-size', 'font-weight', 'width', 'height'];
async function grab(b, url, hash, vw) {
  const ctx = await b.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(url + '#' + hash, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2000);
  const out = await p.evaluate(PROPS => {
    const r = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('nav[aria-label="Maquettes"]')) continue;
      const cs = getComputedStyle(el); if (cs.display === 'none') continue;
      const tag = el.tagName.toLowerCase() + (el.getAttribute('data-slot') ? '[' + el.getAttribute('data-slot') + ']' : '');
      r.push({ tag, s: PROPS.map(k => cs.getPropertyValue(k)).join('|'), src: el.tagName === 'IMG' ? el.currentSrc.slice(0, 60) : '' });
    }
    return r;
  }, PROPS);
  await ctx.close(); return out;
}
(async () => {
  const b = await chromium.launch(); const res = {};
  for (const hash of ['platform', 'landing', 'kit']) for (const vw of [1440, 390]) {
    const a = await grab(b, 'http://127.0.0.1:8793/index.html', hash, vw), c = await grab(b, 'http://127.0.0.1:8794/index.html', hash, vw);
    const diffs = [];
    for (let i = 0; i < Math.max(a.length, c.length); i++) {
      if (!a[i] || !c[i] || a[i].s !== c[i].s || a[i].src !== c[i].src || a[i].tag !== c[i].tag) diffs.push({ i, avant: a[i] && a[i].tag, apres: c[i] && c[i].tag, detail: a[i] && c[i] ? PROPS.filter((k, j) => a[i].s.split('|')[j] !== c[i].s.split('|')[j]).map(k => k + ': ' + a[i].s.split('|')[PROPS.indexOf(k)] + ' -> ' + c[i].s.split('|')[PROPS.indexOf(k)]) : null });
    }
    res[hash + '-' + vw] = { elements: [a.length, c.length], differents: diffs.length, exemples: diffs.slice(0, 8) };
  }
  await b.close(); console.log(JSON.stringify(res, null, 1));
})();
