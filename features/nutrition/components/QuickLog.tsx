"use client";

import { Plus, Camera, History } from "lucide-react";

export function QuickLog() {
  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-4 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 group">
          <Plus size={20} />
          Add Meal
        </button>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 group">
          <Camera size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
          Scan Food
        </button>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 group">
          <History size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
          History
        </button>
      </div>
    </section>
  );
}
