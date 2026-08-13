import { useRef } from "react";
import { useElysiaClient } from "@/providers/Eden";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, Link } from "react-router";
import {
  Mail,
  Lock,
  Terminal,
  ShieldAlert,
  CheckCircle2,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* Deterministic star positions so they don't shift on re-render */
const STARS = [
  { top: "8%", left: "14%", size: 2, delay: "0s", dur: "3.2s" },
  { top: "15%", left: "72%", size: 1.5, delay: "0.6s", dur: "4.1s" },
  { top: "22%", left: "38%", size: 2.5, delay: "1.2s", dur: "2.8s" },
  { top: "35%", left: "88%", size: 1, delay: "0.3s", dur: "3.7s" },
  { top: "42%", left: "5%", size: 2, delay: "1.8s", dur: "4.5s" },
  { top: "55%", left: "60%", size: 1.5, delay: "0.9s", dur: "3.0s" },
  { top: "63%", left: "25%", size: 3, delay: "2.1s", dur: "5.0s" },
  { top: "70%", left: "80%", size: 2, delay: "0.5s", dur: "3.5s" },
  { top: "78%", left: "48%", size: 1, delay: "1.4s", dur: "4.2s" },
  { top: "88%", left: "10%", size: 2.5, delay: "0.1s", dur: "2.9s" },
  { top: "90%", left: "90%", size: 1.5, delay: "1.7s", dur: "3.8s" },
  { top: "5%", left: "52%", size: 1, delay: "2.5s", dur: "4.8s" },
  { top: "50%", left: "33%", size: 2, delay: "0.8s", dur: "3.3s" },
  { top: "30%", left: "92%", size: 1.5, delay: "1.1s", dur: "4.0s" },
  { top: "82%", left: "65%", size: 1, delay: "2.3s", dur: "3.6s" },
];

export function Signin() {
  const emailref = useRef<HTMLInputElement>(null);
  const passwordref = useRef<HTMLInputElement>(null);
  const elysiaClient = useElysiaClient();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await elysiaClient.auth["sign-in"].post({ email, password });
      if (res.error) {
        throw new Error(res.error.value?.message || "Signin failed");
      }
      return res.data;
    },
    onSuccess: (data) => {
      if (data && "token" in data && typeof data.token === "string") {
        localStorage.setItem("token", data.token);
      }
      queryClient.invalidateQueries("me");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    },
  });

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailref.current && passwordref.current) {
      mutation.mutate({
        email: emailref.current.value,
        password: passwordref.current.value,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden p-4">
      {/* ── Animated star-glow background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large soft nebula orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-violet-600/12 blur-[120px] animate-[orb1_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] animate-[orb2_10s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-fuchsia-600/8 blur-[90px] animate-[orb3_12s_ease-in-out_infinite_alternate]" />

        {/* Medium glowing star orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-500/8 blur-[60px] animate-[orb2_7s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-indigo-400/8 blur-[50px] animate-[orb1_9s_ease-in-out_infinite_alternate]" />

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
              boxShadow: `0 0 ${s.size * 3}px ${s.size}px rgba(167,139,250,0.7)`,
              animation: `twinkle ${s.dur} ease-in-out ${s.delay} infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── CSS keyframes ── */}
      <style>{`
                @keyframes twinkle {
                    0%   { opacity: 0.15; transform: scale(0.8); }
                    100% { opacity: 1;    transform: scale(1.4); }
                }
                @keyframes orb1 {
                    0%   { transform: translateY(0px) scale(1); }
                    100% { transform: translateY(-40px) scale(1.08); }
                }
                @keyframes orb2 {
                    0%   { transform: translateX(0px) scale(1); }
                    100% { transform: translateX(30px) scale(1.06); }
                }
                @keyframes orb3 {
                    0%   { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(-25px, -30px) scale(1.1); }
                }
            `}</style>

      {/* ── Form card ── */}
      <div className="w-full max-w-md z-10 transition-all duration-300">
        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/20 mb-4 ring-1 ring-white/20">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Sign in to access your developer console
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSignin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-neutral-300"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  ref={emailref}
                  required
                  className="pl-10 bg-black/40 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-violet-500/50 focus-visible:border-violet-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-neutral-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  ref={passwordref}
                  required
                  className="pl-10 bg-black/40 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-violet-500/50 focus-visible:border-violet-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={mutation.isLoading || mutation.isSuccess}
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 border border-violet-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing In...
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </form>

          {/* Success/Error States */}
          {mutation.isError && (
            <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 text-sm flex items-start gap-2.5 animate-in fade-in-50 slide-in-from-top-1 duration-200">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{(mutation.error as Error).message}</span>
            </div>
          )}

          {mutation.isSuccess && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-sm flex items-start gap-2.5 animate-in fade-in-50 slide-in-from-top-1 duration-200">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>Authentication successful! Redirecting...</span>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-500">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-violet-400 hover:text-violet-300 font-medium hover:underline transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
