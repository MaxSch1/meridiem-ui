# Mode nuit Olympe : preuves (18/10/2026)

Captures prises avec Playwright (Chromium, échelle 1, animations réduites pour des images stables),
dépôt servi en local (`python3 -m http.server`), démo `vanilla/demo.html` et build `dist/index.html`.

## Le jour est inchangé
Méthode : capture de référence AVANT toute modification, puis la même page (démo d'origine, tirée de
`HEAD`) servie avec les nouveaux `olympe.css`, `meridiem.js` et `art.js`. Comparaison des styles
calculés de chaque élément (couleurs, fonds, bordures, ombres, fill, stroke, opacité, polices, pseudo-
éléments, empreinte de chaque canvas) et des pixels.

| Page | Éléments comparés | Styles différents | Pixels différents |
|---|---|---|---|
| Démo sans framework, 1440 px | 475 | 0 | 0 |
| Démo sans framework, 390 px | 472 | 0 | 0 |
| Démo, système en sombre, sans `data-theme` | 475 | 0 | 0 |
| Plateforme React (`#platform`), 1440 px | 658 | 0 | 0 |
| Kit React (`#kit`), 1440 px | 3 021 | 4 | une zone de canvas |

Kit : les 4 écarts (3 squelettes `animate-pulse`, 1 canvas animé) changent aussi entre deux captures
successives du même build ; ce sont des animations, pas le thème.
Fichiers : `demo-jour-avant-*.png` et `demo-jour-apres-*.png`, `kit-jour-avant/apres-1440.png`,
`plateforme-jour-avant/apres-1440.png`. Sans attribut `data-theme`, la page reste de jour même si le
système est en sombre : le Command Center et les autres pages existantes ne bougent pas.

## Contrastes mesurés (WCAG)
Statut : couleur du mot sur le fond du badge (14 % de la couleur sur la carte en sans framework).

| Paire | Jour | Nuit |
|---|---|---|
| Texte principal / page | 16.36 | 14.79 |
| Texte principal / carte | 17.20 | 13.62 |
| Texte secondaire / page | 5.33 | 7.05 |
| Texte secondaire / carte | 5.60 | 6.50 |
| Texte secondaire / fond discret | 4.81 | 5.81 |
| Menu / barre latérale | 9.87 | 12.17 |
| Bouton principal : texte / bouton | 5.47 | 5.78 |
| Bouton principal / carte | 5.47 | 5.31 |
| Danger en texte / carte | 6.54 | 6.22 |
| Bouton danger : texte / bouton | 6.54 | 6.78 |
| Badge Traitée (ok) / son fond | 4.71 | 5.85 |
| Badge À valider (wait) / son fond | 6.53 | 5.66 |
| Badge Bloquée (warn) / son fond | 4.78 | 5.98 |
| Badge Urgent (crit) / son fond | 5.75 | 5.31 |
| Badge En cours (info) / son fond | 5.77 | 5.81 |
| Badges sur la barre latérale (pire cas) | 4.15 | 6.20 |
| Séries chart-1 à chart-5 / carte | 3.13 à 5.78 | 5.12 à 5.64 |

Palette des graphiques nuit `#D9773F, #7489E2, #C3841A, #2AA88C, #BE72CC`, script dataviz
`validate_palette.js --mode dark --surface "#211D19"` : bande de luminosité, chroma, daltonisme
(pire voisin ΔE 9,2, deutan), vision normale (ΔE 19,1), contraste : tous PASS. (Palette de jour pour
mémoire : daltonisme ΔE 6,6, en WARN.)

## Parcours déroulé (démo, système en sombre)
| Geste | Ce qui s'affiche |
|---|---|
| Chargement, aucun choix | jour (`data-theme` absent), « Jour » sélectionné |
| Clic « Nuit » | page en encre, toast « Mode nuit · Thème actif : nuit », ville redessinée en sable (`clic-nuit-toast.png`) |
| Clic « Jour » | retour au jour, toast « Mode jour », ville redessinée en jour |
| Clic « Système » | nuit (système sombre), toast « Thème du système · Thème actif : nuit » |
| Système passe en clair, puis en sombre | la page suit sans clic, canvas redessinés |
| Rechargement | le choix « Système » est gardé (stockage du navigateur, démo) |
| ⌘K puis « rel » | palette de nuit, résultat surligné, badge « à valider » (`nuit-palette.png`) |
| Menu du compte | menu de nuit, « Se déconnecter » en rouge clair (`nuit-menu-compte.png`) |
| Réglages | fenêtre de nuit, voile plus sombre, interrupteur (`nuit-fenetre-reglages.png`) |
| Survol des graphiques | infobulles de nuit (`nuit-infobulle-colonnes.png`, `nuit-infobulle-aire.png`) |

Console : aucune erreur ni avertissement de la page sur toutes les captures. Seul avertissement vu pendant
le parcours : « willReadFrequently », provoqué par les lectures de pixels du script de test lui-même.

