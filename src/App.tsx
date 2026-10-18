import { useEffect, useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import Platform from "@/components/meridiem/platform/Platform"
import Landing from "@/components/meridiem/landing"
import Kit from "@/screens/Kit"
import { ThemeProvider, useTheme } from "@/components/meridiem/theme"

const SCREENS = { platform: "Plateforme", landing: "Landing", kit: "Kit" } as const
type Screen = keyof typeof SCREENS

function readHash(): Screen {
  const h = window.location.hash.replace("#", "")
  return (h in SCREENS ? h : "platform") as Screen
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(readHash)
  useEffect(() => {
    const on = () => setScreen(readHash())
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])
  const go = (s: Screen) => {
    setScreen(s)
    try { history.replaceState(null, "", "#" + s) } catch { /* cadre d'artifact */ }
    window.scrollTo(0, 0)
  }
  return (
    <ThemeProvider>
    <MotionConfig reducedMotion="user">
    <TooltipProvider>
      {/* Changement d'écran : fondu seul (une translation casserait la sidebar en position fixe) */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {screen === "platform" && <Platform />}
          {screen === "landing" && <Landing />}
          {screen === "kit" && <Kit />}
        </motion.div>
      </AnimatePresence>
      <ThemedToaster />
      {/* Sélecteur de maquette : hors design system */}
      <nav aria-label="Maquettes" className="fixed right-4 bottom-4 z-50 flex items-center gap-1 rounded-full border border-white/10 bg-[#1C1B1A]/90 p-1 text-[13px] text-[#F6F3ED] shadow-lift backdrop-blur" style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <span className="hidden px-3 font-heading text-sm sm:inline">Olympe</span>
        {(Object.keys(SCREENS) as Screen[]).map((s) => (
          <button key={s} onClick={() => go(s)} aria-pressed={screen === s} className={cn("rounded-full px-3 py-1.5 transition-colors", screen === s ? "bg-[#F6F3ED] text-[#1C1B1A]" : "hover:bg-white/10")}>
            {SCREENS[s]}
          </button>
        ))}
      </nav>
    </TooltipProvider>
    </MotionConfig>
    </ThemeProvider>
  )
}

/* Le Toaster de shadcn lit next-themes : sans son fournisseur, il suit le système et non le choix de la page. On lui passe le thème effectif. */
function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  return <Toaster position="top-center" richColors={false} theme={resolvedTheme} />
}
