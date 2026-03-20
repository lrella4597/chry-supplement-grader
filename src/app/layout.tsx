import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grade Your Supplement | CHRY Wellness",
  description:
    "Find out if your supplement is clinically dosed or fairy dusted. Free supplement transparency grader powered by clinical research.",
  openGraph: {
    title: "Grade Your Supplement | CHRY Wellness",
    description:
      "Find out if your supplement is clinically dosed or fairy dusted.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cream text-navy antialiased">
        <header className="border-b border-cream-dark/50 bg-white/60 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-cherry">
                CHRY
              </span>
              <span className="text-sm font-medium text-navy/50">
                Supplement Grader
              </span>
            </a>
            <nav className="flex gap-6 text-sm font-medium">
              <a
                href="/grade"
                className="text-navy/70 hover:text-cherry transition-colors"
              >
                Grade
              </a>
              <a
                href="/supplements"
                className="text-navy/70 hover:text-cherry transition-colors"
              >
                Leaderboard
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-cream-dark/50 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8 text-xs text-navy/40 space-y-3">
            <p>
              *These statements have not been evaluated by the Food and Drug
              Administration. This tool is for educational purposes only and
              does not constitute medical advice. Scoring criteria are based on
              published clinical research and should not be used as a substitute
              for professional medical guidance. Consult your healthcare
              provider before starting or changing any supplement regimen.
            </p>
            <p>
              Scoring methodology developed using data from Examine.com, NIH
              Office of Dietary Supplements, PubMed clinical trials, and
              reviewed by a board-certified physician.
            </p>
            <p className="text-navy/25">
              &copy; {new Date().getFullYear()} CHRY Wellness &mdash;{" "}
              <a
                href="https://drinkchry.com"
                className="underline hover:text-cherry"
              >
                drinkchry.com
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
