"use client";

import { useState } from "react";
import { AuthRepository } from "@/services/repositories/auth.repository";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await AuthRepository.signIn(email, password);
      // AuthProvider will handle the redirect to / automatically.
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-bold text-secondary uppercase tracking-wider">Email</label>
        <input 
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:outline-none focus:border-purple-500 transition-colors"
          placeholder="commander@ascend.ai"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider">Password</label>
          <Link href="/forgot-password" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
            Forgot?
          </Link>
        </div>
        <input 
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:outline-none focus:border-purple-500 transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary text-primary-foreground font-bold rounded-lg p-3 flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : "Initiate Sequence"}
      </button>

      <div className="text-center mt-6">
        <span className="text-xs text-secondary">Don't have an account? </span>
        <Link href="/signup" className="text-xs font-bold text-primary hover:text-purple-400 transition-colors">
          Join Protocol
        </Link>
      </div>
    </form>
  );
}
