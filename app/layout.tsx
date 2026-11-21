import type { Metadata } from "next";
import "./globals.css";
import Recherche, { ScriptRecherche } from "@/components/Recherche";

export const metadata: Metadata = {
  title: { default: "au comptoir", template: "%s · au comptoir" },
  description:
    "Fiches conseil et médicaments pour le comptoir de l'officine : questions à poser, signaux d'alerte, posologies et sources officielles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap"
        />
      </head>
      <body>
        <header className="entete">
          <div className="conteneur">
            <a href="/" className="logo" aria-label="au comptoir, accueil">
              <span className="croix" aria-hidden="true" />
              au comptoir
            </a>
            <Recherche variante="entete" />
            <nav className="nav" aria-label="Navigation principale">
              <a href="/conseils/">Conseils</a>
              <a href="/medicaments/">Médicaments</a>
              <a href="/admin/">Espace pharmaciens</a>
              <a href="/proposer/" className="cta">Proposer une fiche</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="pied">
          <div className="conteneur colonnes">
            <div>
              <strong>au comptoir</strong>
              <p>
                Aide-mémoire pour l&apos;équipe officinale, construit à partir de sources officielles françaises (HAS, ANSM,
                BDPM, Assurance Maladie, sociétés savantes).
              </p>
            </div>
            <div>
              <strong>Avertissement</strong>
              <p>
                Ces fiches ne remplacent ni le RCP, ni l&apos;avis d&apos;un médecin, ni le jugement du pharmacien. Vérifiez
                toujours la source et la date de mise à jour.
              </p>
            </div>
            <div>
              <strong>Contribuer</strong>
              <p>
                <a href="/proposer/">Proposer un sujet ou une correction</a>
                <br />
                <a href="/admin/">Espace pharmaciens</a>
              </p>
            </div>
          </div>
        </footer>
        <ScriptRecherche />
      </body>
    </html>
  );
}
