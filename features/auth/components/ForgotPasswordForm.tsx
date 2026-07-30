"use client";

import { useState } from "react";
import { AuthRepository } from "@/services/repositories/auth.repository";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await AuthRepository.resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <CheckCircle2 size={48} className="text-emerald-500" />
        <h2 className="text-xl font-bold text-white">Reset Link Sent</h2>
        <p className="text-sm text-zinc-400">
          Check your email for instructions to reset your password.
        </p>
        <Link href="/login" className="mt-4 w-full bg-zinc-900 text-white font-bold rounded-lg p-3 flex items-center justify-center hover:bg-zinc-800 transition-colors">
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</label>
        <input 
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
          placeholder="commander@ascend.ai"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-white text-black font-bold rounded-lg p-3 flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-4"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : "Send Reset Link"}
      </button>

      <div className="text-center mt-6">
        <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">
          Back to Login
        </Link>
      </div>
    </form>
  );
}
