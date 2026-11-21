import { conseils, medicaments, THEMES } from "./contenu";
import type { EntreeIndex } from "@/components/Recherche";

// Mots trop courants pour aider à distinguer les fiches.
const VIDES = new Set(
  ("avec sans pour dans chez plus moins tout tous toute toutes elle elles nous vous leur leurs cette ces son ses une des les aux par sur sous " +
    "est sont être avoir peut peuvent faut fois jour jours entre comme aussi mais donc ainsi alors quand selon après avant très bien " +
    "prendre prise prises cas autre autres même dont votre vos")
    .split(" "),
);

function normaliser(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Mots uniques (≥ 4 lettres, hors mots vides) d'un texte, pour l'index plein texte. */
function mots(...textes: string[]) {
  const vus = new Set<string>();
  for (const t of textes) {
    for (const m of normaliser(t).split(/[^a-z0-9]+/)) {
      if (m.length >= 4 && !VIDES.has(m)) vus.add(m);
    }
  }
  return [...vus].join(" ");
}

export function indexRecherche(): EntreeIndex[] {
  const theme = (id: string) => THEMES.find((t) => t.id === id)?.libelle ?? "";
  return [
    ...conseils().map((c) => ({
      t: c.titre,
      u: `/conseils/${c.slug}/`,
      k: "Conseil" as const,
      r: c.resume,
      m: [...c.motsCles, theme(c.theme)].join(" "),
      x: mots(c.introduction, c.aRetenir, ...c.questions, ...c.produits.map((p) => p.nom), ...c.populations.map((p) => p.population)),
    })),
    ...medicaments().map((m) => ({
      t: m.titre,
      u: `/medicaments/${m.slug}/`,
      k: "Médicament" as const,
      r: m.resume,
      m: [m.dci, m.specialiteReference, m.classe, ...m.motsCles].join(" "),
      x: mots(...m.indications, ...m.posologies.map((p) => p.indication), ...m.effetsAnnoncer.map((e) => e.effet)),
    })),
  ];
}
