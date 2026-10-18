// QA des pastilles de jour : captures avant/après (jour, nuit) et contraste du texte de chaque pastille.
// PLAYWRIGHT=<module> node qa.cjs <sortie> ; avant servi sur 8793, après sur 8794 (racine du dépôt, après npm run build:all).
// Comparaison au pixel : toiles masquées et animations figées (sinon elles bougent d une capture à l autre).
const { chromium } = require(process.env.PLAYWRIGHT);
const fs = require('fs'), path = require('path');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const PAGES = [['demo', '/vanilla/demo.html', ''], ['platform', '/dist/index.html', '#platform'], ['landing', '/dist/index.html', '#landing'], ['kit', '/dist/index.html', '#kit']];
const scan = () => {
  const parse = s => { let m = s.match(/rgba?\(([^)]+)\)/); if (m) { const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0] / 255, p[1] / 255, p[2] / 255, p[3] === undefined ? 1 : p[3]]; }
    m = s.match(/color\(srgb ([^)]+)\)/); if (m) { const p = m[1].split(/[ /]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; } return null; };
  const lin = c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const L = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const over = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  const bgOf = el => { const layers = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; } } let r = [1, 1, 1, 1]; for (let i = layers.length - 1; i >= 0; i--) r = over(layers[i], r); return r; };
  const els = [...document.querySelectorAll('.m-badge, [data-slot="badge"]')].filter(e => e.offsetParent !== null && e.textContent.trim());
  return els.map(e => { const fg = parse(getComputedStyle(e).color), bg = bgOf(e); const t = over(fg, bg); const a = L(t), b = L(bg);
    return { texte: e.textContent.trim().slice(0, 30), classe: (e.className.baseVal ?? e.className).slice(0, 60), couleur: getComputedStyle(e).color, ratio: Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100 }; });
};
(async () => {
  const b = await chromium.launch(); const res = { contrastes: {}, erreurs: {} };
  for (const [nom, chemin, hash] of PAGES) for (const theme of ['jour', 'nuit']) for (const [cote, port] of [['avant', 8793], ['apres', 8794]]) for (const vw of [1440, 390]) {
    const ctx = await b.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    if (theme === 'nuit') await ctx.addInitScript(() => { try { localStorage.setItem('olympe-theme', 'dark'); } catch (e) { void e } });
    const p = await ctx.newPage(); const k = `${nom}-${theme}-${cote}-${vw}`; res.erreurs[k] = [];
    p.on('console', m => { if (m.type() === 'error') res.erreurs[k].push(m.text()); }); p.on('pageerror', e => res.erreurs[k].push(e.message));
    await p.goto(`http://127.0.0.1:${port}${chemin}${hash}`, { waitUntil: 'load' });
    if (theme === 'nuit') await p.evaluate(() => { document.documentElement.setAttribute('data-theme', 'dark'); document.documentElement.classList.add('dark'); if (window.MUI && MUI.retheme) MUI.retheme(); });
    await p.addStyleTag({ content: '*{caret-color:transparent!important} nav[aria-label="Maquettes"]{visibility:hidden} canvas{visibility:hidden!important} *,*::before,*::after{animation:none!important;transition:none!important}' });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500);
    await p.screenshot({ path: path.join(OUT, `${k}.png`), fullPage: true });
    if (vw === 1440) res.contrastes[k] = await p.evaluate(scan);
    res.rects = res.rects || {}; res.rects[k] = await p.evaluate(() => [...document.querySelectorAll('.m-badge, [data-slot="badge"]')].filter(e => e.offsetParent !== null).map(e => { const r = e.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.right + scrollX, r.bottom + scrollY]; }));
    await ctx.close();
  }
  await b.close(); fs.writeFileSync(path.join(OUT, 'resultats.json'), JSON.stringify(res, null, 1));
  for (const [k, v] of Object.entries(res.contrastes)) { const m = v.length ? Math.min(...v.map(x => x.ratio)) : null; const sous = v.filter(x => x.ratio < 4.5).length; console.log(k.padEnd(26), 'pastilles', String(v.length).padStart(3), ' min', m, ' sous 4,5 :', sous); }
  const errs = Object.entries(res.erreurs).filter(([, v]) => v.length); console.log('erreurs console :', errs.length ? JSON.stringify(errs).slice(0, 600) : 'aucune');
})();
