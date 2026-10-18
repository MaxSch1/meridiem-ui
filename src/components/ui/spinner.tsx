import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

/* Spinner shadcn adapté à Hugeicons : la version d'origine étale les props SVG sur l'icône et ne
   compile pas avec HugeiconsIcon. Masqué aux lecteurs d'écran : il accompagne toujours un libellé
   qui change (« Envoi… »), c'est ce libellé qui annonce l'état, dans la langue de la page. */
function Spinner({ className }: { className?: string }) {
  return (
    <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} data-slot="spinner" aria-hidden className={cn("size-4 animate-spin", className)} />
  )
}

export { Spinner }
