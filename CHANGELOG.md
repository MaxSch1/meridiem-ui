# Changelog

## 2026-10-18 · Mot des pastilles de statut lisible de jour
Relevé en passant l'AI Center au mode nuit : de jour, le mot des pastilles descendait à 3,48:1 (« Terminé » sur une carte teintée et sélectionnée), 4,14:1 sur le menu de gauche (sans framework). Le mot prenait la couleur pure du statut, pensée pour le point.
- Sans framework : `.m-badge` écrit son mot en `color-mix(statut --m-badge-ink, --m-fg)`, `--m-badge-ink: 72%` le jour et `100%` la nuit ; le point (`::before`) garde `var(--st)`.
- React : `--badge-ink` et les couleurs `ok-ink`, `warn-ink`, `wait-ink`, `crit-ink`, `info-ink` (thème du registre et `src/index.css`) ; `StatusBadge` écrit le mot en `text-*-ink` et pose le point en `bg-*`. Jetons DTCG : `status-*-text`.
- Contraste de jour du mot, pire cas (statut 8 % sur une carte teintée de 7 % de son statut, menu sélectionné) : 3,48:1 avant, 4,95:1 après ; sur la démo 4,14 devient 5,89 ; sur le kit 5,25 devient 7,46 (ok), 5,32 devient 7,55 (warn).
- Preuve (`docs/qa/pastilles-jour/`) : démo, plateforme, landing et kit à 1440 et 390 px, toiles masquées et animations figées : nuit identique au pixel partout, jour différent seulement à l'intérieur des pastilles ; console sans erreur.

## 2026-10-18 · Sous-menu rogné par un conteneur en `overflow: hidden`
- `DESIGN.md` § Mise en page : le sous-menu sans framework est posé en absolu à côté de son panneau ; un menu de gauche en `overflow: hidden` (étroit ou replié) le coupe. Parade documentée : `.m-sidebar:has(.m-menu.is-open) { overflow: visible; }`. Relevé en passant l'AI Center au sous-menu « Apparence ».

## 2026-10-18 · `ThemeSubmenu` traduisible
- `labels` (Jour, Nuit, Système) à côté de `label` : le sous-menu d'apparence suit la langue d'une interface bilingue. Repris de la première application Next.js passée au mode nuit, qui l'a ajouté pour son anglais.
- `DESIGN.md` : le piège de la clé du cookie importée d'un module client dans un layout serveur (le cookie n'est alors jamais lu).

## 2026-10-18 · Sortie du mode nuit d'Olympe (sans framework et React)
Le mode nuit validé par Maxime le 18/10 (essai réel sur le Command Center : « très beau » pour la ville éclairée, « le sous-menu est parfait ») est complet dans les deux versions de la librairie. Ce qui part avec cette sortie, depuis `56949ba` :