## Ce qui reste hors de ce lot (React)
Les briques React posent encore quelques couleurs en dur, hors des fichiers de ce lot : la ville du
tableau de bord et de la landing (`paper="#FFFFFF"` ou `#FBF9F5` et palette de jour dans
`platform/Dashboard.tsx`, `landing.tsx`, `kit/layouts.tsx`), les valeurs par défaut de `CityDots`,
`DotField`, `DotChart` (`brand.tsx`), le dégradé des colonnes (`charts.tsx`), le logo noir du menu et
du kit, et les nuanciers du kit (`kit/foundations.tsx`, qui documentent le jour). De nuit, la ville
du tableau de bord React garde donc un ciel blanc (`plateforme-nuit-1440.png`). Correctif simple
maintenant qu'`art.js` lit les variables : passer `paper="var(--card)"` et une palette en variables.

## Améliorations du 18/10 (après le premier essai réel, Command Center)
| Défaut | Correction | Preuve |
|---|---|---|
| Aires de nuit en bloc brun | facteur `--m-area-fill` / `--chart-area-fill` : 1 le jour, 0,3 la nuit | `demo-aire-nuit-avant.png`, `demo-aire-nuit-apres.png` |
| Ville de nuit trop lumineuse à droite | `--m-city-1/2/3` : `#3F2D1E`, `#7E5537`, `#A08A70` | `demo-ville-nuit-avant.png`, `demo-ville-nuit-apres.png` |
| Jour | démo 1440 et 390 px : 0 pixel différent | `demo-jour-avant-18-10-1440.png`, `demo-jour-apres-18-10-1440.png` |

## Retours de Maxime du 18/10 (soir) : ville de nuit éclairée, points, sous-menu
| Sujet | Preuve |
|---|---|
| Trois partis de ville essayés dans le bandeau réel du Command Center, retenu : ville éclairée | `ville-nuit-essais.png` (captures détaillées dans `meridiem-operateur/docs/qa/mode-nuit/retours-1/`) |
| Démo de nuit | `demo-nuit-retours-1440.png`, `demo-nuit-retours-390.png` |
| Jour inchangé : démo 1440 et 390 px, 0 pixel différent (polices chargées, curseur masqué) | `demo-jour-avant-retours-1440.png` / `demo-jour-apres-retours-1440.png`, idem `-390` |
| Sous-menu Apparence : menu, survol (jour), choix Nuit et toast, survol (nuit) | `sous-menu-1-menu-jour.png` à `sous-menu-4-survol-nuit.png` |

Parcours (`qa-retours-1.js`) : survol ouvre ; clic sur « Nuit » pose `data-theme="dark"`, ferme le menu, toast ; la valeur affichée passe à « Nuit », coche sur Nuit ; clic dehors ferme tout ; flèche droite ouvre et met le focus sur l'option cochée, flèche bas passe à la suivante, flèche gauche referme et rend le focus à l'entrée ; Échap ferme tout ; Entrée ouvre puis choisit. Console : aucune erreur ni avertissement.
Piège mesuré : un sous-menu fermé en `opacity: 0` (calque composité) décalait de ±1 l'anticrénelage de 20 pixels du menu de gauche ; en `display: none`, 0 pixel.

## Kit React à parité (18/10, sortie du mode nuit) : `react/`
Builds d'avant (HEAD `b245a4f`) et d'après servis en local, Playwright, échelle 1, animations réduites. Scripts : `react/qa-react.cjs` (captures et parcours), `react/qa-styles.cjs` (styles calculés de chaque élément visible).

| Contrôle | Résultat |
|---|---|
| Styles calculés, jour, avant / après | `#platform` 638 et 526 éléments : 0 écart ; `#landing` 174 et 172 : 0 ; `#kit` 3 022 et 2 989 : 4 (3 squelettes animés, 1 bouton devenu déclencheur de menu, aucun écart de style) |
| Pixels, jour | plateforme 1440 et 390 : 0 ; landing et kit : seules les zones animées (champ de points, squelettes), qui diffèrent aussi entre deux captures du build d'avant |
| Nuit | `data-theme="dark"`, `.dark`, page `#181513` sur les trois écrans ; « Système » avec un système sombre : nuit |
| Sous-menu | options Jour, Nuit, Système ; clic sur Nuit : thème posé, gardé (stockage et cookie), toast « Mode nuit · Thème actif : nuit », ville redessinée, valeur « Nuit » dans l'entrée ; flèche droite ouvre et va sur Jour, flèche gauche referme et rend le focus à l'entrée, Échap ferme ; rechargement : nuit gardée ; téléphone : options en place sous l'entrée |
| Logo et icône de nuit | logotype blanc ; icône 1,82 rendue 1,82 (jamais écrasée), inversée en blanc |
| Console | aucune erreur ni avertissement de la page ; seul avertissement : « willReadFrequently », dû aux lectures de pixels du script de test |

Captures : `platform-jour-avant/apres-1440|390.png`, `landing-jour-*`, `kit-jour-avant/apres-1440.png`, `*-nuit-1440|390.png`, `platform-systeme-sombre-1440.png`, `sous-menu-apparence-jour.png`, `sous-menu-apparence-nuit.png`, `sous-menu-apparence-nuit-390.png`, `clic-nuit-toast.png`, `kit-sous-menu-apparence-nuit.png`, `kit-visuels-nuit.png`, `kit-sections-nuit.png`. Le constat « Ce qui reste hors de ce lot (React) » ci-dessus est soldé.
