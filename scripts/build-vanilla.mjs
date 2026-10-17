// Génère vanilla/icons.js (icônes Hugeicons en SVG, sans React) et vanilla/art.js (moteur de visuels, sans module).
// Usage : node scripts/build-vanilla.mjs
import * as H from "@hugeicons/core-free-icons"
import { readFileSync, writeFileSync } from "node:fs"

const kit = readFileSync("src/kit/foundations.tsx", "utf8")
const names = [...new Set([...kit.matchAll(/\["([A-Za-z0-9]+Icon)", "([^"]+)"/g)].map((m) => m[1]))]
const kebab = (k) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())
const svgOf = (icon) =>
  icon.map(([tag, attrs]) => "<" + tag + " " + Object.entries(attrs).filter(([k]) => k !== "key").map(([k, v]) => `${kebab(k)}="${v}"`).join(" ") + "/>").join("")
const map = {}
for (const n of names) if (H[n]) map[n.replace(/Icon$/, "")] = svgOf(H[n])
const icons = `/* Icônes Hugeicons (gratuites, style stroke rounded) en SVG, pour les pages sans React. Généré par scripts/build-vanilla.mjs.
   Icônes : Hugeicons, licence MIT, Copyright (c) 2025 Hugeicons (https://hugeicons.com).
   Usage : <script src="icons.js"></script> puis meridiemIcon("Inbox", 16) ou <i data-icon="Inbox"></i> + MeridiemIcons.hydrate() */
(function (g) {
  var I = ${JSON.stringify(map)};
  function meridiemIcon(name, size, strokeWidth) {
    var p = I[name]; if (!p) return "";
    size = size || 16;
    var s = p.replace(/stroke-width="[^"]*"/g, 'stroke-width="' + (strokeWidth || 1.5) + '"');
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" aria-hidden="true">' + s + "</svg>";
  }
  function hydrate(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) { el.innerHTML = meridiemIcon(el.getAttribute("data-icon"), +el.getAttribute("data-size") || 16); });
  }
  g.MeridiemIcons = { list: Object.keys(I), svg: meridiemIcon, hydrate: hydrate };
  g.meridiemIcon = meridiemIcon;
})(typeof window !== "undefined" ? window : globalThis);
`
writeFileSync("vanilla/icons.js", icons)

let art = readFileSync("src/lib/meridiem/art.js", "utf8").replace("// @ts-nocheck\n", "")
art = art.replace("  export { render, dots, dotChart, ditherImage, reduced, color };", "  window.MeridiemArt = { render, dots, dotChart, ditherImage, reduced, color };")
writeFileSync("vanilla/art.js", "/* Moteur de visuels Meridiem sans module (window.MeridiemArt). Généré par scripts/build-vanilla.mjs depuis src/lib/meridiem/art.js. */\n(function () {\n" + art + "\n})();\n")
console.log("icônes :", Object.keys(map).length)
