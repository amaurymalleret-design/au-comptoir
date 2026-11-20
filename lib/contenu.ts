import fs from "node:fs";
import path from "node:path";
import type { Conseil, Medicament } from "./types";

const racine = path.join(process.cwd(), "content");

function lireDossier<T>(dossier: string): T[] {
  const dir = path.join(racine, dossier);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as T);
}

const triAlpha = <T extends { titre: string }>(a: T, b: T) => a.titre.localeCompare(b.titre, "fr");

export function conseils(): Conseil[] {
  return lireDossier<Conseil>("conseils").sort(triAlpha);
}
export function medicaments(): Medicament[] {
  return lireDossier<Medicament>("medicaments").sort(triAlpha);
}
export function conseil(slug: string) {
  return conseils().find((c) => c.slug === slug);
}
export function medicament(slug: string) {
  return medicaments().find((m) => m.slug === slug);
}

export const THEMES: { id: string; libelle: string; couleur: string; icone: string }[] = [
  { id: "orl", libelle: "ORL · Respiratoire", couleur: "var(--c-orl)", icone: "🫁" },
  { id: "digestif", libelle: "Digestif", couleur: "var(--c-digestif)", icone: "🍃" },
  { id: "douleur", libelle: "Douleur · Rhumato", couleur: "var(--c-douleur)", icone: "🦴" },
  { id: "dermato", libelle: "Dermatologie", couleur: "var(--c-dermato)", icone: "🧴" },
  { id: "uro", libelle: "Urologie · Gynéco", couleur: "var(--c-uro)", icone: "💧" },
  { id: "metabo", libelle: "Cardio · Métabolisme", couleur: "var(--c-metabo)", icone: "❤️" },
];
