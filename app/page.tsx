import Link from "next/link";
export const metadata = {
  title: "Preparis",
  description: "Kanti Appenzell – Mathe Vorbereitung",
};

export default function Home() {
  return (
    <main className="center-screen">
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '0.5rem' }}>
          Kanti Appenzell – Mathe Vorbereitung
        </h1>
        <div className="card">
          <p style={{ fontSize: '1.1rem', color: '#555' }}>
            Schritt-für-Schritt Videoerklärungen zu alten Aufnahmeprüfungen.
            Pilotprojekt für Appenzell Ausserrhoden.
          </p>
        </div>


      <div className="btn-row">
        <Link href="/exam" className="btn">Alte Prüfungen</Link>
        <Link href="/topics" className="btn">Themen</Link>
        <Link href="/about" className="btn">Über Uns</Link>
        <Link href="/about" className="btn">Kontakt</Link>
      </div>


        <p className="small">v0.1 – Skeleton build</p>
      </div>
    </main>
  );
}