| Sujet | Sans framework | React (registre) |
|---|---|---|
| Activation | `data-theme="dark"`, `"auto"` (système), rien = jour ; `MUI.setTheme`, `MUI.theme`, `MUI.retheme` | `.dark` ou `data-theme` ; nouvel élément **`theme`** : `ThemeProvider`, `useTheme`, `ThemeScript` / `themeScript()` (aucun flash), cookie `olympe-theme` pour Next.js |
| Choix d'apparence | entrée « Apparence » du menu du compte qui ouvre un sous-menu Jour, Nuit, Système (`.m-menu-sub`, `MUI.menuValue`) | `ThemeSubmenu` (sous-menu shadcn, en place sous l'entrée sur téléphone), posé dans le menu du compte du gabarit `platform` et du kit |
| Jetons nuit | encre chaude, cartes `#211D19`, texte ivoire, terracotta `#D9773F` à texte encre, statuts et graphiques éclaircis | mêmes valeurs sous `.dark` et `data-theme`, plus les jetons des visuels : `--city-mode`, `--city-1..3`, `--city-light-1..3`, `--dots`, `--dots-accent`, `--dotchart-dim`, `--chart-bar-top/bottom`, `--cta`, `--elevation-soft/lift` (valeurs de jour égales aux anciennes couleurs en dur) |
| Ville | ville de nuit éclairée (mode `nocturne` d'`art.js`) | `CityDots` lit `--city-mode` et les jetons, se redessine au changement de thème sans rejouer l'apparition |
| Points | champ de points pierre et ambre ; toiles recalées sur leur bloc (points ronds, `b245a4f`) | `DotField`, `DotChart` lisent les jetons et se redessinent |
| Aires | dégradé allégé (`--m-area-fill` 0,3) | `--chart-area-fill` 0,3 |
| Logo | `m-mark-ink`, logotype blanc | `Logo` (noir le jour, blanc la nuit, sans script), `Mark` (icône jamais écrasée, blanche la nuit) |
| Divers | voiles, ombres noires, bloc à points `#0E0C0A` cerné d'un filet | idem (ombres `shadow-soft`/`shadow-lift` par `--elevation-*`, bloc `--cta`), avatar et pastille « En cours » de nuit, toasts au thème de la page |

- React, ce lot : `brand.tsx` (hook `useThemeSignature`, `CityDots` avec `nightPalette` et `mode="nocturne"`, `Logo`, `Mark`), `theme.tsx` (nouveau), `charts.tsx` (colonnes), gabarits `Dashboard`, `Platform`, `landing`, kit (`Kit.tsx`, `layouts.tsx`), `App.tsx` (fournisseur, toasts), `index.html` (script anti-flash), `src/index.css`, `registry/olympe.css`, `registry.json` (thème et élément `theme`, dont `platform` dépend), jetons DTCG (`color-dark` complet : ville, points, bloc, colonnes, aires).
- Changement d'API à connaître : `CityDots` sans `palette` prend la trame des jetons `--city-1..3` (avant : `OLYMPE_INK`), et `palette` ne vaut plus que pour le jour. Les gabarits passaient tous une palette, leur rendu de jour ne change pas.
- Le jour ne bouge pas : 0 style calculé différent sur `#platform` et `#landing` (1440 et 390 px), 4 sur `#kit` (3 squelettes animés, et le bouton du compte devenu déclencheur de menu, sans écart de style) ; pixels identiques sur la plateforme ; les seules zones de pixels qui bougent (champ de points, squelettes) bougent aussi entre deux captures du build d'avant. Preuves : `docs/qa/mode-nuit/react/`.
- Défaut trouvé et corrigé pendant la vérification : à 390 px le sous-menu sortait de l'écran (coche coupée) ; il s'ouvre maintenant en place sous l'entrée, comme `MUI.menu`.
- Vérifié par la CLI shadcn dans un projet vide : `add olympe-theme` pose tous les jetons ; les auto-références qu'elle ajoute dans `@theme inline` (`--city-mode`, `--elevation-*`) restent dans `@layer theme` et sont écrasées par `:root` et `.dark` ; `add theme` installe `theme.tsx`, `brand`, `dropdown-menu`.
- Reste ouvert : la landing affiche « FR · EN » en texte simple dans l'en-tête d'un site (pas de menu du compte) ; un vrai choix de langue suivra la règle du sous-menu.

## 2026-10-18 · Points ronds dans les blocs qui grandissent
- Une toile animée (champ de points, graphique en points) prenait sa taille au premier rendu : si son bloc grandissait ensuite, les points s'étiraient en ovales (bloc final du Command Center, de jour comme de nuit). `art.js` : la boucle d'animation recale la toile sur la taille de son bloc à chaque image (et par `ResizeObserver` quand les animations sont réduites).

## 2026-10-18 · Mode nuit : ville de nuit éclairée, points apaisés, sous-menu de préférence
Retours de Maxime sur le premier essai réel (Command Center) : « l'affichage avec les petits points est très laid sur la version nuit », et le choix d'apparence doit passer par un bouton du menu du compte qui ouvre un sous-menu. Rendu de jour inchangé : démo 1440 et 390 px, 0 pixel différent (`demo-jour-avant/apres-retours-*.png`).
- **Ville de nuit** (`art.js`, source `src/lib/meridiem/art.js`) : nouveau mode `nocturne` de `ditherImage`. Les zones lisses de la photo (ciel, brume, eau, mesurées par l'écart-type local) restent la carte ; la ville est une masse de points sourds qui suit la photo en positif ; un point plus clair que son voisinage devient une lumière chaude (3 tons), qui s'allume en fin d'apparition. `MUI.city` lit le jeton `--m-city-mode` (posé à `nocturne` la nuit seulement) ; nouveaux jetons nuit `--m-city-light-1..3`, masse `--m-city-1/2` = `#433A31`, `#5C4F42`. Le chemin de jour n'a pas changé d'une ligne. Trois partis essayés dans le bandeau réel du Command Center (gravure claire, ville éclairée, riso deux encres) : `docs/qa/mode-nuit/ville-nuit-essais.png`. Retenu : la ville éclairée (seule à rester calme sur l'encre, la gravure faisait un bloc beige, le riso un champ terracotta).
- **Champ de points de nuit** : terracotta saturé sur l'encre remplacé par pierre et ambre (`--m-dots` `#5C5045`, `--m-dots-accent` `#D9934A`), accordé aux lumières de la ville.
- **Sous-menu** (`MUI.menu`, `olympe.css`) : bloc `.m-menu-sub` dans un panneau de menu, ouvert au survol et au clic, à droite de l'entrée (à gauche ou en place sur téléphone), clavier (flèche droite, flèche gauche, haut et bas), Échap et clic dehors. `MUI.menuValue(bloc, valeur)` coche et recopie la valeur dans l'entrée. Fermé, le sous-menu est en `display: none` : un premier essai en opacité nulle ajoutait un calque composité qui décalait de ±1 l'anticrénelage du menu de gauche, de jour. Démo : entrée « Apparence » dans le menu du compte. Règle écrite dans `DESIGN.md` § Mise en page.
- Constat non corrigé (changerait le jour) : `MUI.ctaBand` et la carte sombre dimensionnent leur toile au premier rendu ; si le bloc grandit ensuite (texte rempli après coup), les points sont étirés en ovales jusqu'au prochain redessin. Correctif proposé : redimensionner dans la boucle de `dots()` quand `clientWidth/clientHeight` change.

## 2026-10-18 · Mode nuit : aires plus légères, ville plus sourde
Relevés sur la démo de nuit et confirmés sur le Command Center de nuit (premier projet réel à passer la nuit, tableau de bord et menu). Rendu de jour inchangé : démo sans framework 1440 et 390 px, 0 pixel différent ; opacités de jour relues identiques (sans framework 0,26 et 0,02, React 0,22, 0,02, 0,28, 0,03).
- **Graphique en aires** (`MUI.area`, `RequestsAreaChart`) : de nuit, le dégradé à 26 % formait un bloc brun qui écrasait la lecture, surtout où deux séries se superposent. L'opacité passe par un facteur : `--m-area-fill` (sans framework) et `--chart-area-fill` (React, thème du registre), 1 le jour, 0,3 la nuit. Le dégradé de nuit va donc de 7,8 % à 0,6 % ; les courbes portent la lecture. Essai à 0,45 jugé trop timide.
- **Ville en points de nuit** : la teinte sable claire (`#C9AD8A`) faisait de la droite du bandeau la zone la plus lumineuse de la page. `--m-city-1/2/3` passent à `#3F2D1E`, `#7E5537`, `#A08A70` (variante la plus calme des trois essayées sur le bandeau réel qui garde la ville lisible).
- Preuves : `docs/qa/mode-nuit/demo-aire-nuit-avant.png` / `-apres.png`, `demo-ville-nuit-avant.png` / `-apres.png`, `demo-jour-avant-18-10-1440.png` / `demo-jour-apres-18-10-1440.png`, `demo-nuit-1440-18-10.png`.

## 2026-10-18 · Icônes épingle, favori retiré et suivi retiré
- Quatre icônes Hugeicons ajoutées au kit et à `vanilla/icons.js` (121 icônes) : `Pin` (épingler), `PinOff` (détacher), `StarOff` (retirer des favoris), `FlagOff` (retirer du suivi). Besoin : épingles et favoris des conversations dans Meridiem AI Center (`DEV/meridiem-vigie`).

## 2026-10-18 · Retours d'une app Next.js 16 interne
Quatre défauts du registre trouvés en montant une app interne (Next.js 16.4) et corrigés là-bas sur place la nuit du 18/10 ; reportés à la source pour que les projets suivants n'aient pas à les refaire.
- **`brand`** : erreur d'hydratation React des cartes animées (`KpiCard`). Le dernier chiffre de cos et sin différait entre le rendu serveur et le navigateur, donc les attributs SVG aussi. Coordonnées isométriques et polaires arrondies à 0,01 (`r2` dans `P` et `polar`), rendu identique à l'œil.
- **`use-mobile`** : le hook de la sidebar shadcn faisait échouer `npm run lint` de Next 16 (règle `react-hooks/set-state-in-effect` d'eslint-config-next 16). Réécrit avec `useSyncExternalStore`, même résultat (faux au rendu serveur, puis la vraie largeur). Livré par l'élément `platform`, qui remplace à l'installation celui de la sidebar : la CLI installe les dépendances d'abord et garde le dernier fichier écrit à un même chemin.
- **`spinner`** (nouvel élément du registre) : le spinner shadcn, converti à Hugeicons par la CLI, étalait les props SVG sur `HugeiconsIcon` et ne compilait pas. Version adaptée (celle de l'espace clients) : aucune prop étalée, `aria-hidden` car il accompagne toujours un libellé qui change (« Envoi… »). `platform` en dépend à la place du spinner shadcn. Le kit utilise le même fichier ; il n'annonce plus « Chargement » en plus du libellé.
- **`clients-table`, `data-table`** : `@tanstack/react-table@^8.21.3` épinglé. Sans version, la CLI installait la dernière, v9 (9.3.1 au 18/10), dont l'API est incompatible.
- Preuve : projet Next 16.4 neuf (`shadcn@4.22.0 init -t next -b radix -p nova`, icônes Hugeicons), puis `add` de `olympe-theme`, `olympe-styles`, `platform`, `data-table` et `landing` depuis le registre régénéré : spinner et `use-mobile` corrigés posés, TanStack 8.21.3 installé, `tsc --noEmit` sans erreur, plus aucune erreur de lint sur `use-mobile`, `spinner`, `brand`, `charts`, `kpi-card`, `data-table`, `clients-table`.
- Reste ouvert : le lint de Next 16 refuse encore les apostrophes droites du texte JSX des gabarits `platform` (14) et `landing` (5) (`react/no-unescaped-entities`). L'app exclut le code copié du registre de son lint en attendant.

## 2026-10-18 · Mode nuit
- Mode nuit complet, rendu de jour inchangé (0 style calculé et 0 pixel différent sur la démo sans framework et la plateforme React, preuves dans `docs/qa/mode-nuit/`). Activation : `<html data-theme="dark">`, `data-theme="auto"` (suit le système) ou la classe `.dark` de shadcn ; sans attribut, la page reste de jour même si le système est en sombre.
- Sans framework : jeu `--m-*` nuit dans `olympe.css` (encre chaude `#181513`, cartes `#211D19`, texte ivoire, terracotta `#D9773F` avec texte encre, statuts et graphiques éclaircis). Couleurs en dur remplacées par des variables aux valeurs de jour identiques (texte du menu, texte du bouton danger, fonds des badges, trait blanc des illustrations, bloc à points, avatar, voiles, bouton occupé). Classe `m-mark-ink` pour l'icône noire officielle. `MUI.setTheme`, `MUI.theme`, `MUI.retheme` ; les canvas (ville, points, graphique en points) se redessinent seuls au changement de thème ; `MUI.CHART` contient désormais des `var(--m-chart-N, #jour)` (`MUI.CHART_HEX` pour les hexadécimaux). Démo : sélecteur Jour, Nuit, Système en tête de page.
- `art.js` (source `src/lib/meridiem/art.js`) : accepte des couleurs `var(--x)` lues sur le canvas au rendu (nouvelle fonction exportée `color`) ; `scripts/build-vanilla.mjs` exporte `color`.
- React : jeu nuit dans `src/index.css` et `registry/olympe.css` (installé en `src/styles/olympe.css`) sous `.dark` et `data-theme`, variante `dark:` étendue à `data-theme` dans la démo, jeu `dark` du thème du registre (`registry.json`, `public/r/`). Jetons DTCG : groupes `color-dark` et `shadow-dark`, plus `primary-foreground`, `sidebar-foreground`, `destructive-foreground` au jeu de jour. `DESIGN.md` : section « Mode nuit ».
- Palette nuit des graphiques choisie au script dataviz (tous les contrôles PASS sur la carte nuit, daltonisme ΔE 9,2) ; premiers essais refusés par le script (trop clairs pour la bande, bleu trop gris, prune et sarcelle confondus en deutan ΔE 3,8).
- Reste à faire (hors lot) : couleurs en dur des briques React (`brand.tsx`, `charts.tsx`, `Dashboard.tsx`, `landing.tsx`, kit) ; de nuit, la ville du tableau de bord React garde un ciel blanc.

## 2026-10-16 · Icône carrée et favicons
- Retour de Maxime : l'icône Meridiem posée en favicon ou dans une case carrée sortait écrasée. Ajout de `meridiem-icone-hd.png` (440 × 246, extraite du logotype officiel), `meridiem-icone-carre.png` et sa version blanche, et du jeu `public/assets/favicon/` (ico 16/32/48, png 16/32/48, apple-touch-icon et 512 sur fond ivoire), tous à ratio conservé. `assets.markSquare`, `assets.markSquareLight`. Favicons câblés dans le kit et la démo sans framework. Règle dans `DESIGN.md` § Marque.

## Non publié · 2026-10-06
- **Logotypes officiels** (Maxime, 06/10) : `meridiem-logo-noir.png` remplacé, `meridiem-logo-blanc.png` ajouté pour les fonds sombres (`assets.logoLight`).
- **Plus de Waremme en avant** : pied du gabarit `landing` signé « meridiem.be · Your AI partner » (adresse retirée), clients fictifs des démos déplacés à Ciney ; règle ajoutée dans `DESIGN.md` (§ Marque).
Retours de la première intégration dans une app Next.js 16 (espace clients `meridiem-portail`, branche `design-olympe`).
- **`data-table`** (nouvel élément du registre) : table de données générique (TanStack + shadcn) ; colonnes, données et libellés fournis par l'app ; recherche (sur un texte choisi par ligne), tri avec flèche de sens, pagination, ligne cliquable, état vide avec « Effacer la recherche », colonnes masquables sur téléphone (`meta.className`). `ClientsTable` reste la démonstration figée ; démonstration générique ajoutée au kit (Tables).
- **`StatusBadge`** : statut `neutral` (clos, refusé, annulé, terminé), démontré dans le kit.
- **Next.js / RSC** : `"use client"` en tête des composants à hooks (`brand`, `kpi-card`, `charts`, `clients-table`, `landing`, gabarit `platform`). La CLI shadcn le retire pour un projet `rsc: false` (Vite), le garde pour Next.
- **Correctif SSR** : `art.js` lisait `window` au chargement du module ; dans Next, tout écran qui importait une brique de marque répondait 500 (`window is not defined`), build pourtant vert. Garde `typeof window`.
- **Correctif palette ⌘K du gabarit `platform`** : le contenu de `CommandDialog` n'était pas enveloppé dans `<Command>` ; cmdk plante à l'ouverture (`Cannot read properties of undefined (reading 'subscribe')`). Enveloppé.

## Non publié · 2026-10-04
- Sans framework : `MUI.actionBar` (barre d'actions unique : décision à gauche avec une phrase et un seul bouton terracotta, suivi à droite, « ⋯ » en `MUI.menu`, état fait, zone de saisie, deux lignes sous 520 px) et `MUI.busy` (bouton occupé).
- Icônes : `Agreement02` (poignée de main lisible à 16 px, retenue pour le CRM du Command Center ; `Agreement01` y devenait un gribouillis), 117 icônes.
- Sans framework : `MUI.palette` générique (sources de contenu asynchrones avec chargement et cache, groupes, classement, surbrillance des termes, état vide avec suggestion) ; `MUI.dialog` (fenêtre centrée façon shadcn Dialog) ; interrupteur `.m-switch`, lignes de réglage `.m-section` / `.m-setting`, indicateur `.m-spin`.
- Sans framework : `MUI.palette` (palette de commandes ⌘K : filtre sans accents, flèches, Entrée, Échap) et `MUI.kpis` (rangée de cartes indicateur mise à jour en place, sans rejouer les animations, pour les pages qui se rafraîchissent seules). Classes `.m-pal-*`. Démo : la recherche de `vanilla/demo.html` ouvre la palette.

## 0.1.0 · 2026-10-04
- Première version publique du design system Olympe : thème shadcn/ui, briques de marque (ville en points, champ de points, graphique en points, 9 cartes animées, badge de statut, icônes Hugeicons), graphiques, table de données, gabarits de plateforme et de landing, kit de référence.
- Registre shadcn (`public/r/`), version sans framework (`vanilla/`), jetons DTCG (`tokens/`).
