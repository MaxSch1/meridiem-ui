"use client"
/* Graphiques Olympe : shadcn/ui Chart (Recharts) + règles dataviz (une échelle, traits fins, infobulle, légende dès 2 séries). */
import { useMemo, useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, PolarAngleAxis, RadialBar, RadialBarChart, XAxis, YAxis } from "recharts"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/* Données d'exemple déterministes : 90 jours de demandes reçues et traitées */
const DAYS = (() => {
  const out: { date: string; recues: number; traitees: number }[] = []
  const start = new Date(2026, 6, 7)
  for (let i = 0; i < 90; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i)
    const wk = d.getDay() === 0 || d.getDay() === 6
    const base = 22 + Math.round(10 * Math.sin(i / 9) + 6 * Math.sin(i / 3.3) + i / 6)
    const recues = wk ? Math.round(base * 0.25) : base
    const traitees = Math.max(0, Math.round(recues * (0.72 + 0.18 * Math.sin(i / 5 + 1))))
    out.push({ date: d.toISOString().slice(0, 10), recues, traitees })
  }
  return out
})()
const fmtDay = (v: string) => new Date(v).toLocaleDateString("fr-BE", { day: "numeric", month: "short" })

const areaConfig = {
  recues: { label: "Reçues", color: "var(--chart-2)" },
  traitees: { label: "Traitées par l'assistant", color: "var(--chart-1)" },
} satisfies ChartConfig

/** Aire à deux séries avec choix de période (filtre dans une rangée au-dessus du graphique). */
export function RequestsAreaChart({ className }: { className?: string }) {
  const [range, setRange] = useState("30")
  const data = useMemo(() => DAYS.slice(-Number(range)), [range])
  const total = data.reduce((a, d) => a + d.recues, 0), auto = data.reduce((a, d) => a + d.traitees, 0)
  return (
    <Card className={"gap-4 shadow-soft " + (className || "")}>
      <CardHeader>
        <CardTitle className="text-lg">Demandes reçues et traitées</CardTitle>
        <CardDescription><span className="num">{total}</span> reçues, <span className="num">{Math.round((auto / total) * 100)} %</span> traitées par l'assistant sur la période</CardDescription>
        <CardAction>
          <ToggleGroup type="single" value={range} onValueChange={(v) => v && setRange(v)} variant="outline" size="sm">
            <ToggleGroupItem value="7">7 j</ToggleGroupItem>
            <ToggleGroupItem value="30">30 j</ToggleGroupItem>
            <ToggleGroupItem value="90">90 j</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={areaConfig} className="aspect-auto h-[240px] w-full">
          <AreaChart data={data} margin={{ left: 0, right: 8 }}>
            <defs>
              <linearGradient id="fillRecues" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-recues)" style={{ stopOpacity: "calc(0.22 * var(--chart-area-fill, 1))" }} /><stop offset="95%" stopColor="var(--color-recues)" style={{ stopOpacity: "calc(0.02 * var(--chart-area-fill, 1))" }} /></linearGradient>
              <linearGradient id="fillTraitees" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-traitees)" style={{ stopOpacity: "calc(0.28 * var(--chart-area-fill, 1))" }} /><stop offset="95%" stopColor="var(--color-traitees)" style={{ stopOpacity: "calc(0.03 * var(--chart-area-fill, 1))" }} /></linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={28} tickFormatter={fmtDay} />
            <YAxis tickLine={false} axisLine={false} width={28} tickMargin={4} />
            <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent labelFormatter={(v) => new Date(v).toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long" })} indicator="line" />} />
            <Area dataKey="recues" type="monotone" fill="url(#fillRecues)" stroke="var(--color-recues)" strokeWidth={2} />
            <Area dataKey="traitees" type="monotone" fill="url(#fillTraitees)" stroke="var(--color-traitees)" strokeWidth={2} />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const TYPES = [
  { type: "Devis", n: 164 },
  { type: "Commandes", n: 121 },
  { type: "Réclamations", n: 58 },
  { type: "Administratif", n: 47 },
  { type: "Autres", n: 28 },
]
const TYPES_TOTAL = TYPES.reduce((a, t) => a + t.n, 0)
const barConfig = { n: { label: "Demandes", color: "var(--chart-1)" } } satisfies ChartConfig

/* Fond de survol arrondi et décollé des bords (au lieu du rectangle plein de Recharts) */
export function RoundedCursor(props: { x?: number; y?: number; width?: number; height?: number }) {
  const { x = 0, y = 0, width = 0, height = 0 } = props
  return <rect x={x + 6} y={y} width={Math.max(0, width - 12)} height={height} rx={10} fill="var(--muted)" opacity={0.75} />
}

/* Colonne : haut arrondi, dégradé terracotta et trame de points (la signature de marque) */
function Column(props: { x?: number; y?: number; width?: number; height?: number; index?: number; active?: number | null }) {
  const { x = 0, y = 0, width = 0, height = 0, index = 0, active = null } = props
  if (height <= 0) return null
  const r = Math.min(10, width / 2, height)
  const d = `M${x},${y + height} V${y + r} Q${x},${y} ${x + r},${y} H${x + width - r} Q${x + width},${y} ${x + width},${y + r} V${y + height} Z`
  const dim = active != null && active !== index
  return (
    <g style={{ opacity: dim ? 0.38 : 1, transition: "opacity 200ms ease" }}>
      <path d={d} fill="url(#colFill)" />
      <path d={d} fill="url(#colDots)" />
      <path d={`M${x + r},${y + 0.75} H${x + width - r}`} stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} />
    </g>
  )
}

