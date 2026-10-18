/* Structures : menus latéraux, cartes, cartes animées, tables, graphiques, sections de page, visuels de marque. */
import { useState } from "react"
import {
  DashboardSquare01Icon, InboxIcon, Invoice03Icon, UserGroupIcon, Folder01Icon, Search01Icon, Settings02Icon, UnfoldMoreIcon, Building03Icon,
  ArrowRight01Icon, Analytics01Icon, WorkflowSquare01Icon, Robot01Icon, Plug01Icon, Mail01Icon, Calendar03Icon, Tick02Icon, Add01Icon, CloudUploadIcon,
  HelpCircleIcon, Logout01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge,
  SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Kbd } from "@/components/ui/kbd"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeSubmenu } from "@/components/meridiem/theme"
import { CityDots, DotChart, DotField, Icon, OLYMPE_INK, StatusBadge, type IsoKind } from "@/components/meridiem/brand"
import { KpiCard } from "@/components/meridiem/kpi-card"
import { ClientsTable } from "@/components/meridiem/clients-table"
import { DataTable, SortHeader } from "@/components/meridiem/data-table"
import { REQUESTS, type Request } from "@/components/meridiem/demo-data"
import type { ColumnDef } from "@tanstack/react-table"
import { AutomationRadial, ChannelsStackedChart, DelayLineChart, RequestsAreaChart, TypesBarChart } from "@/components/meridiem/charts"
import { KitSection, Demo } from "./parts"

const NAV = [
  { label: "Tableau de bord", icon: DashboardSquare01Icon },
  { label: "Demandes", icon: InboxIcon, badge: 12 },
  { label: "Devis", icon: Invoice03Icon, badge: 4 },
  { label: "Clients", icon: UserGroupIcon },
  { label: "Documents", icon: Folder01Icon },
]

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="h-[460px] overflow-hidden rounded-xl border bg-sidebar shadow-soft">{children}</div>
}

