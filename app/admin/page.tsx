import type { Metadata } from "next";
import { conseils, medicaments } from "@/lib/contenu";
import { URL_DEPOT } from "@/lib/config";

export const metadata: Metadata = { title: "Espace pharmaciens" };

export default function PageAdmin() {
  const aRelire = [...conseils(), ...medicaments()].filter((f) => f.statut === "brouillon");
  const lien = (q: string) => `${URL_DEPOT}/issues?q=${encodeURIComponent(q)}`;
  return (
    <div className="conteneur etroit">
      <p className="fil"><a href="/">Accueil</a> / Espace pharmaciens</p>
      <h1>Espace pharmaciens</h1>
      <p className="chapo" style={{ color: "var(--encre-2)" }}>
        Les administrateurs sont les pharmaciens ajoutés comme collaborateurs du dépôt GitHub par le propriétaire du site.
        La validation se fait directement sur GitHub, avec historique et relecture à plusieurs.
      </p>

      <h2 style={{ marginTop: 32 }}>Le circuit d&apos;une fiche</h2>
      <ol className="etapes">
        <li><strong>Proposition</strong><br />Un ticket GitHub avec le label <code>proposition</code> est créé depuis le formulaire.</li>
        <li><strong>Validation</strong><br />Un administrateur ajoute le label <code>validé</code> (ou <code>refusé</code> pour clore).</li>
        <li><strong>Rédaction IA</strong><br />Une action GitHub rédige un brouillon sourcé avec l&apos;API Claude et ouvre une pull request.</li>
        <li><strong>Relecture</strong><br />Un pharmacien corrige, passe le statut à <code>publie</code>, signe la relecture et fusionne. Le site se met à jour.</li>
      </ol>

      <div className="liens" style={{ margin: "28px 0" }}>
        <a href={lien("is:open label:proposition -label:validé -label:refusé")} target="_blank" rel="noopener noreferrer">📥 Propositions à examiner</a>
        <a href={`${URL_DEPOT}/pulls?q=${encodeURIComponent("is:open label:brouillon-ia")}`} target="_blank" rel="noopener noreferrer">✍️ Brouillons IA à relire</a>
        <a href={`${URL_DEPOT}/settings/access`} target="_blank" rel="noopener noreferrer">👥 Gérer les administrateurs</a>
      </div>

      <h2>Fiches en attente de validation ({aRelire.length})</h2>
      <p style={{ color: "var(--encre-2)" }}>
        Pour valider une fiche : modifier son fichier JSON dans <code>content/</code>, passer <code>&quot;statut&quot;</code> à{" "}
        <code>&quot;publie&quot;</code> et renseigner <code>&quot;relecture&quot;</code> (nom du pharmacien et date).
      </p>
      <div className="tableau-wrap">
        <table>
          <thead><tr><th scope="col">Fiche</th><th scope="col">Type</th><th scope="col">Mise à jour</th><th scope="col">Fichier</th></tr></thead>
          <tbody>
            {aRelire.map((f) => {
              const dossier = f.type === "conseil" ? "conseils" : "medicaments";
              return (
                <tr key={f.type + f.slug}>
                  <td><a href={`/${dossier}/${f.slug}/`}>{f.titre}</a></td>
                  <td>{f.type === "conseil" ? "Conseil" : "Médicament"}</td>
                  <td>{f.miseAJour}</td>
                  <td><a href={`${URL_DEPOT}/edit/main/content/${dossier}/${f.slug}.json`} target="_blank" rel="noopener noreferrer">Modifier</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
