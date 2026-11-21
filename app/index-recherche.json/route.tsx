import { indexRecherche } from "@/lib/index-recherche";

// Index de recherche servi comme fichier statique. Extension .tsx pour être incluse dans l'export statique (les .ts en sont exclues).
export const dynamic = "force-static";

export function GET() {
  return Response.json(indexRecherche());
}
