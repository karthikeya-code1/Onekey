import { useQuery, useMutation, useQueryClient } from "react-query";
import { useElysiaClient } from "@/providers/Eden";
import { useNavigate, useLocation, Link } from "react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  KeyRound,
  Coins,
  LogOut,
  Terminal,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const elysiaClient = useElysiaClient();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch user details
  const {
    data: user,
    isLoading,
    error,
  } = useQuery(
    "me",
    async () => {
      const res = await elysiaClient.auth.me.get();
      if (res.error) {
        throw new Error("Unauthorized");
      }
      return res.data;
    },
    {
      retry: false,
      staleTime: 30000, // Cache for 30s
    },
  );

  // Handle authentication redirect
  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
      navigate("/signin");
    }
  }, [error, navigate]);

  // Sign out mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
      const res = await elysiaClient.auth["sign-out"].post();
      if (res.error) throw new Error("Signout failed");
      return res.data;
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear(); // Clear cache
      navigate("/signin");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 animate-pulse ring-1 ring-white/15">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <div className="text-neutral-400 text-sm font-medium animate-pulse">
            Loading your workspace...
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { name: "Models", path: "/dashboard", icon: LayoutDashboard },
    { name: "API Keys", path: "/apikeys", icon: KeyRound },
    { name: "Credits", path: "/credits", icon: Coins },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-neutral-100 flex flex-col md:flex-row font-sans selection:bg-violet-500/30">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-white/5 bg-zinc-900/40 backdrop-blur-xl z-20">
        {/* Logo Section */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600">
            <Terminal className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            OneKey
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                    ? "bg-violet-600/15 text-violet-400 border border-violet-500/20"
                    : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200 border border-transparent"
                  }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 transition-transform duration-200 ${isActive
                      ? "text-violet-400"
                      : "text-neutral-500 group-hover:text-neutral-300"
                    }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5 space-y-3 bg-zinc-950/20">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-500 truncate font-medium">
                Signed in as
              </p>
              <p
                className="text-sm text-neutral-200 font-semibold truncate"
                title={user.email}
              >
                {user.email}
              </p>
            </div>
          </div>

          <div className="px-2 py-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">
              Credits
            </span>
            <span className="text-sm font-bold text-violet-400">
              ${(user.credits / 100).toFixed(2)}
            </span>
          </div>

          <Button
            variant="ghost"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isLoading}
            className="w-full justify-start text-neutral-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer text-sm"
          >
            <LogOut className="h-4 w-4 mr-2.5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden h-16 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-xl border-b border-white/5 z-20">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600">
            <Terminal className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-bold text-md text-white">OneKey</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-md bg-violet-600/10 border border-violet-500/20 text-xs font-bold text-violet-400">
            ${(user.credits / 100).toFixed(2)}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-white/5 hover:text-neutral-200 transition-all"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-zinc-900/95 backdrop-blur-2xl border-b border-white/5 z-30 py-4 px-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "bg-violet-600/15 text-violet-400"
                      : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
                    }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/5 space-y-3">
            <div className="text-xs text-neutral-500">
              Signed in as{" "}
              <span className="text-neutral-300 font-medium">{user.email}</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setIsMobileMenuOpen(false);
                logoutMutation.mutate();
              }}
              disabled={logoutMutation.isLoading}
              className="w-full justify-start text-neutral-400 hover:text-red-400 hover:bg-red-500/10 h-10 px-4"
            >
              <LogOut className="h-4 w-4 mr-2.5" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-0 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
