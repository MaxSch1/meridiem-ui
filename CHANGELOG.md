# Changelog

## 2026-10-18 · Retours d'une app Next.js 16 (Assiette)
Quatre défauts du registre trouvés en montant `DEV/meridiem-assiette` (Next.js 16.4) et corrigés là-bas sur place la nuit du 18/10 ; reportés à la source pour que les projets suivants n'aient pas à les refaire.
- **`brand`** : erreur d'hydratation React des cartes animées (`KpiCard`). Le dernier chiffre de cos et sin différait entre le rendu serveur et le navigateur, donc les attributs SVG aussi. Coordonnées isométriques et polaires arrondies à 0,01 (`r2` dans `P` et `polar`), rendu identique à l'œil.
- **`use-mobile`** : le hook de la sidebar shadcn faisait échouer `npm run lint` de Next 16 (règle `react-hooks/set-state-in-effect` d'eslint-config-next 16). Réécrit avec `useSyncExternalStore`, même résultat (faux au rendu serveur, puis la vraie largeur). Livré par l'élément `platform`, qui remplace à l'installation celui de la sidebar : la CLI installe les dépendances d'abord et garde le dernier fichier écrit à un même chemin.
- **`spinner`** (nouvel élément du registre) : le spinner shadcn, converti à Hugeicons par la CLI, étalait les props SVG sur `HugeiconsIcon` et ne compilait pas. Version adaptée (celle de l'espace clients) : aucune prop étalée, `aria-hidden` car il accompagne toujours un libellé qui change (« Envoi… »). `platform` en dépend à la place du spinner shadcn. Le kit utilise le même fichier ; il n'annonce plus « Chargement » en plus du libellé.
- **`clients-table`, `data-table`** : `@tanstack/react-table@^8.21.3` épinglé. Sans version, la CLI installait la dernière, v9 (9.3.1 au 18/10), dont l'API est incompatible.
- Preuve : projet Next 16.4 neuf (`shadcn@4.22.0 init -t next -b radix -p nova`, icônes Hugeicons), puis `add` de `olympe-theme`, `olympe-styles`, `platform`, `data-table` et `landing` depuis le registre régénéré : spinner et `use-mobile` corrigés posés, TanStack 8.21.3 installé, `tsc --noEmit` sans erreur, plus aucune erreur de lint sur `use-mobile`, `spinner`, `brand`, `charts`, `kpi-card`, `data-table`, `clients-table`.
- Reste ouvert : le lint de Next 16 refuse encore les apostrophes droites du texte JSX des gabarits `platform` (14) et `landing` (5) (`react/no-unescaped-entities`). Assiette exclut le code copié du registre de son lint en attendant.

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
