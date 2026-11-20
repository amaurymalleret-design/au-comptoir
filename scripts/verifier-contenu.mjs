// Vérifie toutes les fiches de content/ : schéma, slug = nom de fichier, liens croisés existants.
import fs from "node:fs";
import path from "node:path";
import { fiche } from "./schemas.mjs";

const racine = path.join(process.cwd(), "content");
const erreurs = [];
const slugs = { conseils: new Set(), medicaments: new Set() };
const fiches = [];

for (const dossier of ["conseils", "medicaments"]) {
  for (const f of fs.readdirSync(path.join(racine, dossier)).filter((x) => x.endsWith(".json"))) {
    const chemin = `content/${dossier}/${f}`;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(racine, dossier, f), "utf8"));
    } catch (e) {
      erreurs.push(`${chemin} : JSON invalide (${e.message})`);
      continue;
    }
    const r = fiche.safeParse(data);
    if (!r.success) {
      for (const i of r.error.issues) erreurs.push(`${chemin} : ${i.path.join(".")} ${i.message}`);
      continue;
    }
    const attendu = dossier === "conseils" ? "conseil" : "medicament";
    if (r.data.type !== attendu) erreurs.push(`${chemin} : type "${r.data.type}" dans le dossier ${dossier}`);
    if (r.data.slug + ".json" !== f) erreurs.push(`${chemin} : le slug "${r.data.slug}" ne correspond pas au nom du fichier`);
    slugs[dossier].add(r.data.slug);
    fiches.push({ chemin, data: r.data });
  }
}
for (const { chemin, data } of fiches) {
  for (const s of data.medicamentsLies ?? []) if (!slugs.medicaments.has(s)) erreurs.push(`${chemin} : médicament lié inconnu "${s}"`);
  for (const s of data.conseilsLies ?? []) if (!slugs.conseils.has(s)) erreurs.push(`${chemin} : conseil lié inconnu "${s}"`);
}

if (erreurs.length) {
  console.error(erreurs.map((e) => "✗ " + e).join("\n"));
  process.exit(1);
}
console.log(`✓ ${fiches.length} fiches valides (${slugs.conseils.size} conseils, ${slugs.medicaments.size} médicaments)`);
