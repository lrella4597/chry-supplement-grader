import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SuppDog | Your Supplement Watchdog",
  description:
    "SuppDog sniffs out bad supplements. AI-powered grading for clinical dosing, transparency, and clean labels. Stop wasting money on fairy-dusted formulas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <header className="border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="text-2xl">🐶</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl tracking-wide text-dog">
                  SuppDog
                </span>
                <span className="text-xs font-medium text-text-dim tracking-widest uppercase">
                  by CHRY
                </span>
              </div>
            </a>
            <nav className="flex gap-1">
              <a href="/grade" className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-cream transition-all">
                Grade
              </a>
              <a href="/recommend" className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-cream transition-all">
                Find Your Match
              </a>
              <a href="/supplements" className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-cream transition-all">
                Leaderboard
              </a>
              <a href="https://drinkchry.com" target="_blank" rel="noopener noreferrer"
                className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold bg-dog text-white hover:bg-dog-bright transition-all">
                Shop CHRY
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-border mt-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl opacity-60">🐶</span>
              <span className="font-display text-lg text-text-dim">SuppDog</span>
            </div>
            <p className="text-[11px] leading-relaxed text-text-dim max-w-3xl">
              *These statements have not been evaluated by the Food and Drug
              Administration. This tool is for educational purposes only and
              does not constitute medical advice. Scoring criteria are based on
              published clinical research and should not be used as a substitute
              for professional medical guidance. Consult your healthcare
              provider before starting or changing any supplement regimen.
            </p>
            <p className="text-[11px] text-text-dim">
              Scoring methodology developed using data from Examine.com, NIH
              Office of Dietary Supplements, PubMed clinical trials, and
              reviewed by a board-certified physician.
            </p>
            <div className="pt-4 border-t border-border-light flex items-center justify-between">
              <p className="text-[11px] text-text-dim">
                &copy; {new Date().getFullYear()} SuppDog by CHRY Wellness
              </p>
              <a href="https://drinkchry.com" className="text-[11px] text-dog hover:text-dog-bright transition-colors">
                drinkchry.com
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
