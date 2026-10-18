"use client"
/* Micro landing Meridiem : héros sur la ville en points (comme le site actuel), quatre cartes, bloc final, prise de rendez-vous. */
import { useState } from "react"
import { Globe02Icon, SecurityCheckIcon, ServerStack01Icon, Key01Icon, Mail01Icon, File01Icon, InboxIcon, Invoice01Icon, Calendar03Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { fr } from "react-day-picker/locale"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CityDots, DotField, Icon, Logo, Mark, StatusBadge } from "@/components/meridiem/brand"
import { cn } from "@/lib/utils"

const AGENTS = [
  { name: "Agent commercial", task: "Relances de devis", icon: Mail01Icon, running: true },
  { name: "Agent administratif", task: "Tri de la boîte info@", icon: InboxIcon },
  { name: "Agent devis", task: "Devis depuis les demandes", icon: File01Icon },
  { name: "Agent comptable", task: "Encodage des factures", icon: Invoice01Icon },
]
const TOOLS = ["Outlook", "Teams", "Odoo", "Excel"]
const SLOTS = ["09:30", "10:00", "11:30", "14:00", "15:30", "16:30"]

function Cell({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-10">
      <div className="flex min-h-56 items-center justify-center">{children}</div>
      <div>
        <h3 className="font-heading text-2xl">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

function BookingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [day, setDay] = useState<Date | undefined>(new Date(2026, 9, 8))
  const [slot, setSlot] = useState<string | null>(null)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-normal">Réserver un audit gratuit de 30 min</DialogTitle>
          <DialogDescription>Un appel vidéo avec Maxime Schifflers. Choisissez un jour puis un créneau.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
          <Calendar mode="single" selected={day} onSelect={(d) => { setDay(d); setSlot(null) }} locale={fr} defaultMonth={new Date(2026, 9, 1)} disabled={(d) => d.getDay() === 0 || d.getDay() === 6 || d < new Date(2026, 9, 5)} className="rounded-lg border" />
          <div className="flex flex-col gap-2">
            <span className="eyebrow">{day ? day.toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long" }) : "Choisissez un jour"}</span>
            <div className="grid grid-cols-2 gap-2">
              {SLOTS.map((s) => (
                <Button key={s} variant={slot === s ? "default" : "outline"} disabled={!day} onClick={() => setSlot(s)} className="num">{s}</Button>
              ))}
            </div>
            <p className="mt-auto text-xs text-muted-foreground">Heure de Bruxelles. Lien de visio envoyé par mail.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!slot} onClick={() => { onOpenChange(false); toast.success("Rendez-vous demandé", { description: `${day?.toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long" })} à ${slot}. Confirmation par mail.` }); setSlot(null) }}>
            <Icon icon={Calendar03Icon} />Confirmer le rendez-vous
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Landing() {
  const [booking, setBooking] = useState(false)
  const book = () => setBooking(true)
  return (
    <div className="min-h-svh bg-background">
      {/* Héros : la ville du site, tramée en points */}
      <section className="relative isolate flex min-h-[820px] flex-col overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <CityDots focusY={0} cell={2} lift={0.16} contrast={1.15} reveal={1.8} />
          <div className="absolute inset-x-0 top-0 h-[88%] bg-gradient-to-b from-background from-45% via-background/85 to-transparent md:h-[74%] md:from-35%" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
        <header className="mx-auto flex w-full max-w-6xl items-center gap-8 px-6 py-5">
          <Logo className="h-5 w-auto" />
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            {["Solutions", "Références", "Notre modèle", "Presse"].map((l) => <a key={l} href="#landing" className="transition-colors hover:text-foreground">{l}</a>)}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline">FR · EN</span>
            <Button size="sm" onClick={book}>Réserver un appel</Button>
          </div>
        </header>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pt-12 text-center md:pt-14">
          <span className="eyebrow text-primary">Première entreprise d'Europe opérée par l'IA</span>
          <h1 className="font-heading text-[2.6rem] leading-[1.05] tracking-tight text-balance md:text-[3.8rem]">
            Votre partenaire pour intégrer l'IA dans vos opérations. <em className="text-muted-foreground">Rapidement, et en toute sécurité.</em>
          </h1>
          <p className="max-w-[54ch] text-base leading-relaxed text-muted-foreground md:text-lg">Meridiem est le partenaire européen qui construit votre intelligence sur mesure : logiciels, automatisations et agents IA. Et elle vous appartient.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button className="h-11 px-5 text-[15px]" onClick={book}>Réserver un audit gratuit de 30 min</Button>
            <Button variant="outline" className="h-11 bg-background/80 px-5 text-[15px] backdrop-blur">Voir nos références</Button>
          </div>
          <div className="flex flex-wrap justify-center gap-5 rounded-2xl bg-background/85 px-4 py-1.5 text-sm md:rounded-full text-muted-foreground backdrop-blur">
            <span className="inline-flex items-center gap-1.5"><Icon icon={Globe02Icon} />Hébergement en Europe</span>
            <span className="inline-flex items-center gap-1.5"><Icon icon={SecurityCheckIcon} />Conforme RGPD</span>
          </div>
        </div>
      </section>

      {/* Ce que font les agents */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <span className="eyebrow">Notre modèle</span>
          <h2 className="max-w-[22ch] font-heading text-4xl leading-tight text-balance md:text-5xl">Des agents qui exécutent, vous qui décidez.</h2>
        </div>
        <div className="hairline-grid md:grid-cols-2">
          <Cell title="Des agents à qui confier le travail" text="Chaque agent reprend une tâche précise, dans vos outils, avec vos règles.">
            <div className="flex w-full max-w-sm flex-col gap-2.5">
              {AGENTS.map((a) => (
                <div key={a.name} className={cn("group flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition-all duration-300 hover:scale-[1.03] hover:shadow-lift", a.running ? "scale-[1.04] shadow-lift" : "shadow-soft")}>
                  <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"><Icon icon={a.icon} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="font-heading text-[15px] leading-tight">{a.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{a.task}</div>
                  </div>
                  {a.running ? <span className="rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-ivory dark:bg-foreground dark:text-background">En cours</span> : <Button size="xs" variant="outline" onClick={() => toast.success(a.name + " assigné")}>Assigner</Button>}
                </div>
              ))}
            </div>
          </Cell>
          <Cell title="Vous validez ce qui engage" text="Un devis, un mail à un client, un paiement : rien ne part sans votre accord.">
            <div className="flex w-full max-w-sm flex-col gap-2.5">
              {[
                { t: "6 relances de devis prêtes", ok: true },
                { t: "Devis 2026-118 · 8 640,00 €", ok: true },
                { t: "Facture 2026-0912 contestée", ok: false },
              ].map((r) => (
                <div key={r.t} className="flex items-center justify-between gap-3 rounded-xl border bg-card px-3 py-3 text-sm shadow-soft transition-shadow hover:shadow-lift">
                  <span>{r.t}</span>
                  {r.ok ? <Button size="xs" onClick={() => toast.success("Validé", { description: r.t })}>Valider</Button> : <StatusBadge status="warn">À vérifier</StatusBadge>}
                </div>
              ))}
            </div>
          </Cell>
          <Cell title="Branchés sur vos outils" text="Outlook, Teams, votre ERP ou votre CRM : les agents travaillent là où vous travaillez.">
            <div className="flex items-center gap-3">
              {TOOLS.slice(0, 2).map((t) => <div key={t} className="flex size-14 items-center justify-center rounded-full border bg-card text-xs text-muted-foreground shadow-soft transition-transform hover:-translate-y-1">{t}</div>)}
              <div className="flex size-20 items-center justify-center rounded-full border bg-card shadow-lift"><Mark className="w-10" /></div>
              {TOOLS.slice(2).map((t) => <div key={t} className="flex size-14 items-center justify-center rounded-full border bg-card text-xs text-muted-foreground shadow-soft transition-transform hover:-translate-y-1">{t}</div>)}
            </div>
          </Cell>
          <Cell title="Hébergé en Europe" text="Vos données restent en Europe, et vos agents vous appartiennent.">
            <div className="flex w-full max-w-xs flex-col gap-2.5">
              {[
                { i: ServerStack01Icon, t: "Hébergement Azure en Europe" },
                { i: SecurityCheckIcon, t: "Conforme RGPD" },
                { i: Key01Icon, t: "Accès limité à ce que vous autorisez" },
              ].map((r) => (
                <div key={r.t} className="flex items-center gap-3 rounded-xl border bg-card px-3 py-3 text-sm shadow-soft"><Icon icon={r.i} className="text-primary" />{r.t}<Icon icon={Tick02Icon} className="ml-auto text-ok" /></div>
              ))}
            </div>
          </Cell>
        </div>
      </section>

      {/* Bloc final (validé par Maxime le 04/10) */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--cta,var(--ink))] px-6 py-16 text-center text-ivory md:px-12 md:py-20 dark:ring-1 dark:ring-border dark:ring-inset">
          <DotField />
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-5">
            <h2 className="font-heading text-4xl leading-tight text-balance md:text-5xl">30 minutes pour savoir ce que l'IA peut faire chez vous.</h2>
            <p className="max-w-[52ch] text-ivory/75">Un appel avec Maxime Schifflers, fondateur de Meridiem. Vous repartez avec la liste des tâches qu'un agent peut reprendre.</p>
            <Button className="h-11 px-5 text-[15px]" onClick={book}>Réserver un audit gratuit de 30 min</Button>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 text-sm text-muted-foreground sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3"><Logo className="h-5 w-fit" /><p className="max-w-[30ch]">Agence IA belge. Logiciels, automatisations et agents IA, hébergés en Europe.</p></div>
          {([["Solutions", ["Agents IA", "Automatisations", "Logiciels sur mesure"]], ["Speyy", ["Le produit", "Sécurité des données"]], ["Société", ["Notre modèle", "Références", "Presse"]]] as const).map(([h, ls]) => (
            <div key={h} className="flex flex-col gap-2"><span className="eyebrow">{h}</span>{ls.map((l) => <a key={l} href="#landing" className="hover:text-foreground">{l}</a>)}</div>
          ))}
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-1 border-t px-6 py-5 text-xs text-muted-foreground">
          <span>MERIDIEM SRL</span><span>meridiem.be · Your AI partner</span><span>TVA BE1003910507</span><span>CGV</span>
        </div>
      </footer>
      <BookingDialog open={booking} onOpenChange={setBooking} />
    </div>
  )
}
