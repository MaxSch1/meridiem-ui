import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { setMeridiemAssets } from "@/components/meridiem/assets"
import logo from "@/assets/meridiem-logo-noir.png"
import logoLight from "@/assets/meridiem-logo-blanc.png"
import mark from "@/assets/meridiem-icone.png"
import city from "@/assets/ville-europe.jpg"

// La démo embarque ses fichiers (page autonome) au lieu des URL publiques
setMeridiemAssets({ logo, logoLight, mark, city })

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
