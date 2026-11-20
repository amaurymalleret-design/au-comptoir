import { conseils, medicaments } from "./contenu";
import type { EntreeIndex } from "@/components/Recherche";

export function indexRecherche(): EntreeIndex[] {
  return [
    ...conseils().map((c) => ({ t: c.titre, u: `/conseils/${c.slug}/`, k: "Conseil" as const, r: c.resume, m: c.motsCles.join(" ") })),
    ...medicaments().map((m) => ({
      t: m.titre,
      u: `/medicaments/${m.slug}/`,
      k: "Médicament" as const,
      r: m.resume,
      m: [m.dci, m.specialiteReference, m.classe, ...m.motsCles].join(" "),
    })),
  ];
}
