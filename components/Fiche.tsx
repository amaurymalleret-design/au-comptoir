import type { Fiche, Source } from "@/lib/types";

export function dateFr(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function BandeauStatut({ fiche }: { fiche: Fiche }) {
  if (fiche.statut === "publie") return null;
  return (
    <div className="bandeau brouillon" role="note">
      <span aria-hidden="true">✍️</span>
      <div>
        <strong>Fiche à relire par un pharmacien</strong>
        Rédigée à partir des sources citées, elle n&apos;a pas encore été validée par un pharmacien administrateur.
      </div>
    </div>
  );
}

export function Avertissement() {
  return (
    <div className="bandeau avertissement" role="note">
      <span aria-hidden="true">ℹ️</span>
      <div>
        Aide-mémoire destiné aux professionnels de l&apos;officine. Ne remplace pas le RCP, l&apos;avis médical ni le jugement
        du pharmacien. En cas de doute, orienter.
      </div>
    </div>
  );
}

export function Infos({ fiche }: { fiche: Fiche }) {
  return (
    <div className="infos">
      <span>
        Mise à jour : <strong>{dateFr(fiche.miseAJour)}</strong>
      </span>
      {fiche.relecture && <span>Relue par {fiche.relecture}</span>}
      <span>{fiche.sources.length} source{fiche.sources.length > 1 ? "s" : ""}</span>
    </div>
  );
}

export function Bloc({
  num,
  titre,
  variante,
  children,
}: {
  num: number;
  titre: string;
  variante?: "alerte" | "vert";
  children: React.ReactNode;
}) {
  return (
    <section className={`bloc ${variante ?? ""}`}>
      <h2>
        <span className="num">{String(num).padStart(2, "0")}</span>
        {titre}
      </h2>
      <div className="contenu">{children}</div>
    </section>
  );
}

export function Sources({ sources, num }: { sources: Source[]; num: number }) {
  return (
    <Bloc num={num} titre="Sources">
      <div className="sources">
        <ol>
          {sources.map((s) => (
            <li key={s.url}>
              <span className="org">{s.organisme}</span> :{" "}
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.titre}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </Bloc>
  );
}

export function Liste({ items, classe }: { items: string[]; classe?: string }) {
  return (
    <ul className={`liste ${classe ?? ""}`}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
