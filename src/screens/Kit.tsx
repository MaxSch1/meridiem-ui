/* Kit Olympe : la référence que les agents consultent avant toute interface Meridiem. */
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { Colors, Typography, Icons } from "@/kit/foundations"
import { Actions, Forms, Statuses, Navigation, Feedback } from "@/kit/components"
import { Sidebars, Cards, AnimatedCards, Tables, Charts, PageSections, BrandVisuals } from "@/kit/layouts"
import { Logo } from "@/components/meridiem/brand"

const TOC = [
  { g: "Fondations", items: [["couleurs", "Couleurs"], ["typo", "Typographie"], ["icones", "Icônes"]] },
  { g: "Composants", items: [["actions", "Actions"], ["formulaires", "Formulaires"], ["statuts", "Statuts et badges"], ["navigation", "Navigation"], ["retours", "Retours et fenêtres"]] },
  { g: "Structures", items: [["menus", "Menus latéraux"], ["cartes", "Cartes"], ["cartes-animees", "Cartes animées"], ["tables", "Tables"], ["graphiques", "Graphiques"]] },
  { g: "Marque", items: [["sections", "Sections de page"], ["visuels", "Visuels de marque"]] },
]

export default function Kit() {
  const [active, setActive] = useState("couleurs")
  useEffect(() => {
    const els = TOC.flatMap((g) => g.items.map(([id]) => document.getElementById(id))).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (vis[0]) setActive(vis[0].target.id)
    }, { rootMargin: "-10% 0px -70% 0px" })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
  const jump = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); setActive(id) }
  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 md:px-6">
      <aside className="sticky top-0 hidden h-svh w-56 shrink-0 flex-col gap-6 overflow-y-auto py-10 lg:flex">
        <div className="flex flex-col gap-1 px-2">
          <Logo className="h-4 w-fit" />
          <span className="font-heading text-2xl">Kit Olympe</span>
        </div>
        <nav className="flex flex-col gap-5">
          {TOC.map((g) => (
            <div key={g.g} className="flex flex-col gap-0.5">
              <span className="eyebrow px-2 pb-1">{g.g}</span>
              {g.items.map(([id, l]) => (
                <button key={id} onClick={() => jump(id)} className={cn("relative isolate rounded-md px-2 py-1.5 text-left text-sm transition-colors", active === id ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {active === id && <motion.span layoutId="toc-pill" className="absolute inset-0 -z-10 rounded-md bg-sidebar-accent" transition={{ type: "spring", stiffness: 480, damping: 40 }}><span className="absolute top-1/2 -left-0.5 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" /></motion.span>}
                  {l}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col gap-16 py-10 pb-32">
        <header className="flex flex-col gap-3">
          <span className="eyebrow text-primary">Design system Meridiem</span>
          <h1 className="font-heading text-5xl md:text-6xl">Olympe</h1>
          <p className="max-w-prose text-muted-foreground">Ivoire et encre, titres en EB Garamond, interface en Geist, icônes Hugeicons. Composants shadcn/ui (Radix) habillés par les variables du thème, graphiques Recharts, tables TanStack. Tout ce qui est ici est cliquable.</p>
        </header>
        <Colors /><Typography /><Icons />
        <Actions /><Forms /><Statuses /><Navigation /><Feedback />
        <Sidebars /><Cards /><AnimatedCards /><Tables /><Charts />
        <PageSections /><BrandVisuals />
      </main>
    </div>
  )
}
