import Recherche from "@/components/Recherche";
import { conseils, medicaments, THEMES } from "@/lib/contenu";
import { indexRecherche } from "@/lib/index-recherche";

export default function Accueil() {
  const cs = conseils();
  const ms = medicaments();
  const recents = [...cs, ...ms].sort((a, b) => b.miseAJour.localeCompare(a.miseAJour) || a.titre.localeCompare(b.titre, "fr")).slice(0, 6);
  return (
    <>
      <section className="heros">
        <div className="conteneur">
          <span className="surtitre">Pour l&apos;équipe officinale</span>
          <h1>
            Le bon conseil, <span className="surligne">au comptoir</span>.
          </h1>
          <p className="chapo">
            Questions à poser, signaux d&apos;alerte, conseils et posologies usuelles, en une page par sujet. Chaque fiche cite
            ses sources officielles et affiche sa date de mise à jour.
          </p>
          <Recherche index={indexRecherche()} />
        </div>
      </section>

      <section className="section">
        <div className="conteneur entrees">
          <a href="/conseils/" className="entree">
            <div className="bande" style={{ background: "var(--vert)" }} />
            <div className="corps">
              <span className="pastille conseil">{cs.length} fiches</span>
              <h2>Conseils &amp; pathologies</h2>
              <p>Pathologies du quotidien et maladies chroniques : que demander, quand orienter, quoi proposer.</p>
              <span className="fleche">Voir les conseils →</span>
            </div>
          </a>
          <a href="/medicaments/" className="entree">
            <div className="bande" style={{ background: "var(--corail)" }} />
            <div className="corps">
              <span className="pastille medicament">{ms.length} fiches</span>
              <h2>Médicaments</h2>
              <p>Indications, posologies par indication, effets à annoncer, interactions majeures et lien vers le RCP.</p>
              <span className="fleche">Voir les médicaments →</span>
            </div>
          </a>
        </div>
      </section>

      <section className="section">
        <div className="conteneur">
          <div className="entete-section">
            <h2>Par thème</h2>
            <p>Conseils et pathologies regroupés par appareil.</p>
          </div>
          <div className="grille">
            {THEMES.map((t) => {
              const n = cs.filter((c) => c.theme === t.id).length;
              return (
                <a key={t.id} href={`/conseils/#${t.id}`} className="carte theme" style={{ borderTopColor: t.couleur }}>
                  <span className="icone" aria-hidden="true">{t.icone}</span>
                  <span>
                    <h3>{t.libelle}</h3>
                    <span className="compte">{n} fiche{n > 1 ? "s" : ""}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="conteneur">
          <div className="entete-section">
            <h2>Dernières mises à jour</h2>
          </div>
          <div className="grille">
            {recents.map((f) => (
              <a
                key={f.type + f.slug}
                href={`/${f.type === "conseil" ? "conseils" : "medicaments"}/${f.slug}/`}
                className="carte"
                style={{ borderTopColor: f.type === "conseil" ? "var(--vert)" : "var(--corail)" }}
              >
                <h3>{f.titre}</h3>
                <p>{f.resume}</p>
                <span className="meta">
                  <span className={`pastille ${f.type}`}>{f.type === "conseil" ? "Conseil" : "Médicament"}</span>
                  {f.statut === "brouillon" && <span className="pastille brouillon">À relire</span>}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="conteneur">
          <div className="entete-section">
            <h2>Une fiche manque ?</h2>
            <p>Tout le monde peut proposer un sujet. Les pharmaciens administrateurs valident avant toute publication.</p>
          </div>
          <ol className="etapes">
            <li>Vous proposez un conseil, une pathologie ou un médicament.</li>
            <li>Un pharmacien administrateur valide ou refuse la proposition.</li>
            <li>L&apos;IA rédige un brouillon à partir des sources officielles.</li>
            <li>Un pharmacien relit, corrige et publie la fiche.</li>
          </ol>
          <p style={{ marginTop: 20 }}>
            <a href="/proposer/" className="bouton">Proposer une fiche</a>
          </p>
        </div>
      </section>
    </>
  );
}
