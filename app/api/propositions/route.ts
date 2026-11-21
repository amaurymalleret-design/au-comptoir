import { DEPOT } from "@/lib/config";

const TYPES = ["Conseil", "Pathologie chronique", "Médicament", "Correction d'une fiche"];
const nettoyer = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let d: Record<string, unknown>;
  try {
    d = await req.json();
  } catch {
    return Response.json({ erreur: "Requête invalide." }, { status: 400 });
  }
  if (nettoyer(d.site, 10)) return Response.json({ ok: true, url: "#" }); // pot de miel

  const type = nettoyer(d.type, 40);
  const sujet = nettoyer(d.sujet, 120);
  const details = nettoyer(d.details, 4000);
  const sources = nettoyer(d.sources, 2000);
  if (!TYPES.includes(type) || sujet.length < 2) {
    return Response.json({ erreur: "Indiquez le type et le sujet de la fiche." }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  const depot = process.env.GITHUB_REPO || DEPOT;
  if (!token) return Response.json({ erreur: "Envoi direct non configuré.", repli: true }, { status: 503 });

  const corps = [
    `### Type de fiche\n\n${type}`,
    `### Sujet\n\n${sujet}`,
    `### Précisions\n\n${details || "_Aucune_"}`,
    `### Sources suggérées\n\n${sources || "_Aucune_"}`,
    `---\n_Proposition envoyée depuis le formulaire du site. Un administrateur ajoute le label \`validé\` pour lancer la rédaction par IA, ou \`refusé\` pour la clore._`,
  ].join("\n\n");

  const r = await fetch(`https://api.github.com/repos/${depot}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "au-comptoir",
    },
    body: JSON.stringify({ title: `[${type}] ${sujet}`, body: corps, labels: ["proposition"] }),
  });
  if (!r.ok) return Response.json({ erreur: "Le service est indisponible.", repli: true }, { status: 502 });
  const issue = (await r.json()) as { html_url: string };
  return Response.json({ ok: true, url: issue.html_url }, { status: 201 });
}
