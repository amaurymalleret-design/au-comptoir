import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avertissement, BandeauStatut, Bloc, Infos, Liste, Sources } from "@/components/Fiche";
import { conseil, medicament, medicaments } from "@/lib/contenu";

export const dynamicParams = false;
export function generateStaticParams() {
  return medicaments().map((m) => ({ slug: m.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = medicament((await params).slug);
  return m ? { title: m.titre, description: m.resume } : {};
}

export default async function PageMedicament({ params }: { params: Promise<{ slug: string }> }) {
  const m = medicament((await params).slug);
  if (!m) notFound();
  const lies = (m.conseilsLies ?? []).map((s) => conseil(s)).filter((c) => c !== undefined);
  let n = 0;
  return (
    <article className="conteneur etroit">
      <p className="fil"><a href="/">Accueil</a> / <a href="/medicaments/">Médicaments</a> / {m.titre}</p>
      <header className="entete-fiche">
        <div className="infos" style={{ marginBottom: 10 }}>
          <span className="pastille medicament">Médicament</span>
          <span className="pastille">{m.delivrance}</span>
        </div>
        <h1>{m.titre}</h1>
        <p className="chapo">{m.resume}</p>
        <div className="infos" style={{ marginBottom: 8 }}>
          <span>Spécialité de référence : <strong>{m.specialiteReference}</strong></span>
          <span>{m.classe}</span>
        </div>
        <Infos fiche={m} />
        <a className="rcp" href={m.rcp.url} target="_blank" rel="noopener noreferrer">📄 {m.rcp.libelle} ↗</a>
      </header>
      <BandeauStatut fiche={m} />

      <Bloc num={++n} titre="Indications">
        <Liste items={m.indications} />
      </Bloc>
      <Bloc num={++n} titre="Posologies usuelles par indication" variante="vert">
        <div className="tableau-wrap">
          <table>
            <thead>
              <tr><th scope="col">Indication</th><th scope="col">Population</th><th scope="col">Posologie</th></tr>
            </thead>
            <tbody>
              {m.posologies.map((p, i) => (
                <tr key={i}>
                  <td>{p.indication}</td>
                  <td>{p.population}</td>
                  <td>
                    <strong>{p.dose}</strong>
                    {p.remarque && <><br /><span style={{ color: "var(--encre-2)", fontSize: ".9rem" }}>{p.remarque}</span></>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {m.adaptations.length > 0 && (
          <>
            <h3>Adaptations</h3>
            <Liste items={m.adaptations} />
          </>
        )}
      </Bloc>
      <Bloc num={++n} titre="Effets indésirables à annoncer">
        <div className="tableau-wrap">
          <table>
            <thead><tr><th scope="col">Effet</th><th scope="col">Fréquence</th><th scope="col">Que dire au patient</th></tr></thead>
            <tbody>
              {m.effetsAnnoncer.map((e) => (
                <tr key={e.effet}><td><strong>{e.effet}</strong></td><td>{e.frequence}</td><td>{e.conduite}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bloc>
      <Bloc num={++n} titre="Contre-indications principales" variante="alerte">
        <Liste items={m.contreIndications} classe="alertes" />
      </Bloc>
      <Bloc num={++n} titre="Interactions majeures" variante="alerte">
        <div className="tableau-wrap">
          <table>
            <thead><tr><th scope="col">Avec</th><th scope="col">Risque et conduite</th></tr></thead>
            <tbody>
              {m.interactions.map((x) => (
                <tr key={x.avec}><td><strong>{x.avec}</strong></td><td>{x.risque}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bloc>
      <div className="retenir">
        <h2>Conseils de délivrance</h2>
        <ul className="liste" style={{ margin: 0 }}>
          {m.conseilsDelivrance.map((t) => <li key={t} style={{ fontWeight: 700 }}>{t}</li>)}
        </ul>
      </div>
      {lies.length > 0 && (
        <Bloc num={++n} titre="Conseils liés">
          <div className="liens" style={{ marginBottom: 12 }}>
            {lies.map((c) => <a key={c.slug} href={`/conseils/${c.slug}/`}>🩺 {c.titre}</a>)}
          </div>
        </Bloc>
      )}
      <Sources sources={m.sources} num={++n} />
      <Avertissement />
    </article>
  );
}
