import { z } from "zod";

const source = z.object({ titre: z.string().min(3), url: z.string().url(), organisme: z.string().min(2) });
const meta = {
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug en minuscules, sans accents, tirets"),
  titre: z.string().min(2),
  resume: z.string().min(20),
  statut: z.enum(["publie", "brouillon"]),
  miseAJour: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  relecture: z.string().optional(),
  motsCles: z.array(z.string()),
  sources: z.array(source).min(1),
};

export const conseil = z.object({
  type: z.literal("conseil"),
  ...meta,
  categorie: z.enum(["quotidien", "chronique"]),
  theme: z.enum(["orl", "digestif", "douleur", "dermato", "uro", "metabo", "pediatrie"]),
  introduction: z.string().min(20),
  questions: z.array(z.string()).min(2),
  alertes: z.array(z.string()).min(2),
  conseils: z.array(z.string()).min(2),
  produits: z.array(z.object({ nom: z.string(), detail: z.string(), prudence: z.string().optional() })),
  populations: z.array(z.object({ population: z.string(), conduite: z.string() })),
  aRetenir: z.string().min(10),
  medicamentsLies: z.array(z.string()).optional(),
});

export const medicament = z.object({
  type: z.literal("medicament"),
  ...meta,
  dci: z.string(),
  specialiteReference: z.string(),
  classe: z.string(),
  delivrance: z.string(),
  rcp: z.object({ libelle: z.string(), url: z.string().url() }),
  indications: z.array(z.string()).min(1),
  posologies: z.array(z.object({ indication: z.string(), population: z.string(), dose: z.string(), remarque: z.string().optional() })).min(1),
  adaptations: z.array(z.string()),
  effetsAnnoncer: z.array(z.object({ effet: z.string(), frequence: z.string(), conduite: z.string() })).min(1),
  contreIndications: z.array(z.string()).min(1),
  interactions: z.array(z.object({ avec: z.string(), risque: z.string() })),
  conseilsDelivrance: z.array(z.string()).min(1),
  conseilsLies: z.array(z.string()).optional(),
});

export const fiche = z.discriminatedUnion("type", [conseil, medicament]);
