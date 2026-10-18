"use client"
/* Apparence Olympe : Jour, Nuit ou Système, mémorisé, posé en data-theme sur <html> (plus la classe .dark de shadcn).
   - ThemeProvider : l'état et son application ; Jour par défaut.
   - ThemeScript (ou themeScript) : à mettre dans <head>, pose le thème avant le premier affichage (aucun flash).
   - ThemeSubmenu : l'entrée « Apparence » du menu du compte, qui ouvre un sous-menu Jour, Nuit, Système (règle de DESIGN.md).
   Mêmes valeurs et même clé de stockage que la version sans framework (MUI.setTheme) : "light", "dark", "auto". */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react"
import { ArrowRight01Icon, Layers01Icon, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import {
  DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/meridiem/brand"
import { cn } from "@/lib/utils"

export type Theme = "light" | "dark" | "auto"
export const THEME_LABELS: Record<Theme, string> = { light: "Jour", dark: "Nuit", auto: "Système" }
export const THEME_STORAGE_KEY = "olympe-theme"

const isTheme = (v: unknown): v is Theme => v === "light" || v === "dark" || v === "auto"
const media = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null)

/** Script à exécuter avant l'affichage (dans <head>) : lit le choix mémorisé et pose data-theme et .dark sur <html>. */
export function themeScript(storageKey = THEME_STORAGE_KEY, defaultTheme: Theme = "light") {
  return `(function(){try{var d=document.documentElement,t=localStorage.getItem(${JSON.stringify(storageKey)});if(t!=="light"&&t!=="dark"&&t!=="auto")t=${JSON.stringify(defaultTheme)};d.setAttribute("data-theme",t);var n=t==="dark"||(t==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);d.classList.toggle("dark",n);}catch(e){}})()`
}

/** Version composant du script, pour Next.js : <html suppressHydrationWarning><head><ThemeScript /></head>… */
export function ThemeScript({ storageKey, defaultTheme }: { storageKey?: string; defaultTheme?: Theme }) {
  return <script dangerouslySetInnerHTML={{ __html: themeScript(storageKey, defaultTheme) }} />
}

/* Petit magasin partagé : le choix courant, lu dans le stockage du navigateur. */
let current: Theme | null = null
const listeners = new Set<() => void>()
function read(storageKey: string, fallback: Theme): Theme {
  if (current) return current
  try { const v = localStorage.getItem(storageKey); if (isTheme(v)) return (current = v) } catch { /* stockage indisponible */ }
  const attr = typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme") : null
  return (current = isTheme(attr) ? attr : fallback)
}
function apply(theme: Theme) {
  const d = document.documentElement
  d.setAttribute("data-theme", theme)
  d.classList.toggle("dark", theme === "dark" || (theme === "auto" && !!media()?.matches))
}

type Ctx = { theme: Theme; resolvedTheme: "light" | "dark"; setTheme: (t: Theme) => void }
const ThemeContext = createContext<Ctx | null>(null)

/** Fournit le choix d'apparence. `defaultTheme` : Jour. `initialTheme` : valeur lue côté serveur (cookie `olympe-theme`, Next.js),
    pour que le premier rendu montre déjà la bonne valeur dans le menu. Le choix est gardé dans le stockage du navigateur et dans
    un cookie du même nom (lisible par le serveur). */
export function ThemeProvider({ children, defaultTheme = "light", initialTheme, storageKey = THEME_STORAGE_KEY }: {
  children: React.ReactNode; defaultTheme?: Theme; initialTheme?: Theme; storageKey?: string
}) {
  const subscribe = useCallback((cb: () => void) => {
    listeners.add(cb)
    const mq = media()
    const onSystem = () => { if (current === "auto") apply("auto"); cb() }
    const onStorage = (e: StorageEvent) => { if (e.key === storageKey && isTheme(e.newValue)) { current = e.newValue; apply(e.newValue); listeners.forEach((l) => l()) } }
    mq?.addEventListener("change", onSystem)
    window.addEventListener("storage", onStorage)
    return () => { listeners.delete(cb); mq?.removeEventListener("change", onSystem); window.removeEventListener("storage", onStorage) }
  }, [storageKey])
  const theme = useSyncExternalStore(subscribe, () => read(storageKey, defaultTheme), () => initialTheme ?? defaultTheme)
  const systemDark = useSyncExternalStore(subscribe, () => !!media()?.matches, () => false)
  const resolvedTheme = theme === "dark" || (theme === "auto" && systemDark) ? "dark" : "light"

  // Sans script en tête, le thème est posé ici (après le premier affichage) ; avec le script, ce geste ne change rien.
  // On applique la valeur du magasin, pas celle du rendu : pendant l'hydratation, le rendu montre encore la valeur du serveur.
  useEffect(() => { apply(read(storageKey, defaultTheme)) }, [theme, storageKey, defaultTheme])

  const setTheme = useCallback((t: Theme) => {
    current = t
    apply(t)
    try { localStorage.setItem(storageKey, t) } catch { /* stockage indisponible */ }
    try { document.cookie = `${storageKey}=${t}; path=/; max-age=31536000; samesite=lax` } catch { /* cadre sans cookie */ }
    listeners.forEach((l) => l())
  }, [storageKey])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]) as Ctx
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** Le choix courant (`theme`), le thème effectif (`resolvedTheme`) et `setTheme`. */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme : envelopper l'application dans <ThemeProvider>")
  return ctx
}

