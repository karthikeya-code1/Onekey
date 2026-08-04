import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useElysiaClient } from "@/providers/Eden";
import { Layout } from "@/components/Layout";
import {
  KeyRound,
  Plus,
  Trash2,
  Check,
  Copy,
  ShieldAlert,
  Calendar,
  Eye,
  EyeOff,
  Sparkles,
  CircleAlert,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApiKey {
  id: string;
  name: string;
  apikey: string;
  disabled: boolean;
  lastUsed?: string | null;
  creditsConsumed: number;
}

export function Apikeys() {
  const elysiaClient = useElysiaClient();
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [createdKeyData, setCreatedKeyData] = useState<{
    id: string;
    name: string;
    apikey: string;
  } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Fetch API keys
  const { data, isLoading, error } = useQuery("apikeys", async () => {
    const res = await elysiaClient["api-keys"].get();
    if (res.error) {
      throw new Error("Failed to load API keys");
    }
    return res.data;
  });

  // Create API Key Mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await elysiaClient["api-keys"].post({ name });
      if (res.error) throw new Error("Failed to create API key");
      return res.data;
    },
    onSuccess: (newData) => {
      queryClient.invalidateQueries("apikeys");
      setCreatedKeyData({
        id: newData.id,
        name: newKeyName,
        apikey: newData.apikey,
      });
      setNewKeyName("");
      setIsCreateOpen(false);
    },
  });

  // Toggle Disable/Enable Mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ id, disabled }: { id: string; disabled: boolean }) => {
      const res = await elysiaClient["api-keys"].put({ id, disabled });
      if (res.error) throw new Error("Failed to update status");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("apikeys");
    },
  });

  // Delete API Key Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await elysiaClient["api-keys"]({ id }).delete();
      if (res.error) throw new Error("Failed to delete API key");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("apikeys");
      setConfirmDeleteId(null);
    },
  });

  // Handle Copy to Clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyName.trim()) {
      createMutation.mutate(newKeyName.trim());
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-10 w-48 bg-zinc-900 rounded-lg animate-pulse" />
          <div className="h-32 w-full bg-zinc-900 rounded-2xl animate-pulse border border-white/5" />
          <div className="h-32 w-full bg-zinc-900 rounded-2xl animate-pulse border border-white/5" />
        </div>
      </Layout>
    );
  }

  const apiKeys = (data?.apiKeys || []) as ApiKey[];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent">
              API Keys
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Create and manage authorization keys to query models from your
              applications.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg px-4 h-10 flex items-center gap-2 shadow-lg shadow-violet-500/25 cursor-pointer shrink-0"
          >
            <Plus className="h-4.5 w-4.5" />
            Create New Key
          </Button>
        </div>

        {/* Newly Created Key Modal */}
        {createdKeyData && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-violet-500/30 rounded-2xl max-w-lg w-full p-8 shadow-2xl shadow-violet-500/5 relative animate-in scale-in-95 duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/30 text-violet-400 mb-5">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-neutral-100 mb-2">
                API Key Created Successfully
              </h2>
              <p className="text-sm text-neutral-400 mb-6">
                Please copy this key and store it securely. For security
                reasons,{" "}
                <span className="text-violet-400 font-semibold">
                  you will not be able to see it again.
                </span>
              </p>

              <div className="bg-black/40 border border-neutral-800 rounded-lg p-3.5 flex items-center justify-between gap-3 font-mono text-sm text-neutral-200 select-all mb-6">
                <span className="truncate">{createdKeyData.apikey}</span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(createdKeyData.apikey, "new-key")
                  }
                  className="shrink-0 hover:bg-white/5 text-neutral-400 hover:text-white cursor-pointer"
                >
                  {copiedKeyId === "new-key" ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="p-3.5 rounded-lg bg-yellow-950/20 border border-yellow-900/30 text-yellow-500 text-xs flex items-start gap-2.5 mb-6">
                <CircleAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>
                  If you lose this key, you will need to generate a new one. Any
                  applications using the old key will stop working.
                </span>
              </div>

              <Button
                onClick={() => setCreatedKeyData(null)}
                className="w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-neutral-100 border border-neutral-700 rounded-lg cursor-pointer font-medium"
              >
                I Have Saved This Key
              </Button>
            </div>
          </div>
        )}

        {/* Create Key Input Dialog (Inline Dropdown or overlay) */}
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in scale-in-95 duration-150">
              <h2 className="text-lg font-bold text-neutral-100 mb-4">
                Create API Key
              </h2>
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-400">
                    Key Name
                  </label>
                  <Input
                    placeholder="e.g. Production Backend, Dev Laptop"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    required
                    autoFocus
                    className="bg-black/40 border-neutral-800 text-neutral-200 focus-visible:ring-violet-500/50"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 cursor-pointer border-neutral-800 hover:bg-neutral-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isLoading}
                    className="flex-1 bg-violet-600 hover:bg-violet-500 text-white cursor-pointer"
                  >
                    {createMutation.isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Generate"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* API Keys Table/Card List */}
        {apiKeys.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-zinc-900/10 flex flex-col items-center">
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-neutral-500 mb-4">
              <KeyRound className="h-6 w-6" />
            </div>
            <h3 className="text-md font-bold text-neutral-300">No API Keys</h3>
            <p className="text-sm text-neutral-500 mt-1.5 max-w-sm">
              You haven't created any API keys yet. Create a key to start
              integrating OneKey models into your code.
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="mt-5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-neutral-200 cursor-pointer text-xs"
            >
              Create your first key
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((key) => {
              const isDeleting = confirmDeleteId === key.id;
              const obfuscatedKey = `${key.apikey.slice(0, 10)}...${key.apikey.slice(-6)}`;
              // If key is disabled, show styled greyed state
              const isDisabled = (key as any).disabled;

              return (
                <div
                  key={key.id}
                  className={`p-5 rounded-2xl bg-zinc-900/25 border backdrop-blur-xs flex flex-col md:flex-row justify-between gap-4 transition-all duration-200 ${
                    isDisabled
                      ? "border-white/5 opacity-60"
                      : "border-white/5 hover:border-white/10 shadow-lg shadow-black/10"
                  }`}
                >
                  {/* Left Details */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isDisabled
                            ? "bg-neutral-800 text-neutral-500"
                            : "bg-violet-600/10 border border-violet-500/20 text-violet-400"
                        }`}
                      >
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-neutral-200 truncate">
                          {key.name}
                        </h3>
                        <div className="flex items-center gap-2.5 mt-1">
                          <span className="font-mono text-xs text-neutral-500 select-all">
                            {obfuscatedKey}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(key.apikey, key.id)}
                            className="h-6 w-6 rounded hover:bg-white/5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                            title="Copy full key"
                          >
                            {copiedKeyId === key.id ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Meta Stats Row */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-neutral-600" />
                        Last Used:{" "}
                        {key.lastUsed
                          ? new Date(key.lastUsed).toLocaleDateString()
                          : "Never"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-neutral-600" />
                        Consumed: {(key.creditsConsumed / 100).toFixed(2)}{" "}
                        credits
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {/* Toggle Active/Disabled Switch */}
                    <Button
                      variant="ghost"
                      onClick={() =>
                        toggleMutation.mutate({
                          id: key.id,
                          disabled: !isDisabled,
                        })
                      }
                      className={`hover:bg-white/5 cursor-pointer px-3 h-9 text-xs flex items-center gap-1.5 ${
                        isDisabled ? "text-neutral-500" : "text-violet-400"
                      }`}
                      title={isDisabled ? "Enable Key" : "Disable Key"}
                    >
                      {isDisabled ? (
                        <>
                          <ToggleLeft className="h-5 w-5 text-neutral-600" />
                          <span>Disabled</span>
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-5 w-5 text-violet-500" />
                          <span>Active</span>
                        </>
                      )}
                    </Button>

                    {/* Delete Action with inline confirm */}
                    {isDeleting ? (
                      <div className="flex items-center gap-1.5 bg-red-950/25 border border-red-900/40 p-1 rounded-lg animate-in slide-in-from-right-2 duration-150">
                        <span className="text-[10px] text-red-400 px-2 font-medium">
                          Delete key?
                        </span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(key.id)}
                          className="h-7 px-2.5 text-[10px] font-bold cursor-pointer"
                        >
                          Yes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmDeleteId(null)}
                          className="h-7 px-2 text-[10px] border-neutral-800 cursor-pointer"
                        >
                          No
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setConfirmDeleteId(key.id)}
                        className="hover:bg-red-500/10 text-neutral-500 hover:text-red-400 cursor-pointer h-9 w-9"
                        title="Delete Key"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
