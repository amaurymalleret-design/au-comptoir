export type Source = {
  /** Titre lisible, ex. « HAS – Prise en charge de la lombalgie commune (2019) » */
  titre: string;
  url: string;
  /** Organisme : HAS, ANSM, SPLF, SFD, Légifrance, BDPM, EMA… */
  organisme: string;
};

export type Statut = "publie" | "brouillon";

export type Meta = {
  slug: string;
  titre: string;
  /** Une phrase d'accroche affichée sous le titre et dans les listes */
  resume: string;
  statut: Statut;
  /** AAAA-MM-JJ */
  miseAJour: string;
  relecture?: string;
  motsCles: string[];
  sources: Source[];
};

export type Conseil = Meta & {
  type: "conseil";
  categorie: "quotidien" | "chronique";
  theme: string;
  /** Contexte en 2–3 phrases */
  introduction: string;
  questions: string[];
  alertes: string[];
  conseils: string[];
  produits: { nom: string; detail: string; prudence?: string }[];
  populations: { population: string; conduite: string }[];
  aRetenir: string;
  medicamentsLies?: string[];
};

export type Posologie = {
  indication: string;
  population: string;
  dose: string;
  remarque?: string;
};

export type Medicament = Meta & {
  type: "medicament";
  dci: string;
  specialiteReference: string;
  classe: string;
  delivrance: string;
  rcp: { libelle: string; url: string };
  indications: string[];
  posologies: Posologie[];
  adaptations: string[];
  effetsAnnoncer: { effet: string; frequence: string; conduite: string }[];
  contreIndications: string[];
  interactions: { avec: string; risque: string }[];
  conseilsDelivrance: string[];
  conseilsLies?: string[];
};

export type Fiche = Conseil | Medicament;
