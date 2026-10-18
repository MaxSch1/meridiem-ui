/* Meridiem UI sans framework : les blocs du design system Olympe pour les pages HTML/JS simples
   (Command Center, outils internes). Même rendu que la librairie React.
   Dépend de olympe.css, et pour les visuels de marque de art.js (window.MeridiemArt) et icons.js.
   API : window.MUI = { kpi, kpis, iso, bind, area, columns, donut, radial, banner, ctaBand, empty, badge,
                        toast, menu, menuValue, navPill, palette, dialog, actionBar, busy, dotChart, dotField, city,
                        setTheme, theme, retheme, CHART, CHART_HEX }
   Mode nuit : les couleurs sont des variables CSS (olympe.css) ; les visuels sur canvas sont redessinés
   tout seuls quand data-theme change sur <html> ou quand le système passe en sombre (data-theme="auto"). */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var uid = 0;
  function nid(p) { uid += 1; return (p || "m") + uid; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return 1 - Math.pow(1 - clamp(t), 3); }
  function nf(n) { return Number(n).toLocaleString("fr-BE"); }

  /* ======================= Illustrations animées (9) ======================= */
  var C30 = Math.cos(Math.PI / 6);
  function P(x, y, z, s) { return [(x - y) * C30 * s, (x + y) * 0.5 * s - z * s]; }
  function pts(a) { return a.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); }
  function face(points, cls) { return '<polygon points="' + pts(points) + '" class="' + (cls || "mf") + '" stroke-width="1" stroke-linejoin="round"/>'; }
  function box(x0, y0, x1, y1, z, h, s, accentTop) {
    return face([P(x0, y1, z, s), P(x1, y1, z, s), P(x1, y1, z + h, s), P(x0, y1, z + h, s)]) +
      face([P(x1, y0, z, s), P(x1, y1, z, s), P(x1, y1, z + h, s), P(x1, y0, z + h, s)]) +
      face([P(x0, y0, z + h, s), P(x1, y0, z + h, s), P(x1, y1, z + h, s), P(x0, y1, z + h, s)], accentTop ? "ma" : "mf");
  }
  function arc(R, z, a0, a1, n, s) { var o = []; for (var i = 0; i <= n; i++) { var t = a0 + (a1 - a0) * i / n; o.push(P(R * Math.cos(t), R * Math.sin(t), z, s)); } return o; }
  function line(a, b, cls) { return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" class="' + (cls || "ml") + '"/>'; }
  function polar(cx, cy, r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function arcPath(cx, cy, r, a0, a1) { var p0 = polar(cx, cy, r, a0), p1 = polar(cx, cy, r, a1); return "M" + p0[0].toFixed(2) + " " + p0[1].toFixed(2) + " A" + r + " " + r + " 0 " + (a1 - a0 > Math.PI ? 1 : 0) + " 1 " + p1[0].toFixed(2) + " " + p1[1].toFixed(2); }
  function svg(vb, inner) { return '<svg viewBox="' + vb + '" class="m-iso-svg" aria-hidden="true">' + inner + "</svg>"; }

  var ISO = {
    bars: function (k) {
      var s = 9, H = [1.2, 2.1, 1.6, 2.8, 3.8], o = "";
      function kk(i) { return Math.max(0.05, Math.min(1, k * 1.6 - i * 0.15)); }
      o += '<polygon points="' + pts([P(-0.6, -0.6, 0, s), P(7.2, -0.6, 0, s), P(7.2, 1.6, 0, s), P(-0.6, 1.6, 0, s)]) + '" fill="none" class="ml" stroke-dasharray="2 3" opacity=".5"/>';
      H.forEach(function (h, i) { o += box(i * 1.5, 0, i * 1.5 + 1, 1, 0, h * kk(i), s); });
      var last = H.length - 1, top = P(last * 1.5 + 0.5, 0.5, H[last] * kk(last) + 0.55, s);
      o += '<circle cx="' + top[0] + '" cy="' + top[1] + '" r="3.4" class="mdot"/>';
      return svg("-20 -14 84 57", o);
    },
    pie: function (k) {
      var s = 9, R = 3.4, h = 0.8, lift = 0.9 * k, f0 = -Math.PI / 4, f1 = 3 * Math.PI / 4, a0 = -0.35, a1 = 0.9, o = "";
      o += face(arc(R, h, f0, f1, 40, s).concat(arc(R, 0, f1, f0, 40, s)));
      o += face(arc(R, h, 0, Math.PI * 2, 72, s));
      [0.9, 2.3, 3.6, 5.0].forEach(function (t) { o += line(P(0, 0, h, s), P(R * Math.cos(t), R * Math.sin(t), h, s)); });
      o += face(arc(R, h + lift, Math.max(a0, f0), Math.min(a1, f1), 20, s).concat(arc(R, lift, Math.min(a1, f1), Math.max(a0, f0), 20, s)), "ma");
      o += face([P(0, 0, h + lift, s)].concat(arc(R, h + lift, a0, a1, 24, s)), "ma");
      return svg("-40 -31 80 55", o);
    },
    dial: function (k) {
      var s = 9, R = 3.6, h = 0.45, th = -2.3 + k * 2.6, o = "";
      var tip = P(R * 0.78 * Math.cos(th), R * 0.78 * Math.sin(th), h, s);
      o += face(arc(R, h, -Math.PI / 4, 3 * Math.PI / 4, 40, s).concat(arc(R, 0, 3 * Math.PI / 4, -Math.PI / 4, 40, s)));
      o += face(arc(R, h, 0, Math.PI * 2, 72, s));
      for (var i = 0; i < 12; i++) { var t = i / 12 * Math.PI * 2; o += line(P(R * 0.82 * Math.cos(t), R * 0.82 * Math.sin(t), h, s), P(R * 0.95 * Math.cos(t), R * 0.95 * Math.sin(t), h, s)); }
      o += '<polygon points="' + pts([P(0, 0, h, s), P(0.18 * Math.cos(th + 1.57), 0.18 * Math.sin(th + 1.57), h, s), tip]) + '" class="mdot" opacity=".85"/>';
      o += face([P(0, 0, h, s), P(-R * 0.62, 0, h, s), P(0, 0, h + 2.6, s)]);
      o += '<circle cx="' + tip[0] + '" cy="' + tip[1] + '" r="3" class="mdot"/>';
      return svg("-42 -30 84 56", o);
    },
    stack: function (k) {
      var s = 10, n = 4, e = ease(k), gap = 0.18 + 0.75 * e, o = "";
      for (var i = 0; i < n; i++) {
        var z = i * gap, top = i === n - 1, dx = top ? 0.6 * e : 0;
        o += box(-2 + dx, -1.5 - dx, 2 + dx, 1.5 - dx, z, 0.16, s, top && k > 0.4);
        if (top) for (var l = 0; l < 3; l++) o += line(P(-1.3 + dx, -0.9 + l * 0.7 - dx, z + 0.17, s), P(1.3 - l * 0.5 + dx, -0.9 + l * 0.7 - dx, z + 0.17, s), k > 0.4 ? "mlw" : "ml");
      }
      return svg("-33 -50 77 71", o);
    },
    cubes: function (k) {
      var s = 7, V = [[1, 2, 1, 3], [2, 4, 2, 1], [1, 3, 5, 2], [2, 1, 2, 4]], o = "";
      for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) {
        var v = V[y][x], d = (x + y) / 6, hh = 0.25 + (v / 5) * 3 * ease(k * 1.8 - d);
        o += box(x * 1.15, y * 1.15, x * 1.15 + 1, y * 1.15 + 1, 0, hh, s, v === 5 && k > 0.3);
      }
      return svg("-29 -14 58 48", o);
    },
    gauge: function (k, value) {
      value = value == null ? 0.72 : value;
      var a0 = Math.PI, a1 = 2 * Math.PI, v = ease(k) * value, av = a0 + (a1 - a0) * v, n = polar(40, 44, 26, av), o = "";
      o += '<path d="' + arcPath(40, 44, 32, a0, a1) + '" fill="none" class="ml" stroke-width="6" stroke-linecap="round" opacity=".18"/>';
      if (v > 0.005) o += '<path d="' + arcPath(40, 44, 32, a0, av) + '" fill="none" class="mla" stroke-width="6" stroke-linecap="round"/>';
      for (var i = 0; i < 11; i++) { var a = a0 + (a1 - a0) * i / 10, p0 = polar(40, 44, 22, a), p1 = polar(40, 44, i % 5 ? 24 : 20, a); o += line(p0, p1); }
      o += '<line x1="40" y1="44" x2="' + n[0].toFixed(1) + '" y2="' + n[1].toFixed(1) + '" class="mlink" stroke-width="1.5" stroke-linecap="round"/><circle cx="40" cy="44" r="3" class="mink"/>';
      return svg("3 6 74 44", o);
    },
    line: function (k) {
      var Y = [30, 26, 28, 20, 22, 14, 16, 8], d = Y.map(function (y, i) { return (i ? "L" : "M") + (i * 80 / (Y.length - 1)) + " " + y; }).join(" "), len = 130, e = ease(k);
      return svg("-3 4 86 38", '<line x1="0" y1="38" x2="80" y2="38" class="ml" opacity=".3"/>' +
        '<path d="' + d + ' L80 38 L0 38 Z" class="mfa" opacity="' + (0.12 * e).toFixed(3) + '"/>' +
        '<path d="' + d + '" fill="none" class="mla" stroke-width="1.5" stroke-linejoin="round" stroke-dasharray="' + len + '" stroke-dashoffset="' + (len * (1 - Math.max(0.35, e))).toFixed(1) + '"/>' +
        '<circle cx="80" cy="' + Y[Y.length - 1] + '" r="3" class="mdot" opacity="' + (e > 0.95 ? 1 : 0.25) + '"/>');
    },
    envelope: function (k) {
      var e = ease(k), tipY = 26 + 18 * Math.cos(Math.PI * e), letterY = 30 - 22 * e, open = tipY < 26;
      var flap = '<path d="M12 26 L40 ' + tipY.toFixed(2) + ' L68 26 Z" class="' + (open ? "ms" : "mf") + '" stroke-linejoin="round"/>', o = "";
      o += '<rect x="12" y="26" width="56" height="30" rx="2" class="ms"/>';
      if (open) o += flap;
      o += '<rect x="18" y="' + letterY.toFixed(2) + '" width="44" height="30" rx="2" class="mf"/>';
      for (var i = 0; i < 3; i++) o += '<line x1="24" y1="' + (letterY + 7 + i * 6).toFixed(2) + '" x2="' + (i === 2 ? 44 : 56) + '" y2="' + (letterY + 7 + i * 6).toFixed(2) + '" class="' + (i === 0 ? "mla" : "ml") + '" stroke-width="1.5" stroke-linecap="round"/>';
      o += '<path d="M12 26 L40 44 L68 26 L68 56 L12 56 Z" class="mf" stroke-linejoin="round"/><path d="M12 56 L34 40 M68 56 L46 40" class="ml" fill="none"/>';
      if (!open) o += flap;
      return svg("6 2 68 58", o);
    },
    rings: function (k) {
      var R = [[24, 0.82], [17, 0.64], [10, 0.45]], e = ease(k), o = "";
      R.forEach(function (r, i) {
        var c = 2 * Math.PI * r[0];
        o += '<circle cx="32" cy="32" r="' + r[0] + '" fill="none" class="ml" stroke-width="4" opacity=".15"/>';
        o += '<circle cx="32" cy="32" r="' + r[0] + '" fill="none" class="' + (i === 0 ? "mla" : "ml") + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - Math.max(0.04, e * r[1]))).toFixed(1) + '" transform="rotate(-90 32 32)" opacity="' + (i === 0 ? 1 : 0.55 + i * 0.1) + '"/>';
      });
      return svg("4 4 56 56", o);
    },
  };
  var REST = { bars: 1, cubes: 0.55, line: 1, gauge: 1, rings: 1 };
  function iso(kind, k, opt) { return (ISO[kind] || ISO.bars)(k == null ? (REST[kind] || 0) : k, opt); }

  /* Ressort amorti (même sensation que Motion) */
  function spring(el, to, onUpdate) {
    if (el._spr) cancelAnimationFrame(el._spr);
    var x = el._k == null ? to : el._k, v = 0, last = performance.now();
    var stiff = to === 1 ? 110 : 170, damp = to === 1 ? 17 : 26;
    if (reduce) { el._k = to; onUpdate(to); return; }
    function step(now) {
      var dt = Math.min(0.032, (now - last) / 1000); last = now;
      var a = -stiff * (x - to) - damp * v; v += a * dt; x += v * dt;
      el._k = x; onUpdate(x);
      if (Math.abs(x - to) > 0.001 || Math.abs(v) > 0.001) el._spr = requestAnimationFrame(step); else { el._k = to; onUpdate(to); }
    }
    el._spr = requestAnimationFrame(step);
  }

  /* ======================= Carte indicateur ======================= */
  // MUI.kpi({ label, value, note, kind, badge, onclick, tone }) → HTML ; puis MUI.bind(racine)
  function kpi(o) {
    var art = o.kind ? '<div class="m-kpi-art" data-iso="' + o.kind + '"' + (o.gauge != null ? ' data-gauge="' + o.gauge + '"' : "") + ">" + iso(o.kind, null, o.gauge) + "</div>" : "";
    return '<div class="m-card m-kpi' + (o.onclick ? " is-link" : "") + '"' + (o.onclick ? ' onclick="' + esc(o.onclick) + '" role="button" tabindex="0"' : "") + ">" +
      '<div class="m-kpi-top"><span class="m-kpi-label">' + (o.label || "") + "</span>" + (o.badge || "") + "</div>" +
      '<div class="m-kpi-row"><div class="m-kpi-text"><span class="m-kpi-value m-num">' + (o.value == null ? "" : o.value) + "</span>" +
      (o.note ? '<span class="m-kpi-note">' + o.note + "</span>" : "") + "</div>" + art + "</div></div>";
  }
  function bind(root) {
    root = root || document;
    root.querySelectorAll(".m-kpi:not([data-bound])").forEach(function (card) {
      card.setAttribute("data-bound", "1");
      var art = card.querySelector("[data-iso]"); if (!art) return;
      var kind = art.getAttribute("data-iso"), g = art.getAttribute("data-gauge"), rest = REST[kind] || 0;
      art._k = rest;
      var draw = function (k) { art.innerHTML = iso(kind, k, g == null ? undefined : Number(g)); };
      card.addEventListener("mouseenter", function () { if (rest === 1) art._k = 0; spring(art, 1, draw); });
      card.addEventListener("mouseleave", function () { spring(art, rest, draw); });
    });
    root.querySelectorAll("canvas[data-mui-art]:not([data-bound])").forEach(function (cv) {
      cv.setAttribute("data-bound", "1");
      var kind = cv.getAttribute("data-mui-art"), opts = {};
      try { opts = JSON.parse(cv.getAttribute("data-opts") || "{}"); } catch (e) { /* options par défaut */ }
      if (kind === "city") city(cv, opts); else if (kind === "dots") dotField(cv, opts); else if (kind === "dotchart") dotChart(cv, opts);
    });
    if (window.MeridiemIcons) window.MeridiemIcons.hydrate(root);
  }

  /* ======================= Visuels de marque ======================= */
  var CITY_SRC = "https://raw.githubusercontent.com/Meridiem-ai/meridiem-ui/main/public/assets/ville-europe.jpg";
  var cityImg = null;
  function city(cv, o) {
    o = o || {};
    if (!window.MeridiemArt) return;
    var src = o.src || MUI.citySrc || CITY_SRC;
    if (!cityImg || cityImg._src !== src) { cityImg = new Image(); cityImg.crossOrigin = "anonymous"; cityImg._src = src; cityImg.src = src; }
    cv._muiArt = { kind: "city", o: o };
    var go = function () {
      // De nuit, le jeton --m-city-mode vaut « nocturne » : la ville éclairée (masse sourde, lumières chaudes). Le jour ne le pose pas.
      var mode = o.mode || (getComputedStyle(cv).getPropertyValue("--m-city-mode").trim() || "dither");
      var pal = o.palette || (mode === "nocturne" ? ["var(--m-city-1)", "var(--m-city-2)", "var(--m-city-light-1)", "var(--m-city-light-2)", "var(--m-city-light-3)"] : ["var(--m-city-1, #6E4226)", "var(--m-city-2, #B98259)", "var(--m-city-3, #E8D6C0)"]);
      window.MeridiemArt.ditherImage(cv, cityImg, { mode: mode, cell: o.cell || 2, focusY: o.focusY == null ? 0.5 : o.focusY, lift: o.lift == null ? 0.12 : o.lift, contrast: o.contrast || 1.15, reveal: o.reveal == null ? 1.4 : o.reveal, palette: pal.concat([o.paper || "var(--m-card, #FFFFFF)"]) });
    };
    if (cityImg.complete && cityImg.naturalWidth) go(); else cityImg.addEventListener("load", go, { once: true });
  }
  function dotField(cv, o) { cv._muiArt = { kind: "dots", o: o }; if (window.MeridiemArt) window.MeridiemArt.dots(cv, Object.assign({ color: "var(--m-dots, #AA4F13)", accent: "var(--m-dots-accent, #E3CDB3)", gap: 11, alpha: 0.55, focus: { x: 0.82, y: 0.45 } }, o || {})); }
  function dotChart(cv, o) { cv._muiArt = { kind: "dotchart", o: o }; if (window.MeridiemArt) window.MeridiemArt.dotChart(cv, Object.assign({ color: "var(--m-fg, #1C1B1A)", accent: "var(--m-primary, #AA4F13)", dim: "var(--m-dotchart-dim, #C9BFB0)", gap: 5 }, o || {})); }

  /* ======================= Thème (jour, nuit, système) ======================= */
  // MUI.setTheme("dark" | "light" | "auto") pose data-theme sur <html> ; MUI.theme() rend "dark" ou "light" (effectif).
  var darkMq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function setTheme(t) { document.documentElement.setAttribute("data-theme", t === "dark" || t === "auto" ? t : "light"); }
  function theme() {
    var t = document.documentElement.getAttribute("data-theme");
    return t === "dark" || (t === "auto" && darkMq && darkMq.matches) ? "dark" : "light";
  }
  // Redessine les visuels sur canvas (ville, points, graphique en points) avec les couleurs du thème courant.
  // La ville ne rejoue pas son apparition.
  function retheme() {
    document.querySelectorAll("canvas").forEach(function (cv) {
      var a = cv._muiArt; if (!a) return;
      if (a.kind === "city") city(cv, Object.assign({}, a.o, { reveal: 0 }));
      else if (a.kind === "dots") dotField(cv, a.o);
      else if (a.kind === "dotchart") dotChart(cv, a.o);
    });
  }
  var lastTheme = null, themeRaf = 0;
  function onThemeChange() {
    if (themeRaf) return;
    themeRaf = requestAnimationFrame(function () { themeRaf = 0; var t = theme(); if (t !== lastTheme) { lastTheme = t; retheme(); } });
  }
  lastTheme = theme();
  new MutationObserver(onThemeChange).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
  if (darkMq) { if (darkMq.addEventListener) darkMq.addEventListener("change", onThemeChange); else if (darkMq.addListener) darkMq.addListener(onThemeChange); }

  // Bandeau d'accueil : texte à gauche, ville en points à droite (fondue dans la carte)
  function banner(o) {
    return '<section class="m-card m-banner"><div class="m-banner-text">' +
      (o.eyebrow ? '<span class="m-eyebrow m-eyebrow-accent">' + o.eyebrow + "</span>" : "") +
      '<h1 class="m-h1">' + (o.title || "") + "</h1>" + (o.sub ? '<p class="m-banner-sub">' + o.sub + "</p>" : "") +
      (o.actions ? '<div class="m-banner-actions">' + o.actions + "</div>" : "") + (o.extra || "") +
      '</div><div class="m-banner-art"><canvas data-mui-art="city" data-opts=\'' + JSON.stringify(o.city || { focusY: 0.5 }) + "'></canvas></div></section>";
  }
  // Bloc sombre avec champ de points animé
  function ctaBand(o) {
    return '<section class="m-cta"><canvas data-mui-art="dots" data-opts=\'' + JSON.stringify(o.dots || {}) + "'></canvas><div class=\"m-cta-inner\">" +
      '<h2 class="m-h2">' + (o.title || "") + "</h2>" + (o.text ? "<p>" + o.text + "</p>" : "") + (o.action || "") + "</div></section>";
  }
  // État vide utile : icône, titre précis, phrase, action
  function empty(o) {
    return '<div class="m-empty">' + (o.icon ? '<div class="m-empty-ico"><i data-icon="' + o.icon + '" data-size="20"></i></div>' : "") +
      '<div class="m-empty-title">' + (o.title || "") + "</div>" + (o.text ? '<div class="m-empty-text">' + o.text + "</div>" : "") + (o.action || "") + "</div>";
  }
  function badge(status, text) { return '<span class="m-badge is-' + status + '">' + esc(text) + "</span>"; }

  /* ======================= Graphiques ======================= */
  // Couleurs des séries : variables CSS (suivent le mode nuit), valeurs de jour en repli. CHART_HEX : les valeurs de jour en hexadécimal.
  var CHART_HEX = ["#AA4F13", "#3F6FB0", "#C2861A", "#0E8C7C", "#8E4F8A"];
  var CHART = CHART_HEX.map(function (h, i) { return "var(--m-chart-" + (i + 1) + ", " + h + ")"; });
  function tipEl(host) {
    var t = host.querySelector(".m-tip");
    if (!t) { t = document.createElement("div"); t.className = "m-tip"; host.appendChild(t); }
    return t;
  }
  function placeTip(host, t, x, y) {
    var w = host.clientWidth, tw = t.offsetWidth;
    t.style.left = Math.max(4, Math.min(w - tw - 4, x - tw / 2)) + "px"; t.style.top = Math.max(0, y - t.offsetHeight - 10) + "px";
  }
  function niceMax(v) { if (v <= 0) return 4; var p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }

  // Aire à plusieurs séries : MUI.area(el, { labels, series: [{ name, values, color }], height, format, axisFormat, padLeft })
  function area(el, o) {
    var H = o.height || 240, W = Math.max(280, el.clientWidth || 600), padL = o.padLeft || 30, padR = 10, padT = 12, padB = 26;
    var n = o.labels.length, max = niceMax(Math.max.apply(null, o.series.map(function (s) { return Math.max.apply(null, s.values); })) || 1);
    var X = function (i) { return padL + (W - padL - padR) * (n === 1 ? 0.5 : i / (n - 1)); }, Y = function (v) { return padT + (H - padT - padB) * (1 - v / max); };
    var fmt = o.format || nf, axisFmt = o.axisFormat || Math.round, g = "", defs = "";
    for (var t = 0; t <= 4; t++) { var v = max * t / 4, y = Y(v); g += '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y + '" y2="' + y + '" class="m-grid"/><text x="' + (padL - 6) + '" y="' + (y + 3) + '" class="m-axis" text-anchor="end">' + esc(axisFmt(v)) + "</text>"; }
    var every = Math.max(Math.ceil(n / 7), Math.ceil(n / Math.max(2, Math.floor((W - padL - padR) / 58))));   // au plus une date tous les 58 px (téléphone)
    o.labels.forEach(function (l, i) { if ((n - 1 - i) % every === 0) g += '<text x="' + X(i) + '" y="' + (H - 6) + '" class="m-axis" text-anchor="middle">' + esc(l) + "</text>"; });
    var paths = "";
    o.series.forEach(function (s, si) {
      var c = s.color || CHART[si], gid = nid("ag");
      defs += '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stop-color="' + c + '" style="stop-opacity:calc(.26 * var(--m-area-fill, 1))"/><stop offset="95%" stop-color="' + c + '" style="stop-opacity:calc(.02 * var(--m-area-fill, 1))"/></linearGradient>';
      var d = s.values.map(function (v, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1); }).join(" ");
      paths += '<path d="' + d + " L" + X(n - 1) + " " + Y(0) + " L" + X(0) + " " + Y(0) + ' Z" fill="url(#' + gid + ')"/><path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="2" stroke-linejoin="round" class="m-draw"/>';
    });
    el.classList.add("m-chart");
    el.innerHTML = '<svg width="100%" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none"><defs>' + defs + "</defs>" + g + paths +
      '<line class="m-cross" x1="0" x2="0" y1="' + padT + '" y2="' + (H - padB) + '" style="display:none"/><g class="m-hdots"></g><rect x="' + padL + '" y="0" width="' + (W - padL - padR) + '" height="' + H + '" fill="transparent" class="m-hit"/></svg>' +
      (o.series.length > 1 ? '<div class="m-legend">' + o.series.map(function (s, si) { return '<span><i style="background:' + (s.color || CHART[si]) + '"></i>' + esc(s.name) + "</span>"; }).join("") + "</div>" : "");
    var sv = el.querySelector("svg"), hit = el.querySelector(".m-hit"), cross = el.querySelector(".m-cross"), hd = el.querySelector(".m-hdots"), tip = tipEl(el);
    hit.addEventListener("mousemove", function (e) {
      var r = sv.getBoundingClientRect(), px = (e.clientX - r.left) * W / r.width, i = Math.max(0, Math.min(n - 1, Math.round((px - padL) / ((W - padL - padR) / Math.max(1, n - 1)))));
      cross.setAttribute("x1", X(i)); cross.setAttribute("x2", X(i)); cross.style.display = "";
      hd.innerHTML = o.series.map(function (s, si) { return '<circle cx="' + X(i) + '" cy="' + Y(s.values[i]) + '" r="4" fill="var(--m-card)" stroke="' + (s.color || CHART[si]) + '" stroke-width="2"/>'; }).join("");
      tip.innerHTML = '<div class="m-tip-h">' + esc(o.tipLabels ? o.tipLabels[i] : o.labels[i]) + "</div>" + o.series.map(function (s, si) { return '<div class="m-tip-r"><i style="background:' + (s.color || CHART[si]) + '"></i>' + esc(s.name) + "<b>" + fmt(s.values[i]) + "</b></div>"; }).join("");
      tip.style.opacity = 1; placeTip(el, tip, X(i) * r.width / W, Y(Math.max.apply(null, o.series.map(function (s) { return s.values[i]; }))) * r.height / H);
    });
    hit.addEventListener("mouseleave", function () { cross.style.display = "none"; hd.innerHTML = ""; tip.style.opacity = 0; });
  }

  // Colonnes tramées, une série : MUI.columns(el, { data: [{ label, value }], height, total, format, onClick })
  function columns(el, o) {
    var H = o.height || 230, W = Math.max(260, el.clientWidth || 520), padT = 30, padB = 26, n = o.data.length;
    var max = Math.max.apply(null, o.data.map(function (d) { return d.value; })) || 1, slot = W / n, bw = Math.min(56, slot * 0.55);
    var total = o.total || o.data.reduce(function (a, d) { return a + d.value; }, 0), fmt = o.format || nf;
    var gid = nid("cg"), pid = nid("cp"), body = "";
    for (var t = 1; t <= 4; t++) { var gy = padT + (H - padT - padB) * (1 - t / 4); body += '<line x1="0" x2="' + W + '" y1="' + gy + '" y2="' + gy + '" class="m-grid"/>'; }
    o.data.forEach(function (d, i) {
      var h = (H - padT - padB) * d.value / max, x = slot * i + (slot - bw) / 2, y = H - padB - h, r = Math.min(10, bw / 2, h);
      var path = h > 0 ? "M" + x + "," + (y + h) + " V" + (y + r) + " Q" + x + "," + y + " " + (x + r) + "," + y + " H" + (x + bw - r) + " Q" + (x + bw) + "," + y + " " + (x + bw) + "," + (y + r) + " V" + (y + h) + " Z" : "";
      body += '<g class="m-col" data-i="' + i + '"><rect class="m-cursor" x="' + (slot * i + 6) + '" y="0" width="' + (slot - 12) + '" height="' + (H - padB + 4) + '" rx="10"/>' +
        (path ? '<path d="' + path + '" fill="url(#' + gid + ')" class="m-grow" style="transform-origin:center ' + (H - padB) + 'px;animation-delay:' + (i * 60) + 'ms"/><path d="' + path + '" fill="url(#' + pid + ')"/>' : "") +
        '<text x="' + (x + bw / 2) + '" y="' + (y - 9) + '" text-anchor="middle" class="m-val"><tspan class="m-val-n">' + fmt(d.value) + '</tspan><tspan class="m-val-p" dx="4">' + Math.round(d.value / total * 100) + " %</tspan></text>" +
        '<text x="' + (slot * i + slot / 2) + '" y="' + (H - 7) + '" text-anchor="middle" class="m-axis">' + esc(d.label) + "</text>" +
        '<rect x="' + slot * i + '" y="0" width="' + slot + '" height="' + H + '" fill="transparent" class="m-hit"/></g>';
    });
    el.classList.add("m-chart");
    el.innerHTML = '<svg width="100%" height="' + H + '" viewBox="0 0 ' + W + " " + H + '"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--m-bar-top, #C4672A)"/><stop offset="100%" stop-color="var(--m-bar-bottom, #8A3F0F)"/></linearGradient>' +
      '<pattern id="' + pid + '" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".8" fill="#fff" fill-opacity=".22"/></pattern></defs>' + body + "</svg>";
    var cols = el.querySelectorAll(".m-col"), tip = tipEl(el);
    cols.forEach(function (g) {
      var i = +g.getAttribute("data-i"), d = o.data[i];
      g.addEventListener("mouseenter", function () { el.classList.add("is-hover"); g.classList.add("is-on"); tip.innerHTML = '<div class="m-tip-h">' + esc(d.label) + '</div><div class="m-tip-r"><i style="background:' + CHART[0] + '"></i>' + esc(o.name || "Valeur") + "<b>" + fmt(d.value) + "</b></div>"; tip.style.opacity = 1; var r = el.getBoundingClientRect(), gr = g.getBoundingClientRect(); placeTip(el, tip, gr.left - r.left + gr.width / 2, 34); });
      g.addEventListener("mouseleave", function () { el.classList.remove("is-hover"); g.classList.remove("is-on"); tip.style.opacity = 0; });
      if (o.onClick) { g.style.cursor = "pointer"; g.addEventListener("click", function () { o.onClick(d, i); }); }
    });
  }

  // Anneau à segments : MUI.donut(el, { segments: [{ label, value, color }], total, sub, format })
  function donut(el, o) {
    var size = o.size || 170, r = size / 2 - 14, c = 2 * Math.PI * r, sum = o.segments.reduce(function (a, s) { return a + s.value; }, 0) || 1, off = 0, gap = 3, arcs = "";
    o.segments.forEach(function (s, i) {
      var len = Math.max(0, c * s.value / sum - gap);
      arcs += '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + (s.color || CHART[i]) + '" stroke-width="16" stroke-linecap="butt" stroke-dasharray="' + len.toFixed(1) + " " + (c - len).toFixed(1) + '" stroke-dashoffset="' + (-off).toFixed(1) + '" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')" class="m-seg"><title>' + esc(s.label) + "</title></circle>";
      off += c * s.value / sum;
    });
    el.classList.add("m-chart");
    el.innerHTML = '<div class="m-donut"><div class="m-donut-ring" style="width:' + size + "px;height:" + size + 'px"><svg width="' + size + '" height="' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--m-muted)" stroke-width="16"/>' + arcs + "</svg>" +
      '<div class="m-donut-c"><b class="m-num">' + (o.total || "") + "</b><span>" + esc(o.sub || "") + "</span></div></div>" +
      '<div class="m-donut-lg">' + o.segments.map(function (s, i) { return '<div><i style="background:' + (s.color || CHART[i]) + '"></i><span>' + esc(s.label) + '</span><b class="m-num">' + (o.format ? o.format(s.value) : nf(s.value)) + "</b><em>" + Math.round(s.value / sum * 100) + " %</em></div>"; }).join("") + "</div></div>";
  }

  // Jauge radiale : MUI.radial(el, { value (0-100), label, sub })
  function radial(el, o) {
    var size = o.size || 150, r = size / 2 - 12, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, o.value || 0));
    el.classList.add("m-chart");
    el.innerHTML = '<div class="m-radial" style="width:' + size + "px;height:" + size + 'px"><svg width="' + size + '" height="' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--m-muted)" stroke-width="14"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--m-primary)" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')" class="m-radial-arc" style="--to:' + (c * (1 - v / 100)).toFixed(1) + '"/></svg>' +
      '<div class="m-donut-c"><b class="m-num">' + (o.label != null ? o.label : v + " %") + "</b><span>" + esc(o.sub || "") + "</span></div></div>";
  }

  /* ======================= Interactions ======================= */
  // Toasts (même esprit que sonner) : MUI.toast("Titre", { description, action: { label, onClick }, tone })
  function toast(title, o) {
    o = o || {};
    var host = document.querySelector(".m-toasts");
    if (!host) { host = document.createElement("div"); host.className = "m-toasts"; document.body.appendChild(host); }
    var t = document.createElement("div"); t.className = "m-toast" + (o.tone ? " is-" + o.tone : "");
    t.innerHTML = '<div class="m-toast-b"><div class="m-toast-t">' + esc(title) + "</div>" + (o.description ? '<div class="m-toast-d">' + esc(o.description) + "</div>" : "") + "</div>" + (o.action ? '<button class="m-btn m-btn-sm">' + esc(o.action.label) + "</button>" : "");
    if (o.action) t.querySelector("button").addEventListener("click", function () { o.action.onClick(); close(); });
    host.appendChild(t);
    function close() { t.classList.add("is-out"); setTimeout(function () { t.remove(); }, 220); }
    setTimeout(close, o.duration || 4000);
    return close;
  }

  // Menu déroulant attaché à un bouton : MUI.menu(bouton, panneau, { side: "top" | "bottom" })
  // Sous-menu (choix d'une préférence : apparence, langue) : dans le panneau, un bloc
  //   <div class="m-menu-sub"><button class="m-menu-item m-menu-subtrigger">icône, libellé, <span class="m-menu-value">valeur</span></button>
  //   <div class="m-submenu" role="menu"> options role="menuitemradio" data-value, <span class="m-menu-check"></span> </div></div>
  // Il s'ouvre au survol et au clic, à droite de l'entrée (à gauche, ou en place sous elle, si la place manque) ;
  // flèche droite l'ouvre, flèche gauche le referme, Échap et clic dehors ferment tout. MUI.menuValue(bloc, valeur) coche.
  function menu(trigger, panel, o) {
    o = o || {};
    panel.classList.add("m-menu"); panel.setAttribute("data-side", o.side || "bottom");
    var subs = [];
    function close() { subs.forEach(function (x) { x.hide(); }); panel.classList.remove("is-open"); trigger.setAttribute("aria-expanded", "false"); document.removeEventListener("click", outside, true); document.removeEventListener("keydown", key); }
    function outside(e) { if (!panel.contains(e.target) && !trigger.contains(e.target)) close(); }
    function key(e) { if (e.key === "Escape") { close(); trigger.focus(); } }
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (panel.classList.contains("is-open")) return close();
      panel.classList.add("is-open"); trigger.setAttribute("aria-expanded", "true");
      setTimeout(function () { document.addEventListener("click", outside, true); document.addEventListener("keydown", key); }, 0);
    });
    panel.addEventListener("click", function (e) { var it = e.target.closest(".m-menu-item"); if (it && !it.classList.contains("m-menu-subtrigger")) close(); });
    panel.querySelectorAll(".m-menu-sub").forEach(function (box) { subs.push(subMenu(box, function () { subs.forEach(function (x) { if (x.box !== box) x.hide(); }); })); });
    return { close: close };
  }
  var canHover = window.matchMedia ? window.matchMedia("(hover: hover) and (pointer: fine)") : null;
  function subMenu(box, others) {
    var btn = box.querySelector(".m-menu-subtrigger"), sub = box.querySelector(".m-submenu"), timer = 0;
    btn.setAttribute("aria-haspopup", "menu"); btn.setAttribute("aria-expanded", "false");
    sub.classList.add("m-menu"); sub.setAttribute("role", "menu");
    var items = function () { return Array.prototype.slice.call(sub.querySelectorAll(".m-menu-item")); };
    function place() {
      sub.removeAttribute("data-place"); sub.style.top = "";
      var r = btn.getBoundingClientRect(), w = sub.offsetWidth, vw = document.documentElement.clientWidth;
      if (r.right + 6 + w > vw - 8) sub.setAttribute("data-place", r.left - 6 - w >= 8 ? "left" : "inline");
      if (sub.getAttribute("data-place") === "inline") return;
      var sr = sub.getBoundingClientRect(), over = sr.bottom - (window.innerHeight - 8);
      if (over > 0) sub.style.top = Math.round(-5 - Math.min(over, sr.top - 8)) + "px";
    }
    function show(focus) {
      clearTimeout(timer); if (box.classList.contains("is-open")) { if (focus) items()[0].focus(); return; }
      others(); box.classList.add("is-open"); sub.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); place();
      if (focus) { var on = sub.querySelector('[aria-checked="true"]') || items()[0]; if (on) on.focus(); }
    }
    function hide() { clearTimeout(timer); box.classList.remove("is-open"); sub.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); if (box.classList.contains("is-open") && !(canHover && canHover.matches)) hide(); else show(e.detail === 0); });
    box.addEventListener("mouseenter", function () { if (canHover && canHover.matches) { clearTimeout(timer); timer = setTimeout(function () { show(false); }, 60); } });
    box.addEventListener("mouseleave", function () { if (canHover && canHover.matches) { clearTimeout(timer); timer = setTimeout(hide, 220); } });
    btn.addEventListener("keydown", function (e) { if (e.key === "ArrowRight" || ((e.key === "Enter" || e.key === " ") && !box.classList.contains("is-open"))) { e.preventDefault(); show(true); } else if (e.key === "ArrowLeft") { e.preventDefault(); hide(); } });
    sub.addEventListener("keydown", function (e) {
      var list = items(), i = list.indexOf(document.activeElement);
      if (e.key === "ArrowLeft") { e.preventDefault(); e.stopPropagation(); hide(); btn.focus(); }
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); list[(i + (e.key === "ArrowDown" ? 1 : list.length - 1)) % list.length].focus(); }
    });
    return { box: box, hide: hide };
  }
  // Coche l'option data-value=valeur d'un sous-menu et recopie son libellé dans l'entrée (valeur courante à droite)
  function menuValue(box, value) {
    var label = "";
    box.querySelectorAll(".m-submenu [data-value]").forEach(function (it) {
      var on = it.getAttribute("data-value") === String(value), c = it.querySelector(".m-menu-check");
      it.setAttribute("aria-checked", on ? "true" : "false");
      if (c) c.innerHTML = on && window.meridiemIcon ? window.meridiemIcon("Tick02", 16) : "";
      if (on) { var t = it.querySelector(".m-menu-label"); label = (t || it).textContent.trim(); }
    });
    var v = box.querySelector(".m-menu-subtrigger .m-menu-value"); if (v && label) v.textContent = label;
  }

  // Pastille active qui glisse d'un lien à l'autre : MUI.navPill(nav, ".m-nav-item", "is-active")
  function navPill(nav, sel, activeCls) {
    sel = sel || ".m-nav-item"; activeCls = activeCls || "is-active";
    var pill = nav.querySelector(".m-pill");
    if (!pill) { pill = document.createElement("span"); pill.className = "m-pill"; nav.insertBefore(pill, nav.firstChild); }
    if (getComputedStyle(nav).position === "static") nav.style.position = "relative";
    function move(first) {
      var a = nav.querySelector(sel + "." + activeCls); if (!a) { pill.style.opacity = 0; return; }
      if (first) pill.style.transition = "none";
      pill.style.opacity = 1; pill.style.transform = "translateY(" + a.offsetTop + "px)"; pill.style.height = a.offsetHeight + "px";
      pill.style.left = a.offsetLeft + "px"; pill.style.width = a.offsetWidth + "px";
      if (first) { void pill.offsetWidth; pill.style.transition = ""; }
    }
    new MutationObserver(function () { move(false); }).observe(nav, { attributes: true, subtree: true, attributeFilter: ["class"] });
    window.addEventListener("resize", function () { move(true); });
    move(true);
    return { update: function () { move(false); } };
  }

  /* Rangée de cartes indicateur qui se met à jour EN PLACE : MUI.kpis(el, [{ label, value, note, kind, badge, onclick, gauge }])
     Premier appel : rend les cartes et les anime (bind). Appels suivants avec les mêmes cartes (même libellé, même
     illustration, même clic) : seuls la valeur, la note et le badge changent ; rien ne clignote, aucune animation ne
     se rejoue. Fait pour les pages qui se rafraîchissent toutes les quelques secondes. */
  function kpis(el, list) {
    list = list || [];
    el.classList.add("m-kpis");
    var sig = list.map(function (o) { return [o.kind || "", o.label || "", o.onclick || "", o.gauge == null ? "" : Number(o.gauge).toFixed(2), o.note ? 1 : 0, o.badge ? 1 : 0].join("|"); }).join("§");
    if (el._muiSig !== sig || el.children.length !== list.length) {
      el.innerHTML = list.map(kpi).join(""); el._muiSig = sig; bind(el); return;
    }
    function put(node, v) { if (node && node._v !== v) { node.innerHTML = v; node._v = v; } }
    list.forEach(function (o, i) {
      var c = el.children[i];
      put(c.querySelector(".m-kpi-value"), o.value == null ? "" : String(o.value));
      put(c.querySelector(".m-kpi-note"), o.note || "");
      var top = c.querySelector(".m-kpi-top"), b = top && top.children[1];
      if (b && o.badge && b._v !== o.badge) { b.outerHTML = o.badge; top.children[1]._v = o.badge; }
    });
  }

  /* Palette de commandes (⌘K), même esprit que cmdk :
     MUI.palette({ items, sources, placeholder, hotkey, limit, emptyText, emptyItems, loadingLabel, navLabel, goLabel, closeLabel })
     - items   : éléments fixes (pages, actions), tableau ou fonction ; tous affichés quand le champ est vide.
     - sources : contenus cherchés quand on tape [{ group, items, ready, load, ttl, limit, minChars }].
                 items = tableau ou fonction ; ready() dit si les données sont déjà là ; sinon load() (Promise)
                 est appelé à l'ouverture, une ligne « Chargement… » s'affiche dans le groupe, puis le résultat
                 reste en cache (rechargé en arrière-plan après ttl ms si ttl est donné).
     - un élément : { group, label, sub, icon, hint, badge (HTML), keywords, run }.
     Recherche sans accents ni casse, mot à mot, termes en surbrillance, `limit` résultats par groupe (5),
     flèches pour choisir, Entrée pour lancer, Échap pour fermer. Sans résultat : emptyText(q) et emptyItems(q).
     hotkey : true pour ⌘K / Ctrl+K. Renvoie { open, close, toggle, isOpen, refresh }. */
  function norm(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  // texte échappé avec les termes cherchés en surbrillance (correspondance sans accents ni casse)
  function hl(text, terms) {
    text = String(text == null ? "" : text);
    if (!terms.length || !text) return esc(text);
    var n = "", map = [];
    for (var i = 0; i < text.length; i++) { var c = norm(text[i]); for (var j = 0; j < c.length; j++) { n += c[j]; map.push(i); } }
    var on = new Array(text.length + 1).join("0").split("").map(Number);
    terms.forEach(function (w) { var k = n.indexOf(w); while (k >= 0) { for (var x = k; x < k + w.length; x++) on[map[x]] = 1; k = n.indexOf(w, k + w.length); } });
    var out = "", open = false;
    for (var p = 0; p < text.length; p++) {
      if (on[p] && !open) { out += '<mark class="m-pal-hl">'; open = true; }
      if (!on[p] && open) { out += "</mark>"; open = false; }
      out += esc(text[p]);
    }
    return out + (open ? "</mark>" : "");
  }
  function palette(o) {
    o = o || {};
    var limit = o.limit || 5, sources = o.sources || [];
    var back = document.createElement("div"); back.className = "m-pal-back";
    back.innerHTML = '<div class="m-pal" role="dialog" aria-modal="true" aria-label="' + esc(o.placeholder || "Rechercher") + '">' +
      '<div class="m-pal-in"><i data-icon="Search01"></i><input type="text" autocomplete="off" spellcheck="false" placeholder="' + esc(o.placeholder || "Rechercher") + '"><span class="m-kbd">Échap</span></div>' +
      '<div class="m-pal-list" role="listbox"></div>' +
      '<div class="m-pal-foot"><span><span class="m-kbd">↑</span><span class="m-kbd">↓</span> ' + esc(o.navLabel || "choisir") + '</span><span><span class="m-kbd">Entrée</span> ' + esc(o.goLabel || "ouvrir") + '</span><span><span class="m-kbd">Échap</span> ' + esc(o.closeLabel || "fermer") + "</span></div></div>";
    document.body.appendChild(back);
    if (window.MeridiemIcons) window.MeridiemIcons.hydrate(back);
    var input = back.querySelector("input"), list = back.querySelector(".m-pal-list"), shown = [], sel = 0, prevFocus = null;
    function val(x) { return (typeof x === "function" ? x() : x) || []; }
    function rank(items, terms) {
      return items.map(function (it, i) {
        var l = norm(it.label), h = l + " " + norm(it.sub) + " " + norm(it.keywords) + " " + norm(it.group), s = 0;
        for (var k = 0; k < terms.length; k++) {
          var w = terms[k]; if (h.indexOf(w) < 0) return null;
          s += l.indexOf(w) === 0 ? 4 : (l.indexOf(" " + w) >= 0 ? 3 : (l.indexOf(w) >= 0 ? 2 : 1));
        }
        return { it: it, s: s, i: i };
      }).filter(Boolean).sort(function (a, b) { return b.s - a.s || a.i - b.i; }).map(function (x) { return x.it; });
    }
    function loading(src) { return !!src._p && !(src.ready && src.ready()) && !src._at; }
    function itemHtml(it, i, terms) {
      return '<div class="m-pal-item' + (i === sel ? " is-on" : "") + (it.sub ? " has-sub" : "") + '" role="option" data-i="' + i + '">' +
        (it.icon && window.meridiemIcon ? window.meridiemIcon(it.icon, 16) : "") +
        '<span class="m-pal-txt"><span class="m-pal-l">' + hl(it.label, terms) + "</span>" + (it.sub ? '<span class="m-pal-s">' + hl(it.sub, terms) + "</span>" : "") + "</span>" +
        (it.badge || "") + (it.hint ? '<span class="m-pal-hint">' + esc(it.hint) + "</span>" : "") + "</div>";
    }
    function draw() {
      var raw = input.value.trim(), terms = norm(raw).split(/\s+/).filter(Boolean), blocks = [], wait = false;
      shown = [];
      // 1. contenus (seulement quand on tape), dans l'ordre des sources
      if (terms.length) sources.forEach(function (src) {
        if (raw.length < (src.minChars || 1)) return;
        var found = rank(val(src.items), terms).slice(0, src.limit || limit);
        if (found.length) blocks.push({ g: src.group, items: found });
        else if (loading(src)) { blocks.push({ g: src.group, wait: true }); wait = true; }
      });
      // 2. éléments fixes (pages, actions), regroupés dans leur ordre d'apparition
      var fixed = terms.length ? rank(val(o.items), terms) : val(o.items), by = {}, order = [];
      fixed.forEach(function (it) { var g = it.group || ""; if (!by[g]) { by[g] = []; order.push(g); } by[g].push(it); });
      order.forEach(function (g) { blocks.push({ g: g, items: terms.length ? by[g].slice(0, limit) : by[g] }); });
      var html = "";
      blocks.forEach(function (b) {
        html += b.g ? '<div class="m-pal-group">' + esc(b.g) + "</div>" : "";
        if (b.wait) { html += '<div class="m-pal-loading"><span class="m-spin" aria-hidden="true"></span>' + esc(o.loadingLabel || "Chargement…") + "</div>"; return; }
        b.items.forEach(function (it) { html += itemHtml(it, shown.length, terms); shown.push(it); });
      });
      if (!shown.length && !wait) {
        var sug = terms.length && o.emptyItems ? val(function () { return o.emptyItems(raw); }) : [];
        html = '<div class="m-pal-empty">' + esc(terms.length && o.emptyText ? o.emptyText(raw) : (o.empty || "Aucun résultat.")) + "</div>";
        var lastG = null;
        sug.forEach(function (it) { if (it.group && it.group !== lastG) { html += '<div class="m-pal-group">' + esc(it.group) + "</div>"; lastG = it.group; } html += itemHtml(it, shown.length, []); shown.push(it); });
      }
      if (sel >= shown.length) sel = Math.max(0, shown.length - 1);
      list.innerHTML = html;
      mark();
    }
    function mark() {
      list.querySelectorAll(".m-pal-item").forEach(function (x) { x.classList.toggle("is-on", +x.getAttribute("data-i") === sel); });
      var on = list.querySelector(".m-pal-item.is-on"); if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest" });
    }
    function fetchSources() {
      sources.forEach(function (src) {
        var fresh = src.ready ? src.ready() : !!src._at, stale = src.ttl && src._at && Date.now() - src._at > src.ttl;
        if (!src.load || src._p || (fresh && !stale)) return;
        src._p = Promise.resolve().then(src.load).then(function () { src._at = Date.now(); }, function () { /* source indisponible : on garde le cache */ })
          .then(function () { src._p = null; if (isOpen()) draw(); });
      });
    }
    function run(i) { var it = shown[i]; if (!it) return; close(); if (it.run) setTimeout(function () { it.run(); }, 0); }
    function open() { prevFocus = document.activeElement; input.value = ""; sel = 0; fetchSources(); draw(); back.classList.add("is-open"); input.focus(); }
    function close() { if (!back.classList.contains("is-open")) return; back.classList.remove("is-open"); if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e) { /* élément disparu */ } }
    function isOpen() { return back.classList.contains("is-open"); }
    input.addEventListener("input", function () { sel = 0; draw(); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); mark(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
      else if (e.key === "Enter") { e.preventDefault(); run(sel); }
      else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    });
    list.addEventListener("mousemove", function (e) { var it = e.target.closest(".m-pal-item"); if (it && +it.getAttribute("data-i") !== sel) { sel = +it.getAttribute("data-i"); mark(); } });
    list.addEventListener("click", function (e) { var it = e.target.closest(".m-pal-item"); if (it) run(+it.getAttribute("data-i")); });
    back.addEventListener("mousedown", function (e) { if (e.target === back) close(); });
    if (o.hotkey) document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && (e.key === "k" || e.key === "K")) { e.preventDefault(); if (isOpen()) close(); else open(); }
    });
    return { open: open, close: close, toggle: function () { if (isOpen()) close(); else open(); }, isOpen: isOpen, refresh: function () { if (isOpen()) draw(); } };
  }

  /* Fenêtre centrée (même esprit que le Dialog de shadcn) : MUI.dialog({ title, description, content, footer, size, onOpen, onClose })
     content : chaîne HTML ou élément (déplacé dans la fenêtre, il garde ses écouteurs et ses ids).
     Voile, titre en serif, bouton de fermeture, Échap et clic sur le voile ferment, ouverture animée,
     focus rendu à l'élément d'origine. Renvoie { open, close, isOpen, el, body }. */
  var DLG_OPEN = [];
  function dialog(o) {
    o = o || {};
    var back = document.createElement("div"); back.className = "m-dialog-back";
    var id = nid("dlg");
    back.innerHTML = '<div class="m-dialog' + (o.size ? " is-" + o.size : "") + '" role="dialog" aria-modal="true" aria-labelledby="' + id + '" tabindex="-1">' +
      '<div class="m-dialog-head"><div><h2 class="m-dialog-title" id="' + id + '">' + esc(o.title || "") + "</h2>" + (o.description ? '<p class="m-dialog-desc">' + esc(o.description) + "</p>" : "") + "</div>" +
      '<button type="button" class="m-btn m-btn-ghost m-btn-icon m-dialog-x" aria-label="' + esc(o.closeLabel || "Fermer") + '"><i data-icon="Cancel01"></i></button></div>' +
      '<div class="m-dialog-body"></div>' + (o.footer ? '<div class="m-dialog-foot">' + o.footer + "</div>" : "") + "</div>";
    document.body.appendChild(back);
    var box = back.querySelector(".m-dialog"), body = back.querySelector(".m-dialog-body"), prev = null;
    if (typeof o.content === "string") body.innerHTML = o.content; else if (o.content) body.appendChild(o.content);
    if (window.MeridiemIcons) window.MeridiemIcons.hydrate(back);
    function isOpen() { return back.classList.contains("is-open"); }
    function open() {
      if (isOpen()) return;
      prev = document.activeElement; back.classList.add("is-open"); DLG_OPEN.push(api);
      document.documentElement.classList.add("m-dialog-lock");
      if (o.onOpen) o.onOpen(api);
      box.focus();
    }
    function close() {
      if (!isOpen()) return;
      back.classList.remove("is-open"); DLG_OPEN = DLG_OPEN.filter(function (d) { return d !== api; });
      if (!DLG_OPEN.length) document.documentElement.classList.remove("m-dialog-lock");
      if (o.onClose) o.onClose(api);
      if (prev && prev.focus) try { prev.focus(); } catch (e) { /* élément disparu */ }
    }
    back.querySelector(".m-dialog-x").addEventListener("click", close);
    back.addEventListener("mousedown", function (e) { if (e.target === back) close(); });
    var api = { open: open, close: close, isOpen: isOpen, el: box, body: body };
    return api;
  }
  // Échap ferme la fenêtre du dessus (une seule à la fois)
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && DLG_OPEN.length && !document.querySelector(".m-pal-back.is-open")) { e.stopPropagation(); DLG_OPEN[DLG_OPEN.length - 1].close(); } }, true);

  /* Barre d'actions : la même partout, la relation entre les boutons se lit d'un coup d'œil.
     MUI.actionBar({ size, prompt, decision, follow, more, lead, status, panel, label, moreLabel }) → HTML
     - À GAUCHE, le groupe DÉCISION : une phrase courte en gras (prompt) puis les boutons (decision) ;
       le principal est `kind: "primary"` (terracotta, un seul), les autres en contour.
       Sans décision : `status` (badge + texte, ex. « Confirmé à 23:41 ») ou `lead` (liens fantômes).
     - À DROITE, le groupe SUIVI (follow, ex. « Marquer lu ») puis « ⋯ » (more) : MUI.menu, branché
       tout seul au premier clic, ouvert vers le haut s'il manque de place en bas.
     - `panel` : HTML rendu juste sous la barre (zone de saisie d'un retour ou d'une réponse).
     size : "md" (boutons 36 px, carte) ou "sm" (30 px, listes, colonnes). Sous 520 px de large, la
     barre passe sur deux lignes, décision au-dessus.
     bouton : { label, icon, onclick (chaîne), kind: "primary" | "outline" | "ghost" | "note", pressed, title, disabled }
     entrée du menu : { label, icon, onclick, danger } */
  function actionBar(o) {
    o = o || {};
    var sm = o.size === "sm", isz = sm ? 14 : 16;
    function ic(n) { return n && window.meridiemIcon ? window.meridiemIcon(n, isz) : ""; }
    function btn(b) {
      var k = b.kind || "outline";
      if (k === "note") return '<span class="m-ab-note"' + (b.title ? ' title="' + esc(b.title) + '"' : "") + ">" + ic(b.icon) + "<span>" + esc(b.label) + "</span></span>";
      return '<button type="button" class="m-btn m-ab-btn' + (k === "primary" ? " m-btn-primary" : k === "ghost" ? " m-btn-ghost" : "") + (b.pressed ? " is-pressed" : "") + '"' +
        (b.pressed ? ' aria-pressed="true"' : "") + (b.title ? ' title="' + esc(b.title) + '"' : "") + (b.onclick ? ' onclick="' + esc(b.onclick) + '"' : "") + (b.disabled ? " disabled" : "") + ">" +
        ic(b.icon) + "<span>" + esc(b.label) + "</span></button>";
    }
    var left = "";
    if (o.status) left = '<div class="m-ab-status">' + badge(o.status.tone || "ok", o.status.word) + (o.status.text ? "<span>" + esc(o.status.text) + "</span>" : "") + "</div>";
    else if ((o.decision || []).length) left = '<div class="m-ab-dec">' + (o.prompt ? '<span class="m-ab-prompt">' + esc(o.prompt) + "</span>" : "") + '<div class="m-ab-btns">' + o.decision.map(btn).join("") + "</div></div>";
    else if ((o.lead || []).length) left = '<div class="m-ab-lead">' + o.lead.map(function (b) { return btn(Object.assign({ kind: "ghost" }, b)); }).join("") + "</div>";
    var more = (o.more || []).length ? '<div class="m-ab-morewrap"><button type="button" class="m-btn m-btn-icon m-ab-btn m-ab-more" aria-haspopup="menu" aria-expanded="false" aria-label="' + esc(o.moreLabel || "Plus d'actions") + '" title="' + esc(o.moreLabel || "Plus d'actions") + '">' + ic("MoreHorizontal") + "</button>" +
      '<div class="m-ab-menu m-menu" data-side="bottom" role="menu">' + o.more.map(function (m) { return '<button type="button" class="m-menu-item' + (m.danger ? " is-danger" : "") + '"' + (m.onclick ? ' onclick="' + esc(m.onclick) + '"' : "") + ">" + (m.icon && window.meridiemIcon ? window.meridiemIcon(m.icon, 16) : "") + "<span>" + esc(m.label) + "</span></button>"; }).join("") + "</div></div>" : "";
    var right = (o.follow || []).map(btn).join("") + more;
    return '<div class="m-ab is-' + (sm ? "sm" : "md") + '" role="group"' + (o.label ? ' aria-label="' + esc(o.label) + '"' : "") + ">" +
      '<div class="m-ab-row">' + (left || '<span class="m-ab-void"></span>') + (right ? '<div class="m-ab-follow">' + right + "</div>" : "") + "</div>" +
      (o.panel ? '<div class="m-ab-panel">' + o.panel + "</div>" : "") + "</div>";
  }
  // « ⋯ » des barres : branché au premier clic (les barres sont souvent rendues en HTML par des pages qui se rafraîchissent)
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest(".m-ab-more") : null; if (!b) return;
    var panel = b.nextElementSibling; if (!panel) return;
    if (!b.hasAttribute("data-bound")) { b.setAttribute("data-bound", "1"); menu(b, panel, { side: "bottom" }); }
    var r = b.getBoundingClientRect();
    panel.setAttribute("data-side", window.innerHeight - r.bottom < 260 && r.top > 260 ? "top" : "bottom");
  }, true);

  /* Bouton occupé pendant une action : MUI.busy(bouton, () => promesse). Largeur gardée, petit cercle, clic bloqué. */
  function busy(el, fn) {
    if (!el) return Promise.resolve().then(fn);
    el.style.minWidth = el.offsetWidth + "px"; el.classList.add("is-busy"); el.setAttribute("aria-busy", "true");
    return Promise.resolve().then(fn).finally(function () { el.classList.remove("is-busy"); el.style.minWidth = ""; el.removeAttribute("aria-busy"); });
  }

  window.MUI = { kpi: kpi, kpis: kpis, iso: iso, bind: bind, area: area, columns: columns, donut: donut, radial: radial, banner: banner, ctaBand: ctaBand, empty: empty, badge: badge,
    toast: toast, menu: menu, menuValue: menuValue, navPill: navPill, palette: palette, dialog: dialog, actionBar: actionBar, busy: busy, dotChart: dotChart, dotField: dotField, city: city, CHART: CHART, CHART_HEX: CHART_HEX, citySrc: null,
    setTheme: setTheme, theme: theme, retheme: retheme };
})();
