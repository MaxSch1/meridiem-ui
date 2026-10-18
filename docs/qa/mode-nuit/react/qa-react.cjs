// QA du kit React, mode nuit : jour identique (avant/après), nuit, sous-menu Apparence, redessin des canvas, console.
// Usage : node qa-react.cjs <dossier de sortie>  (build d'avant servi sur 8793, build d'après sur 8794)
const { chromium } = require('/Users/maximeschifflers/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const AV = 'http://127.0.0.1:8793/index.html', AP = 'http://127.0.0.1:8794/index.html';
const res = { errs: {} };
async function open(b, url, hash, vw, theme, scheme, tag) {
  const ctx = await b.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: scheme || 'light' });
  if (theme) await ctx.addInitScript(t => { try { localStorage.setItem('olympe-theme', t); } catch (e) { void e } }, theme);
  const p = await ctx.newPage(); const key = `${hash}-${vw}-${theme || 'jour'}-${url === AV ? 'avant' : 'apres'}${tag ? '-' + tag : ''}`; res.errs[key] = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') res.errs[key].push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => res.errs[key].push('pageerror: ' + e.message));
  await p.goto(url + '#' + hash, { waitUntil: 'load' });
  await p.addStyleTag({ content: '*{caret-color:transparent!important} nav[aria-label="Maquettes"]{visibility:hidden}' });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500);
  return p;
}
const canvasPrint = p => p.evaluate(() => [...document.querySelectorAll('canvas')].map(c => { try { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) >>> 0; return h; } catch (e) { return String(e) } }));
(async () => {
  const b = await chromium.launch();
  // 1. Jour : avant / après, mêmes conditions
  for (const hash of ['platform', 'landing', 'kit']) for (const vw of [1440, 390]) for (const [nom, url] of [['avant', AV], ['apres', AP]]) {
    const p = await open(b, url, hash, vw);
    await p.screenshot({ path: path.join(OUT, `${hash}-jour-${nom}-${vw}.png`), fullPage: true });
    await p.context().close();
  }
  // 2. Nuit
  for (const hash of ['platform', 'landing', 'kit']) for (const vw of [1440, 390]) {
    const p = await open(b, AP, hash, vw, 'dark');
    res[`theme-${hash}-${vw}`] = await p.evaluate(() => ({ attr: document.documentElement.getAttribute('data-theme'), dark: document.documentElement.classList.contains('dark'), bg: getComputedStyle(document.body).backgroundColor }));
    await p.screenshot({ path: path.join(OUT, `${hash}-nuit-${vw}.png`), fullPage: true });
    await p.context().close();
  }
  // 3. Système en sombre, choix « Système »
  { const p = await open(b, AP, 'platform', 1440, 'auto', 'dark');
    res['systeme-sombre'] = await p.evaluate(() => ({ attr: document.documentElement.getAttribute('data-theme'), dark: document.documentElement.classList.contains('dark'), bg: getComputedStyle(document.body).backgroundColor }));
    await p.screenshot({ path: path.join(OUT, 'platform-systeme-sombre-1440.png') }); await p.context().close(); }
  // 4. Sous-menu Apparence : ouverture, choix Nuit, toast, redessin des canvas, retour au jour
  { const p = await open(b, AP, 'platform', 1440, null, null, 'parcours');
    const before = await canvasPrint(p);
    await p.getByRole('button', { name: /Julie Remacle/ }).click(); await p.waitForTimeout(300);
    await p.getByRole('menuitem', { name: /Apparence/ }).hover(); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, 'sous-menu-apparence-jour.png') });
    res['sous-menu-items'] = await p.getByRole('menuitemradio').allInnerTexts();
    res['sous-menu-coche-jour'] = await p.locator('[role=menuitemradio][aria-checked=true]').innerText();
    await p.getByRole('menuitemradio', { name: 'Nuit' }).click(); await p.waitForTimeout(1200);
    res['apres-clic-nuit'] = await p.evaluate(() => ({ attr: document.documentElement.getAttribute('data-theme'), dark: document.documentElement.classList.contains('dark'), stored: localStorage.getItem('olympe-theme'), cookie: document.cookie, toast: [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText) }));
    const after = await canvasPrint(p);
    res['canvas-redessines'] = before.map((h, i) => h !== after[i]);
    await p.screenshot({ path: path.join(OUT, 'clic-nuit-toast.png') });
    await p.getByRole('button', { name: /Julie Remacle/ }).click(); await p.waitForTimeout(300);
    await p.getByRole('menuitem', { name: /Apparence/ }).hover(); await p.waitForTimeout(400);
    res['valeur-affichee-nuit'] = await p.getByRole('menuitem', { name: /Apparence/ }).innerText();
    await p.screenshot({ path: path.join(OUT, 'sous-menu-apparence-nuit.png') });
    // clavier : focus sur « Apparence », flèche droite ouvre le sous-menu et va sur une option, flèche gauche le referme
    await p.mouse.move(700, 300); await p.waitForTimeout(400);
    await p.getByRole('menuitem', { name: /Apparence/ }).focus(); await p.waitForTimeout(200);
    await p.keyboard.press('ArrowRight'); await p.waitForTimeout(400);
    res['clavier-droite-ouvre'] = { options: await p.getByRole('menuitemradio').count(), focus: await p.evaluate(() => document.activeElement && document.activeElement.innerText) };
    await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(400);
    res['clavier-gauche-ferme'] = { options: await p.getByRole('menuitemradio').count(), focus: await p.evaluate(() => document.activeElement && document.activeElement.innerText) };
    await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    res['echap-ferme'] = await p.getByRole('menu').count() === 0;
    await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(800);
    res['rechargement-garde-nuit'] = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await p.getByRole('button', { name: /Julie Remacle/ }).click(); await p.waitForTimeout(300);
    await p.getByRole('menuitem', { name: /Apparence/ }).click(); await p.waitForTimeout(300);
    await p.getByRole('menuitemradio', { name: 'Jour' }).click(); await p.waitForTimeout(800);
    res['retour-jour'] = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await p.context().close(); }
  // 5. Téléphone : sous-menu ouvert, nuit
  { const p = await open(b, AP, 'platform', 390, 'dark');
    await p.getByRole('button', { name: /Basculer|Toggle Sidebar/i }).first().click().catch(() => {}); await p.waitForTimeout(500);
    await p.getByRole('button', { name: /Julie Remacle/ }).click(); await p.waitForTimeout(300);
    await p.getByRole('menuitem', { name: /Apparence/ }).click(); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, 'sous-menu-apparence-nuit-390.png') });
    res['telephone-options-en-place'] = await p.evaluate(() => [...document.querySelectorAll('[role=menuitemradio]')].map(e => { const r = e.getBoundingClientRect(); return e.innerText + ' ' + Math.round(r.left) + '-' + Math.round(r.right); }));
    await p.getByRole('menuitemradio', { name: 'Système' }).click(); await p.waitForTimeout(500);
    res['telephone-choix-systeme'] = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await p.context().close(); }
  // 6. Kit : sous-menu du menu du compte (classique), nuit
  { const p = await open(b, AP, 'kit', 1440, 'dark');
    const btn = p.locator('#menus').getByRole('button', { name: /Julie Remacle/ });
    await btn.scrollIntoViewIfNeeded(); await btn.click(); await p.waitForTimeout(300);
    await p.getByRole('menuitem', { name: /Apparence/ }).hover(); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, 'kit-sous-menu-apparence-nuit.png') }); await p.context().close(); }
  // 7. Visuels de marque de nuit (gros plan)
  { const p = await open(b, AP, 'kit', 1440, 'dark');
    const v = p.locator('#visuels'); await v.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
    await v.screenshot({ path: path.join(OUT, 'kit-visuels-nuit.png') });
    const s = p.locator('#sections'); await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
    await s.screenshot({ path: path.join(OUT, 'kit-sections-nuit.png') });
    res['logo-nuit'] = await p.evaluate(() => [...document.querySelectorAll('img[alt=Meridiem]')].filter(i => i.offsetParent).map(i => i.src.slice(0, 40) + '… ' + i.naturalWidth + 'x' + i.naturalHeight + ' rendu ' + i.width + 'x' + i.height));
    await p.context().close(); }
  { const p = await open(b, AP, 'landing', 1440, 'dark');
    res['landing-logos-nuit'] = await p.evaluate(() => [...document.querySelectorAll('img[alt=Meridiem]')].filter(i => i.offsetParent).map(i => ({ w: i.width, h: i.height, nat: (i.naturalWidth / i.naturalHeight).toFixed(2), rendu: (i.width / i.height).toFixed(2), filter: getComputedStyle(i).filter })));
    await p.context().close(); }
  await b.close();
  fs.writeFileSync(path.join(OUT, 'resultats.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1));
})();
