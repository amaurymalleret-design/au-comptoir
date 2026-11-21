import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avertissement, BandeauStatut, Bloc, Infos, Liste, Sources } from "@/components/Fiche";
import { conseil, conseils, medicament, THEMES } from "@/lib/contenu";

export const dynamicParams = false;
export function generateStaticParams() {
  return conseils().map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = conseil((await params).slug);
  return c ? { title: c.titre, description: c.resume } : {};
}

export default async function PageConseil({ params }: { params: Promise<{ slug: string }> }) {
  const c = conseil((await params).slug);
  if (!c) notFound();
  const theme = THEMES.find((t) => t.id === c.theme);
  const lies = (c.medicamentsLies ?? []).map((s) => medicament(s)).filter((m) => m !== undefined);
  let n = 0;
  return (
    <article className="conteneur etroit">
      <p className="fil">
        <a href="/">Accueil</a> / <a href="/conseils/">Conseils</a> / {theme && <><a href={`/conseils/#${theme.id}`}>{theme.libelle}</a> / </>}
        {c.titre}
      </p>
      <header className="entete-fiche">
        <div className="infos" style={{ marginBottom: 10 }}>
          <span className="pastille conseil">Conseil</span>
          <span className={`pastille ${c.categorie === "chronique" ? "chronique" : ""}`}>
            {c.categorie === "chronique" ? "Pathologie chronique" : "Quotidien"}
          </span>
          {theme && <span className="pastille" style={{ borderTop: `4px solid ${theme.couleur}` }}>{theme.libelle}</span>}
        </div>
        <h1>{c.titre}</h1>
        <p className="chapo">{c.resume}</p>
        <Infos fiche={c} />
      </header>
      <BandeauStatut fiche={c} />
      <p>{c.introduction}</p>

      <Bloc num={++n} titre="Questions à poser">
        <Liste items={c.questions} classe="coches" />
      </Bloc>
      <Bloc num={++n} titre="Signaux d'alerte : orienter" variante="alerte">
        <Liste items={c.alertes} classe="alertes" />
      </Bloc>
      <Bloc num={++n} titre="Conseils à donner" variante="vert">
        <Liste items={c.conseils} />
      </Bloc>
      <Bloc num={++n} titre="Produits envisageables">
        {c.produits.map((p) => (
          <div key={p.nom} className="produit">
            <strong>{p.nom}</strong> : {p.detail}
            {p.prudence && <span className="prudence">⚠ {p.prudence}</span>}
          </div>
        ))}
      </Bloc>
      <Bloc num={++n} titre="Populations à risque">
        <div className="tableau-wrap">
          <table>
            <thead><tr><th scope="col">Population</th><th scope="col">Conduite à tenir</th></tr></thead>
            <tbody>
              {c.populations.map((p) => (
                <tr key={p.population}><td><strong>{p.population}</strong></td><td>{p.conduite}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bloc>

      <div className="retenir">
        <h2>À retenir</h2>
        <p>{c.aRetenir}</p>
      </div>

      {lies.length > 0 && (
        <Bloc num={++n} titre="Médicaments liés">
          <div className="liens" style={{ marginBottom: 12 }}>
            {lies.map((m) => <a key={m.slug} href={`/medicaments/${m.slug}/`}>💊 {m.titre}</a>)}
          </div>
        </Bloc>
      )}
      <Sources sources={c.sources} num={++n} />
      <Avertissement />
    </article>
  );
}
