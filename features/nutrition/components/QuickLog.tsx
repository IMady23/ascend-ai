"use client";

import { Plus, Camera, History } from "lucide-react";

export function QuickLog() {
  return (
    <section className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-primary mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-4 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 group">
          <Plus size={20} />
          Add Meal
        </button>
        <button className="bg-surface-elevated hover:bg-surface-elevated text-primary font-bold py-4 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 group">
          <Camera size={20} className="text-secondary group-hover:text-primary transition-colors" />
          Scan Food
        </button>
        <button className="bg-surface-elevated hover:bg-surface-elevated text-primary font-bold py-4 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 group">
          <History size={20} className="text-secondary group-hover:text-primary transition-colors" />
          History
        </button>
      </div>
    </section>
  );
}
