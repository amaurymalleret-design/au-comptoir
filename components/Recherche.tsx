export type EntreeIndex = { t: string; u: string; k: "Conseil" | "Médicament"; r: string; m: string };

// Recherche en JavaScript natif (sans framework) : fonctionne aussi sur l'export statique.
const script = `
(function(){
  var d = JSON.parse(document.getElementById('index-recherche').textContent);
  var i = document.getElementById('champ-recherche'), l = document.getElementById('resultats-recherche');
  function n(s){ return s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,''); }
  d.forEach(function(e){ e.x = n(e.t + ' ' + e.m + ' ' + e.r); });
  function rendre(){
    var q = n(i.value.trim());
    if (!q) { l.hidden = true; l.innerHTML=''; return; }
    var mots = q.split(/\\s+/);
    var r = d.filter(function(e){ return mots.every(function(m){ return e.x.indexOf(m) > -1; }); }).slice(0, 8);
    l.innerHTML = '';
    if (!r.length) { var v=document.createElement('li'); v.className='vide'; v.textContent='Aucune fiche. Vous pouvez la proposer.'; l.appendChild(v); }
    r.forEach(function(e){
      var li=document.createElement('li'), a=document.createElement('a'), p=document.createElement('span'), s=document.createElement('span');
      a.href=e.u; p.className='pastille '+(e.k==='Conseil'?'conseil':'medicament'); p.textContent=e.k; s.textContent=e.t;
      a.appendChild(p); a.appendChild(s); li.appendChild(a); l.appendChild(li);
    });
    l.hidden = false;
  }
  i.addEventListener('input', rendre);
  i.addEventListener('keydown', function(ev){ if(ev.key==='Escape'){ i.value=''; rendre(); } });
})();`;

export default function Recherche({ index }: { index: EntreeIndex[] }) {
  return (
    <div className="recherche" role="search">
      <label htmlFor="champ-recherche" className="sr-only" style={{ position: "absolute", left: -9999 }}>
        Rechercher une fiche
      </label>
      <input
        id="champ-recherche"
        type="search"
        autoComplete="off"
        placeholder="Rhume, amoxicilline, cystite, Doliprane…"
      />
      <ul id="resultats-recherche" className="resultats" hidden />
      <script
        id="index-recherche"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(index).replace(/</g, "\\u003c") }}
      />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </div>
  );
}
