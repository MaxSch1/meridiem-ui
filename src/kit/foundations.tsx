/* Fondations : couleurs, typographie, formes, icônes (Hugeicons, style stroke rounded de Speyy). */
import { useMemo, useState } from "react"
import {
  Add01Icon, Agreement01Icon, Agreement02Icon, AiBrain01Icon, Alert02Icon, Analytics01Icon, Archive02Icon, ArrowLeft01Icon, ArrowRight01Icon, ArrowUpDownIcon, Attachment01Icon, BankIcon, BookOpen01Icon, Bookmark01Icon, BriefcaseBusinessIcon, Building03Icon, Calendar03Icon, Call02Icon, Cancel01Icon, ChartHistogramIcon, ChartLineData01Icon, CheckListIcon, CheckmarkCircle02Icon, Clock01Icon, CloudUploadIcon, ComputerTerminal01Icon, ConnectIcon, Contact01Icon, Copy01Icon, CustomerSupportIcon, DashboardSquare01Icon, Database01Icon, Delete02Icon, DeliveryTruck01Icon, Download01Icon, Factory01Icon, File01Icon, FilterIcon, FingerPrintIcon, Flag02Icon, FlagOffIcon, FlashIcon, Folder01Icon, FullScreenIcon, GitCommitHorizontalIcon, Globe02Icon, GridTableIcon, GridViewIcon, HelpCircleIcon, Home01Icon, Image01Icon, InboxIcon, InformationCircleIcon, Invoice01Icon, Invoice03Icon, KanbanIcon, Key01Icon, KeyboardIcon, Layers01Icon, Link01Icon, LinkSquare02Icon, Location01Icon, LockIcon, Login01Icon, Logout01Icon, Mail01Icon, MailOpen01Icon, Megaphone01Icon, Menu01Icon, Message01Icon, MessageMultiple01Icon, Mic01Icon, Money01Icon, Moon02Icon, MoreHorizontalIcon, Note01Icon, Notification01Icon, Package01Icon, PencilEdit02Icon, PercentIcon, PieChartIcon, PinIcon, PinOffIcon, PauseIcon, PlayIcon, Plug01Icon, PrinterIcon, Pulse01Icon, Refresh01Icon, Robot01Icon, Route01Icon, Search01Icon, SecurityCheckIcon, SentIcon, ServerStack01Icon, Settings02Icon, Share08Icon, ShoppingCart01Icon, SidebarLeftIcon, SignpostIcon, SourceCodeIcon, SquareLock02Icon, SquareUnlock02Icon, StarIcon, StarOffIcon, StopIcon, Store01Icon, Sun03Icon, Tag01Icon, Target02Icon, Task01Icon, TaskAdd01Icon, Tick02Icon, UnfoldMoreIcon, Upload01Icon, UserCircleIcon, UserGroupIcon, UserIcon, Video01Icon, ViewIcon, ViewOffIcon, Wallet01Icon, WorkflowSquare01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { toast } from "sonner"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Icon, CHART } from "@/components/meridiem/brand"
import { KitSection, Demo } from "./parts"

const BRAND = [
  ["Ivoire", "#F6F3ED", "fond de marque"], ["Page", "#FBF9F5", "fond des écrans"], ["Carte", "#FFFFFF", "surfaces"], ["Barre latérale", "#F3EFE8", "menu de gauche"],
  ["Encre", "#1C1B1A", "texte"], ["Pierre", "#6B6764", "texte secondaire"], ["Filet", "#E8E2D8", "bordures"], ["Secondaire", "#F2EDE5", "fonds discrets"],
  ["Terracotta", "#AA4F13", "action principale"], ["Sable", "#E3CDB3", "points clairs"], ["Sépia", "#4A2C18", "points sombres"], ["Repère", "#C98A5E", "focus, croix de grille"],
]
const STATUS = [["Traitée", "#2F7A4A"], ["Bloquée", "#9A5D0C"], ["À valider", "#55499F"], ["Urgent", "#B3261E"], ["En cours", "#2B6099"]]

function Swatch({ n, c, u }: { n: string; c: string; u?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-2.5">
      <span className="size-9 shrink-0 rounded-md border" style={{ background: c }} />
      <div className="min-w-0 text-sm leading-tight"><div className="font-medium">{n}</div><div className="font-mono text-[11px] text-muted-foreground">{c}{u ? " · " + u : ""}</div></div>
    </div>
  )
}

