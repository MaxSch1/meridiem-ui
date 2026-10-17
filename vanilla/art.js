/* Moteur de visuels Meridiem sans module (window.MeridiemArt). Généré par scripts/build-vanilla.mjs depuis src/lib/meridiem/art.js. */
(function () {
/* Meridiem Art : visuels génératifs de la marque, calculés sur canvas (aucune image externe, donc libres de droits).
   - MeridiemArt.render(canvas, opts)   paysage « soleil de midi » : mode 'dither' (trame d'encre) ou 'paint' (ciel peint)
       opts : palette (sombre -> clair), seed, sun {x,y,r}, sunColor, cell, gamma, contrast, colors {...}, temple {x,y,w,h}
   - MeridiemArt.dots(canvas, opts)     champ de points animé (variante de marque, chargements)
   - MeridiemArt.dotChart(canvas, opts) graphique en points (barres faites de points), animé à l'apparition
   Respecte prefers-reduced-motion : une seule image fixe dans ce cas.
   Couleurs : hexadécimal, ou variable CSS « var(--m-primary) » lue sur le canvas au moment du rendu
   (le mode nuit change ces variables ; relancer le rendu après un changement de thème). */
  // Garde SSR : ce module est aussi évalué côté serveur dans une app Next (composants client pré-rendus).
  const reduced = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }
  function makeNoise(seed) {
    const r = rng(seed), p = new Uint8Array(512), g = [];
    for (let i = 0; i < 256; i++) { p[i] = i; const a = r() * Math.PI * 2; g.push([Math.cos(a), Math.sin(a)]); }
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 256; i++) p[i + 256] = p[i];
    const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    function n2(x, y) {
      const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255, xf = x - Math.floor(x), yf = y - Math.floor(y);
      const d = (h, dx, dy) => { const v = g[p[h]]; return v[0] * dx + v[1] * dy; };
      const u = fade(xf), v = fade(yf);
      const a = d(xi + p[yi], xf, yf), b = d(xi + 1 + p[yi], xf - 1, yf);
      const c = d(xi + p[yi + 1], xf, yf - 1), e = d(xi + 1 + p[yi + 1], xf - 1, yf - 1);
      return (a + u * (b - a)) + v * ((c + u * (e - c)) - (a + u * (b - a)));
    }
    function fbm(x, y, oct) { let s = 0, amp = 0.5, f = 1; for (let i = 0; i < (oct || 5); i++) { s += amp * n2(x * f, y * f); f *= 2; amp *= 0.5; } return s; }
    fbm.ridged = function (x, y, oct) { let s = 0, amp = 0.55, f = 1; for (let i = 0; i < (oct || 5); i++) { const v = 1 - Math.abs(n2(x * f, y * f) * 1.6); s += amp * v * v; f *= 2.1; amp *= 0.45; } return s; };
    fbm.n2 = n2;
    return fbm;
  }
  const BAYER = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];
  function hex(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };

  /* Temple antique (stylobate, colonnes cannelées, entablement, fronton), en luminance. */
  function temple(T, x, y) {
    const u = (x - (T.x - T.w / 2)) / T.w, v = (T.y - y) / T.h;
    if (u < -0.05 || u > 1.05 || v < 0 || v > 1) return null;
    if (v < 0.09) { const step = Math.floor(v / 0.03); const inset = 0.05 - step * 0.018; if (u < -inset || u > 1 + inset) return null; return step % 2 ? 0.74 : 0.93; }
    if (u < 0 || u > 1) return null;
    if (v < 0.68) {
      const n = T.columns || 8, f = (u * n) % 1, col = f > 0.18 && f < 0.82;
      if (!col) return 0.2 + 0.08 * (1 - v);
      const k = (f - 0.18) / 0.64; const flute = 0.05 * Math.cos(k * Math.PI * 8);
      return clamp(0.97 - 0.6 * Math.pow(k, 1.7) + flute);
    }
    if (v < 0.82) { if (v > 0.745 && v < 0.762) return 0.5; return 0.9; }
    const half = (1 - (v - 0.82) / 0.18) * 0.52;
    if (Math.abs(u - 0.5) > half + 0.02) return null;
    if (Math.abs(u - 0.5) > half - 0.012 || v < 0.834) return 0.55;
    return 0.84;
  }

  function scene(o) {
    const N = makeNoise(o.seed || 7), sun = o.sun || { x: 0.68, y: 0.22, r: 0.075 };
    const col = o.colors || {};
    const C = {
      skyTop: hex(col.skyTop || '#3d6fd6'), skyLow: hex(col.skyLow || '#cfe0f5'), cloud: hex(col.cloud || '#ffffff'),
      far: hex(col.far || '#8fa6c9'), mid: hex(col.mid || '#5f8f63'), near: hex(col.near || '#3f6b3c'), field: hex(col.field || '#7aa35a'),
      sun: hex(col.sun || '#fff6dc'), marble: hex(col.marble || '#f3efe6')
    };
    const horizon = o.horizon || 0.62, relief = o.relief == null ? 1 : o.relief;
    return function (x, y, aspect) {
      const t = clamp(y / horizon);
      let lum = 0.55 + 0.4 * Math.pow(t, 1.4);
      let c = mix(C.skyTop, C.skyLow, Math.pow(t, 1.3));
      const dx = (x - sun.x) * aspect, dy = y - sun.y, d = Math.sqrt(dx * dx + dy * dy);
      const halo = Math.exp(-d * d / (sun.r * sun.r * 9));
      lum += 0.25 * halo; c = mix(c, C.sun, 0.45 * halo);
      const inSun = d < sun.r;
      if (inSun) { lum = 1; c = C.sun; }
      const cl = N(x * 3.2 * aspect, y * 7 + 3, 6);
      const band = smooth(0.0, 0.18, y) * (1 - smooth(horizon - 0.18, horizon - 0.02, y));
      const cloud = smooth(0.05, 0.32, cl + 0.12 * Math.sin(y * 12)) * band * (o.clouds == null ? 1 : o.clouds);
      if (!inSun) {
        const under = smooth(0.0, 0.25, N(x * 3.2 * aspect, y * 7 + 3.06, 6) - cl + 0.05);
        lum = lum + (0.98 - lum) * cloud * 0.9; c = mix(c, mix(C.cloud, C.skyLow, 0.35 * under), cloud * 0.92);
      }
      const ridge = (s, base, amp, f, oct) => base - amp * relief * N.ridged(x * f * aspect + s, s * 0.37, oct);
      const farY = ridge(11, horizon + 0.06, 0.26, 0.9, 5);
      const midY = ridge(23, horizon + 0.17, 0.14, 0.7, 4);
      const nearY = ridge(37, horizon + 0.3, 0.1, 0.5, 3);
      if (y > farY) { const k = smooth(farY, farY + 0.25, y); lum = 0.62 - 0.1 * k + 0.05 * N(x * 30, y * 30, 2); c = mix(C.far, C.mid, k * 0.3); }
      if (y > midY) { const k = smooth(midY, midY + 0.2, y); lum = 0.46 - 0.08 * k + 0.07 * N(x * 40, y * 40, 3); c = mix(C.mid, C.near, k * 0.5); }
      if (y > nearY) { const k = smooth(nearY, 1, y); const tex = N(x * 90, y * 160, 3); lum = 0.34 - 0.16 * k + 0.12 * tex; c = mix(C.field, C.near, k * 0.8 + tex * 0.2); }
      if (o.temple) { const tl = temple(o.temple, x, y); if (tl != null) { lum = tl; c = mix(C.marble, C.far, (1 - tl) * 0.8); } }
      return [clamp(lum), c, inSun && y < farY];
    };
  }

  /* Couleur lue sur le canvas : « var(--x) » ou « var(--x, repli) » devient la valeur calculée de la
     variable, normalisée en #rrggbb par un contexte 2D (accepte aussi rgb() et les noms CSS). */
  let probe = null;
  function color(canvas, c) {
    if (typeof c !== 'string' || c.indexOf('var(') !== 0 || typeof getComputedStyle === 'undefined') return c;
    const m = /^var\(\s*(--[\w-]+)\s*(?:,\s*(.+?))?\s*\)$/.exec(c);
    if (!m) return c;
    const v = getComputedStyle(canvas).getPropertyValue(m[1]).trim() || (m[2] || '').trim();
    if (!v) return c;
    if (!probe) probe = document.createElement('canvas').getContext('2d');
    probe.fillStyle = '#000'; probe.fillStyle = v;
    return probe.fillStyle;
  }
  function size(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth || canvas.width, H = canvas.clientHeight || canvas.height;
    canvas.width = Math.max(1, Math.round(W * dpr)); canvas.height = Math.max(1, Math.round(H * dpr));
    return dpr;
  }

  function render(canvas, o) {
    o = o || {};
    if (canvas._stop) canvas._stop();
    const dpr = size(canvas), ctx = canvas.getContext('2d');
    const cell = Math.max(1, Math.round((o.cell || 3) * dpr));
    const w = Math.ceil(canvas.width / cell), h = Math.ceil(canvas.height / cell);
    const off = document.createElement('canvas'); off.width = w; off.height = h;
    const octx = off.getContext('2d'), img = octx.createImageData(w, h);
    const f = scene(o), aspect = w / h;
    const pal = (o.palette || ['#1d2a6b', '#5b74c9', '#f3efe6']).map(c => hex(color(canvas, c)));
    const levels = pal.length - 1, gamma = o.gamma || 1, contrast = o.contrast || 1, sunC = o.sunColor ? hex(color(canvas, o.sunColor)) : null;
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        const r = f(i / w, j / h, aspect), k = (j * w + i) * 4; let rgb;
        if (o.mode === 'paint') {
          const grain = (BAYER[(j & 7) * 8 + (i & 7)] / 64 - 0.5) * 6;
          rgb = [r[1][0] + grain, r[1][1] + grain, r[1][2] + grain];
        } else {
          const L = Math.pow(clamp((r[0] - 0.5) * contrast + 0.5), gamma) * levels;
          const base = Math.floor(L), frac = L - base, th = (BAYER[(j & 7) * 8 + (i & 7)] + 0.5) / 64;
          rgb = (sunC && r[2]) ? sunC : pal[Math.min(levels, base + (frac > th ? 1 : 0))];
        }
        img.data[k] = rgb[0]; img.data[k + 1] = rgb[1]; img.data[k + 2] = rgb[2]; img.data[k + 3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = o.mode === 'paint';
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
  }

  /* Boucle d'animation ; une seule image si l'utilisateur a demandé moins d'animations. */
  function loop(canvas, draw) {
    if (canvas._stop) canvas._stop();
    let raf = 0, alive = true; const t0 = performance.now();
    const tick = now => { if (!alive) return; draw(Math.max(0, (now - t0) / 1000)); if (!reduced) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    canvas._stop = () => { alive = false; cancelAnimationFrame(raf); };
  }

  /* Champ de points : la taille de chaque point suit un bruit qui dérive lentement, avec une onde autour d'un foyer « soleil ». */
  function dots(canvas, o) {
    o = o || {};
    const dpr = size(canvas), ctx = canvas.getContext('2d'), N = makeNoise(o.seed || 3);
    const gap = (o.gap || 9) * dpr, rmax = gap * (o.fill || 0.42);
    const ink = color(canvas, o.color || '#1b2a8a'), acc = o.accent ? color(canvas, o.accent) : null, bg = o.background ? color(canvas, o.background) : null;
    const fx = o.focus ? o.focus.x : 0.7, fy = o.focus ? o.focus.y : 0.35, speed = o.speed || 0.12;
    loop(canvas, t => {
      const W = canvas.width, H = canvas.height;
      if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); } else ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      for (let y = gap / 2; y < H; y += gap) {
        for (let x = gap / 2; x < W; x += gap) {
          const nx = x / W, ny = y / H;
          const dd = Math.hypot((nx - fx) * W / H, ny - fy);
          let v = 0.45 + 0.9 * N.n2(nx * 3.5 + t * speed, ny * 3.5 - t * speed * 0.6) + 0.4 * Math.cos(dd * 14 - t * 1.4) * Math.exp(-dd * 2.2);
          v = clamp(v * (o.gain || 1));
          if (v < 0.08) continue;
          ctx.fillStyle = acc && v > 0.9 ? acc : ink;
          ctx.beginPath(); ctx.arc(x, y, rmax * v, 0, 6.2832); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    });
  }

  /* Graphique en points : chaque barre est une colonne de points ; montée à l'apparition puis légère respiration. */
  function dotChart(canvas, o) {
    const dpr = size(canvas), ctx = canvas.getContext('2d');
    const vals = o.values || [], max = Math.max.apply(null, vals) || 1;
    const gap = (o.gap || 6) * dpr, r = gap * 0.34, ink = color(canvas, o.color || '#111'), acc = o.accent ? color(canvas, o.accent) : ink, dim = o.dim ? color(canvas, o.dim) : ink;
    const hi = o.highlight == null ? vals.length - 1 : o.highlight;
    loop(canvas, t => {
      const W = canvas.width, H = canvas.height; ctx.clearRect(0, 0, W, H);
      const colsPer = Math.max(2, Math.floor(W / gap / vals.length)), rows = Math.floor(H / gap);
      const grow = reduced ? 1 : Math.min(1, t / 1.1), ease = 1 - Math.pow(1 - grow, 3);
      vals.forEach((v, i) => {
        const hgt = Math.round(rows * (v / max) * ease * (1 + (reduced ? 0 : 0.03 * Math.sin(t * 2 + i))));
        for (let c = 0; c < colsPer - 1; c++) {
          const x = (i * colsPer + c) * gap + gap / 2;
          for (let k = 0; k < rows; k++) {
            const y = H - (k * gap + gap / 2), on = k < hgt;
            ctx.fillStyle = on ? (i === hi ? acc : ink) : dim;
            ctx.globalAlpha = on ? 1 : 0.16;
            ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
          }
        }
      });
      ctx.globalAlpha = 1;
    });
  }


  /* Image tramée (la ville du site) : 'dither' = trame de Bayer en pixels, 'halftone' = points dont la taille suit l'ombre.
     L'image « se développe » à l'apparition : le seuil de trame monte de 0 à 1 (reveal, en secondes). */
  function ditherImage(canvas, img, o) {
    o = o || {};
    const dpr = size(canvas), ctx = canvas.getContext('2d');
    const cell = Math.max(1, Math.round((o.cell || 3) * dpr));
    const W = canvas.width, H = canvas.height, w = Math.ceil(W / cell), h = Math.ceil(H / cell);
    // cadrage « cover » avec point focal vertical (focusY : 0 = haut, 1 = bas)
    const ir = img.width / img.height, cr = w / h; let sw = img.width, sh = img.height, sx = 0, sy = 0;
    if (ir > cr) { sw = img.height * cr; sx = (img.width - sw) * (o.focusX == null ? 0.5 : o.focusX); } else { sh = img.width / cr; sy = (img.height - sh) * (o.focusY == null ? 0.5 : o.focusY); }
    const off = document.createElement('canvas'); off.width = w; off.height = h;
    const octx = off.getContext('2d', { willReadFrequently: true }); octx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    const src = octx.getImageData(0, 0, w, h).data, lum = new Float32Array(w * h);
    const gamma = o.gamma || 1, contrast = o.contrast || 1, lift = o.lift || 0;
    for (let i = 0; i < w * h; i++) {
      const L = (0.2126 * src[i * 4] + 0.7152 * src[i * 4 + 1] + 0.0722 * src[i * 4 + 2]) / 255;
      lum[i] = Math.pow(clamp((L - 0.5) * contrast + 0.5 + lift), gamma);
    }
    const pal = (o.palette || ['#4a2c18', '#a8693f', '#e3cdb3', '#fbf9f5']).map(c => hex(color(canvas, c))), levels = pal.length - 1;
    const paper = pal[levels], ink = pal[0];
    const out = ctx.createImageData(w, h);
    const draw = t => {
      const k = reduced || !o.reveal ? 1 : clamp(t / o.reveal), ease = 1 - Math.pow(1 - k, 3);
      if (o.mode === 'halftone') {
        ctx.fillStyle = 'rgb(' + paper.join(',') + ')'; ctx.fillRect(0, 0, W, H);
        for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
          const v = 1 - lum[j * w + i]; if (v < 0.06) continue;
          const lv = Math.min(levels - 1, Math.floor((1 - v) * levels));
          ctx.fillStyle = 'rgb(' + pal[lv].join(',') + ')';
          ctx.beginPath(); ctx.arc(i * cell + cell / 2, j * cell + cell / 2, Math.max(0, cell * 0.55 * Math.sqrt(v) * ease), 0, 6.2832); ctx.fill();
        }
        return;
      }
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        const L = lum[j * w + i] * levels, base = Math.floor(L), frac = L - base;
        const th = (BAYER[(j & 7) * 8 + (i & 7)] + 0.5) / 64;
        let rgb = pal[Math.min(levels, base + (frac > th ? 1 : 0))];
        // apparition : les points passent du papier à leur valeur, de bas en haut
        const gate = ease * 1.25 - (1 - j / h) * 0.25;
        if (th > gate) rgb = paper;
        const q = (j * w + i) * 4; out.data[q] = rgb[0]; out.data[q + 1] = rgb[1]; out.data[q + 2] = rgb[2]; out.data[q + 3] = 255;
      }
      const tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h; tmp.getContext('2d').putImageData(out, 0, 0);
      ctx.imageSmoothingEnabled = false; ctx.drawImage(tmp, 0, 0, W, H);
    };
    if (o.reveal && !reduced) {
      if (canvas._stop) canvas._stop();
      let raf = 0, alive = true; const t0 = performance.now();
      const tick = now => { if (!alive) return; const t = Math.max(0, (now - t0) / 1000); draw(t); if (t < o.reveal) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick); canvas._stop = () => { alive = false; cancelAnimationFrame(raf); };
    } else draw(1e9);
    void ink;
  }

  window.MeridiemArt = { render, dots, dotChart, ditherImage, reduced, color };

})();
