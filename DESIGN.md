---
name: Meridiem Olympe
version: 0.1.0
colors:
  ivory: "#F6F3ED"
  background: "#FBF9F5"
  sidebar: "#F3EFE8"
  card: "#FFFFFF"
  foreground: "#1C1B1A"
  muted: "#F2EDE5"
  muted-foreground: "#6B6764"
  border: "#E8E2D8"
  ring: "#C98A5E"
  primary: "#AA4F13"
  sand: "#E3CDB3"
  sepia: "#4A2C18"
  status: { ok: "#2F7A4A", warn: "#9A5D0C", wait: "#55499F", crit: "#B3261E", info: "#2B6099" }
  chart: ["#AA4F13", "#3F6FB0", "#C2861A", "#0E8C7C", "#8E4F8A"]
colors-dark:
  background: "#181513"
  sidebar: "#12100E"
  card: "#211D19"
  foreground: "#EEE7DB"
  muted: "#2B2621"
  muted-foreground: "#A9A095"
  border: "#36302A"
  ring: "#C98A5E"
  primary: "#D9773F"
  primary-foreground: "#1A1410"
  status: { ok: "#6CC08A", warn: "#E3A55A", wait: "#AFA2EE", crit: "#F2867A", info: "#80B2E8" }
  chart: ["#D9773F", "#7489E2", "#C3841A", "#2AA88C", "#BE72CC"]
  city: { mode: nocturne, mass: ["#433A31", "#5C4F42"], lights: ["#A8693A", "#DE9A4E", "#F2D49C"] }
  dots: { ink: "#5C5045", accent: "#D9934A" }
  cta: "#0E0C0A"
typography:
  heading: "EB Garamond"
  sans: "Geist"
  mono: "Geist Mono"
radius: { sm: 6px, md: 10px, lg: 14px }
icons: "Hugeicons free, stroke rounded, stroke 1.5"
---

# Meridiem · Olympe

## Vue d'ensemble
Calme, lisible, sérieux, avec une touche classique : ivoire et encre, titres en serif, beaucoup d'air, ombres très douces. La couleur vit dans les visuels de marque (ville en points, champ de points) et dans une seule action par zone. Lire ce fichier avant de créer ou de modifier une interface Meridiem.

## Marque
- Logotypes officiels (fournis par Maxime le 06/10/2026) : `public/assets/meridiem-logo-noir.png` sur fond
  clair, `public/assets/meridiem-logo-blanc.png` sur fond sombre (`assets.logo`, `assets.logoLight`). Ne pas
  redessiner le logo, ne pas l'écrire en texte à côté : le fichier contient déjà le mot « Meridiem ».
  React : `<Logo className="h-5 w-auto" />` (brique `brand`) pose le noir le jour et le blanc la nuit, sans flash ;
  `<Mark className="w-10" />` pose l'icône seule, jamais écrasée, blanche la nuit.
- Signature en pied de page : « meridiem.be · Your AI partner ». Ne jamais mettre l'adresse ni la ville
  (Waremme) en avant dans une interface (demande de Maxime du 06/10/2026). Seul un document commercial ou
  légal (devis, facture, CGV) porte l'adresse du siège.
- Icône seule (sans le mot) : son ratio est 1,79 (plus large que haute). Ne jamais la mettre dans une boîte
  carrée avec une largeur ET une hauteur imposées : elle s'écrase (retour de Maxime du 16/10/2026, favicons
  et icônes d'interfaces écrasés). Dans une page : `height: auto` ou `object-fit: contain`. Pour tout usage
  carré, les fichiers déjà carrés de `public/assets/` : `meridiem-icone-carre.png` (fond clair),
  `meridiem-icone-carre-blanc.png` (fond sombre), et le jeu de favicons `favicon/` à copier tel quel :
  ```html
  <link rel="icon" href="favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">
  ```
  Next.js : copier `favicon.ico` dans `src/app/` et `apple-touch-icon.png` sous le nom `src/app/apple-icon.png`.
  Version haute définition de l'icône (440 × 246) : `meridiem-icone-hd.png`.

