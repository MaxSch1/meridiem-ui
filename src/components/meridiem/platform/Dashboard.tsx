"use client"
/* Tableau de bord : bandeau ville, indicateurs animés, graphiques, activité. */
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CityDots } from "@/components/meridiem/brand"
import { KpiCard } from "@/components/meridiem/kpi-card"
import { AutomationRadial, RequestsAreaChart, TypesBarChart } from "@/components/meridiem/charts"
import { ACTIVITY, type Request } from "@/components/meridiem/demo-data"
import type { Page } from "./Platform"

export default function Dashboard({ rows, go }: { rows: Request[]; go: (p: Page) => void }) {
  const wait = rows.filter((r) => r.status === "wait").length, crit = rows.filter((r) => r.status === "crit").length
  return (
    <>
      <section className="relative grid min-h-[168px] overflow-hidden rounded-xl border bg-card shadow-soft md:grid-cols-[1fr_46%]">
        <div className="relative z-10 flex flex-col justify-center gap-1.5 p-6">
          <span className="eyebrow text-primary">Bonjour Julie</span>
          <h1 className="font-heading text-[2rem] leading-tight">Votre journée</h1>
          <p className="max-w-prose text-sm text-muted-foreground">{wait} demandes à valider{crit ? `, dont ${crit} urgente` : ""}. L'assistant a préparé une réponse pour 9 d'entre elles.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => go("requests")}>Traiter les demandes</Button>
            <Button size="sm" variant="ghost" onClick={() => go("clients")}>Voir les clients</Button>
          </div>
        </div>
        <div className="absolute inset-0 opacity-20 md:left-auto md:w-[46%] md:opacity-100">
          <CityDots paper="var(--card, #FFFFFF)" focusY={0.5} cell={2} lift={0.12} />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-card to-transparent" />
        </div>
      </section>

      <section className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="À valider" value={String(wait)} note={crit ? `dont ${crit} urgente` : "rien d'urgent"} kind="bars" />
        <KpiCard label="Mails triés aujourd'hui" value="47" note="33 devenus des demandes" kind="envelope" />
        <KpiCard label="Taux de réponse sous 2 h" value="72 %" note="objectif : 70 %" kind="gauge" />
        <KpiCard label="Activité de la semaine" value="418" note="actions de l'assistant" kind="cubes" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <RequestsAreaChart />
        <AutomationRadial value={78} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <TypesBarChart />
        <Card className="gap-4 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Activité récente</CardTitle>
            <CardDescription>ce qui a été fait ce matin</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 border-b py-2.5 text-sm last:border-0">
                <Avatar className="size-7"><AvatarFallback className={a.who === "Assistant" ? "bg-primary text-[10px] text-primary-foreground" : "bg-secondary text-[10px]"}>{a.who === "Assistant" ? "IA" : a.who.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
                <span className="min-w-0 flex-1 truncate"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span></span>
                <span className="font-mono text-xs text-muted-foreground">{a.at}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
