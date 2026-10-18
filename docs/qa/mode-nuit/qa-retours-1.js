// QA de la librairie : jour identique (avant/après), nuit, sous-menu Apparence (souris, clavier, téléphone).
const { chromium } = require('/Users/maximeschifflers/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const AV = 'http://127.0.0.1:8791/ui-avant/vanilla/demo.html', AP = 'http://127.0.0.1:8792/vanilla/demo.html';
const res = {};
async function page(b, url, vw, theme, motion) {
  const ctx = await b.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: 1, reducedMotion: motion ? 'no-preference' : 'reduce' });
  if (theme) await ctx.addInitScript(t => { try { localStorage.setItem('olympe-theme', t); } catch (e) {} }, theme);
  const p = await ctx.newPage(); p._errs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') p._errs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => p._errs.push('pageerror: ' + e.message));
  await p.goto(url, { waitUntil: 'load' }); await p.addStyleTag({ content: '*{caret-color:transparent!important}' }); await p.waitForTimeout(1800);
  return p;
}
(async () => {
  const b = await chromium.launch();
  for (const vw of [1440, 390]) {
    for (const [nom, url] of [['avant', AV], ['apres', AP]]) {
      const p = await page(b, url, vw);
      await p.screenshot({ path: path.join(OUT, `demo-jour-${nom}-retours-${vw}.png`), fullPage: true });
      res[`errs-${nom}-${vw}`] = p._errs; await p.context().close();
    }
  }
  // nuit
  for (const vw of [1440, 390]) {
    const p = await page(b, AP, vw, 'dark');
    await p.screenshot({ path: path.join(OUT, `demo-nuit-retours-${vw}.png`), fullPage: vw === 390 });
    res[`errs-nuit-${vw}`] = p._errs; await p.context().close();
  }
  // sous-menu, souris
  {
    const p = await page(b, AP, 1440);
    await p.click('#userbtn'); await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(OUT, 'sous-menu-1-menu-jour.png'), clip: { x: 0, y: 500, width: 600, height: 400 } });
    await p.hover('#um-theme .m-menu-subtrigger'); await p.waitForTimeout(350);
    res.survolOuvre = await p.evaluate(() => document.querySelector('#um-theme .m-submenu').classList.contains('is-open'));
    await p.screenshot({ path: path.join(OUT, 'sous-menu-2-survol-jour.png'), clip: { x: 0, y: 500, width: 600, height: 400 } });
    await p.click('#um-theme [data-value="dark"]'); await p.waitForTimeout(700);
    res.apresClic = await p.evaluate(() => ({ theme: document.documentElement.getAttribute('data-theme'), menuOuvert: document.getElementById('usermenu').classList.contains('is-open'), toast: (document.querySelector('.m-toast') || {}).textContent || '' }));
    await p.screenshot({ path: path.join(OUT, 'sous-menu-3-nuit-toast.png') });
    await p.click('#userbtn'); await p.waitForTimeout(250);
    await p.hover('#um-theme .m-menu-subtrigger'); await p.waitForTimeout(350);
    res.valeur = await p.evaluate(() => ({ v: document.querySelector('#um-theme .m-menu-value').textContent, coche: [...document.querySelectorAll('#um-theme [data-value]')].map(x => x.dataset.value + ':' + x.getAttribute('aria-checked')) }));
    await p.screenshot({ path: path.join(OUT, 'sous-menu-4-survol-nuit.png'), clip: { x: 0, y: 500, width: 600, height: 400 } });
    // clic dehors
    await p.mouse.click(1000, 200); await p.waitForTimeout(250);
    res.clicDehorsFerme = await p.evaluate(() => !document.getElementById('usermenu').classList.contains('is-open') && !document.querySelector('#um-theme .m-submenu').classList.contains('is-open'));
    // clavier
    await p.click('#userbtn'); await p.waitForTimeout(200);
    await p.mouse.move(1000, 200); await p.waitForTimeout(300);
    await p.focus('#um-theme .m-menu-subtrigger'); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(200);
    res.flecheDroite = await p.evaluate(() => ({ ouvert: document.querySelector('#um-theme .m-submenu').classList.contains('is-open'), focus: document.activeElement.dataset.value }));
    await p.keyboard.press('ArrowDown'); res.flecheBas = await p.evaluate(() => document.activeElement.dataset.value);
    await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(200);
    res.flecheGauche = await p.evaluate(() => ({ ouvert: document.querySelector('#um-theme .m-submenu').classList.contains('is-open'), focusTrigger: document.activeElement.classList.contains('m-menu-subtrigger'), menu: document.getElementById('usermenu').classList.contains('is-open') }));
    await p.keyboard.press('ArrowRight'); await p.waitForTimeout(150); await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    res.echap = await p.evaluate(() => ({ menu: document.getElementById('usermenu').classList.contains('is-open'), sous: document.querySelector('#um-theme .m-submenu').classList.contains('is-open') }));
    await p.focus('#um-theme .m-menu-subtrigger'); // menu fermé : rien
    await p.click('#userbtn'); await p.waitForTimeout(150); await p.focus('#um-theme .m-menu-subtrigger'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
    res.entree = await p.evaluate(() => ({ ouvert: document.querySelector('#um-theme .m-submenu').classList.contains('is-open'), focus: document.activeElement.dataset.value }));
    await p.keyboard.press('Enter'); await p.waitForTimeout(300);
    res.entreeChoix = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
    res['errs-souris-clavier'] = p._errs; await p.context().close();
  }
  // téléphone (tactile) : place disponible ?
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    const p = await ctx.newPage(); p._errs = []; p.on('pageerror', e => p._errs.push(e.message));
    await p.goto(AP, { waitUntil: 'load' }); await p.waitForTimeout(1500);
    const vis = await p.evaluate(() => { const r = document.getElementById('userbtn').getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(document.getElementById('userbtn')).visibility !== 'hidden'; });
    res.telBouton = vis;
    if (vis) {
      await p.evaluate(() => document.getElementById('userbtn').scrollIntoView());
      await p.tap('#userbtn'); await p.waitForTimeout(250); await p.tap('#um-theme .m-menu-subtrigger'); await p.waitForTimeout(300);
      res.tel = await p.evaluate(() => ({ place: document.querySelector('#um-theme .m-submenu').getAttribute('data-place'), ouvert: document.querySelector('#um-theme .m-submenu').classList.contains('is-open'), r: JSON.stringify(document.querySelector('#um-theme .m-submenu').getBoundingClientRect()) }));
      await p.screenshot({ path: path.join(OUT, 'sous-menu-5-telephone.png') });
    }
    res['errs-tel'] = p._errs; await ctx.close();
  }
  console.log(JSON.stringify(res, null, 1));
  await b.close();
})();
