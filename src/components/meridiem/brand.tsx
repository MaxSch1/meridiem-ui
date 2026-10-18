"use client"
/* Briques de marque Meridiem · Olympe
   Ville en points (image du site tramée), champ de points, graphique en points, cartes animées, icônes, statuts. */
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { animate, useReducedMotion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import * as Art from "@/lib/meridiem/art.js"
import { assets } from "@/components/meridiem/assets"

/* Encre de marque (du plus sombre au plus clair, sans le papier) */
export const OLYMPE_INK = ["#4a2c18", "#a8693f", "#e3cdb3"]

/** Icône Hugeicons (style stroke rounded de Speyy), trait 1.5 par défaut. */
export function Icon({ icon, size = 16, strokeWidth = 1.5, className }: { icon: IconSvgElement; size?: number; strokeWidth?: number; className?: string }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} className={cn("shrink-0", className)} />
}

/* Thème effectif de la page (jour ou nuit). Change quand data-theme ou la classe .dark de <html> change, ou quand le
   système bascule (data-theme="auto") : les visuels sur canvas lisent leurs couleurs dans les variables et se redessinent. */
const darkQuery = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null)
function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] })
  const mq = darkQuery()
  mq?.addEventListener("change", cb)
  return () => { mo.disconnect(); mq?.removeEventListener("change", cb) }
}
/* La signature est la couleur de page calculée : elle suit tous les sélecteurs du thème (.dark, data-theme, auto). */
const themeSnapshot = () => getComputedStyle(document.documentElement).getPropertyValue("--background").trim() + "|" + getComputedStyle(document.documentElement).colorScheme
export function useThemeSignature() {
  return useSyncExternalStore(subscribeTheme, themeSnapshot, () => "")
}

