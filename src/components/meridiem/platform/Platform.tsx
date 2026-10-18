"use client"
/* Plateforme métier type : coquille (sidebar, en-tête, palette de commandes, notifications, menu du compte) et navigation entre pages. */
import { useEffect, useState } from "react"
import {
  DashboardSquare01Icon, InboxIcon, Invoice03Icon, UserGroupIcon, Folder01Icon, Search01Icon, Notification01Icon, Add01Icon,
  Settings02Icon, HelpCircleIcon, Logout01Icon, UserCircleIcon, KeyboardIcon, UnfoldMoreIcon, Tick02Icon, Mail01Icon, Building03Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { AnimatePresence, motion } from "motion/react"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset,
  SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Icon, Logo } from "@/components/meridiem/brand"
import { ThemeSubmenu } from "@/components/meridiem/theme"
import { REQUESTS, NOTIFICATIONS, CLIENTS, type Request } from "@/components/meridiem/demo-data"
import Dashboard from "./Dashboard"
import Requests from "./Requests"
import Clients from "./Clients"
import Settings from "./Settings"

export type Page = "dashboard" | "requests" | "quotes" | "clients" | "documents" | "settings"
const NAV: { id: Page; label: string; icon: typeof InboxIcon }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: DashboardSquare01Icon },
  { id: "requests", label: "Demandes", icon: InboxIcon },
  { id: "quotes", label: "Devis", icon: Invoice03Icon },
  { id: "clients", label: "Clients", icon: UserGroupIcon },
  { id: "documents", label: "Documents", icon: Folder01Icon },
]
const TITLES: Record<Page, string> = { dashboard: "Tableau de bord", requests: "Demandes", quotes: "Devis", clients: "Clients", documents: "Documents", settings: "Réglages" }