export function Colors() {
  return (
    <KitSection id="couleurs" title="Couleurs" desc="Ivoire et encre. Le terracotta est réservé à l'action principale d'une zone. Les statuts et les graphiques ont leurs propres couleurs, toujours accompagnées d'un mot.">
      <Demo label="Marque et interface" bare><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{BRAND.map(([n, c, u]) => <Swatch key={n} n={n} c={c} u={u} />)}</div></Demo>
      <div className="grid gap-5 md:grid-cols-2">
        <Demo label="Statuts (avec un mot, jamais seuls)" bare><div className="grid grid-cols-2 gap-3">{STATUS.map(([n, c]) => <Swatch key={n} n={n} c={c} />)}</div></Demo>
        <Demo label="Graphiques (ordre fixe, validé au script)" bare><div className="grid grid-cols-2 gap-3">{Object.entries(CHART).map(([k, c], i) => <Swatch key={k} n={"Série " + (i + 1)} c={c} />)}</div></Demo>
      </div>
    </KitSection>
  )
}

export function Typography() {
  return (
    <KitSection id="typo" title="Typographie" desc="EB Garamond pour les titres et les chiffres mis en avant, Geist pour le texte et l'interface, Geist Mono pour les étiquettes et les références.">
      <Demo className="flex flex-col divide-y p-0">
        {[
          ["Titre d'écran · EB Garamond 48", <div className="font-heading text-5xl leading-tight">Demandes entrantes</div>],
          ["Titre de section · EB Garamond 30", <div className="font-heading text-3xl">Activité de la semaine</div>],
          ["Titre de carte · EB Garamond 18", <div className="font-heading text-lg">Devis 12 000 bocaux 370 ml</div>],
          ["Chiffre clé · EB Garamond 32", <div className="num font-heading text-[2rem]">8 640,00 €</div>],
          ["Texte · Geist 14", <p className="max-w-prose text-sm">L'assistant a préparé une réponse pour 9 demandes. Rien ne part chez le client sans votre validation.</p>],
          ["Texte secondaire · Geist 12", <p className="text-xs text-muted-foreground">Brasserie du Condroz · Marc Lejeune · reçue à 09:12</p>],
          ["Étiquette · Geist Mono 11, capitales", <div className="eyebrow">Demande du client</div>],
          ["Référence · Geist Mono 12", <div className="font-mono text-xs text-muted-foreground">D-2611 · 09:12</div>],
        ].map(([l, el]) => (
          <div key={l as string} className="grid items-center gap-2 px-5 py-4 md:grid-cols-[220px_1fr]"><span className="font-mono text-[11px] text-muted-foreground">{l as string}</span>{el as React.ReactNode}</div>
        ))}
      </Demo>
      <div className="grid gap-5 md:grid-cols-3">
        <Demo label="Rayons"><div className="flex items-end gap-3">{[["6", "rounded-sm"], ["8", "rounded-md"], ["10", "rounded-lg"], ["14", "rounded-xl"]].map(([v, c]) => <div key={v} className="flex flex-col items-center gap-1"><div className={"size-12 border bg-secondary " + c} /><span className="font-mono text-[11px] text-muted-foreground">{v} px</span></div>)}</div></Demo>
        <Demo label="Ombres"><div className="flex gap-4"><div className="flex size-16 items-center justify-center rounded-lg border bg-card text-[11px] text-muted-foreground shadow-soft">douce</div><div className="flex size-16 items-center justify-center rounded-lg border bg-card text-[11px] text-muted-foreground shadow-lift">survol</div></div></Demo>
        <Demo label="Grille de filets"><div className="hairline-grid grid-cols-2"><div className="h-12" /><div className="h-12" /><div className="h-12" /><div className="h-12" /></div></Demo>
      </div>
    </KitSection>
  )
}

/* Icônes retenues pour Meridiem (Hugeicons gratuits, style stroke rounded, le même que Speyy) */
const ICONS: [string, string, IconSvgElement][] = [
  ["Home01Icon", "Accueil", Home01Icon], ["DashboardSquare01Icon", "Tableau de bord", DashboardSquare01Icon], ["InboxIcon", "Demandes", InboxIcon], ["Mail01Icon", "Mail", Mail01Icon], ["MailOpen01Icon", "Mail lu", MailOpen01Icon], ["SentIcon", "Envoyer", SentIcon],
  ["Attachment01Icon", "Pièce jointe", Attachment01Icon], ["Calendar03Icon", "Agenda", Calendar03Icon], ["Clock01Icon", "Heure", Clock01Icon], ["Notification01Icon", "Notifications", Notification01Icon], ["Search01Icon", "Rechercher", Search01Icon], ["FilterIcon", "Filtrer", FilterIcon],
  ["Settings02Icon", "Réglages", Settings02Icon], ["UserIcon", "Utilisateur", UserIcon], ["UserGroupIcon", "Équipe", UserGroupIcon], ["UserCircleIcon", "Profil", UserCircleIcon], ["Contact01Icon", "Contact", Contact01Icon], ["Building03Icon", "Entreprise", Building03Icon],
  ["Factory01Icon", "Usine", Factory01Icon], ["Store01Icon", "Magasin", Store01Icon], ["BriefcaseBusinessIcon", "Affaire", BriefcaseBusinessIcon], ["Invoice03Icon", "Devis", Invoice03Icon], ["Invoice01Icon", "Facture", Invoice01Icon], ["File01Icon", "Document", File01Icon],
  ["Folder01Icon", "Dossier", Folder01Icon], ["Note01Icon", "Note", Note01Icon], ["Archive02Icon", "Archiver", Archive02Icon], ["Download01Icon", "Télécharger", Download01Icon], ["Upload01Icon", "Importer", Upload01Icon], ["CloudUploadIcon", "Déposer", CloudUploadIcon],
  ["Link01Icon", "Lien", Link01Icon], ["Copy01Icon", "Copier", Copy01Icon], ["PencilEdit02Icon", "Modifier", PencilEdit02Icon], ["Delete02Icon", "Supprimer", Delete02Icon], ["Add01Icon", "Ajouter", Add01Icon], ["Cancel01Icon", "Fermer", Cancel01Icon],
  ["Tick02Icon", "Valider", Tick02Icon], ["CheckmarkCircle02Icon", "Terminé", CheckmarkCircle02Icon], ["Alert02Icon", "Alerte", Alert02Icon], ["InformationCircleIcon", "Information", InformationCircleIcon], ["HelpCircleIcon", "Aide", HelpCircleIcon], ["LockIcon", "Verrouillé", LockIcon],
  ["Key01Icon", "Accès", Key01Icon], ["SecurityCheckIcon", "Sécurité", SecurityCheckIcon], ["FingerPrintIcon", "Identité", FingerPrintIcon], ["ViewIcon", "Voir", ViewIcon], ["Globe02Icon", "Europe", Globe02Icon], ["ServerStack01Icon", "Hébergement", ServerStack01Icon],
  ["Database01Icon", "Base", Database01Icon], ["Plug01Icon", "Connecteur", Plug01Icon], ["ConnectIcon", "Intégration", ConnectIcon], ["WorkflowSquare01Icon", "Automatisation", WorkflowSquare01Icon], ["Robot01Icon", "Agent", Robot01Icon], ["AiBrain01Icon", "Mémoire", AiBrain01Icon],
  ["Analytics01Icon", "Statistiques", Analytics01Icon], ["ChartLineData01Icon", "Tendance", ChartLineData01Icon], ["ChartHistogramIcon", "Histogramme", ChartHistogramIcon], ["PieChartIcon", "Répartition", PieChartIcon], ["Target02Icon", "Objectif", Target02Icon], ["Task01Icon", "Tâche", Task01Icon],
  ["CheckListIcon", "Checklist", CheckListIcon], ["Package01Icon", "Colis", Package01Icon], ["DeliveryTruck01Icon", "Livraison", DeliveryTruck01Icon], ["ShoppingCart01Icon", "Commande", ShoppingCart01Icon], ["Wallet01Icon", "Portefeuille", Wallet01Icon], ["Money01Icon", "Montant", Money01Icon],
  ["BankIcon", "Banque", BankIcon], ["Agreement01Icon", "Accord", Agreement01Icon], ["Agreement02Icon", "Poignée de main (CRM)", Agreement02Icon], ["Tag01Icon", "Étiquette", Tag01Icon], ["PercentIcon", "Pourcentage", PercentIcon], ["Call02Icon", "Appel", Call02Icon], ["Message01Icon", "Message", Message01Icon],
  ["MessageMultiple01Icon", "Conversation", MessageMultiple01Icon], ["CustomerSupportIcon", "Support", CustomerSupportIcon], ["Location01Icon", "Adresse", Location01Icon], ["StarIcon", "Favori", StarIcon], ["StarOffIcon", "Retirer des favoris", StarOffIcon], ["PinIcon", "Épingler", PinIcon], ["PinOffIcon", "Détacher", PinOffIcon], ["FlagOffIcon", "Retirer du suivi", FlagOffIcon], ["Bookmark01Icon", "Signet", Bookmark01Icon], ["Share08Icon", "Partager", Share08Icon],
  ["Refresh01Icon", "Actualiser", Refresh01Icon], ["MoreHorizontalIcon", "Plus", MoreHorizontalIcon], ["ArrowRight01Icon", "Suivant", ArrowRight01Icon], ["ArrowLeft01Icon", "Précédent", ArrowLeft01Icon], ["ArrowUpDownIcon", "Trier", ArrowUpDownIcon], ["UnfoldMoreIcon", "Déplier", UnfoldMoreIcon],
  ["SidebarLeftIcon", "Menu latéral", SidebarLeftIcon], ["Menu01Icon", "Menu", Menu01Icon], ["GridViewIcon", "Grille", GridViewIcon], ["Layers01Icon", "Calques", Layers01Icon], ["KeyboardIcon", "Raccourcis", KeyboardIcon], ["Login01Icon", "Connexion", Login01Icon],
  ["Logout01Icon", "Déconnexion", Logout01Icon],
  ["KanbanIcon", "Kanban", KanbanIcon],
  ["BookOpen01Icon", "Lecture", BookOpen01Icon],
  ["Megaphone01Icon", "Annonce", Megaphone01Icon],
  ["ComputerTerminal01Icon", "Terminal", ComputerTerminal01Icon],
  ["Pulse01Icon", "Activité", Pulse01Icon],
  ["FullScreenIcon", "Plein écran", FullScreenIcon],
  ["GridTableIcon", "Tableau", GridTableIcon],
  ["LinkSquare02Icon", "Lien externe", LinkSquare02Icon],
  ["PlayIcon", "Lancer", PlayIcon],
  ["StopIcon", "Arrêter", StopIcon],
  ["PauseIcon", "Suspendre", PauseIcon],
  ["Video01Icon", "Vidéo", Video01Icon],
  ["TaskAdd01Icon", "Nouvelle tâche", TaskAdd01Icon],
  ["SquareUnlock02Icon", "Déverrouiller", SquareUnlock02Icon],
  ["SquareLock02Icon", "Verrouiller", SquareLock02Icon],
  ["Route01Icon", "Parcours", Route01Icon],
  ["SignpostIcon", "Orientation", SignpostIcon],
  ["FlashIcon", "Rapide", FlashIcon],
  ["Flag02Icon", "Drapeau", Flag02Icon],
  ["ViewOffIcon", "Masquer", ViewOffIcon],
  ["GitCommitHorizontalIcon", "Commit", GitCommitHorizontalIcon],
  ["SourceCodeIcon", "Code", SourceCodeIcon], ["PrinterIcon", "Imprimer", PrinterIcon], ["Image01Icon", "Image", Image01Icon], ["Mic01Icon", "Micro", Mic01Icon], ["Sun03Icon", "Clair", Sun03Icon], ["Moon02Icon", "Sombre", Moon02Icon],
]

export function Icons() {
  const [q, setQ] = useState("")
  const [size, setSize] = useState("20")
  const list = useMemo(() => ICONS.filter(([n, l]) => (n + l).toLowerCase().includes(q.toLowerCase())), [q])
  const copy = (n: string) => {
    try { navigator.clipboard.writeText(n).then(() => toast.success("Copié : " + n), () => toast("Nom de l'icône : " + n)) } catch { toast("Nom de l'icône : " + n) }
  }
  return (
    <KitSection id="icones" title="Icônes" desc="Hugeicons, style stroke rounded, trait 1,5 : le jeu utilisé sur Speyy. Paquets @hugeicons/react et @hugeicons/core-free-icons. Cliquez sur une icône pour copier son nom.">
      <div className="flex flex-wrap items-center gap-3">
        <InputGroup className="sm:w-72"><InputGroupAddon><Icon icon={Search01Icon} /></InputGroupAddon><InputGroupInput placeholder="Rechercher une icône (devis, mail…)" value={q} onChange={(e) => setQ(e.target.value)} /></InputGroup>
        <ToggleGroup type="single" variant="outline" size="sm" value={size} onValueChange={(v) => v && setSize(v)}>
          <ToggleGroupItem value="16">16</ToggleGroupItem><ToggleGroupItem value="20">20</ToggleGroupItem><ToggleGroupItem value="24">24</ToggleGroupItem>
        </ToggleGroup>
        <span className="text-sm text-muted-foreground"><span className="num">{list.length}</span> icônes</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {list.map(([n, l, ic]) => (
          <button key={n} onClick={() => copy(n)} className="group flex flex-col items-center gap-2 rounded-lg border bg-card px-2 py-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift">
            <Icon icon={ic} size={Number(size)} className="text-foreground transition-colors group-hover:text-primary" />
            <span className="text-xs">{l}</span>
            <span className="max-w-full truncate font-mono text-[10px] text-muted-foreground">{n.replace(/Icon$/, "")}</span>
          </button>
        ))}
      </div>
    </KitSection>
  )
}
