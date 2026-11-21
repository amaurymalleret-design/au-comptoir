export type EntreeIndex = {
  /** titre */ t: string;
  /** url */ u: string;
  k: "Conseil" | "Médicament";
  /** résumé */ r: string;
  /** mots-clés, DCI, noms commerciaux, classe, thème */ m: string;
  /** mots du corps de la fiche */ x: string;
};

/*
 * Recherche en JavaScript natif (sans framework) : fonctionne aussi sur l'export statique.
 * - insensible aux accents et à la casse, tolère une faute de frappe (distance d'édition),
 * - cherche dans le titre, les mots-clés (DCI, noms commerciaux, symptômes), le résumé et le corps,
 * - élargit avec quelques synonymes du langage courant (« mal de tête » → céphalée, migraine…),
 * - classe les résultats par pertinence ; navigation au clavier ; « / » pour aller au champ.
 */
const script = String.raw`
(function(){
  var lienPage = document.querySelector('a[data-page-recherche]'), lienProposer = document.querySelector('a[data-page-proposer]');
  if (!lienPage) return;
  // L'index est chargé à la première utilisation, à côté de la page /recherche/ (chemin relatif : marche aussi hors racine).
  var D = null, attente = null;
  function charger(){
    if (!attente) attente = fetch(new URL('../index-recherche.json', lienPage.href)).then(function(r){ return r.json(); }).then(function(d){
      d.forEach(function(e){ e.tt = mots(e.t); e.mm = mots(e.m); e.rr = mots(e.r); e.xx = e.x ? e.x.split(' ') : []; });
      D = d; return d;
    });
    return attente;
  }
  function n(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }
  function mots(s){ return n(s).split(/[^a-z0-9]+/).filter(Boolean); }
  var VIDES = {de:1,du:1,des:1,la:1,le:1,les:1,un:1,une:1,et:1,en:1,a:1,au:1,aux:1,pour:1,avec:1,d:1,l:1,j:1,ai:1,est:1,sur:1,par:1,ou:1,que:1,qui:1,mon:1,ma:1,mes:1};
  var SYN = [
    ['mal de tete','cephalee migraine'],['mal au crane','cephalee migraine'],['tete','cephalee migraine'],
    ['mal de ventre','douleur abdominale spasme diarrhee constipation'],['ventre','abdominale digestif'],
    ['mal de dos','lumbago lombalgie'],['dos','lumbago lombalgie'],['mal de gorge','angine pharyngite'],
    ['gastro','gastro enterite diarrhee vomissements'],['vomi','vomissements nausees'],['nausee','nausees vomissements transports'],
    ['pilule du lendemain','contraception urgence levonorgestrel ulipristal'],['lendemain','contraception urgence'],
    ['pipi','cystite urinaire'],['brule en urinant','cystite'],['uriner','cystite urinaire prostate'],
    ['bouton','acne herpes varicelle verrue'],['boutons','acne varicelle'],
    ['rhume des foins','rhinite allergique pollen'],['allergie','rhinite allergique antihistaminique urticaire'],
    ['tension','hypertension arterielle'],['sucre','diabete glycemie'],['glycemie','diabete'],['coeur','cardiaque infarctus'],
    ['fluidifiant','anticoagulant antiagregant'],['sang','anticoagulant saignement'],['dormir','insomnie sommeil'],['sommeil','insomnie'],
    ['stress','anxiete angoisse'],['angoisse','anxiete'],['deprime','depression'],['moral','depression'],
    ['cigarette','tabac nicotine sevrage'],['fumer','tabac nicotine sevrage'],['arreter de fumer','sevrage tabagique nicotine'],
    ['moustique','piqures paludisme'],['tique','piqures lyme'],['guepe','piqures'],['champignon','mycose antifongique'],
    ['bebe','nourrisson enfant'],['nourrisson','enfant bebe'],['fievre','fievre temperature antipyretique'],
    ['brulure','brulure brulures'],['estomac','brulures estomac reflux'],['reflux','brulures estomac'],
    ['yeux','oeil conjonctivite'],['oeil','conjonctivite yeux'],['toux','toux antitussif'],['nez','rhume rhinite'],
    ['jambes','jambes lourdes veineuse varices'],['varices','jambes lourdes veineuse'],['os','osteoporose fracture'],
    ['articulation','arthrose goutte'],['genou','arthrose entorse'],['cheville','entorse'],['regles','dysmenorrhee regles douloureuses'],
    ['cholesterol','hypercholesterolemie statine'],['thyroide','hypothyroidie levothyroxine'],['tremblement','parkinson'],
    ['crise','epilepsie migraine asthme goutte'],['respirer','asthme bpco essoufflement'],['essouffle','asthme bpco insuffisance cardiaque'],
    ['voyage','transports paludisme'],['avion','transports voyage'],['bouche','aphtes herpes'],['poux','pediculose lentes'],
    ['doliprane','paracetamol'],['efferalgan','paracetamol'],['dafalgan','paracetamol'],['advil','ibuprofene'],['nurofen','ibuprofene'],
    ['spasfon','phloroglucinol'],['smecta','diarrhee'],['imodium','loperamide'],['ventoline','salbutamol'],['levothyrox','levothyroxine'],
    ['kardegic','aspirine'],['plavix','clopidogrel'],['eliquis','apixaban'],['xanax','alprazolam'],['zoloft','sertraline'],
    ['daflon','diosmine'],['tiorfan','racecadotril'],['imigrane','sumatriptan'],['omix','tamsulosine'],['augmentin','amoxicilline'],
    ['clamoxyl','amoxicilline'],['mopral','omeprazole'],['inexium','omeprazole'],['tahor','atorvastatine'],['glucophage','metformine'],
    ['coversyl','ramipril'],['triatec','ramipril'],['amlor','amlodipine'],['monuril','fosfomycine'],['voltarene','diclofenac'],
    ['zyrtec','cetirizine'],['virlix','cetirizine'],['donormyl','doxylamine'],['mercalm','dimenhydrinate'],['nausicalm','dimenhydrinate'],
    ['malarone','atovaquone proguanil'],['norlevo','levonorgestrel'],['ellaone','ulipristal'],['forlax','macrogol'],['movicol','macrogol'],
    ['zovirax','aciclovir'],['gyno pevaryl','econazole'],['coumadine','warfarine'],['diamicron','gliclazide'],['diprosone','betamethasone'],
    ['lamisil','terbinafine'],['aftagel','lidocaine aphtes'],['lasilix','furosemide'],['cardensiel','bisoprolol'],['zyloric','allopurinol'],
    ['fosamax','alendronate'],['spiriva','tiotropium'],['keppra','levetiracetam'],['modopar','levodopa'],['nicopatch','nicotine']
  ];
  var CHAMPS = [['tt',4],['mm',3],['rr',1.5],['xx',1]];

  function lev(a, b, max){
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var p = [], i, j;
    for (j = 0; j <= b.length; j++) p[j] = j;
    for (i = 1; i <= a.length; i++){
      var c = [i], m = i;
      for (j = 1; j <= b.length; j++){
        c[j] = Math.min(p[j] + 1, c[j-1] + 1, p[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
        if (c[j] < m) m = c[j];
      }
      if (m > max) return max + 1;
      p = c;
    }
    return p[b.length];
  }
  function correspond(q, w){
    if (w === q) return 1;
    if (w.indexOf(q) === 0) return q.length >= 3 ? .85 : .6;
    if (q.length >= 4 && w.indexOf(q) > 0) return .6;
    if (q.length >= 4 && w.length >= 4){
      var max = q.length >= 8 ? 2 : 1;
      if (lev(q, w.length > q.length + max ? w.slice(0, q.length + max) : w, max) <= max) return .5;
    }
    return 0;
  }
  function scoreMot(e, q){
    var best = 0;
    for (var c = 0; c < CHAMPS.length; c++){
      var ws = e[CHAMPS[c][0]], poids = CHAMPS[c][1];
      for (var k = 0; k < ws.length; k++){
        var s = correspond(q, ws[k]) * poids;
        if (s > best) best = s;
      }
    }
    return best;
  }
  // Découpe la requête en groupes : chaque groupe = un mot (ou une expression connue) + ses synonymes.
  function groupes(brut){
    var q = ' ' + mots(brut).join(' ') + ' ', gs = [];
    SYN.forEach(function(s){
      var cle = ' ' + s[0] + ' ';
      if (s[0].indexOf(' ') > -1 && q.indexOf(cle) > -1){ gs.push([s[0].split(' ').filter(function(m){return !VIDES[m];})].concat(s[1].split(' ').map(function(m){return [m];}))); q = q.replace(cle, ' '); }
    });
    q.split(' ').filter(function(m){ return m && !VIDES[m]; }).forEach(function(m){
      var alt = [[m]];
      SYN.forEach(function(s){ if (s[0] === m) s[1].split(' ').forEach(function(x){ alt.push([x]); }); });
      gs.push(alt);
    });
    return gs;
  }
  function chercher(brut){
    var gs = groupes(brut);
    if (!gs.length) return { r: [], approx: false };
    function noter(e, strict){
      var total = 0, trouves = 0;
      for (var g = 0; g < gs.length; g++){
        var best = 0;
        for (var a = 0; a < gs[g].length; a++){
          var expr = gs[g][a], s = 0, ok = true;
          for (var w = 0; w < expr.length; w++){ var v = scoreMot(e, expr[w]); if (!v) { ok = false; break; } s += v; }
          if (ok){ s = s / expr.length * (a === 0 ? 1 : .8); if (s > best) best = s; }
        }
        if (best) { total += best; trouves++; } else if (strict) return 0;
      }
      return strict ? total : total * trouves / gs.length;
    }
    var r = D.map(function(e){ return { e: e, s: noter(e, true) }; }).filter(function(x){ return x.s > 0; });
    var approx = false;
    if (!r.length){ approx = true; r = D.map(function(e){ return { e: e, s: noter(e, false) }; }).filter(function(x){ return x.s > 0; }); }
    r.sort(function(a, b){ return b.s - a.s || a.e.t.localeCompare(b.e.t, 'fr'); });
    return { r: r.map(function(x){ return x.e; }), approx: approx };
  }
  function court(s, n){ return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; }

  // Les URL de l'index sont absolues (/conseils/x/) : on les résout depuis la racine du site, où qu'il soit servi.
  var racine = new URL('../', lienPage.href), suffixe = /index\.html$/.test(lienPage.href) ? 'index.html' : '';
  function url(u){ return new URL(u.replace(/^\//, '') + suffixe, racine).href; }
  function versPage(q){ if (lienPage) location.href = lienPage.href + '?q=' + encodeURIComponent(q); }

  document.querySelectorAll('[data-recherche]').forEach(function(bloc){
    var i = bloc.querySelector('input'), l = bloc.querySelector('.resultats'), info = bloc.querySelector('.info-recherche');
    var pleinePage = bloc.getAttribute('data-recherche') === 'page', actif = -1;
    function rendre(){
      if (!D){ if (i.value.trim()) charger().then(rendre); return; }
      var q = i.value.trim(); actif = -1;
      l.innerHTML = '';
      if (!q){ l.hidden = true; if (info) info.textContent = ''; return; }
      var res = chercher(q), liste = pleinePage ? res.r : res.r.slice(0, 8);
      if (info) info.textContent = res.r.length ? (res.r.length + (res.r.length > 1 ? ' fiches' : ' fiche') + (res.approx ? ' (résultats approchés)' : '')) : '';
      if (!liste.length){
        var v = document.createElement('li'); v.className = 'vide';
        v.innerHTML = 'Aucune fiche trouvée. <a href="' + (lienProposer ? lienProposer.href : '#') + '">Proposer ce sujet</a>';
        l.appendChild(v);
      }
      if (res.approx && liste.length && !pleinePage){
        var ap = document.createElement('li'); ap.className = 'vide'; ap.textContent = 'Pas de fiche avec tous ces mots. Fiches proches :'; l.appendChild(ap);
      }
      liste.forEach(function(e){
        var li = document.createElement('li'), a = document.createElement('a'), haut = document.createElement('span'),
            p = document.createElement('span'), t = document.createElement('strong'), r = document.createElement('span');
        a.href = url(e.u); haut.className = 'ligne';
        p.className = 'pastille ' + (e.k === 'Conseil' ? 'conseil' : 'medicament'); p.textContent = e.k;
        t.textContent = e.t; r.className = 'extrait'; r.textContent = court(e.r, pleinePage ? 220 : 110);
        haut.appendChild(p); haut.appendChild(t); a.appendChild(haut); a.appendChild(r); li.appendChild(a); l.appendChild(li);
      });
      if (!pleinePage && res.r.length > liste.length){
        var tout = document.createElement('li'), lt = document.createElement('a');
        lt.className = 'voir-tout'; lt.href = '#'; lt.textContent = 'Voir les ' + res.r.length + ' résultats →';
        lt.addEventListener('click', function(ev){ ev.preventDefault(); versPage(q); });
        tout.appendChild(lt); l.appendChild(tout);
      }
      l.hidden = false;
    }
    function liens(){ return l.querySelectorAll('li > a'); }
    function marquer(k){
      var ls = liens(); if (!ls.length) return;
      actif = (k + ls.length) % ls.length;
      ls.forEach(function(a, j){ a.classList.toggle('actif', j === actif); });
      ls[actif].scrollIntoView({ block: 'nearest' });
    }
    i.addEventListener('input', rendre);
    i.addEventListener('focus', function(){ charger(); if (i.value.trim()) rendre(); });
    i.addEventListener('keydown', function(ev){
      if (ev.key === 'ArrowDown'){ ev.preventDefault(); marquer(actif + 1); }
      else if (ev.key === 'ArrowUp'){ ev.preventDefault(); marquer(actif - 1); }
      else if (ev.key === 'Enter'){
        ev.preventDefault();
        var ls = liens();
        if (actif > -1 && ls[actif]) ls[actif].click();
        else if (!pleinePage && i.value.trim()) versPage(i.value.trim());
        else if (pleinePage && ls[0]) ls[0].click();
      }
      else if (ev.key === 'Escape'){ i.value = ''; rendre(); if (!pleinePage) i.blur(); }
    });
    if (!pleinePage){
      document.addEventListener('click', function(ev){ if (!bloc.contains(ev.target)) l.hidden = true; });
    } else {
      var q0 = new URLSearchParams(location.search).get('q');
      if (q0){ i.value = q0; rendre(); }
      i.focus();
    }
  });
  document.addEventListener('keydown', function(ev){
    var t = ev.target;
    if (ev.key === '/' && !(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable))){
      var champ = document.querySelector('[data-recherche] input'); if (champ){ ev.preventDefault(); champ.focus(); }
    }
  });
})();`;

