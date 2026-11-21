import type { Metadata } from "next";
import { medicaments } from "@/lib/contenu";

export const metadata: Metadata = { title: "Médicaments" };

export default function PageMedicaments() {
  const ms = medicaments();
  return (
    <div className="conteneur">
      <p className="fil"><a href="/">Accueil</a> / Médicaments</p>
      <h1>Médicaments</h1>
      <p className="chapo" style={{ color: "var(--encre-2)", maxWidth: 680 }}>
        Indications, posologies usuelles par indication, effets indésirables à annoncer, interactions majeures. Les
        posologies sont relevées dans le RCP officiel, accessible depuis chaque fiche.
      </p>
      <div className="grille" style={{ marginTop: 24 }}>
        {ms.map((m) => (
          <a key={m.slug} href={`/medicaments/${m.slug}/`} className="carte" style={{ borderTopColor: "var(--corail)" }}>
            <h3>{m.titre}</h3>
            <p style={{ fontSize: ".85rem" }}>{m.specialiteReference}</p>
            <p>{m.resume}</p>
            <span className="meta">
              <span className="pastille medicament">{m.delivrance.split(" (")[0]}</span>
              {m.statut === "brouillon" && <span className="pastille brouillon">À relire</span>}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