/** Colonnes, une seule série : pas de légende, valeur et part au-dessus, la colonne survolée reste vive, les autres s'estompent. */
export function TypesBarChart({ className }: { className?: string }) {
  const [active, setActive] = useState<number | null>(null)
  return (
    <Card className={"gap-4 shadow-soft " + (className || "")}>
      <CardHeader>
        <CardTitle className="text-lg">Demandes par type</CardTitle>
        <CardDescription>90 derniers jours · <span className="num">{TYPES_TOTAL}</span> demandes, dont <span className="num">{Math.round((TYPES[0].n / TYPES_TOTAL) * 100)} %</span> de devis</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={barConfig} className="aspect-auto h-[240px] w-full">
          <BarChart
            data={TYPES}
            margin={{ top: 28, left: 4, right: 4 }}
            onMouseMove={(st: { activeTooltipIndex?: number | string | null }) => setActive(st?.activeTooltipIndex != null ? Number(st.activeTooltipIndex) : null)}
            onMouseLeave={() => setActive(null)}
          >
            <defs>
              <linearGradient id="colFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C4672A" />
                <stop offset="100%" stopColor="#8A3F0F" />
              </linearGradient>
              <pattern id="colDots" width="5" height="5" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="0.8" fill="#FFFFFF" fillOpacity="0.22" />
              </pattern>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="type" tickLine={false} axisLine={false} tickMargin={10} interval={0} fontSize={12} />
            <ChartTooltip cursor={<RoundedCursor />} content={<ChartTooltipContent />} />
            <Bar dataKey="n" maxBarSize={56} shape={(p: unknown) => <Column {...(p as object)} active={active} />} animationDuration={900} animationEasing="ease-out">
              <LabelList dataKey="n" content={((lp: { viewBox?: { x?: number; y?: number; width?: number }; x?: number | string; y?: number | string; width?: number | string; value?: number | string }) => {
                const vb = lp.viewBox || {}
                const x = Number(vb.x ?? lp.x) + Number(vb.width ?? lp.width) / 2, y = Number(vb.y ?? lp.y) - 10, v = Number(lp.value)
                if (!Number.isFinite(x) || !Number.isFinite(y)) return null
                return (
                  <text x={x} y={y} textAnchor="middle" className="fill-foreground">
                    <tspan fontSize={13} fontWeight={500}>{v}</tspan>
                    <tspan fontSize={11} className="fill-muted-foreground" dx={4}>{Math.round((v / TYPES_TOTAL) * 100)}{"\u202F"}%</tspan>
                  </text>
                )
              }) as never} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const radialConfig = { taux: { label: "Traitement automatique", color: "var(--chart-1)" } } satisfies ChartConfig

/** Une seule valeur mise en avant : jauge radiale avec le chiffre au centre. */
export function AutomationRadial({ value = 78, className }: { value?: number; className?: string }) {
  return (
    <Card className={"gap-2 shadow-soft " + (className || "")}>
      <CardHeader>
        <CardTitle className="text-lg">Traitement automatique</CardTitle>
        <CardDescription>part des demandes préparées sans intervention</CardDescription>
      </CardHeader>
      <CardContent className="relative flex items-center justify-center">
        <ChartContainer config={radialConfig} className="relative aspect-square h-[190px]">
          <RadialBarChart data={[{ taux: value }]} startAngle={90} endAngle={-270} innerRadius={70} outerRadius={92}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="taux" background={{ fill: "var(--muted)" }} cornerRadius={8} fill="var(--color-taux)" />
          </RadialBarChart>
        </ChartContainer>
        <div className="pointer-events-none absolute flex flex-col items-center">
          <span className="num font-heading text-4xl">{value} %</span>
          <span className="text-xs text-muted-foreground">objectif : 70 %</span>
        </div>
      </CardContent>
    </Card>
  )
}

const DELAY = [
  { m: "mai", h: 5.2 }, { m: "juin", h: 4.1 }, { m: "juil.", h: 3.4 }, { m: "août", h: 2.6 }, { m: "sept.", h: 1.6 }, { m: "oct.", h: 1.2 },
]
const lineConfig = { h: { label: "Délai moyen (heures)", color: "var(--chart-1)" } } satisfies ChartConfig

/** Courbe simple (une série), points marqués, dernier point étiqueté. */
export function DelayLineChart({ className }: { className?: string }) {
  return (
    <Card className={"gap-4 shadow-soft " + (className || "")}>
      <CardHeader>
        <CardTitle className="text-lg">Délai moyen de réponse</CardTitle>
        <CardDescription>en heures, par mois</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={lineConfig} className="aspect-auto h-[200px] w-full">
          <LineChart data={DELAY} margin={{ left: 0, right: 24, top: 16 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="m" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="h" type="monotone" stroke="var(--color-h)" strokeWidth={2} dot={{ r: 4, fill: "var(--card)", strokeWidth: 2 }} activeDot={{ r: 5 }}>
              <LabelList dataKey="h" position="top" offset={10} fontSize={11} className="fill-muted-foreground" formatter={(v: unknown) => String(v).replace(".", ",")} />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const CANAUX = [
  { m: "mai", mail: 210, portail: 40, tel: 60 }, { m: "juin", mail: 230, portail: 62, tel: 54 }, { m: "juil.", mail: 190, portail: 75, tel: 41 },
  { m: "août", mail: 160, portail: 70, tel: 30 }, { m: "sept.", mail: 250, portail: 96, tel: 44 }, { m: "oct.", mail: 120, portail: 58, tel: 18 },
]
const stackConfig = {
  mail: { label: "Mail", color: "var(--chart-1)" },
  portail: { label: "Portail client", color: "var(--chart-2)" },
  tel: { label: "Téléphone", color: "var(--chart-3)" },
} satisfies ChartConfig

/** Barres empilées à trois séries : légende, écart de 2 px entre segments (trait de la couleur de surface). */
export function ChannelsStackedChart({ className }: { className?: string }) {
  return (
    <Card className={"gap-4 shadow-soft " + (className || "")}>
      <CardHeader>
        <CardTitle className="text-lg">Demandes par canal</CardTitle>
        <CardDescription>par mois</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={stackConfig} className="aspect-auto h-[220px] w-full">
          <BarChart data={CANAUX} margin={{ left: 0, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="m" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <ChartTooltip cursor={<RoundedCursor />} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="mail" stackId="a" fill="var(--color-mail)" stroke="var(--card)" strokeWidth={2} radius={[0, 0, 4, 4]} barSize={26} />
            <Bar dataKey="portail" stackId="a" fill="var(--color-portail)" stroke="var(--card)" strokeWidth={2} barSize={26} />
            <Bar dataKey="tel" stackId="a" fill="var(--color-tel)" stroke="var(--card)" strokeWidth={2} radius={[4, 4, 0, 0]} barSize={26} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