function useCanvas(draw: (cv: HTMLCanvasElement) => void, deps: unknown[]) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    let raf = 0, w = 0, h = 0
    const run = () => {
      if (cv.clientWidth === w && cv.clientHeight === h) return
      w = cv.clientWidth; h = cv.clientHeight
      cancelAnimationFrame(raf); raf = requestAnimationFrame(() => draw(cv))
    }
    run()
    const ro = new ResizeObserver(run)
    ro.observe(cv)
    return () => { ro.disconnect(); cancelAnimationFrame(raf); (cv as any)._stop?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

let villeImg: HTMLImageElement | null = null
function loadVille(cb: (img: HTMLImageElement) => void) {
  if (villeImg?.complete && villeImg.naturalWidth) return cb(villeImg)
  villeImg = villeImg || Object.assign(new Image(), { crossOrigin: "anonymous", src: assets.city })
  villeImg.addEventListener("load", () => cb(villeImg!), { once: true })
}

/* Trame de jour de la ville et ville de nuit éclairée : variables du thème (repli = valeurs de jour) */
const CITY_DAY = ["var(--city-1, #6E4226)", "var(--city-2, #B98259)", "var(--city-3, #E8D6C0)"]
const CITY_NIGHT = ["var(--city-1)", "var(--city-2)", "var(--city-light-1)", "var(--city-light-2)", "var(--city-light-3)"]

/** La ville du site, tramée en points d'encre. `paper` = fond sur lequel elle se fond. Parent positionné requis.
    De nuit (jeton `--city-mode: nocturne` du thème), elle devient la ville de nuit éclairée, quel que soit `mode` ;
    `palette` est la trame de jour (par défaut les jetons `--city-1..3`), `nightPalette` celle de nuit (`--city-1/2`, `--city-light-1..3`).
    Se redessine seule au changement de thème, sans rejouer l'apparition. */
export function CityDots({ paper = "var(--background, #FBF9F5)", mode = "dither", focusY = 0.5, cell = 3, reveal = 1.4, gamma = 1, contrast = 1.15, lift = 0, palette, nightPalette, className }: {
  paper?: string; mode?: "dither" | "halftone" | "nocturne"; focusY?: number; cell?: number; reveal?: number; gamma?: number; contrast?: number; lift?: number; palette?: string[]; nightPalette?: string[]; className?: string
}) {
  const theme = useThemeSignature()
  const shown = useRef(false)
  const ref = useCanvas((cv) => loadVille((img) => {
    const night = mode === "nocturne" || getComputedStyle(cv).getPropertyValue("--city-mode").trim() === "nocturne"
    const pal = night ? (nightPalette || CITY_NIGHT) : (palette || CITY_DAY)
    Art.ditherImage(cv, img, { mode: night ? "nocturne" : mode, focusY, cell, reveal: shown.current ? 0 : reveal, gamma, contrast, lift, palette: [...pal, paper] })
    shown.current = true
  }), [paper, mode, focusY, cell, gamma, contrast, lift, (palette || []).join(), (nightPalette || []).join(), theme])
  return <canvas ref={ref} className={cn("absolute inset-0 block size-full", className)} aria-hidden />
}

/** Champ de points animé (variante de marque, à utiliser avec parcimonie). Couleurs : jetons `--dots`, `--dots-accent` (pierre et ambre de nuit). */
export function DotField({ color = "var(--dots, #AA4F13)", accent = "var(--dots-accent, #E3CDB3)", gap = 11, alpha = 0.55, focus = { x: 0.82, y: 0.45 }, className }: { color?: string; accent?: string; gap?: number; alpha?: number; focus?: { x: number; y: number }; className?: string }) {
  const theme = useThemeSignature()
  const ref = useCanvas((cv) => Art.dots(cv, { color, accent, gap, alpha, focus }), [color, accent, gap, alpha, theme])
  return <canvas ref={ref} className={cn("absolute inset-0 block size-full", className)} aria-hidden />
}

/** Graphique en points : barres faites de points, montée à l'apparition. Couleurs : texte, action principale, `--dotchart-dim`. */
export function DotChart({ values, color = "var(--foreground, #1C1B1A)", accent = "var(--primary, #AA4F13)", dim = "var(--dotchart-dim, #C9BFB0)", gap = 5, className }: { values: number[]; color?: string; accent?: string; dim?: string; gap?: number; className?: string }) {
  const theme = useThemeSignature()
  const ref = useCanvas((cv) => Art.dotChart(cv, { values, color, accent, dim, gap }), [values.join(","), color, accent, dim, theme])
  return <canvas ref={ref} className={cn("absolute inset-0 block size-full", className)} aria-hidden />
}

/** Logotype officiel : noir de jour, blanc de nuit (`assets.logoLight`), sans script ni flash (CSS `dark:`).
    Donner une hauteur (`h-5 w-auto`) : le fichier contient déjà le mot « Meridiem ». */
export function Logo({ className, alt = "Meridiem" }: { className?: string; alt?: string }) {
  return (
    <>
      <img src={assets.logo} alt={alt} className={cn(className, "dark:hidden")} />
      <img src={assets.logoLight} alt={alt} className={cn(className, "hidden dark:inline-block")} />
    </>
  )
}

/** Icône seule (sans le mot), ratio 1,79 : jamais écrasée (`object-contain`, hauteur auto par défaut), blanche de nuit.
    Donner une largeur (`w-10`) ; pour une case carrée, `assets.markSquare` / `assets.markSquareLight`. */
export function Mark({ className, alt = "Meridiem" }: { className?: string; alt?: string }) {
  return <img src={assets.mark} alt={alt} className={cn("h-auto object-contain dark:invert", className)} />
}

/* ======================= Cartes animées ======================= */
const C30 = Math.cos(Math.PI / 6)
type Pt = [number, number]
/* Arrondi à 0,01 : sans lui, le dernier chiffre de cos/sin diffère entre Node et le navigateur et l'hydratation signale un écart d'attribut. */
const r2 = (v: number) => Math.round(v * 100) / 100
const P = (x: number, y: number, z: number, s: number): Pt => [r2((x - y) * C30 * s), r2((x + y) * 0.5 * s - z * s)]
const pts = (a: Pt[]) => a.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ")
const clamp = (v: number) => Math.max(0, Math.min(1, v))
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3)

function Face({ points, accent, soft }: { points: Pt[]; accent?: boolean; soft?: boolean }) {
  return <polygon points={pts(points)} className={accent ? "fill-primary stroke-primary" : soft ? "fill-secondary stroke-current" : "fill-card stroke-current"} strokeWidth={1} strokeLinejoin="round" />
}
function Box({ x0, y0, x1, y1, z = 0, h, s, accentTop }: { x0: number; y0: number; x1: number; y1: number; z?: number; h: number; s: number; accentTop?: boolean }) {
  return (
    <g>
      <Face points={[P(x0, y1, z, s), P(x1, y1, z, s), P(x1, y1, z + h, s), P(x0, y1, z + h, s)]} />
      <Face points={[P(x1, y0, z, s), P(x1, y1, z, s), P(x1, y1, z + h, s), P(x1, y0, z + h, s)]} />
      <Face accent={accentTop} points={[P(x0, y0, z + h, s), P(x1, y0, z + h, s), P(x1, y1, z + h, s), P(x0, y1, z + h, s)]} />
    </g>
  )
}
const arc = (R: number, z: number, a0: number, a1: number, n: number, s: number) => Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return P(R * Math.cos(t), R * Math.sin(t), z, s) })
const polar = (cx: number, cy: number, r: number, a: number): Pt => [r2(cx + r * Math.cos(a)), r2(cy + r * Math.sin(a))]
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1)
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
}