function NavClassic() {
  const [active, setActive] = useState("Demandes")
  return (
    <SidebarProvider className="min-h-0 h-full" style={{ "--sidebar-width": "100%" } as React.CSSProperties}>
      <Sidebar collapsible="none" className="h-full w-full">
        <SidebarHeader>
          <SidebarMenu><SidebarMenuItem><SidebarMenuButton size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary font-heading text-lg text-primary-foreground">L</div>
            <div className="grid flex-1 text-left leading-tight"><span className="truncate text-sm font-medium">Lambert Emballages</span><span className="truncate text-xs text-muted-foreground">Plateforme commerciale</span></div>
            <Icon icon={UnfoldMoreIcon} className="ml-auto text-muted-foreground" />
          </SidebarMenuButton></SidebarMenuItem></SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup><SidebarGroupContent><SidebarMenu>
            <SidebarMenuItem><SidebarMenuButton className="text-muted-foreground"><Icon icon={Search01Icon} /><span>Rechercher</span><Kbd className="ml-auto">⌘K</Kbd></SidebarMenuButton></SidebarMenuItem>
            {NAV.map((n) => (
              <SidebarMenuItem key={n.label}>
                <SidebarMenuButton isActive={active === n.label} onClick={() => setActive(n.label)}><Icon icon={n.icon} /><span>{n.label}</span></SidebarMenuButton>
                {n.badge ? <SidebarMenuBadge className="num">{n.badge}</SidebarMenuBadge> : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu></SidebarGroupContent></SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {/* Menu du compte : réglages, aide, apparence (sous-menu Jour, Nuit, Système), déconnexion */}
          <SidebarMenu><SidebarMenuItem><DropdownMenu><DropdownMenuTrigger asChild><SidebarMenuButton size="lg">
            <Avatar className="size-8 rounded-lg"><AvatarFallback className="rounded-lg bg-sand/50 dark:bg-sand/16 text-xs">JR</AvatarFallback></Avatar>
            <div className="grid flex-1 text-left leading-tight"><span className="truncate text-sm font-medium">Julie Remacle</span><span className="truncate text-xs text-muted-foreground">julie@lambert…</span></div>
            <Icon icon={UnfoldMoreIcon} className="ml-auto text-muted-foreground" />
          </SidebarMenuButton></DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="top" align="start" sideOffset={6}>
              <DropdownMenuItem onSelect={() => toast("Réglages")}><Icon icon={Settings02Icon} />Réglages</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast("Aide")}><Icon icon={HelpCircleIcon} />Aide</DropdownMenuItem>
              <ThemeSubmenu />
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => toast("Déconnexion", { description: "Désactivée dans le kit" })}><Icon icon={Logout01Icon} />Se déconnecter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu></SidebarMenuItem></SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}

function NavRail() {
  const [active, setActive] = useState("Demandes")
  return (
    <div className="flex h-full">
      <div className="flex w-14 flex-col items-center gap-1 border-r py-3">
        <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-primary font-heading text-lg text-primary-foreground">L</div>
        {NAV.map((n) => (
          <Tooltip key={n.label}>
            <TooltipTrigger asChild>
              <button onClick={() => setActive(n.label)} aria-label={n.label} className={"relative flex size-9 items-center justify-center rounded-lg transition-colors " + (active === n.label ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:bg-sidebar-accent")}>
                <Icon icon={n.icon} size={18} />
                {n.badge ? <span className="absolute -top-0.5 -right-0.5 rounded-full bg-primary px-1 text-[9px] leading-4 text-primary-foreground num">{n.badge}</span> : null}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{n.label}</TooltipContent>
          </Tooltip>
        ))}
        <div className="mt-auto flex flex-col items-center gap-2">
          <button aria-label="Réglages" className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent"><Icon icon={Settings02Icon} size={18} /></button>
          <Avatar className="size-8 rounded-lg"><AvatarFallback className="rounded-lg bg-sand/50 dark:bg-sand/16 text-[10px]">JR</AvatarFallback></Avatar>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 bg-background p-4">
        <span className="eyebrow">Rail compact</span>
        <p className="text-sm text-muted-foreground">Pour les écrans denses : icônes seules, nom au survol, compteur en pastille.</p>
        <div className="mt-2 flex flex-col gap-2">{[1, 2, 3].map((i) => <div key={i} className="h-9 rounded-md border bg-card" />)}</div>
      </div>
    </div>
  )
}

function NavNested() {
  return (
    <SidebarProvider className="min-h-0 h-full" style={{ "--sidebar-width": "100%" } as React.CSSProperties}>
      <Sidebar collapsible="none" className="h-full w-full">
        <SidebarHeader><div className="flex items-center gap-2 px-2 pt-1"><Icon icon={Building03Icon} className="text-muted-foreground" /><span className="text-sm font-medium">Meridiem Command Center</span></div></SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Opérations</SidebarGroupLabel>
            <SidebarMenu>
              {[
                { t: "Projets clients", i: Analytics01Icon, open: true, sub: ["Lambert Emballages", "Verrerie Delvaux", "Brasserie du Condroz"] },
                { t: "Automatisations", i: WorkflowSquare01Icon, sub: ["Tri des mails", "Relances", "Devis"] },
                { t: "Agents", i: Robot01Icon, sub: ["Agent commercial", "Agent administratif"] },
                { t: "Connexions", i: Plug01Icon, sub: ["Outlook", "Odoo", "Teams"] },
              ].map((g) => (
                <Collapsible key={g.t} defaultOpen={g.open} className="group/collapsible" asChild>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton><Icon icon={g.i} /><span>{g.t}</span><Icon icon={ArrowRight01Icon} size={14} className="ml-auto text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /></SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {g.sub.map((s, i) => <SidebarMenuSubItem key={s}><SidebarMenuSubButton isActive={g.open && i === 0}><span>{s}</span></SidebarMenuSubButton></SidebarMenuSubItem>)}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Aujourd'hui</SidebarGroupLabel>
            <SidebarMenu>
              {["Relances devis de septembre", "Compte rendu réunion"].map((t) => <SidebarMenuItem key={t}><SidebarMenuButton size="sm" className="text-muted-foreground"><span className="truncate">{t}</span></SidebarMenuButton></SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

export function Sidebars() {
  return (
    <KitSection id="menus" title="Menus latéraux" desc="Trois formes, mêmes composants (shadcn Sidebar). Classique pour une plateforme métier, rail compact pour les écrans denses, à sous-menus pour un outil interne. Réglages et aide vivent dans le menu du compte, en bas.">
      <div className="grid gap-5 md:grid-cols-3">
        <Demo label="Classique" bare><Frame><NavClassic /></Frame></Demo>
        <Demo label="Rail compact" bare><Frame><NavRail /></Frame></Demo>
        <Demo label="À sous-menus" bare><Frame><NavNested /></Frame></Demo>
      </div>
    </KitSection>
  )
}

export function Cards() {
  return (
    <KitSection id="cartes" title="Cartes" desc="Indicateur, carte d'information avec action, liste d'éléments, état vide qui dit quoi faire.">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gap-2 py-5 shadow-soft"><CardHeader><CardDescription>Chiffre 2026</CardDescription><CardTitle className="num text-[2rem] font-normal leading-none">193 390 €</CardTitle><CardAction><StatusBadge status="ok">+12 %</StatusBadge></CardAction></CardHeader><CardContent className="text-xs text-muted-foreground">par rapport à la même période en 2025</CardContent></Card>
        <Card className="gap-3 shadow-soft">
          <CardHeader><CardTitle className="text-lg">Boîte Outlook</CardTitle><CardDescription>commercial@lambert-emballages.be</CardDescription><CardAction><StatusBadge status="ok">Connectée</StatusBadge></CardAction></CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Dernière lecture</span><span className="font-mono text-xs">09:14</span></div><Progress value={64} /><span className="text-xs text-muted-foreground">64 % de la boîte triée aujourd'hui</span></CardContent>
          <CardFooter className="border-t"><Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Boîte relue", { description: "3 nouveaux mails" })}>Relire maintenant</Button></CardFooter>
        </Card>
        <Card className="gap-3 shadow-soft">
          <CardHeader><CardTitle className="text-lg">Prochains rendez-vous</CardTitle></CardHeader>
          <CardContent>
            <ItemGroup className="gap-1">
              {[["Marc Lejeune", "jeudi 08/10 · 10:30", Calendar03Icon], ["Claire Destrée", "vendredi 09/10 · 14:00", Calendar03Icon], ["Relance Halleux", "lundi 12/10", Mail01Icon]].map(([t, d, ic]) => (
                <Item key={t as string} size="sm" className="px-0"><ItemMedia variant="icon"><Icon icon={ic as typeof Mail01Icon} /></ItemMedia><ItemContent><ItemTitle>{t as string}</ItemTitle><ItemDescription>{d as string}</ItemDescription></ItemContent><ItemActions><Button variant="ghost" size="icon-sm" aria-label="Ouvrir"><Icon icon={ArrowRight01Icon} size={14} /></Button></ItemActions></Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Empty className="rounded-xl border border-dashed bg-card">
          <EmptyHeader><EmptyMedia variant="icon"><Icon icon={CloudUploadIcon} /></EmptyMedia><EmptyTitle>Aucun catalogue importé</EmptyTitle><EmptyDescription>L'assistant a besoin de vos prix pour préparer les devis.</EmptyDescription></EmptyHeader>
          <EmptyContent><Button size="sm" onClick={() => toast.success("Import lancé")}>Importer le catalogue</Button></EmptyContent>
        </Empty>
        <Card className="justify-center gap-3 border-dashed bg-transparent shadow-none">
          <CardHeader><CardTitle className="text-lg">Règle d'or des états vides</CardTitle><CardDescription>Le bon titre (« Aucun catalogue importé », pas « Catalogues ») et l'action qui en sort, avec sa destination. Un état vide sans porte de sortie est un écran mort.</CardDescription></CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-ok"><Icon icon={Tick02Icon} />Titre précis, une phrase, une action</CardContent>
        </Card>
      </div>
    </KitSection>
  )
}

const ANIM: { k: IsoKind; l: string; v: string; n: string }[] = [
  { k: "bars", l: "À valider", v: "12", n: "barres qui montent en vague" },
  { k: "pie", l: "Traitées aujourd'hui", v: "33", n: "une part se soulève" },
  { k: "dial", l: "Délai moyen", v: "1 h 12", n: "l'ombre du cadran tourne" },
  { k: "stack", l: "Devis envoyés", v: "64", n: "la pile s'écarte" },
  { k: "cubes", l: "Activité de la semaine", v: "418", n: "les cubes s'élèvent" },
  { k: "gauge", l: "Réponse sous 2 h", v: "72 %", n: "l'aiguille balaie" },
  { k: "line", l: "Chiffre 2026", v: "193 390 €", n: "la courbe se trace" },
  { k: "envelope", l: "Mails triés", v: "47", n: "l'enveloppe s'ouvre" },
  { k: "rings", l: "Objectifs du mois", v: "82 %", n: "les anneaux se remplissent" },
]
export function AnimatedCards() {
  return (
    <KitSection id="cartes-animees" title="Cartes animées" desc="Neuf illustrations qui rejouent leur mouvement au survol. Traits fins, une seule touche terracotta. Elles restent immobiles si l'utilisateur a demandé moins d'animations.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ANIM.map((a) => <KpiCard key={a.k} label={a.l} value={a.v} note={a.n} kind={a.k} />)}
      </div>
    </KitSection>
  )
}

const REQUEST_COLUMNS: ColumnDef<Request>[] = [
  { accessorKey: "title", header: ({ column }) => <SortHeader column={column} label="Demande" />, cell: ({ row }) => <div><div className="font-medium">{row.original.title}</div><div className="text-xs text-muted-foreground">{row.original.id} · {row.original.client}</div></div> },
  { accessorKey: "type", header: () => <span className="eyebrow">Type</span>, cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span>, meta: { className: "hidden md:table-cell" } },
  { accessorKey: "amount", header: () => <span className="eyebrow">Montant</span>, cell: ({ getValue }) => <span className="num whitespace-nowrap">{getValue<string>() || "-"}</span>, meta: { className: "text-right" } },
  { accessorKey: "label", header: () => <span className="eyebrow">Statut</span>, cell: ({ row }) => <StatusBadge status={row.original.status}>{row.original.label}</StatusBadge> },
]
function RequestsDataTable() {
  return <DataTable data={REQUESTS} columns={REQUEST_COLUMNS} pageSize={5} searchText={(r) => r.title + " " + r.client + " " + r.id} labels={{ search: "Client, objet, référence", count: (n) => `${n} demande${n > 1 ? "s" : ""}` }} onRowClick={(r) => toast(r.title, { description: r.client })} />
}

export function Tables() {
  return (
    <KitSection id="tables" title="Tables" desc="Simple pour lire, de données pour agir : recherche, tri, sélection avec actions groupées, actions par ligne, pagination (TanStack Table).">
      <Demo label="Simple" bare>
        <Card className="gap-0 overflow-hidden py-0 shadow-soft">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent"><TableHead className="eyebrow h-10 pl-4">Devis</TableHead><TableHead className="eyebrow">Client</TableHead><TableHead className="eyebrow">Envoyé</TableHead><TableHead className="eyebrow text-right">Montant</TableHead><TableHead className="eyebrow pr-4">Statut</TableHead></TableRow></TableHeader>
            <TableBody>
              {[["2026-104", "Biscuiterie Destrée", "18/09", "3 120,00 €", "wait", "En attente"], ["2026-101", "Fromagerie du Condroz", "17/09", "1 240,00 €", "ok", "Signé"], ["2026-099", "Confiturerie Gérard", "16/09", "2 410,00 €", "warn", "Prix à revoir"], ["2026-098", "Domaine du Chenoy", "15/09", "5 960,00 €", "ok", "Signé"]].map(([d, c, e, m, s, l]) => (
                <TableRow key={d}><TableCell className="pl-4 font-mono text-xs">{d}</TableCell><TableCell className="font-medium">{c}</TableCell><TableCell className="font-mono text-xs text-muted-foreground">{e}</TableCell><TableCell className="num text-right">{m}</TableCell><TableCell className="pr-4"><StatusBadge status={s as "ok"}>{l}</StatusBadge></TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Demo>
      <Demo label="De données (cochez des lignes, triez, cherchez)" bare><ClientsTable pageSize={5} onNewRequest={() => toast("Nouvelle demande (démo)")} /></Demo>
      <Demo label="Générique : vos colonnes, vos données (DataTable)" bare><RequestsDataTable /></Demo>
    </KitSection>
  )
}

export function Charts() {
  return (
    <KitSection id="graphiques" title="Graphiques" desc="shadcn Chart (Recharts). Une seule échelle par graphique, traits de 2 px, extrémités arrondies, infobulle au survol, légende dès deux séries, palette validée pour le daltonisme.">
      <RequestsAreaChart />
      <div className="grid gap-4 md:grid-cols-2"><TypesBarChart /><ChannelsStackedChart /></div>
      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"><DelayLineChart /><AutomationRadial value={78} /></div>
      <Demo label="Graphique en points (variante de marque)">
        <div className="relative h-28"><DotChart values={[22, 31, 28, 35, 19, 8, 6, 30, 34, 29, 41, 37, 12, 48, 44, 39, 21, 9]} gap={6} /></div>
      </Demo>
    </KitSection>
  )
}

export function PageSections() {
  return (
    <KitSection id="sections" title="Sections de page" desc="Les blocs de la landing, réutilisables sur toute page vitrine : héros sur la ville en points, grille de filets, bloc final.">
      <Demo label="Héros ville en points" bare>
        <div className="relative isolate overflow-hidden rounded-xl border">
          <div className="absolute inset-0 -z-10"><CityDots focusY={0} cell={2.5} lift={0.16} /><div className="absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-background from-30% to-transparent" /></div>
          <div className="flex min-h-[340px] flex-col items-center gap-3 px-6 pt-12 text-center">
            <span className="eyebrow text-primary">Titre de rubrique</span>
            <h3 className="max-w-[20ch] font-heading text-4xl leading-tight text-balance">Une promesse claire, en une phrase.</h3>
            <div className="flex gap-2"><Button size="sm">Action principale</Button><Button size="sm" variant="outline" className="bg-background/80">Secondaire</Button></div>
          </div>
        </div>
      </Demo>
      <div className="grid gap-5 md:grid-cols-2">
        <Demo label="Grille de filets à repères" bare>
          <div className="hairline-grid grid-cols-2 bg-card">
            {["Des agents qui exécutent", "Vous validez", "Branchés sur vos outils", "Hébergé en Europe"].map((t) => <div key={t} className="flex min-h-28 items-end p-4"><span className="font-heading text-lg">{t}</span></div>)}
          </div>
        </Demo>
        <Demo label="Bloc final" bare>
          <div className="relative flex min-h-[226px] flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-[var(--cta,var(--ink))] px-6 text-center text-ivory dark:ring-1 dark:ring-border dark:ring-inset">
            <DotField />
            <h3 className="relative z-10 max-w-[18ch] font-heading text-3xl leading-tight">30 minutes pour savoir ce que l'IA peut faire chez vous.</h3>
            <Button size="sm" className="relative z-10" onClick={() => toast.success("Ouverture de l'agenda")}><Icon icon={Add01Icon} />Réserver un audit</Button>
          </div>
        </Demo>
      </div>
    </KitSection>
  )
}

export function BrandVisuals() {
  const [key, setKey] = useState(0)
  return (
    <KitSection id="visuels" title="Visuels de marque" desc="Générés à partir de l'image de ville du site ou calculés : aucune image tierce. La ville se « développe » à l'apparition.">
      <div className="grid gap-4 md:grid-cols-3">
        <Demo label="Ville, trame en pixels" bare><div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-card"><CityDots key={"d" + key} paper="var(--card, #FFFFFF)" focusY={0.45} cell={2} /></div></Demo>
        <Demo label="Ville, trame en points" bare><div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-card"><CityDots key={"h" + key} paper="var(--card, #FFFFFF)" mode="halftone" focusY={0.45} cell={4} palette={OLYMPE_INK} /></div></Demo>
        <Demo label="Champ de points animé" bare><div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--cta,var(--ink))] dark:ring-1 dark:ring-border dark:ring-inset"><DotField focus={{ x: 0.5, y: 0.5 }} /></div></Demo>
      </div>
      <Button variant="outline" size="sm" className="self-start" onClick={() => setKey((k) => k + 1)}>Rejouer l'apparition</Button>
    </KitSection>
  )
}
