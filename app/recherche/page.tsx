import type { Metadata } from "next";
import Recherche from "@/components/Recherche";

export const metadata: Metadata = { title: "Rechercher une fiche" };

export default function PageRecherche() {
  return (
    <section className="section">
      <div className="conteneur">
        <h1>Rechercher une fiche</h1>
        <p className="chapo">
          Tapez un symptôme, une pathologie, une DCI ou un nom commercial. La recherche ignore les accents, tolère une faute de
          frappe et reconnaît quelques mots du langage courant (« mal de tête », « pilule du lendemain »…).
        </p>
        <Recherche variante="page" />
      </div>
    </section>
  );
}