/** Script de recherche (l'index est chargé depuis /index-recherche.json) : à placer une seule fois, en fin de page. */
export function ScriptRecherche() {
  return (
    <>
      <a data-page-recherche="" href="/recherche/" hidden aria-hidden="true" tabIndex={-1} />
      <a data-page-proposer="" href="/proposer/" hidden aria-hidden="true" tabIndex={-1} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}

/** Champ de recherche. variante : « entete » (barre en haut de chaque page), « accueil » ou « page » (page /recherche). */
export default function Recherche({ variante = "accueil" }: { variante?: "entete" | "accueil" | "page" }) {
  const id = `champ-recherche-${variante}`;
  return (
    <div className={`recherche recherche-${variante}`} role="search" data-recherche={variante}>
      <label htmlFor={id} className="sr-only">
        Rechercher une fiche par mot-clé
      </label>
      <span className="loupe" aria-hidden="true" />
      <input
        id={id}
        type="search"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        placeholder={variante === "entete" ? "Rechercher une fiche…  ( / )" : "Symptôme, pathologie, DCI ou nom commercial : toux, Doliprane, cystite…"}
      />
      {variante === "page" && <p className="info-recherche" aria-live="polite" />}
      <ul className="resultats" hidden={variante !== "page"} />
    </div>
  );
}
