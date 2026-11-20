import type { Metadata } from "next";
import { conseils, THEMES } from "@/lib/contenu";

export const metadata: Metadata = { title: "Conseils & pathologies" };

export default function PageConseils() {
  const cs = conseils();
  return (
    <div className="conteneur">
      <p className="fil"><a href="/">Accueil</a> / Conseils</p>
      <h1>Conseils &amp; pathologies</h1>
      <p className="chapo" style={{ color: "var(--encre-2)", maxWidth: 680 }}>
        Pour chaque sujet : les questions à poser, les signaux qui imposent d&apos;orienter, les conseils, les produits
        envisageables et les populations à risque.
      </p>
      <div className="filtres" aria-label="Aller au thème">
        {THEMES.map((t) => (
          <a key={t.id} href={`#${t.id}`}>{t.icone} {t.libelle}</a>
        ))}
      </div>
      {THEMES.map((t) => {
        const liste = cs.filter((c) => c.theme === t.id);
        if (!liste.length) return null;
        return (
          <section key={t.id} id={t.id} className="groupe">
            <h2 className="groupe-titre">
              <span className="puce" style={{ background: t.couleur }} aria-hidden="true" />
              {t.libelle}
            </h2>
            <div className="grille">
              {liste.map((c) => (
                <a key={c.slug} href={`/conseils/${c.slug}/`} className="carte" style={{ borderTopColor: t.couleur }}>
                  <h3>{c.titre}</h3>
                  <p>{c.resume}</p>
                  <span className="meta">
                    <span className={`pastille ${c.categorie === "chronique" ? "chronique" : "conseil"}`}>
                      {c.categorie === "chronique" ? "Chronique" : "Quotidien"}
                    </span>
                    {c.statut === "brouillon" && <span className="pastille brouillon">À relire</span>}
                  </span>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