## Couleurs
- Fond de page `background`, surfaces `card`, menu de gauche `sidebar`, filets `border`.
- `primary` (terracotta) : l'action principale de la zone, et elle seule. Les autres actions : contour (`outline`) ou fantôme (`ghost`).
- Statuts : `ok` traitée, `wait` à valider, `warn` bloquée, `crit` urgent, `info` en cours. Toujours une pastille ET un mot (`StatusBadge` ou `.m-badge`), jamais la couleur seule.
- Graphiques : `chart` dans cet ordre fixe, jamais réordonné ; palette vérifiée pour le daltonisme. La couleur suit la série, pas son rang.

## Mode nuit
Olympe de nuit, pas un thème sombre générique : la même page, éclairée à la bougie.

**Principes**
- Fond encre chaude (`#181513`), jamais de noir pur ni de bleu nuit. Les surfaces montent d'un cran
  vers le clair (carte `#211D19`, fenêtre `#262119`) ; le menu de gauche descend d'un cran (`#12100E`),
  comme de jour où il est plus foncé que la page.
- Texte ivoire (`#EEE7DB`), secondaire pierre claire (`#A9A095`), filets discrets (`#36302A`).
- Terracotta éclairci (`#D9773F`) pour l'action principale, avec un texte encre (`#1A1410`) : du blanc
  sur un terracotta assez clair pour se détacher du fond tomberait sous 4,5:1. Toujours un seul par zone.