export default function Platform() {
  const [page, setPage] = useState<Page>("dashboard")
  const [rows, setRows] = useState<Request[]>(REQUESTS)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [keysOpen, setKeysOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const toValidate = rows.filter((r) => r.status === "wait").length

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen((o) => !o) }
    }
    window.addEventListener("keydown", on)
    return () => window.removeEventListener("keydown", on)
  }, [])

  const go = (p: Page) => { setPage(p); setCmdOpen(false); window.scrollTo(0, 0) }
  const createRequest = (r: Request) => {
    setRows((rs) => [r, ...rs])
    setNewOpen(false)
    go("requests")
    toast.success(`Demande ${r.id} créée`, { description: `${r.client} · ${r.title}` })
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary font-heading text-lg text-primary-foreground">L</div>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate text-sm font-medium">Lambert Emballages</span>
                      <span className="truncate text-xs text-muted-foreground">Plateforme commerciale</span>
                    </div>
                    <Icon icon={UnfoldMoreIcon} className="ml-auto text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="start" side="bottom">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Espaces de travail</DropdownMenuLabel>
                  <DropdownMenuItem><Icon icon={Building03Icon} />Lambert Emballages<Icon icon={Tick02Icon} className="ml-auto" /></DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => toast("Changement d'espace", { description: "Verrerie Delvaux (démo)" })}><Icon icon={Building03Icon} />Verrerie Delvaux</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => toast("Ajouter un espace de travail", { description: "Disponible dans la vraie plateforme" })}><Icon icon={Add01Icon} />Ajouter un espace</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setCmdOpen(true)} className="text-muted-foreground">
                    <Icon icon={Search01Icon} /><span>Rechercher</span><Kbd className="ml-auto">⌘K</Kbd>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {NAV.map((n) => (
                  <SidebarMenuItem key={n.id}>
                    <SidebarMenuButton isActive={page === n.id} tooltip={n.label} onClick={() => go(n.id)} className="relative data-active:bg-transparent">
                      {page === n.id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-md bg-sidebar-accent" transition={{ type: "spring", stiffness: 520, damping: 40 }} />}
                      <Icon icon={n.icon} className="relative" /><span className="relative">{n.label}</span>
                    </SidebarMenuButton>
                    {n.id === "requests" && toValidate ? <SidebarMenuBadge className="num">{toValidate}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>À valider</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {rows.filter((r) => r.status === "wait" || r.status === "crit").slice(0, 4).map((r) => (
                  <SidebarMenuItem key={r.id}>
                    <SidebarMenuButton size="sm" className="text-muted-foreground" onClick={() => go("requests")}>
                      <span className="truncate">{r.client}</span>
                      {r.status === "crit" && <span className="ml-auto font-mono text-[10px] tracking-wide text-crit uppercase">urgent</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                    <Avatar className="size-8 rounded-lg"><AvatarFallback className="rounded-lg bg-sand/50 dark:bg-sand/16 text-xs">JR</AvatarFallback></Avatar>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate text-sm font-medium">Julie Remacle</span>
                      <span className="truncate text-xs text-muted-foreground">julie@lambert-emballages.be</span>
                    </div>
                    <Icon icon={UnfoldMoreIcon} className="ml-auto text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" side="top" align="start" sideOffset={6}>
                  <DropdownMenuLabel className="flex items-center gap-2 font-normal">
                    <Avatar className="size-8 rounded-lg"><AvatarFallback className="rounded-lg bg-sand/50 dark:bg-sand/16 text-xs">JR</AvatarFallback></Avatar>
                    <div className="grid leading-tight"><span className="text-sm font-medium">Julie Remacle</span><span className="text-xs text-muted-foreground">Service commercial</span></div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => go("settings")}><Icon icon={UserCircleIcon} />Mon profil</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => go("settings")}><Icon icon={Settings02Icon} />Réglages<DropdownMenuShortcut>⌘,</DropdownMenuShortcut></DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setHelpOpen(true)}><Icon icon={HelpCircleIcon} />Aide</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setKeysOpen(true)}><Icon icon={KeyboardIcon} />Raccourcis clavier</DropdownMenuItem>
                    <ThemeSubmenu onChange={(t, r) => toast(t === "dark" ? "Mode nuit" : t === "auto" ? "Thème du système" : "Mode jour", { description: "Thème actif : " + (r === "dark" ? "nuit" : "jour") })} />
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => toast("Déconnexion", { description: "Désactivée dans la maquette" })}><Icon icon={Logout01Icon} />Se déconnecter</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center gap-1.5 px-2 pb-1 text-[11px] text-muted-foreground">by <Logo className="h-2.5 w-auto opacity-70" /></div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block"><BreadcrumbLink href="#platform" onClick={(e) => { e.preventDefault(); go("dashboard") }}>Lambert Emballages</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>{TITLES[page]}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                  <Icon icon={Notification01Icon} />
                  {unread && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <span className="text-sm font-medium">Notifications</span>
                  <Button variant="ghost" size="xs" disabled={!unread} onClick={() => { setUnread(false); toast.success("Notifications marquées comme lues") }}>Tout marquer comme lu</Button>
                </div>
                <div className="divide-y">
                  {NOTIFICATIONS.map((n) => (
                    <button key={n.id} className="flex w-full gap-3 px-4 py-3 text-left hover:bg-muted/60" onClick={() => go("requests")}>
                      <span className={"mt-1.5 size-2 shrink-0 rounded-full " + (unread ? "bg-primary" : "bg-border")} aria-hidden />
                      <span className="grid gap-0.5"><span className="text-sm font-medium">{n.title}</span><span className="text-xs text-muted-foreground">{n.text} · {n.at}</span></span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button size="sm" onClick={() => setNewOpen(true)}><Icon icon={Add01Icon} />Nouvelle demande</Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
          <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            className="stagger flex flex-1 flex-col gap-5"
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
            exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
          >
          {page === "dashboard" && <Dashboard rows={rows} go={go} />}
          {page === "requests" && <Requests rows={rows} setRows={setRows} />}
          {page === "clients" && <Clients onNewRequest={() => setNewOpen(true)} />}
          {page === "settings" && <Settings />}
          {page === "quotes" && (
            <Empty className="min-h-[60vh] rounded-xl border border-dashed bg-card">
              <EmptyHeader>
                <EmptyMedia variant="icon"><Icon icon={Invoice03Icon} /></EmptyMedia>
                <EmptyTitle>Aucun devis en attente de signature</EmptyTitle>
                <EmptyDescription>Les devis validés dans Demandes apparaissent ici jusqu'à leur signature par le client.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent><Button onClick={() => go("requests")}>Voir les demandes à valider</Button></EmptyContent>
            </Empty>
          )}
          {page === "documents" && (
            <Empty className="min-h-[60vh] rounded-xl border border-dashed bg-card">
              <EmptyHeader>
                <EmptyMedia variant="icon"><Icon icon={Folder01Icon} /></EmptyMedia>
                <EmptyTitle>Aucun document</EmptyTitle>
                <EmptyDescription>Déposez vos conditions générales et vos catalogues : l'assistant s'en sert pour préparer les devis.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent><Button variant="outline" onClick={() => toast.success("Import lancé", { description: "conditions-generales-2026.pdf" })}>Importer un document</Button></EmptyContent>
            </Empty>
          )}
          </motion.div>
          </AnimatePresence>
          <p className="text-center font-mono text-[11px] text-muted-foreground">Données d'exemple</p>
        </div>
      </SidebarInset>

      {/* Palette de commandes (⌘K) */}
      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen} title="Rechercher" description="Aller à une page ou lancer une action">
        {/* cmdk exige son conteneur <Command> : CommandDialog (shadcn actuel) ne le pose plus. */}
        <Command>
        <CommandInput placeholder="Rechercher une page, un client, une action" />
        <CommandList>
          <CommandEmpty>Aucun résultat.</CommandEmpty>
          <CommandGroup heading="Pages">
            {NAV.map((n) => <CommandItem key={n.id} onSelect={() => go(n.id)}><Icon icon={n.icon} />{n.label}</CommandItem>)}
            <CommandItem onSelect={() => go("settings")}><Icon icon={Settings02Icon} />Réglages<CommandShortcut>⌘,</CommandShortcut></CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { setCmdOpen(false); setNewOpen(true) }}><Icon icon={Add01Icon} />Nouvelle demande</CommandItem>
            <CommandItem onSelect={() => { setCmdOpen(false); toast.success("Relances préparées", { description: "4 brouillons dans Outlook" }) }}><Icon icon={Mail01Icon} />Préparer les relances de devis</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Clients">
            {CLIENTS.slice(0, 5).map((c) => <CommandItem key={c.id} onSelect={() => go("clients")}><Icon icon={Building03Icon} />{c.name}<span className="ml-auto text-xs text-muted-foreground">{c.city}</span></CommandItem>)}
          </CommandGroup>
        </CommandList>
        </Command>
      </CommandDialog>

      <NewRequestDialog open={newOpen} onOpenChange={setNewOpen} nextId={"D-" + (2612 + rows.length - REQUESTS.length)} onCreate={createRequest} />

      {/* Aide (depuis le menu du compte) */}
      <Sheet open={helpOpen} onOpenChange={setHelpOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-heading text-2xl font-normal">Aide</SheetTitle>
            <SheetDescription>Les réponses aux questions les plus fréquentes.</SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <Accordion type="single" collapsible defaultValue="q1">
              <AccordionItem value="q1"><AccordionTrigger>Que fait l'assistant sans me demander ?</AccordionTrigger><AccordionContent className="text-muted-foreground">Il lit, trie et prépare (réponses, devis, relances). Tout ce qui part chez un client attend votre validation.</AccordionContent></AccordionItem>
              <AccordionItem value="q2"><AccordionTrigger>Comment corriger un devis préparé ?</AccordionTrigger><AccordionContent className="text-muted-foreground">Ouvrez la demande, cliquez sur Modifier, changez les lignes puis enregistrez. L'assistant retient vos corrections.</AccordionContent></AccordionItem>
              <AccordionItem value="q3"><AccordionTrigger>Où sont hébergées mes données ?</AccordionTrigger><AccordionContent className="text-muted-foreground">En Europe, sur Azure. Vos données ne servent pas à entraîner d'autres modèles.</AccordionContent></AccordionItem>
            </Accordion>
          </div>
          <div className="mt-auto flex flex-col gap-2 p-4">
            <Button onClick={() => { setHelpOpen(false); toast.success("Message envoyé à Meridiem", { description: "Réponse sous 24 h ouvrées" }) }}>Écrire à Meridiem</Button>
            <Button variant="outline" onClick={() => { setHelpOpen(false); setKeysOpen(true) }}>Voir les raccourcis clavier</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Raccourcis */}
      <Dialog open={keysOpen} onOpenChange={setKeysOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-heading text-xl font-normal">Raccourcis clavier</DialogTitle><DialogDescription>Pour aller plus vite.</DialogDescription></DialogHeader>
          <div className="divide-y text-sm">
            {[["Rechercher", ["⌘", "K"]], ["Nouvelle demande", ["N"]], ["Valider la demande ouverte", ["⌘", "Entrée"]], ["Réglages", ["⌘", ","]]].map(([l, k]) => (
              <div key={l as string} className="flex items-center justify-between py-2.5"><span>{l as string}</span><KbdGroup>{(k as string[]).map((x) => <Kbd key={x}>{x}</Kbd>)}</KbdGroup></div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

function NewRequestDialog({ open, onOpenChange, nextId, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; nextId: string; onCreate: (r: Request) => void }) {
  const [client, setClient] = useState("Biscuiterie Destrée")
  const [type, setType] = useState("Devis")
  const [title, setTitle] = useState("")
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const c = CLIENTS.find((x) => x.name === client)!
    onCreate({ id: nextId, title: title || "Nouvelle demande", client, contact: c.contact, type, at: "à l'instant", amount: "", status: "info", label: "En cours", owner: "JR" })
    setTitle("")
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-normal">Nouvelle demande</DialogTitle>
            <DialogDescription>L'assistant prépare une première réponse dès la création.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nr-client">Client</FieldLabel>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger id="nr-client" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{CLIENTS.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="nr-type">Type</FieldLabel>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="nr-type" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{["Devis", "Commande", "Réclamation", "Administratif"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="nr-title">Objet</FieldLabel>
              <Input id="nr-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Devis 6 000 bocaux 212 ml" />
            </Field>
            <Field>
              <FieldLabel htmlFor="nr-msg">Message du client</FieldLabel>
              <Textarea id="nr-msg" placeholder="Collez ici le mail ou les notes d'appel" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit">Créer la demande</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
