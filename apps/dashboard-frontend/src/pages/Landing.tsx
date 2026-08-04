import { Link } from "react-router";
import {
  KeyRound,
  Zap,
  ShieldCheck,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: KeyRound,
    title: "Unified API Keys",
    description:
      "Manage all your AI provider keys from a single, secure dashboard. One interface for everything.",
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: Zap,
    title: "Lightning Fast Routing",
    description:
      "Intelligent request routing across providers ensures the lowest latency and highest uptime.",
    color: "from-indigo-500/20 to-indigo-600/10",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption, fine-grained access controls, and real-time threat detection.",
    color: "from-cyan-500/20 to-cyan-600/10",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Layers,
    title: "Multi-Model Access",
    description:
      "Access hundreds of the latest AI models through a single, versioned, stable endpoint.",
    color: "from-fuchsia-500/20 to-fuchsia-600/10",
    border: "border-fuchsia-500/20",
    iconColor: "text-fuchsia-400",
  },
];

/* Deterministic star positions — spread across a tall page */
const STARS = [
  { top: "3%", left: "10%", size: 2, delay: "0.0s", dur: "3.2s" },
  { top: "7%", left: "55%", size: 1.5, delay: "1.1s", dur: "4.5s" },
  { top: "10%", left: "82%", size: 2.5, delay: "0.5s", dur: "2.9s" },
  { top: "16%", left: "32%", size: 1, delay: "2.3s", dur: "3.8s" },
  { top: "22%", left: "70%", size: 2, delay: "0.8s", dur: "4.1s" },
  { top: "28%", left: "6%", size: 1.5, delay: "1.7s", dur: "3.5s" },
  { top: "33%", left: "90%", size: 3, delay: "0.3s", dur: "5.2s" },
  { top: "38%", left: "48%", size: 1, delay: "2.0s", dur: "3.0s" },
  { top: "44%", left: "22%", size: 2, delay: "1.4s", dur: "4.6s" },
  { top: "50%", left: "76%", size: 1.5, delay: "0.6s", dur: "3.3s" },
  { top: "56%", left: "15%", size: 1, delay: "2.7s", dur: "4.9s" },
  { top: "62%", left: "60%", size: 2.5, delay: "1.0s", dur: "2.8s" },
  { top: "68%", left: "38%", size: 2, delay: "0.2s", dur: "3.7s" },
  { top: "74%", left: "88%", size: 1.5, delay: "1.9s", dur: "4.2s" },
  { top: "80%", left: "4%", size: 1, delay: "0.9s", dur: "3.6s" },
  { top: "85%", left: "52%", size: 2, delay: "2.5s", dur: "4.8s" },
  { top: "90%", left: "28%", size: 1.5, delay: "1.3s", dur: "3.1s" },
  { top: "95%", left: "73%", size: 3, delay: "0.7s", dur: "5.0s" },
  { top: "20%", left: "42%", size: 1, delay: "2.1s", dur: "3.9s" },
  { top: "72%", left: "65%", size: 2, delay: "0.4s", dur: "4.3s" },
];

export function Landing() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-neutral-100 overflow-x-hidden font-sans selection:bg-violet-500/30">
      {/* ── Animated star-glow background ── */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Large nebula orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-violet-600/12 blur-[130px] animate-[orb1_9s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-1/4 -left-60 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[110px] animate-[orb2_11s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[600px] rounded-full bg-fuchsia-600/8 blur-[120px] animate-[orb3_13s_ease-in-out_infinite_alternate]" />

        {/* Medium accent orbs */}
        <div className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-violet-500/7 blur-[70px] animate-[orb2_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-1/2 right-1/4 w-56 h-56 rounded-full bg-indigo-400/7 blur-[60px] animate-[orb1_10s_ease-in-out_infinite_alternate]" />

        {/* Twinkling star points */}
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              boxShadow: `0 0 ${s.size * 3}px ${s.size}px rgba(167,139,250,0.75)`,
              animation: `twinkle ${s.dur} ease-in-out ${s.delay} infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── CSS keyframes ── */}
      <style>{`
                @keyframes twinkle {
                    0%   { opacity: 0.12; transform: scale(0.75); }
                    100% { opacity: 1;    transform: scale(1.5);  }
                }
                @keyframes orb1 {
                    0%   { transform: translateY(0px)  scale(1);    }
                    100% { transform: translateY(-45px) scale(1.08); }
                }
                @keyframes orb2 {
                    0%   { transform: translateX(0px)  scale(1);    }
                    100% { transform: translateX(35px)  scale(1.07); }
                }
                @keyframes orb3 {
                    0%   { transform: translate(0,    0)    scale(1);    }
                    100% { transform: translate(-28px,-32px) scale(1.1); }
                }
            `}</style>

      {/* ── Navbar ── */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 h-16 border-b border-white/5 backdrop-blur-md bg-zinc-950/60">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/40">
            <KeyRound className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight">
            OneKey
          </span>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            to="/signin"
            id="nav-signin-btn"
            className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-200 border border-white/10 hover:border-violet-500/40 bg-white/5 hover:bg-violet-600/10"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            id="nav-signup-btn"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 flex items-center gap-1.5"
          >
            Get Started <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          Your AI Gateway
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
          <span className="bg-gradient-to-br from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            One Key.
          </span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            Every AI Model.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base md:text-lg text-neutral-400 leading-relaxed">
          OneKey is the developer-first API gateway that gives you a single
          endpoint, unified billing, and instant access to hundreds of AI models
          — with zero vendor lock-in.
        </p>

        {/* CTA Buttons — no glow wrappers */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/signup"
            id="hero-signup-btn"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-violet-500/20"
          >
            Start for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/signin"
            id="hero-signin-btn"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 hover:border-violet-500/40 bg-white/5 hover:bg-violet-600/10 text-neutral-300 hover:text-white font-semibold text-sm transition-all duration-200"
          >
            Sign In
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Social proof strip */}
        <p className="mt-8 text-xs text-neutral-600">
          No credit card required &nbsp;·&nbsp; Free tier available
          &nbsp;·&nbsp; Cancel anytime
        </p>
      </section>

      {/* ── Features Grid ── */}
      <section className="relative z-10 px-6 md:px-12 pb-28 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Everything you need
          </h2>
          <p className="mt-3 text-neutral-500 text-sm md:text-base max-w-lg mx-auto">
            Built for developers who move fast and need reliability at scale.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${feat.color} border ${feat.border} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 cursor-default`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center bg-zinc-900/80 border ${feat.border} mb-4`}
                >
                  <Icon className={`h-5 w-5 ${feat.iconColor}`} />
                </div>
                <h3 className="text-sm font-bold text-neutral-100 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bottom CTA Banner ── */}
      <section className="relative z-10 px-6 pb-24 max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/30 via-zinc-900/80 to-indigo-900/30 p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent rounded-full" />

          <h2 className="relative text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-violet-200 to-indigo-300 bg-clip-text text-transparent">
            Ready to build?
          </h2>
          <p className="relative mt-3 text-neutral-400 text-sm max-w-md mx-auto">
            Join developers shipping faster with OneKey's unified AI API.
          </p>

          <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              id="bottom-signup-btn"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-500/20 transition-all duration-200"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/signin"
              id="bottom-signin-btn"
              className="text-sm font-medium text-neutral-400 hover:text-violet-300 transition-colors underline underline-offset-4 decoration-neutral-700 hover:decoration-violet-400"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center text-xs text-neutral-600">
        <span className="font-semibold text-neutral-500">OneKey</span>
        &nbsp;·&nbsp; Your unified AI API gateway &nbsp;·&nbsp; ©{" "}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}
