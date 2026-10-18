# meridiem-ui · design system Olympe

Le design system de [Meridiem](https://www.meridiem.be) : un socle commun pour les plateformes, les sites et les outils que nous construisons, pour que tout soit cohérent, propre et rapide à produire. Les agents IA qui développent pour Meridiem partent d'ici au lieu de recoder les mêmes blocs.

**Olympe** : ivoire et encre, titres en EB Garamond, interface en Geist, icônes Hugeicons, terracotta réservé à l'action principale. Composants shadcn/ui (Radix) habillés par le thème, graphiques Recharts, tables TanStack, animations Motion.

## Ce qu'il contient
| Dossier | Contenu | Pour |
|---|---|---|
| `registry.json`, `public/r/` | registre shadcn : thème, styles, briques de marque, carte animée, graphiques, table, plateforme type, landing | projets React (Vite, Next) |
| `vanilla/` | `olympe.css` (classes `.m-*`), `meridiem.js` (les blocs : cartes animées, graphiques, bandeau ville, points animés, menu et sous-menu, thème, pastille, toasts, états vides), `icons.js` (121 icônes), `art.js` (moteur de visuels), `demo.html` | pages sans framework |
| `tokens/` | jetons au format DTCG | tout outil (Figma, Style Dictionary, documents) |
| `src/` | la démo : plateforme interactive, landing, kit de référence | consulter, copier |
| `DESIGN.md` | les règles, à lire avant toute interface | humains et agents |

## Démarrer un nouveau projet
**React (Vite ou Next), le cas courant**
```bash
npm create vite@latest mon-app -- --template react-ts
cd mon-app && npm install && npm install tailwindcss @tailwindcss/vite
# configurer Tailwind 4 et l'alias @/ (copier vite.config.ts et les "paths" des tsconfig de ce dépôt)
npx shadcn@latest init -t vite -b radix -p nova
# dans components.json : "iconLibrary": "hugeicons"
R=https://raw.githubusercontent.com/MaxSch1/meridiem-ui/main/public/r
npx shadcn@latest add $R/olympe-theme.json $R/olympe-styles.json
npx shadcn@latest add $R/platform.json   # gabarit de plateforme complet, ou $R/landing.json
```
Puis ajouter `@import "./styles/olympe.css";` dans le CSS principal, et envelopper l'app dans
`<TooltipProvider>` avec un `<Toaster />` (sonner).

**Projet React existant** : les deux premières commandes `add`, puis les éléments à la carte.

| Élément | Ce que c'est |
|---|---|
| `olympe-theme` | les variables de couleur, polices, rayons, ombres, couleurs de statut |
| `olympe-styles` | polices locales et utilitaires : `.eyebrow`, `.hairline-grid`, `.stagger`, `.num` |
| `brand` | `Icon`, `Logo` et `Mark` (noir le jour, blanc la nuit), `CityDots` (ville en points, ville éclairée la nuit), `DotField`, `DotChart`, `IsoArt` (9 animations), `StatusBadge` |
| `theme` | apparence Jour, Nuit, Système : `ThemeProvider`, `ThemeScript` (pas de flash au chargement), `ThemeSubmenu` (entrée « Apparence » du menu du compte) |
| `kpi-card` | carte indicateur avec illustration animée au survol |
| `charts` | aire à deux séries, colonnes tramées, barres empilées, courbe, jauge radiale |
| `clients-table` | table de données : recherche, tri, sélection, actions, pagination (TanStack Table v8) |
| `data-table` | table générique : vos colonnes et vos données, recherche, tri, pagination, état vide (TanStack Table v8) |
| `spinner` | spinner shadcn adapté à Hugeicons (celui d'origine ne compile pas avec cette bibliothèque d'icônes) |
| `platform` | sidebar, menu du compte (avec Apparence), ⌘K, notifications, tableau de bord, demandes, clients, réglages ; remplace le `use-mobile` de la sidebar shadcn par une version qui passe le lint de Next 16 |
| `landing` | héros sur la ville en points, grille de filets, bloc final, prise de rendez-vous |

## Mode nuit en deux minutes
Olympe a un mode nuit complet (encre chaude, texte ivoire, ville de nuit éclairée). Jour par défaut ; toute interface
propose Jour, Nuit, Système dans le menu du compte. Règles et jetons : `DESIGN.md` § Mode nuit.

**React**
```bash
npx shadcn@latest add $R/olympe-theme.json $R/olympe-styles.json $R/theme.json
```
```tsx
import { ThemeProvider, ThemeSubmenu } from "@/components/meridiem/theme"
<ThemeProvider><App /></ThemeProvider>                 // pose data-theme et .dark sur <html>, mémorise le choix
<DropdownMenuContent>… <ThemeSubmenu /> …</DropdownMenuContent>   // dans le menu du compte
```
Sans flash : le `<script>` de `index.html` (Vite) ou `<ThemeScript />` dans `<head>` (Next.js, avec
`<html suppressHydrationWarning>`), ou le cookie `olympe-theme` lu côté serveur. Ville, points, colonnes, ombres et
logo (`<Logo />`) suivent seuls ; une couleur écrite en dur ne suit pas.

**Sans framework** : `MUI.setTheme("dark" | "light" | "auto")` ; le sous-menu « Apparence » se monte avec
`.m-menu-sub` dans un panneau de `MUI.menu` et `MUI.menuValue(bloc, valeur)` (exemple : `vanilla/demo.html`).

## Pour les agents IA
- Lire `DESIGN.md`, puis ouvrir le kit (`npm run build`, `dist/index.html#kit`) : copier ce qu'on y voit.
- Réutiliser les blocs ; un équivalent maison est un défaut. Habiller un écran existant, c'est le restructurer avec les blocs, pas seulement changer ses couleurs.
- Prouver : captures à 1440 et 390 px, de jour ET de nuit, liste des blocs utilisés, console propre.

## Utiliser sans framework
```html
<link rel="stylesheet" href="vanilla/olympe.css">
<body class="m-body">
  <button class="m-btn m-btn-primary"><i data-icon="Add01"></i>Nouvelle demande</button>
  <span class="m-badge is-wait">À valider</span>
  <script src="vanilla/icons.js"></script>
  <script>MeridiemIcons.hydrate()</script>
</body>
```
Les blocs du design system existent aussi sans framework (`vanilla/meridiem.js`, objet `MUI`) :

| Bloc | Appel |
|---|---|
| Carte indicateur animée | `MUI.kpi({ label, value, note, kind: "bars" })` puis `MUI.bind(racine)` |
| Rangée de cartes rafraîchie en place (page qui se met à jour seule) | `MUI.kpis(el, [{ label, value, note, kind }])` |
| Graphiques | `MUI.area(el, …)`, `MUI.columns(el, …)`, `MUI.donut(el, …)`, `MUI.radial(el, …)` ; `area` accepte `format` (infobulle), `axisFormat` (graduations Y) et `padLeft` (place des unités) |
| Bandeau ville en points, bloc à points animés | `MUI.banner({ … })`, `MUI.ctaBand({ … })` |
| Menu du compte, pastille de navigation | `MUI.menu(bouton, panneau, { side: "top" })`, `MUI.navPill(nav)` |
| Sous-menu de préférence (Apparence, langue), thème | bloc `.m-menu-sub` dans le panneau de `MUI.menu`, `MUI.menuValue(bloc, valeur)` ; `MUI.setTheme("dark" \| "light" \| "auto")`, `MUI.theme()`, `MUI.retheme()` |
| Palette de commandes ⌘K, recherche dans le contenu | `MUI.palette({ items, sources, hotkey: true })` (détail ci-dessous) |
| Barre d'actions (décision à gauche, suivi à droite, « ⋯ ») | `MUI.actionBar({ size, prompt, decision, follow, more, status, panel })` (détail ci-dessous) ; `MUI.busy(bouton, fn)` pour l'état de chargement |
| Fenêtre centrée (réglages, confirmation) | `MUI.dialog({ title, description, content, footer })` puis `.open()` ; interrupteur `<input type="checkbox" class="m-switch">`, lignes `.m-section` et `.m-setting` |
| Toasts, état vide, badge | `MUI.toast(titre, { description })`, `MUI.empty({ … })`, `MUI.badge(statut, texte)` |

### Palette ⌘K : pages, actions et recherche dans les données
```js
const pal = MUI.palette({
  hotkey: true,                                   // ⌘K / Ctrl+K
  placeholder: "Rechercher",
  items: () => [                                  // fixes : tous visibles quand le champ est vide
    { group: "Pages", label: "Clients", icon: "UserGroup", run: () => go("clients") },
    { group: "Actions", label: "Nouvelle demande", icon: "Add01", run: () => newRequest() },
  ],
  sources: [{                                     // cherchées quand on tape, avant les pages
    group: "Clients",
    items: () => CLIENTS.map(c => ({ label: c.name, sub: c.city, icon: "Building03", badge: MUI.badge("ok", "actif"), run: () => openClient(c.id) })),
    ready: () => CLIENTS.length > 0,              // données déjà en mémoire ?
    load: () => fetch("/api/clients").then(r => r.json()).then(d => { CLIENTS = d }),   // sinon chargées à l'ouverture
    ttl: 5 * 60 * 1000,                           // cache, rechargé en arrière-plan après 5 min
  }],
  limit: 5,                                       // résultats par groupe
  emptyText: q => `Aucun résultat pour « ${q} »`,
  emptyItems: q => [{ group: "Suggestion", label: "Nouvelle demande", icon: "Add01", run: () => newRequest(q) }],
});
```
Recherche sans accents ni casse, mot à mot (tous les mots doivent figurer dans `label`, `sub`, `keywords` ou `group`),
classement par pertinence (début du libellé d'abord), termes en surbrillance, ligne « Chargement… » tant qu'une source
charge, flèches puis Entrée, Échap. `pal.open()`, `pal.close()`, `pal.refresh()`.

### Barre d'actions
```js
el.innerHTML += MUI.actionBar({
  size: "md",                                        // "sm" : boutons 30 px (listes, colonnes)
  prompt: "L'agent attend ta décision",
  decision: [
    { label: "Confirmer", icon: "Tick02", kind: "primary", onclick: "confirmer(this)" },   // un seul terracotta
    { label: "Donner un retour", icon: "PencilEdit02", onclick: "ouvrirRetour()" },
  ],
  follow: [{ label: "Marquer lu", icon: "MailOpen01", onclick: "marquerLu()" }],
  more: [{ label: "Discuter avec l'agent", icon: "Message01", onclick: "discuter()" }],
  // status: { tone: "ok", word: "Confirmé", text: "à 23:41" }  remplace le groupe décision une fois fait
  // panel: '<textarea>…</textarea><div class="m-ab-panel-acts">…</div>'  zone ouverte sous la barre
});
```
Même hauteur pour tous les boutons, libellés avec icône, ordre fixe ; sous 520 px de large la barre passe sur deux lignes,
décision au-dessus. Le « ⋯ » est un `MUI.menu` branché tout seul au premier clic.

### Fenêtre centrée
```js
const dlg = MUI.dialog({ title: "Réglages", description: "Pour ce navigateur", content: document.getElementById("reglages") });
dlg.open();   // voile, titre en serif, croix, Échap et clic sur le voile ferment ; l'élément garde ses ids et écouteurs
```

Exemple complet : `vanilla/demo.html` (à servir en http, pas en file://).

## Lancer la démo
```bash
npm install
npm run dev        # #platform, #landing, #kit
npm run build:all  # démo (page unique dist/index.html), registre, version sans framework
```

## Règles en bref
- Un seul bouton terracotta par zone ; secondaire en contour, discret en fantôme.
- Un statut porte toujours un mot en plus de sa couleur.
- Chaque action a un effet visible : toast, fenêtre, panneau, chargement.
- Les états vides disent quoi faire et proposent l'action.
- Pas d'image tierce : les visuels sont générés (`art.js`) ou viennent de Meridiem.

Détail : [DESIGN.md](DESIGN.md).

## Licence
Code sous licence MIT. Le logo et les images Meridiem ne sont pas couverts : voir [NOTICE.md](NOTICE.md).
