/* Fichiers de marque. Par défaut : les versions publiques du dépôt (CORS ouvert, utilisables dans un canvas).
   Une app peut les remplacer par ses fichiers locaux au démarrage avec setMeridiemAssets(). */
const BASE = "https://raw.githubusercontent.com/MaxSch1/meridiem-ui/main/public/assets/"

export const assets = {
  logo: BASE + "meridiem-logo-noir.png",       // logotype officiel, fond clair
  logoLight: BASE + "meridiem-logo-blanc.png", // logotype officiel, fond sombre
  mark: BASE + "meridiem-icone.png",            // icône seule, ratio 1,79 : jamais dans un carré à taille imposée
  markSquare: BASE + "meridiem-icone-carre.png", // icône déjà carrée (favicon, avatar, tuile)
  markSquareLight: BASE + "meridiem-icone-carre-blanc.png",
  city: BASE + "ville-europe.jpg",
}

export function setMeridiemAssets(next: Partial<typeof assets>) {
  Object.assign(assets, next)
}
