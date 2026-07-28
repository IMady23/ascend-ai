"use client";

import { MOCK_ACHIEVEMENTS } from "../constants";
import { Trophy } from "lucide-react";

export function AchievementPanel() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Achievements</h2>
        <span className="text-sm font-semibold text-indigo-400">{MOCK_ACHIEVEMENTS.length} Unlocked</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {MOCK_ACHIEVEMENTS.map((achievement) => (
          <div 
            key={achievement.id}
            className="flex flex-col items-center text-center p-4 bg-zinc-950 border border-zinc-800/50 rounded-xl group hover:border-indigo-500/50 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Trophy className="text-indigo-400" size={24} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{achievement.title}</h4>
            <p className="text-xs text-zinc-500 leading-tight line-clamp-2">
              {achievement.description}
            </p>
          </div>
        ))}

        {/* Locked placeholders */}
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="flex flex-col items-center text-center p-4 bg-zinc-950/50 border border-zinc-800/30 rounded-xl opacity-50 grayscale"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
              <Trophy className="text-zinc-700" size={24} />
            </div>
            <h4 className="text-sm font-bold text-zinc-600 mb-1">Locked</h4>
            <p className="text-xs text-zinc-700 leading-tight">
              Keep progressing to unlock.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
