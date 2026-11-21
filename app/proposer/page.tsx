import type { Metadata } from "next";
import { URL_DEPOT } from "@/lib/config";

export const metadata: Metadata = { title: "Proposer une fiche" };

// Formulaire en HTML + JavaScript natif : il envoie la proposition à l'API du site,
// ou, sur l'export statique (ou si l'API n'est pas configurée), ouvre un ticket GitHub pré-rempli.
const script = (statique: boolean, depot: string) => `
(function(){
  var f = document.getElementById('form-proposition'), m = document.getElementById('message-proposition'), b = f.querySelector('button');
  function afficher(type, html){ m.className = 'message ' + type; m.innerHTML = html; m.hidden = false; }
  function urlGithub(d){
    var p = new URLSearchParams({ template: 'proposition.yml', title: '[' + d.type + '] ' + d.sujet, type: d.type, sujet: d.sujet, details: d.details || '', sources: d.sources || '' });
    return '${depot}/issues/new?' + p.toString();
  }
  function versGithub(d){
    afficher('ok', 'Dernière étape : <a href="' + urlGithub(d).replace(/"/g, '&quot;') + '" target="_blank" rel="noopener">ouvrir la proposition pré-remplie sur GitHub</a>, puis cliquer sur « Create ». Un compte GitHub gratuit est nécessaire.');
  }
  f.addEventListener('submit', function(ev){
    ev.preventDefault();
    var d = Object.fromEntries(new FormData(f).entries());
    if (d.site) return; // pot de miel anti-robots
    if (${statique ? "true" : "false"}) { versGithub(d); return; }
    b.disabled = true;
    fetch('/api/propositions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
      .then(function(r){ return r.json().then(function(j){ return { ok: r.ok, j: j }; }); })
      .then(function(x){
        if (x.ok) { f.reset(); afficher('ok', 'Merci ! Votre proposition est enregistrée. Un pharmacien administrateur va l\\u2019examiner. <a href="' + x.j.url + '" target="_blank" rel="noopener">Suivre la proposition</a>'); }
        else if (x.j && x.j.repli) { versGithub(d); }
        else { afficher('erreur', (x.j && x.j.erreur) || 'Envoi impossible. Réessayez plus tard.'); }
      })
      .catch(function(){ versGithub(d); })
      .finally(function(){ b.disabled = false; });
  });
})();`;

export default function PageProposer() {
  const statique = process.env.NEXT_PUBLIC_STATIQUE === "1";
  return (
    <div className="conteneur etroit">
      <p className="fil"><a href="/">Accueil</a> / Proposer une fiche</p>
      <h1>Proposer une fiche</h1>
      <p className="chapo" style={{ color: "var(--encre-2)" }}>
        Un conseil, une pathologie ou un médicament manque ? Une fiche mérite une correction ? Proposez-le ici.
      </p>
      <ol className="etapes" style={{ margin: "24px 0 32px" }}>
        <li>Vous envoyez la proposition.</li>
        <li>Un pharmacien administrateur la valide ou la refuse.</li>
        <li>Si elle est validée, l&apos;IA rédige un brouillon sourcé.</li>
        <li>Un pharmacien relit et publie.</li>
      </ol>
      <form id="form-proposition" className="formulaire">
        <label>
          Type de fiche
          <select name="type" required defaultValue="Conseil">
            <option>Conseil</option>
            <option>Pathologie chronique</option>
            <option>Médicament</option>
            <option>Correction d&apos;une fiche</option>
          </select>
        </label>
        <label>
          Sujet
          <input name="sujet" required maxLength={120} placeholder="Ex. : conjonctivite, mycose vaginale, méthotrexate…" />
        </label>
        <label>
          Précisions <span className="aide">Ce qui vous semble important : situation au comptoir, population, question fréquente…</span>
          <textarea name="details" rows={5} maxLength={4000} />
        </label>
        <label>
          Sources suggérées <span className="aide">Facultatif : liens HAS, ANSM, RCP, sociétés savantes.</span>
          <textarea name="sources" rows={2} maxLength={2000} />
        </label>
        <label style={{ position: "absolute", left: -9999 }} aria-hidden="true">
          Ne pas remplir <input name="site" tabIndex={-1} autoComplete="off" />
        </label>
        <div>
          <button type="submit" className="bouton">Envoyer la proposition</button>
        </div>
        <p className="aide" style={{ margin: 0 }}>
          Les propositions sont publiques sur le{" "}
          <a href={`${URL_DEPOT}/issues?q=label%3Aproposition`} target="_blank" rel="noopener noreferrer">dépôt du projet</a>. N&apos;y
          mettez aucune donnée de patient.
        </p>
        <div id="message-proposition" role="status" hidden />
      </form>
      <script dangerouslySetInnerHTML={{ __html: script(statique, URL_DEPOT) }} />
    </div>
  );
}
