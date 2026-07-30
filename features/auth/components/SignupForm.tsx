"use client";

import { useState } from "react";
import { AuthRepository } from "@/services/repositories/auth.repository";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters, include an uppercase, a lowercase, and a number.");
      return;
    }

    setLoading(true);

    try {
      await AuthRepository.signUp(email, password);
      // AuthProvider handles redirect
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</label>
        <input 
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
          placeholder="Commander Name"
        />
      </div>

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

      <div className="space-y-1">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Password</label>
        <input 
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
          placeholder="••••••••"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Confirm Password</label>
        <input 
          type="password"
          required
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-white text-black font-bold rounded-lg p-3 flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-4"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : "Commit to Protocol"}
      </button>

      <div className="text-center mt-6">
        <span className="text-xs text-zinc-500">Already enlisted? </span>
        <Link href="/login" className="text-xs font-bold text-white hover:text-purple-400 transition-colors">
          Sign In
        </Link>
      </div>
    </form>
  );
}
