# au comptoir

Aide-mémoire pour l'équipe officinale : fiches **conseils et pathologies** (questions à poser, signaux d'alerte,
conseils, produits, populations à risque) et fiches **médicaments** (indications, posologies par indication,
effets à annoncer, interactions majeures, lien vers le RCP). Chaque fiche cite ses sources officielles françaises
et affiche sa date de mise à jour.

> Les fiches de la V1 sont au statut `brouillon` : elles doivent être relues par un pharmacien avant publication.

## Démarrer

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint:contenu   # vérifie toutes les fiches (schéma, liens croisés)
npm run build          # build de production (avec l'API de propositions)
npm run build:static   # export statique dans out/ (aperçu sans serveur)
```

## Contenu

Une fiche = un fichier JSON :

- `content/conseils/<slug>.json`
- `content/medicaments/<slug>.json`

Le schéma est décrit dans `lib/types.ts` et vérifié par `scripts/schemas.mjs`.
Pour publier une fiche relue : `"statut": "publie"` et `"relecture": "Nom du pharmacien, date"`.

Règle éditoriale : les posologies viennent uniquement du RCP (BDPM ou EMA) ou d'une recommandation HAS.

## Circuit des propositions

1. **Proposition** : le formulaire `/proposer` crée un ticket GitHub avec le label `proposition`
   (via l'API du site si `GITHUB_TOKEN` est configuré, sinon via un ticket pré-rempli).
2. **Validation** : un administrateur ajoute le label `validé`, ou `refusé` (le ticket est alors clos).
3. **Rédaction IA** : l'action `.github/workflows/redaction-ia.yml` vérifie que le label vient d'un collaborateur,
   appelle l'API Claude avec recherche web (`scripts/rediger-fiche.mjs`), valide le JSON et ouvre une pull request
   `brouillon-ia`.
4. **Relecture** : un pharmacien corrige, passe la fiche en `publie` et fusionne. Vercel redéploie le site.

Les **administrateurs** sont les pharmaciens ajoutés comme collaborateurs du dépôt
(Settings → Collaborators, rôle *Triage* ou plus).

## Mise en ligne (Vercel)

1. Importer le dépôt sur <https://vercel.com/new> (framework Next.js détecté automatiquement).
2. Variables d'environnement Vercel :
   - `GITHUB_TOKEN` : jeton GitHub *fine-grained* limité à ce dépôt, permission **Issues : Read and write** ;
   - `GITHUB_REPO` : `amaurymalleret-design/au-comptoir`.
3. Secrets du dépôt GitHub (Settings → Secrets and variables → Actions) :
   - `ANTHROPIC_API_KEY` : clé de l'API Claude (console.anthropic.com).
4. Settings → Actions → General : cocher **Allow GitHub Actions to create and approve pull requests**.
5. Créer les labels `proposition`, `validé`, `refusé` (le label `brouillon-ia` est créé automatiquement).

## Avertissement

Ces fiches ne remplacent ni le RCP, ni l'avis médical, ni le jugement du pharmacien.
