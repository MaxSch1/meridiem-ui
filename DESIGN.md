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

## Typographie
- EB Garamond : titres d'écran (32 px), de section (24 à 30 px), de carte (18 px), chiffres clés (32 px).
- Geist : texte et interface (14 px), secondaire 12 px.
- Geist Mono : étiquettes en capitales espacées (`.eyebrow`, 11 px), références et heures.
- Chiffres en colonnes : `tabular-nums` (`.num`).

## Mise en page
- Plateforme : sidebar shadcn en variante `inset` (espace de travail, recherche ⌘K, navigation avec compteurs, liste « à valider », menu du compte en bas qui contient profil, réglages, aide, raccourcis, déconnexion).
- En-tête de page : titre serif, une phrase, actions à droite. L'information essentielle tient au premier écran ; les bandeaux restent compacts.
- Liste et détail côte à côte ; le détail porte l'action principale et rappelle que rien ne part sans validation.
- Landing : héros sur la ville en points, grille de filets à repères en croix, bloc final sombre avec champ de points.

## Composants
shadcn/ui (Radix) pour tout ce qui existe : boutons, champs, sélecteurs, onglets, tables, fenêtres, panneaux, menus, toasts (sonner), palette (cmdk). Ne pas recoder ce que shadcn fournit. Briques propres à Meridiem : `KpiCard` (illustration animée), graphiques, `CityDots`, `DotField`, `DotChart`, `StatusBadge`, `Icon`.

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
