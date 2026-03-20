import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-dog/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-dog/8 border border-dog/15 rounded-full px-4 py-1.5 mb-8">
            <span className="text-lg">🐶</span>
            <span className="text-xs font-semibold text-dog tracking-wide uppercase">
              Your Supplement Watchdog
            </span>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl tracking-tight mb-6 leading-[0.9]">
            <span className="text-text">Stop Buying</span>
            <br />
            <span className="text-dog">Bad Supplements</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
            SuppDog sniffs out fairy-dusted formulas, hidden proprietary blends, and
            sketchy ingredients — so you don&apos;t waste money on supplements that
            don&apos;t work. Powered by clinical research and AI.
          </p>

          {/* Input cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto mb-12">
            <Link href="/grade?method=photo"
              className="group rounded-2xl border border-border bg-white p-6 text-left hover:border-dog/30 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-dog/8 flex items-center justify-center mb-4 group-hover:bg-dog/15 transition-colors text-xl">
                📸
              </div>
              <h3 className="font-bold text-text mb-1">Scan a Label</h3>
              <p className="text-sm text-text-muted">Upload a photo of the Supplement Facts</p>
            </Link>

            <Link href="/grade?method=url"
              className="group rounded-2xl border border-border bg-white p-6 text-left hover:border-dog/30 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-dog/8 flex items-center justify-center mb-4 group-hover:bg-dog/15 transition-colors text-xl">
                🔗
              </div>
              <h3 className="font-bold text-text mb-1">Paste a URL</h3>
              <p className="text-sm text-text-muted">Amazon or brand website link</p>
            </Link>

            <Link href="/supplements"
              className="group rounded-2xl border border-border bg-white p-6 text-left hover:border-dog/30 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-dog/8 flex items-center justify-center mb-4 group-hover:bg-dog/15 transition-colors text-xl">
                🏆
              </div>
              <h3 className="font-bold text-text mb-1">Leaderboard</h3>
              <p className="text-sm text-text-muted">See how top brands score</p>
            </Link>

            <Link href="/recommend"
              className="group rounded-2xl border border-border bg-white p-6 text-left hover:border-dog/30 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-dog/8 flex items-center justify-center mb-4 group-hover:bg-dog/15 transition-colors text-xl">
                🐾
              </div>
              <h3 className="font-bold text-text mb-1">Find Your Match</h3>
              <p className="text-sm text-text-muted">Tell SuppDog what you need</p>
            </Link>
          </div>

          <p className="text-xs text-text-dim max-w-lg mx-auto leading-relaxed">
            Backed by Examine.com, NIH, and PubMed research. Reviewed by a board-certified physician.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border-light">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="font-display text-3xl sm:text-4xl text-center mb-4 text-text">
            How SuppDog Works
          </h2>
          <p className="text-text-muted text-center mb-16 max-w-md mx-auto">
            Like having a friend who actually reads the research.
          </p>
          <div className="grid sm:grid-cols-4 gap-8">
            {[
              { icon: "🐾", title: "Sniff", desc: "Upload a label, paste a URL, or browse. SuppDog picks up the scent." },
              { icon: "🔬", title: "Dig", desc: "AI reads every ingredient, dose, and form — then checks it against clinical trials." },
              { icon: "🦴", title: "Fetch", desc: "Each ingredient is scored on clinical dosing, quality, and potential red flags." },
              { icon: "📋", title: "Report", desc: "Get a full breakdown with grades, warnings, and plain-English explanations." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-text mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we check */}
      <section className="border-t border-border-light bg-white">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="font-display text-3xl sm:text-4xl text-center mb-4 text-text">
            What SuppDog Checks
          </h2>
          <p className="text-text-muted text-center mb-16 max-w-lg mx-auto">
            Four categories. One score. Zero bias.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Clinical Dosing", weight: "50%", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: "⚖️",
                desc: "Is each ingredient at the dose proven to work in clinical trials? SuppDog compares every ingredient against peer-reviewed research. Below 25% = fairy dusted." },
              { title: "Transparency", weight: "20%", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: "🔍",
                desc: "Does the label tell you exactly what's inside? Proprietary blends that hide individual doses get penalized. You deserve to see what you're paying for." },
              { title: "Clean Label", weight: "20%", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: "🧹",
                desc: "SuppDog flags artificial sweeteners (sucralose, acesulfame-K), artificial colors, titanium dioxide, maltodextrin — stuff that doesn't belong in a health product." },
              { title: "Formula Intelligence", weight: "10%", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: "🧠",
                desc: "Smart formulas pair ingredients that boost each other (D3+K2, curcumin+piperine). Kitchen-sink formulas with 30+ ingredients get called out." },
            ].map((cat) => (
              <div key={cat.title} className={`rounded-2xl border ${cat.border} ${cat.bg} p-6`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-bold text-lg ${cat.color}`}>{cat.icon} {cat.title}</h3>
                  <span className="text-xs font-mono text-text-dim bg-white/60 px-2 py-1 rounded">{cat.weight}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chrome extension callout */}
      <section className="border-t border-border-light">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-6">🐶</div>
          <h2 className="font-display text-3xl sm:text-4xl mb-4 text-text">
            Get the Chrome Extension
          </h2>
          <p className="text-text-muted mb-8 max-w-lg mx-auto">
            SuppDog rides along while you shop. It automatically detects supplement
            pages and grades them on the spot — no copy-pasting needed.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/grade" className="bg-dog text-white font-bold px-8 py-3 rounded-full hover:bg-dog-bright transition-colors text-sm">
              Grade a Supplement
            </Link>
            <Link href="/supplements" className="border border-border text-text-secondary font-semibold px-8 py-3 rounded-full hover:border-dog/30 hover:text-dog transition-all text-sm">
              Browse Leaderboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