- Titres EB Garamond inchangés (taille, graisse) ; seule leur couleur suit `foreground`.
- Statuts éclaircis, pastille ET mot comme de jour. Graphiques : même ordre, couleurs éclaircies.
- Visuels de marque : la ville devient une **ville de nuit éclairée** (retours de Maxime du 18/10/2026,
  « les petits points très laids » de la première version) : le ciel, la brume et l'eau restent la carte,
  la ville est une masse de points sourds (`--m-city-1`, `--m-city-2`) piquée de lumières chaudes là où
  la photo est plus claire que son voisinage (`--m-city-light-1` à `-3`, de l'ambre sourd au doré).
  À l'apparition, la masse monte comme de jour puis les lumières s'allument une à une. Le jeton
  `--m-city-mode: nocturne` choisit ce rendu (`ditherImage` mode `nocturne`), le jour ne le pose pas.
  Trois partis essayés dans le vrai bandeau (gravure claire, ville éclairée, riso deux encres) :
  `docs/qa/mode-nuit/ville-nuit-essais.png`. Champ de points (`MUI.dotField`, bloc final, carte
  sombre) en pierre et ambre (`--m-dots` `#5C5045`, `--m-dots-accent` `#D9934A`), jamais de terracotta
  saturé sur l'encre. Bloc à points plus profond que la page (`#0E0C0A`), cerné d'un filet ; cartes
  animées en traits clairs, leur touche terracotta suit `primary`.
  React : mêmes jetons sans préfixe (`--city-mode`, `--city-*`, `--dots`, `--dots-accent`, `--cta`).
- Ombres en noir et plus denses (sans quoi elles disparaissent) ; voile des fenêtres plus opaque.
- Aires de graphique allégées : le dégradé garde 30 % de son opacité de jour (`--m-area-fill`, `--chart-area-fill`) ; la ville reste sourde : seules quelques lumières sont vives, jamais une zone entière lumineuse.

**Activer**
| Valeur | Effet |
|---|---|
| rien, ou `<html data-theme="light">` | jour : rendu identique à avant le mode nuit, même si le système est en sombre |
| `<html data-theme="dark">` | nuit |
| `<html data-theme="auto">` | suit le réglage du système (`prefers-color-scheme`) |
| classe `.dark` (React, `next-themes` en `attribute="class"`) | nuit |

- Sans framework : `MUI.setTheme("dark" | "light" | "auto")`, `MUI.theme()` rend le thème effectif.
  Graphiques SVG et illustrations lisent les variables : rien à refaire. Les visuels sur canvas (ville,
  champ de points, graphique en points) sont redessinés seuls quand `data-theme` change ou que le
  système bascule ; `MUI.retheme()` le force. `MUI.CHART` contient des `var(--m-chart-N, #jour)`
  (utilisables en SVG et en CSS) ; `MUI.CHART_HEX` garde les hexadécimaux de jour.
- Icône officielle noire dans une page qui passe la nuit : classe `m-mark-ink` (elle devient blanche,
  sans autre fichier). Logo complet : `meridiem-logo-blanc.png` sur fond sombre.
- React, mode d'emploi (élément `theme` du registre) :
  ```bash
  npx shadcn@latest add $R/olympe-theme.json $R/olympe-styles.json $R/theme.json
  ```
  1. Envelopper l'application : `<ThemeProvider>` (Jour par défaut, choix gardé dans le navigateur sous `olympe-theme`,
     même clé et mêmes valeurs `light`, `dark`, `auto` que `MUI.setTheme`, et dans un cookie du même nom). Il pose
     `data-theme` sur `<html>` et la classe `.dark` quand la page est de nuit : les utilitaires `dark:` de shadcn suivent
     sans autre réglage. `useTheme()` rend `theme`, `resolvedTheme` (`light` ou `dark`) et `setTheme`.
  2. Aucun flash au chargement : le thème doit être posé avant le premier affichage.
     Vite : copier le `<script>` de `index.html` de ce dépôt dans `<head>` (c'est `themeScript()`).
     Next.js (App Router) : `<html lang="fr" suppressHydrationWarning><head><ThemeScript /></head>…`, ou lire le cookie
     côté serveur : `const t = (await cookies()).get("olympe-theme")?.value` puis `<html data-theme={t ?? "light"}
     className={t === "dark" ? "dark" : undefined}>` et `<ThemeProvider initialTheme={t}>` (en `auto`, seul le script
     connaît le réglage du système : garder `ThemeScript` ou le bloc `@custom-variant` ci-dessous).
  3. Le choix dans le menu du compte : `<ThemeSubmenu />` dans le `DropdownMenuContent` (entrée « Apparence », valeur
     courante, chevron, sous-menu Jour, Nuit, Système à cocher ; en place sous l'entrée sur téléphone). `onChange` pour
     un toast, `label` et `labels` pour une interface bilingue (`labels={{ light: "Day", dark: "Night", auto: "System" }}`). Exemple
     complet : `platform/Platform.tsx`. Piège Next.js : dans le layout (composant serveur), écrire la clé du cookie en
     clair ; importée de `theme.tsx` (module `"use client"`), elle n'est côté serveur qu'une référence et le cookie
     n'est jamais lu (payé sur l'espace clients le 18/10).
  4. Toasts : le `Toaster` de shadcn lit `next-themes` ; sans lui, passer `theme={resolvedTheme}` (voir `src/App.tsx`).
- React, briques : `CityDots` lit le jeton `--city-mode` (ville de nuit éclairée, quel que soit `mode`) et les jetons
  `--city-1..3`, `--city-light-1..3` ; `DotField` lit `--dots`, `--dots-accent` ; `DotChart` lit `--foreground`,
  `--primary`, `--dotchart-dim` ; les colonnes tramées `--chart-bar-top/bottom` ; le bloc à points `--cta`
  (`bg-[var(--cta,var(--ink))]`, filet `dark:ring-1 dark:ring-border dark:ring-inset`) ; les ombres `shadow-soft` et
  `shadow-lift` passent par `--elevation-soft/lift`. Les canvas se redessinent seuls au changement de thème (sans
  rejouer l'apparition). Donner `paper="var(--card)"` à une ville posée sur une carte (par défaut : `--background`).
  Ne plus passer de `palette` en hexadécimal : elle figerait la trame de jour (elle ne vaut que pour le jour).
- Le thème du registre porte les jeux `light` et `dark` (posés par la CLI sous `:root` et `.dark`) ;
  `styles/olympe.css` porte les mêmes valeurs de nuit sous `data-theme`. Pour une page qui pose `data-theme` sans
  le fournisseur, faire suivre les utilitaires `dark:` en remplaçant `@custom-variant dark (&:is(.dark *));` par :
  ```css
  @custom-variant dark {
    &:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *) { @slot; }
    @media (prefers-color-scheme: dark) { &:where([data-theme="auto"], [data-theme="auto"] *) { @slot; } }
  }
  ```
- `art.js` accepte une couleur `var(--x)` ou `var(--x, repli)` : elle est lue sur le canvas au rendu.
- Un projet qui essaie la nuit sur une partie seulement de ses écrans pose `data-theme="dark"` sur ces vues et `"light"` sur toutes les autres, jamais un écran à moitié sombre (exemple : Command Center, `docs/DASHBOARD-UI.md` de `meridiem-operateur`).

**Jetons nuit** (sans framework `--m-*`, React sans préfixe ; jetons DTCG : groupe `color-dark`)
| Rôle | Jour | Nuit |
|---|---|---|
| Page `bg` / `background` | `#FBF9F5` | `#181513` |
| Menu de gauche `sidebar` | `#F3EFE8` | `#12100E` |
| Carte `card` | `#FFFFFF` | `#211D19` |
| Texte `fg` / `foreground` | `#1C1B1A` | `#EEE7DB` |
| Texte secondaire `muted-fg` | `#6B6764` | `#A9A095` |
| Fond discret `muted` | `#F2EDE5` | `#2B2621` |
| Survol `accent` | `#EFE9DF` | `#2E2823` |
| Filet `border` / champ `input` | `#E8E2D8` / `#E0D9CD` | `#36302A` / `#453D35` |
| Action `primary` / son texte | `#AA4F13` / `#FFFFFF` | `#D9773F` / `#1A1410` |
| Danger `destructive` / son texte | `#B3261E` / `#FFFFFF` | `#EE7D70` / `#1A1410` |
| Statuts ok, warn, wait, crit, info | `#2F7A4A` `#9A5D0C` `#55499F` `#B3261E` `#2B6099` | `#6CC08A` `#E3A55A` `#AFA2EE` `#F2867A` `#80B2E8` |
| Graphiques chart-1 à chart-5 | `#AA4F13` `#3F6FB0` `#C2861A` `#0E8C7C` `#8E4F8A` | `#D9773F` `#7489E2` `#C3841A` `#2AA88C` `#BE72CC` |
| Ville `city-mode`, masse `city-1` / `city-2` / `city-3`, lumières `city-light-1..3` | (non posé : trame de jour) `#6E4226` `#B98259` `#E8D6C0` | `nocturne` `#433A31` `#5C4F42` `#A08A70`, `#A8693A` `#DE9A4E` `#F2D49C` |
| Champ de points `dots` / `dots-accent` ; points éteints du graphique en points `dotchart-dim` | `#AA4F13` / `#E3CDB3` ; `#C9BFB0` | `#5C5045` / `#D9934A` ; `#5A5249` |
| Bloc à points `cta-bg` / `cta` | `#1C1B1A` | `#0E0C0A`, cerné d'un filet |
| Colonnes tramées `bar-top` / `bar-bottom` (React `chart-bar-*`) | `#C4672A` / `#8A3F0F` | `#E58B57` / `#A8521F` |
| Aires `area-fill` (React `chart-area-fill`) | 1 | 0,3 |
| Ombres `shadow` / `shadow-lift` (React `elevation-soft/lift`) | brun très léger | noir, plus dense |

**Règles**
- Toute couleur passe par une variable : une couleur écrite en dur dans un composant ne suit pas la nuit.
- Contraste mesuré : texte et texte secondaire ≥ 4,5:1 sur page, carte et fond discret ; chaque badge
  de statut ≥ 4,5:1 sur son propre fond (14 % de sa couleur sur la carte, 8 % en React) ; bouton
  principal ≥ 4,5:1. Palette des graphiques validée au script dataviz sur la carte nuit (bande de
  luminosité, chroma, daltonisme ΔE 9,2, vision normale, contraste ≥ 5:1).
- Le jour ne bouge pas : une évolution du mode nuit se vérifie par une capture de jour identique.
- Toute interface Olympe livre le choix Jour, Nuit, Système dans le menu du compte (sous-menu, Jour par défaut), et se
  prouve par des captures de jour ET de nuit.

## Typographie
- EB Garamond : titres d'écran (32 px), de section (24 à 30 px), de carte (18 px), chiffres clés (32 px).
- Geist : texte et interface (14 px), secondaire 12 px.
- Geist Mono : étiquettes en capitales espacées (`.eyebrow`, 11 px), références et heures.
- Chiffres en colonnes : `tabular-nums` (`.num`).

## Mise en page
- Plateforme : sidebar shadcn en variante `inset` (espace de travail, recherche ⌘K, navigation avec compteurs, liste « à valider », menu du compte en bas qui contient profil, réglages, aide, raccourcis, déconnexion).
- **Choix d'une préférence dans le menu du compte (apparence, langue ; règle de Maxime du 18/10/2026)** :
  UNE entrée du menu (icône, libellé, valeur courante à droite, chevron) qui ouvre un sous-menu avec les
  options cochables, plus une note courte si besoin. Jamais une liste dépliée au milieu du menu, jamais
  un bouton isolé à côté du nom. Le même choix peut vivre aussi dans Réglages et ⌘K.
  Sans framework : bloc `.m-menu-sub` (`.m-menu-subtrigger`, `.m-menu-value`, `.m-menu-chev`,
  `.m-submenu`, options `role="menuitemradio"` avec `data-value` et `.m-menu-check`, note `.m-menu-note`)
  dans un panneau de `MUI.menu` ; `MUI.menuValue(bloc, valeur)` coche et recopie la valeur. Il s'ouvre au
  survol et au clic, à droite de l'entrée, à gauche si la place manque, en place sous l'entrée sur
  téléphone ; flèche droite ouvre, flèche gauche referme, Échap et clic dehors ferment tout. Piège : le
  sous-menu est posé en absolu à côté de son panneau, donc un ancêtre en `overflow: hidden` ou `auto` (menu de
  gauche étroit, menu replié) le rogne ; laisser déborder pendant l'ouverture, par exemple
  `.m-sidebar:has(.m-menu.is-open) { overflow: visible; }` (relevé sur l'AI Center le 18/10 ; React n'est pas
  concerné, le menu de Radix passe par un portail). Fermé, il
  est en `display: none` (aucun calque de plus, le jour reste identique au pixel). React : `ThemeSubmenu` (élément
  `theme`) pour l'apparence ; pour une autre préférence (langue), le même assemblage : `DropdownMenuSub`,
  `DropdownMenuSubTrigger` (icône, libellé en `flex-1`, valeur en `text-muted-foreground`, le chevron est déjà posé),
  `DropdownMenuSubContent` et `DropdownMenuRadioGroup` de shadcn.
- En-tête de page : titre serif, une phrase, actions à droite. L'information essentielle tient au premier écran ; les bandeaux restent compacts.
- Liste et détail côte à côte ; le détail porte l'action principale et rappelle que rien ne part sans validation.
- Landing : héros sur la ville en points, grille de filets à repères en croix, bloc final sombre avec champ de points.

## Composants
shadcn/ui (Radix) pour tout ce qui existe : boutons, champs, sélecteurs, onglets, tables, fenêtres, panneaux, menus, toasts (sonner), palette (cmdk). Ne pas recoder ce que shadcn fournit. Briques propres à Meridiem : `KpiCard` (illustration animée), graphiques, `CityDots`, `DotField`, `DotChart`, `StatusBadge`, `Icon`, `Logo`, `Mark`, et l'apparence (`ThemeProvider`, `ThemeSubmenu`).

## Mouvement
- Transitions de page courtes (fondu, glissé de quelques pixels, léger flou), cascade d'entrée (`.stagger`), pastille de navigation qui glisse (Motion `layoutId`).
- Cartes animées : le mouvement se rejoue au survol, en ressort Motion ; l'illustration reste dans sa boîte.
- Tout s'arrête si l'utilisateur demande moins d'animations.

## À faire
- Un effet visible pour chaque clic : toast, fenêtre, panneau, état de chargement, puis confirmation.
- États vides utiles : un titre précis (« Aucun devis en attente de signature ») et l'action qui en sort.
- Textes courts et concrets, vouvoiement par défaut, données d'exemple crédibles.
- Vérifier le rendu à 390 px de large.

## À éviter
- Plusieurs boutons terracotta côte à côte, ou du terracotta décoratif.
- Une information portée par la couleur seule.
- Des images tierces ou des illustrations génériques d'IA ; des emojis dans l'interface.
- Des tirets longs dans les textes ; du gras au milieu d'une phrase.
- Du texte posé sur une illustration, ou une animation qui sort de sa carte.
