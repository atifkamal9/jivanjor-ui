"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";
import { signIn } from "@/lib/auth";
import { Lock, Mail, AlertTriangle, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });
      const data = res.data?.data;
      if (data?.token) {
        signIn(email, data.token, data?.user?.permissions || data?.permissions);
        router.push("/admin");
      } else {
        setError("Could not retrieve authentication token from backend.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Failed to authenticate with backend server. Make sure the database is running.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          {/* Glowing Premium Brand Logo Container */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF0009] to-[#772571] shadow-lg shadow-red-500/30">
            <span className="text-2xl font-black text-white">JJ</span>
          </div>
          <h2 className="mt-6 text-3xl font-black text-foreground dark:text-zinc-50 font-google-sans">
            Welcome Back
          </h2>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-primary">
            Jivanjor Admin Portal
          </p>
          <p className="mt-2 text-sm text-foreground/60 dark:text-zinc-400">
            Secure access to CMS Content Management Dashboard.
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-background p-8 shadow-xl shadow-gray-200/50 dark:bg-zinc-900 dark:shadow-none border border-surface dark:border-zinc-800 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-950/30">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 dark:text-zinc-400 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-foreground/40 dark:text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@jivanjor.com"
                    className="block w-full rounded-xl border border-surface bg-surface/50 py-3 pl-10 pr-3 text-sm placeholder-foreground/30 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:border-primary dark:focus:bg-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60 dark:text-zinc-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-foreground/40 dark:text-zinc-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-surface bg-surface/50 py-3 pl-10 pr-10 text-sm placeholder-foreground/30 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:border-primary dark:focus:bg-zinc-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground/40 hover:text-foreground dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                    tabIndex={-1}

                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#FF0009] to-[#772571] py-3.5 px-4 text-sm font-bold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-50 shadow-md shadow-primary/20 hover:shadow-lg cursor-pointer"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