/* Barres isométriques qui montent en vague */
function Bars({ k }: { k: number }) {
  const s = 9, H = [1.2, 2.1, 1.6, 2.8, 3.8], kk = (i: number) => Math.max(0.05, Math.min(1, k * 1.6 - i * 0.15))
  const last = H.length - 1, top = P(last * 1.5 + 0.5, 0.5, H[last] * kk(last) + 0.55, s)
  return (
    <svg viewBox="-20 -14 84 57" className="size-full">
      <polygon points={pts([P(-0.6, -0.6, 0, s), P(7.2, -0.6, 0, s), P(7.2, 1.6, 0, s), P(-0.6, 1.6, 0, s)])} fill="none" className="stroke-current" strokeDasharray="2 3" opacity={0.5} />
      {H.map((h, i) => <Box key={i} x0={i * 1.5} y0={0} x1={i * 1.5 + 1} y1={1} h={h * kk(i)} s={s} />)}
      <circle cx={top[0]} cy={top[1]} r={3.4} className="fill-primary" />
    </svg>
  )
}
/* Camembert isométrique : une part se soulève */
function Pie({ k }: { k: number }) {
  const s = 9, R = 3.4, h = 0.8, lift = 0.9 * k, f0 = -Math.PI / 4, f1 = (3 * Math.PI) / 4, a0 = -0.35, a1 = 0.9
  return (
    <svg viewBox="-40 -31 80 55" className="size-full">
      <Face points={[...arc(R, h, f0, f1, 40, s), ...arc(R, 0, f1, f0, 40, s)]} />
      <Face points={arc(R, h, 0, Math.PI * 2, 72, s)} />
      {[0.9, 2.3, 3.6, 5.0].map((t) => { const a = P(0, 0, h, s), b = P(R * Math.cos(t), R * Math.sin(t), h, s); return <line key={t} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="stroke-current" /> })}
      <Face accent points={[...arc(R, h + lift, Math.max(a0, f0), Math.min(a1, f1), 20, s), ...arc(R, lift, Math.min(a1, f1), Math.max(a0, f0), 20, s)]} />
      <Face accent points={[P(0, 0, h + lift, s), ...arc(R, h + lift, a0, a1, 24, s)]} />
    </svg>
  )
}
/* Cadran solaire : l'ombre tourne */
function Dial({ k }: { k: number }) {
  const s = 9, R = 3.6, h = 0.45, th = -2.3 + k * 2.6
  const tip = P(R * 0.78 * Math.cos(th), R * 0.78 * Math.sin(th), h, s)
  return (
    <svg viewBox="-42 -30 84 56" className="size-full">
      <Face points={[...arc(R, h, -Math.PI / 4, (3 * Math.PI) / 4, 40, s), ...arc(R, 0, (3 * Math.PI) / 4, -Math.PI / 4, 40, s)]} />
      <Face points={arc(R, h, 0, Math.PI * 2, 72, s)} />
      {Array.from({ length: 12 }, (_, i) => { const t = (i / 12) * Math.PI * 2, a = P(R * 0.82 * Math.cos(t), R * 0.82 * Math.sin(t), h, s), b = P(R * 0.95 * Math.cos(t), R * 0.95 * Math.sin(t), h, s); return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="stroke-current" /> })}
      <polygon points={pts([P(0, 0, h, s), P(0.18 * Math.cos(th + 1.57), 0.18 * Math.sin(th + 1.57), h, s), tip])} className="fill-primary" opacity={0.85} />
      <Face points={[P(0, 0, h, s), P(-R * 0.62, 0, h, s), P(0, 0, h + 2.6, s)]} />
      <circle cx={tip[0]} cy={tip[1]} r={3} className="fill-primary" />
    </svg>
  )
}
/* Pile de documents qui s'écarte, la feuille du haut se colore */
function Stack({ k }: { k: number }) {
  const s = 10, n = 4, e = ease(k), gap = 0.18 + 0.75 * e
  return (
    <svg viewBox="-33 -50 77 71" className="size-full">
      {Array.from({ length: n }, (_, i) => {
        const z = i * gap, top = i === n - 1, dx = top ? 0.6 * e : 0
        return (
          <g key={i}>
            <Box x0={-2 + dx} y0={-1.5 - dx} x1={2 + dx} y1={1.5 - dx} z={z} h={0.16} s={s} accentTop={top && k > 0.4} />
            {top && [0, 1, 2].map((l) => { const a = P(-1.3 + dx, -0.9 + l * 0.7 - dx, z + 0.17, s), b = P(1.3 - l * 0.5 + dx, -0.9 + l * 0.7 - dx, z + 0.17, s); return <line key={l} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={k > 0.4 ? "stroke-primary-foreground" : "stroke-current"} strokeWidth={1} /> })}
          </g>
        )
      })}
    </svg>
  )
}
/* Grille de cubes qui s'élève en vague, de l'arrière vers l'avant */
function Cubes({ k }: { k: number }) {
  const s = 7, V = [[1, 2, 1, 3], [2, 4, 2, 1], [1, 3, 5, 2], [2, 1, 2, 4]]
  const cells: { x: number; y: number; v: number }[] = []
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) cells.push({ x, y, v: V[y][x] })
  return (
    <svg viewBox="-29 -14 58 48" className="size-full">
      {cells.map(({ x, y, v }) => {
        const d = (x + y) / 6, hh = 0.25 + (v / 5) * 3 * ease(k * 1.8 - d)
        return <Box key={x + "-" + y} x0={x * 1.15} y0={y * 1.15} x1={x * 1.15 + 1} y1={y * 1.15 + 1} h={hh} s={s} accentTop={v === 5 && k > 0.3} />
      })}
    </svg>
  )
}
/* Jauge : l'aiguille balaie jusqu'à la valeur, l'arc se remplit */
function Gauge({ k, value = 0.72 }: { k: number; value?: number }) {
  const a0 = Math.PI, a1 = 2 * Math.PI, v = ease(k) * value, av = a0 + (a1 - a0) * v, [nx, ny] = polar(40, 44, 26, av)
  return (
    <svg viewBox="3 6 74 44" className="size-full">
      <path d={arcPath(40, 44, 32, a0, a1)} fill="none" className="stroke-current" strokeWidth={6} strokeLinecap="round" opacity={0.18} />
      {v > 0.005 && <path d={arcPath(40, 44, 32, a0, av)} fill="none" className="stroke-primary" strokeWidth={6} strokeLinecap="round" />}
      {Array.from({ length: 11 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / 10, [x0, y0] = polar(40, 44, 22, a), [x1, y1] = polar(40, 44, i % 5 ? 24 : 20, a); return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} className="stroke-current" strokeWidth={1} /> })}
      <line x1={40} y1={44} x2={nx} y2={ny} className="stroke-foreground" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={40} cy={44} r={3} className="fill-foreground" />
    </svg>
  )
}
/* Courbe qui se trace, aire qui apparaît, point final */
function Line({ k }: { k: number }) {
  const Y = [30, 26, 28, 20, 22, 14, 16, 8], d = Y.map((y, i) => `${i ? "L" : "M"}${(i * 80) / (Y.length - 1)} ${y}`).join(" "), len = 130, e = ease(k)
  return (
    <svg viewBox="-3 4 86 38" className="size-full">
      <line x1={0} y1={38} x2={80} y2={38} className="stroke-current" opacity={0.3} />
      <path d={d + " L80 38 L0 38 Z"} className="fill-primary" opacity={0.12 * e} />
      <path d={d} fill="none" className="stroke-primary" strokeWidth={1.5} strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - Math.max(0.35, e))} />
      <circle cx={80} cy={Y[Y.length - 1]} r={3} className="fill-primary" opacity={e > 0.95 ? 1 : 0.25} />
    </svg>
  )
}
/* Enveloppe qui s'ouvre : le rabat bascule derrière, la lettre monte (ordre de dessin = profondeur) */
function Envelope({ k }: { k: number }) {
  const e = ease(k), tipY = 26 + 18 * Math.cos(Math.PI * e), letterY = 30 - 22 * e, open = tipY < 26
  const flap = <path d={`M12 26 L40 ${tipY.toFixed(2)} L68 26 Z`} className={open ? "fill-secondary stroke-current" : "fill-card stroke-current"} strokeLinejoin="round" />
  return (
    <svg viewBox="6 2 68 58" className="size-full">
      <rect x={12} y={26} width={56} height={30} rx={2} className="fill-secondary stroke-current" />
      {open && flap}
      <rect x={18} y={letterY} width={44} height={30} rx={2} className="fill-card stroke-current" />
      {[0, 1, 2].map((i) => <line key={i} x1={24} y1={letterY + 7 + i * 6} x2={i === 2 ? 44 : 56} y2={letterY + 7 + i * 6} className={i === 0 ? "stroke-primary" : "stroke-current"} strokeWidth={1.5} strokeLinecap="round" />)}
      <path d="M12 26 L40 44 L68 26 L68 56 L12 56 Z" className="fill-card stroke-current" strokeLinejoin="round" />
      <path d="M12 56 L34 40 M68 56 L46 40" className="stroke-current" fill="none" />
      {!open && flap}
    </svg>
  )
}
/* Anneaux d'objectifs qui se remplissent */
function Rings({ k }: { k: number }) {
  const R = [{ r: 24, v: 0.82 }, { r: 17, v: 0.64 }, { r: 10, v: 0.45 }], e = ease(k)
  return (
    <svg viewBox="4 4 56 56" className="size-full">
      {R.map(({ r, v }, i) => (
        <g key={r}>
          <circle cx={32} cy={32} r={r} fill="none" className="stroke-current" strokeWidth={4} opacity={0.15} />
          <circle cx={32} cy={32} r={r} fill="none" className={i === 0 ? "stroke-primary" : "stroke-current"} strokeWidth={4} strokeLinecap="round" strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - Math.max(0.04, e * v))} transform="rotate(-90 32 32)" opacity={i === 0 ? 1 : 0.55 + i * 0.1} />
        </g>
      ))}
    </svg>
  )
}