/* Téléphone : pas la place d'un sous-menu à côté du menu, il s'ouvre en place sous l'entrée (comme MUI.menu sans framework). */
const NARROW = "(max-width: 639px)"
function subscribeNarrow(cb: () => void) {
  const mq = window.matchMedia?.(NARROW)
  mq?.addEventListener("change", cb)
  return () => mq?.removeEventListener("change", cb)
}
const useNarrow = () => useSyncExternalStore(subscribeNarrow, () => !!window.matchMedia?.(NARROW).matches, () => false)

/** Entrée « Apparence » d'un menu du compte (dans un DropdownMenuContent) : icône, libellé, valeur courante, chevron ;
    elle ouvre un sous-menu Jour, Nuit, Système à cocher (en place sous l'entrée sur téléphone). `onChange` : effet visible en plus (toast). */
/* `label` et `labels` traduisent l'entrée et les trois valeurs (interface bilingue). */
export function ThemeSubmenu({ label = "Apparence", labels = THEME_LABELS, note, onChange }: { label?: string; labels?: Record<Theme, string>; note?: React.ReactNode; onChange?: (theme: Theme, resolved: "light" | "dark") => void }) {
  const { theme, setTheme } = useTheme()
  const narrow = useNarrow()
  const [unfolded, setUnfolded] = useState(false)
  const choose = (v: string) => {
    if (!isTheme(v)) return
    setTheme(v)
    onChange?.(v, v === "dark" || (v === "auto" && !!media()?.matches) ? "dark" : "light")
  }
  const options = (
    <DropdownMenuRadioGroup value={theme} onValueChange={choose}>
      <DropdownMenuRadioItem value="light"><Icon icon={Sun03Icon} />{labels.light}</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="dark"><Icon icon={Moon02Icon} />{labels.dark}</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="auto"><Icon icon={Layers01Icon} />{labels.auto}</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  )
  const noteEl = note ? <p className="px-1.5 pt-1.5 pb-1 text-xs text-muted-foreground">{note}</p> : null
  const head = (
    <>
      <Icon icon={Moon02Icon} />
      <span className="flex-1">{label}</span>
      <span className="text-xs text-muted-foreground">{labels[theme]}</span>
    </>
  )
  if (narrow) return (
    <>
      <DropdownMenuItem aria-expanded={unfolded} onSelect={(e) => { e.preventDefault(); setUnfolded((o) => !o) }}>
        {head}
        <Icon icon={ArrowRight01Icon} strokeWidth={2} className={cn("transition-transform", unfolded && "rotate-90")} />
      </DropdownMenuItem>
      {unfolded ? <div className="pl-5">{options}{noteEl}</div> : null}
    </>
  )
  return (
    <DropdownMenuSub>
      {/* Le chevron est posé par DropdownMenuSubTrigger ; le libellé prend la place pour pousser la valeur à droite. */}
      <DropdownMenuSubTrigger>{head}</DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-44">{options}{noteEl}</DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
