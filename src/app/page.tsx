import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4">
        Grade Your Supplement
      </h1>
      <p className="text-xl text-navy/60 mb-12 max-w-xl mx-auto">
        Find out if your supplement is clinically dosed or{" "}
        <span className="text-cherry font-semibold">fairy dusted</span>.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-12">
        <Link
          href="/grade?method=photo"
          className="group rounded-2xl border border-cream-dark bg-white p-6 text-left hover:border-cherry/30 hover:shadow-lg transition-all"
        >
          <div className="text-3xl mb-3">📸</div>
          <h3 className="font-bold mb-1">Scan Your Label</h3>
          <p className="text-sm text-navy/50">
            Upload a photo of your Supplement Facts panel
          </p>
        </Link>
        <Link
          href="/grade?method=url"
          className="group rounded-2xl border border-cream-dark bg-white p-6 text-left hover:border-cherry/30 hover:shadow-lg transition-all"
        >
          <div className="text-3xl mb-3">🔗</div>
          <h3 className="font-bold mb-1">Paste a URL</h3>
          <p className="text-sm text-navy/50">
            Enter an Amazon or brand website link
          </p>
        </Link>
        <Link
          href="/supplements"
          className="group rounded-2xl border border-cream-dark bg-white p-6 text-left hover:border-cherry/30 hover:shadow-lg transition-all"
        >
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-bold mb-1">Popular Supplements</h3>
          <p className="text-sm text-navy/50">
            See how the top brands score
          </p>
        </Link>
      </div>

      <p className="text-xs text-navy/40 max-w-md mx-auto">
        Scoring criteria developed with clinical research from Examine.com, NIH,
        and PubMed — reviewed by a board-certified physician.
      </p>
    </div>
  );
}