export type IsoKind = "bars" | "pie" | "dial" | "stack" | "cubes" | "gauge" | "line" | "envelope" | "rings"
const ART: Record<IsoKind, (p: { k: number }) => React.ReactElement> = { bars: Bars, pie: Pie, dial: Dial, stack: Stack, cubes: Cubes, gauge: Gauge, line: Line, envelope: Envelope, rings: Rings }
const REST: Partial<Record<IsoKind, number>> = { bars: 1, cubes: 0.55, line: 1, gauge: 1, rings: 1 }

/** Illustration animée : au survol (`active`), elle rejoue son mouvement (ressort Motion, interruptible). */
export function IsoArt({ kind, active, className }: { kind: IsoKind; active: boolean; className?: string }) {
  const rest = REST[kind] ?? 0
  const [k, setK] = useState(rest)
  const kRef = useRef(rest)
  const reduce = useReducedMotion()
  useEffect(() => {
    const replay = rest === 1 && active
    const from = replay ? 0 : kRef.current, to = active ? 1 : rest
    if (reduce || from === to) { kRef.current = to; setK(to); return }
    const controls = animate(from, to, {
      type: "spring", stiffness: active ? 110 : 170, damping: active ? 17 : 26,
      onUpdate: (v) => { kRef.current = v; setK(v) },
    })
    return () => controls.stop()
  }, [active, rest, reduce])
  const C = ART[kind]
  return <div className={cn("size-full text-muted-foreground", className)} aria-hidden><C k={k} /></div>
}

/* ---------- Statut : une pastille ET un mot, jamais la couleur seule ---------- */
export type Status = "ok" | "warn" | "wait" | "crit" | "info" | "neutral"
const STATUS_CLASS: Record<Status, string> = {
  ok: "text-ok bg-ok/8 border-ok/20",
  warn: "text-warn bg-warn/8 border-warn/20",
  wait: "text-wait bg-wait/8 border-wait/20",
  crit: "text-crit bg-crit/8 border-crit/20",
  info: "text-info bg-info/8 border-info/20",
  /* Neutre : clos, retiré, sans suite (refusé, annulé, terminé). Le mot porte l'information. */
  neutral: "text-muted-foreground bg-muted border-border",
}
export function StatusBadge({ status, children, className }: { status: Status; children: React.ReactNode; className?: string }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", STATUS_CLASS[status], className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </Badge>
  )
}

/* Palette des graphiques (validée au script dataviz le 04/10 : bande de clarté, chroma, daltonisme, contraste) */
export const CHART = { c1: "#AA4F13", c2: "#3F6FB0", c3: "#C2861A", c4: "#0E8C7C", c5: "#8E4F8A" }
