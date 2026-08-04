import { useState } from "react";
import { useQuery } from "react-query";
import { useElysiaClient } from "@/providers/Eden";
import { Layout } from "@/components/Layout";
import {
  Coins,
  Plus,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  BarChart2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Credits() {
  const elysiaClient = useElysiaClient();
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Fetch user details
  const {
    data: user,
    isLoading,
  } = useQuery("me", async () => {
    const res = await elysiaClient.auth.me.get();
    if (res.error) throw new Error("Failed to load profile");
    return res.data;
  });

  // Fetch API keys for the per-key breakdown
  const { data: apiKeysData } = useQuery("apikeys", async () => {
    const res = await elysiaClient["api-keys"].get();
    if (res.error) throw new Error("Failed to load API keys");
    return res.data;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-10 w-48 bg-zinc-900 rounded-lg animate-pulse" />
          <div className="h-48 w-full bg-zinc-900 rounded-2xl animate-pulse border border-white/5" />
        </div>
      </Layout>
    );
  }

  const currentBalance = user?.credits || 0;
  const balanceUSD = (currentBalance / 100).toFixed(2);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-white/5 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent">
            Credits & Billing
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Manage your credit balance, top up funds, and view API consumption
            metrics.
          </p>
        </div>

        {/* Main Billing Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Balance Card (Left, spanning 2 columns on medium screens) */}
          <div
            className={`md:col-span-2 bg-zinc-900/30 border rounded-2xl p-8 backdrop-blur-md flex flex-col justify-between relative overflow-hidden transition-all duration-500 ${showSuccessGlow
              ? "border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
              : "border-white/5 shadow-xl shadow-black/20"
              }`}
          >
            {/* Glowing background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-md">
                  Prepaid Account
                </span>
                <Coins
                  className={`h-5 w-5 ${showSuccessGlow ? "text-emerald-400 animate-bounce" : "text-violet-400"}`}
                />
              </div>

              <div>
                <p className="text-xs text-neutral-500 font-medium">
                  Current Balance
                </p>
                <h2 className="text-5xl font-black text-neutral-100 mt-2 tracking-tight flex items-baseline gap-2">
                  ${balanceUSD}
                  <span className="text-sm font-normal text-neutral-500 font-mono">
                    ({currentBalance.toLocaleString()} credits)
                  </span>
                </h2>
              </div>
            </div>

            {/* Top-up Action Area */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                Credits are deducted in real-time as you query models. 100
                credits equals exactly $1.00 USD in API value.
              </p>

              <Button
                onClick={() => {
                  setShowComingSoon(true);
                  setTimeout(() => setShowComingSoon(false), 4000);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 h-11 rounded-lg flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0 w-full sm:w-auto justify-center"
              >
                <Plus className="h-4.5 w-4.5" />
                Add Credits
              </Button>
            </div>

            {/* Success Message Banner */}
            {showComingSoon && (
              <div className="mt-4 p-3 rounded-lg bg-violet-950/40 border border-violet-900/50 text-violet-300 text-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Sparkles className="h-4.5 w-4.5 shrink-0 text-violet-400" />
                <span className="font-medium">
                  Payments are coming soon! You'll be able to top up your credits shortly.
                </span>
              </div>
            )}
          </div>

          {/* Quick Info Panel (Right, 1 column) */}
          <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-violet-400" />
                Billing Details
              </h3>

              <div className="space-y-3 text-xs text-neutral-400">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span>Plan Type</span>
                  <span className="text-neutral-200 font-medium">
                    Developer (Pay-as-you-go)
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span>Rate</span>
                  <span className="text-neutral-200 font-medium">
                    $0.01 / credit
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span>Currency</span>
                  <span className="text-neutral-200 font-medium">USD ($)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Status</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <a
                href="#"
                className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-all"
              >
                View full billing terms
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Credits Used Per API Key Breakdown */}
        {(() => {
          const apiKeys = (apiKeysData?.apiKeys || []).map((k) => ({
            id: k.id,
            name: k.name,
            creditsConsumed: k.creditsConsumed,
            disabled: false,
          }));
          const maxConsumed = Math.max(
            ...apiKeys.map((k) => k.creditsConsumed),
            1,
          );
          const totalConsumed = apiKeys.reduce(
            (sum, k) => sum + k.creditsConsumed,
            0,
          );

          return (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-200 flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-violet-400" />
                  Credits Used Per API Key
                </h3>
                <span className="text-xs text-neutral-500 font-mono bg-zinc-900/40 border border-white/5 px-2.5 py-1 rounded-md">
                  Total:{" "}
                  <span className="text-neutral-300 font-semibold">
                    {(totalConsumed / 100).toFixed(2)} credits
                  </span>
                </span>
              </div>

              {apiKeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/5 rounded-2xl bg-zinc-900/10 text-neutral-500">
                  <KeyRound className="h-8 w-8 mb-3 text-neutral-700" />
                  <p className="text-sm">No API keys found.</p>
                  <p className="text-xs mt-1 text-neutral-600">
                    Create an API key to start tracking usage.
                  </p>
                </div>
              ) : (
                <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 space-y-4">
                  {apiKeys
                    .slice()
                    .sort((a, b) => b.creditsConsumed - a.creditsConsumed)
                    .map((key) => {
                      const pct =
                        maxConsumed > 0
                          ? (key.creditsConsumed / maxConsumed) * 100
                          : 0;
                      const creditsUSD = (key.creditsConsumed / 100).toFixed(2);
                      const isTopConsumer =
                        key.creditsConsumed === maxConsumed &&
                        key.creditsConsumed > 0;
                      return (
                        <div key={key.id} className="space-y-1.5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`h-6 w-6 rounded flex items-center justify-center shrink-0 ${key.disabled
                                  ? "bg-neutral-800 text-neutral-500"
                                  : "bg-violet-600/10 border border-violet-500/20 text-violet-400"
                                  }`}
                              >
                                <KeyRound className="h-3 w-3" />
                              </div>
                              <span className="text-sm font-medium text-neutral-200 truncate">
                                {key.name}
                              </span>
                              {key.disabled && (
                                <span className="text-[10px] text-neutral-600 bg-neutral-800/60 border border-neutral-700/40 px-1.5 py-0.5 rounded shrink-0">
                                  disabled
                                </span>
                              )}
                              {isTopConsumer && (
                                <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded shrink-0">
                                  top consumer
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-mono text-neutral-300 shrink-0">
                              ${creditsUSD}
                              <span className="text-neutral-600 ml-1">
                                ({key.creditsConsumed.toLocaleString()} cr)
                              </span>
                            </span>
                          </div>
                          {/* Bar */}
                          <div className="h-1.5 w-full bg-zinc-800/60 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${Math.max(pct, key.creditsConsumed > 0 ? 1 : 0)}%`,
                                background:
                                  key.creditsConsumed === 0
                                    ? undefined
                                    : isTopConsumer
                                      ? "linear-gradient(90deg, #7c3aed, #a78bfa)"
                                      : "linear-gradient(90deg, #3f3f46, #71717a)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })()}

        {/* FAQ Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-neutral-200 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-neutral-500" />
            Frequently Asked Questions
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-zinc-900/15 border border-white/5 space-y-2">
              <h4 className="text-sm font-bold text-neutral-300">
                How is my credit balance consumed?
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Whenever you make a completion request through an API Key, the
                cost is calculated based on the input and output token counts
                multiplied by the specific model provider's rate. This amount is
                subtracted in real-time.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/15 border border-white/5 space-y-2">
              <h4 className="text-sm font-bold text-neutral-300">
                What happens when my credits reach $0?
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Once your balance is depleted, any requests made using your API
                keys will return a billing error. You can add more credits at
                any time to instantly restore service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
