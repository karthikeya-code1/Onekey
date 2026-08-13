import { useState } from "react";
import { useQuery } from "react-query";
import { useElysiaClient } from "@/providers/Eden";
import { Layout } from "@/components/Layout";
import {
  Search,
  ExternalLink,
  Cpu,
  Building2,
  Layers,
  DollarSign,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Company {
  id: string;
  name: string;
  website?: string | null;
}

interface Model {
  id: string;
  name: string;
  slug: string;
  company: Company;
}

// Component to fetch and display providers for a selected model
function ModelProviders({ modelId }: { modelId: string }) {
  const elysiaClient = useElysiaClient();

  const { data, isLoading, error } = useQuery(
    ["model-providers", modelId],
    async () => {
      // GET /models/:id/providers
      const res = await elysiaClient.models({ id: modelId }).providers.get();
      if (res.error) {
        throw new Error("Failed to load provider mappings");
      }
      return res.data;
    },
  );

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center items-center gap-2 text-neutral-400 text-xs">
        <RefreshCw className="h-3.5 w-3.5 animate-spin text-violet-500" />
        Loading provider endpoints and pricing...
      </div>
    );
  }

  if (error || !data || data.mappings.length === 0) {
    return (
      <div className="py-4 text-xs text-neutral-500 flex items-center gap-1.5 justify-center">
        <Info className="h-4 w-4 text-neutral-600" />
        No provider mappings available for this model yet.
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
      <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Available Endpoints & Routing
      </h4>
      <div className="grid gap-2">
        {data.mappings.map((mapping) => (
          <div
            key={mapping.id}
            className="p-3 rounded-lg bg-zinc-950/60 border border-white/5 hover:border-violet-500/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            {/* Provider Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-200">
                  {mapping.providersName}
                </span>
                {mapping.providersWebsite && (
                  <a
                    href={mapping.providersWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="text-[10px] text-neutral-500">
                Endpoint ID: {mapping.providerId}
              </div>
            </div>

            {/* Pricing cost details */}
            <div className="flex gap-4 shrink-0">
              <div className="bg-violet-950/20 border border-violet-900/30 px-2.5 py-1 rounded text-violet-400 font-medium">
                <div className="text-[9px] text-neutral-500 font-normal">
                  Per 1M tokens
                </div>
                <span>{(mapping.costPer1MTokens / 100).toFixed(2)} credits</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Dashboard() {
  const elysiaClient = useElysiaClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);

  // Fetch models directory
  const { data, isLoading, error } = useQuery("models", async () => {
    const res = await elysiaClient.models.get();
    if (res.error) {
      throw new Error("Failed to load models");
    }
    return res.data;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-10 w-48 bg-zinc-900 rounded-lg animate-pulse" />
          <div className="h-12 w-full bg-zinc-900 rounded-lg animate-pulse" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-44 bg-zinc-900 rounded-2xl animate-pulse border border-white/5"
              />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="text-center py-12 text-red-400">
          Failed to load models list. Please try again.
        </div>
      </Layout>
    );
  }

  const models = (data?.models || []) as Model[];

  // Filter list
  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany =
      selectedCompany === "all" || model.company.name === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  // Unique companies for filter dropdown
  const companies = Array.from(new Set(models.map((m) => m.company.name)));

  // Toggle expanding model
  const toggleExpand = (modelId: string) => {
    setExpandedModelId(expandedModelId === modelId ? null : modelId);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent">
              Models Registry
            </h1>
            <p className="mt-2 text-sm text-neutral-400 max-w-2xl">
              Browse the global model catalog. Expand each model to view
              available routing endpoints, token costs, and providers.
            </p>
          </div>
        </div>

        {/* Gemini-Only Notice Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-950/20 border border-amber-500/25 backdrop-blur-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-sm select-none">
            G
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Gemini Models Only
              </span>
            </div>
            <p className="mt-1 text-xs text-amber-200/60 leading-relaxed">
              This platform currently routes exclusively through{" "}
              <span className="text-amber-300 font-semibold">Google Gemini</span>{" "}
              models. Support for OpenAI, Anthropic, and other providers is
              temporarily paused. Gemini models are fully operational and ready
              to use.
            </p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-md flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                Total Models
              </div>
              <div className="text-2xl font-bold text-neutral-100">
                {models.length}
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-md flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                Creators
              </div>
              <div className="text-2xl font-bold text-neutral-100">
                {companies.length}
              </div>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1 bg-zinc-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-md flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                Routing Type
              </div>
              <div className="text-2xl font-bold text-neutral-100">
                Multi-Provider
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 bg-zinc-900/20 p-3 rounded-xl border border-white/5 backdrop-blur-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search models by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/30 border-neutral-800 text-neutral-200 placeholder:text-neutral-500 text-sm focus-visible:ring-violet-500/50"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full h-9 bg-black/30 border border-neutral-800 rounded-md px-3 text-neutral-300 text-sm outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:border-violet-500 cursor-pointer"
            >
              <option value="all">All Creators</option>
              {companies.map((co) => (
                <option key={co} value={co}>
                  {co}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid List */}
        {filteredModels.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 border border-dashed border-white/5 rounded-2xl bg-zinc-900/10">
            No models matched your search filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model) => {
              const isExpanded = expandedModelId === model.id;
              return (
                <div
                  key={model.id}
                  className={`bg-zinc-900/30 hover:bg-zinc-900/50 border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${isExpanded
                      ? "border-violet-500/30 shadow-lg shadow-violet-500/5 col-span-1 md:col-span-2 lg:col-span-3"
                      : "border-white/5 hover:border-white/10"
                    }`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
                          {model.company.name}
                        </span>
                        <h3 className="text-lg font-bold text-neutral-100 mt-2">
                          {model.name}
                        </h3>
                      </div>
                      {model.company.website && (
                        <a
                          href={model.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-neutral-400 hover:text-neutral-200 transition-all shrink-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <div className="mt-3 text-xs font-mono text-neutral-500 select-all bg-black/20 px-2 py-1 rounded border border-white/5 inline-block">
                      {model.slug}
                    </div>
                  </div>

                  {/* Action Expand Button */}
                  <div className="mt-6">
                    <Button
                      variant={isExpanded ? "outline" : "secondary"}
                      onClick={() => toggleExpand(model.id)}
                      className="w-full flex justify-between items-center text-xs h-9 px-4 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" />
                        {isExpanded
                          ? "Hide Details"
                          : "View Providers & Pricing"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Expanded Panel (Lazy Loaded Model Providers) */}
                  {isExpanded && <ModelProviders modelId={model.id} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
