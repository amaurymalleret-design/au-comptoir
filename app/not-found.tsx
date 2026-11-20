export default function Introuvable() {
  return (
    <div className="conteneur etroit" style={{ padding: "48px 16px" }}>
      <h1>Fiche introuvable</h1>
      <p>Cette page n&apos;existe pas (encore). Vous pouvez la proposer.</p>
      <a className="bouton" href="/proposer/">Proposer une fiche</a>
    </div>
  );
}
