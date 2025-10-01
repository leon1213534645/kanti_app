import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react"; // ← use this import



export const metadata = {
  title: "Prepadis",
  description: "Kanti Appenzell – Mathe Vorbereitung",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {/* Global site header */}
        <header className="site-header">
          <div className="navbar">
            {/* Logo/brand always links home */}
            <Link href="/" className="brand" aria-label="Prepadis – Home">
              Prepadis
            </Link>
          </div>
        </header>

        {/* Page-specific content */}
        {children}

      <Analytics/>
      </body>
    </html>
  );
}
