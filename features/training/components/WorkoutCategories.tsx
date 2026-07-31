"use client";

import { WORKOUT_CATEGORIES } from "../constants";
import * as Icons from "lucide-react";

export function WorkoutCategories() {
  return (
    <section>
      <h2 className="text-xl font-bold text-primary mb-6 px-1">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {WORKOUT_CATEGORIES.map((category) => {
          // Dynamically rendering icon based on string name.
          // In a strict environment, we'd map string to components explicitly.
          const IconComponent = (Icons as any)[category.iconName] || Icons.Circle;
          
          return (
            <button 
              key={category.id}
              className="flex flex-col items-start p-5 bg-surface border border-border-subtle rounded-2xl hover:border-orange-500/50 hover:bg-surface-elevated/80 transition-all group text-left"
            >
              <div className="p-3 bg-base border border-border-subtle rounded-xl mb-4 group-hover:bg-orange-500/10 group-hover:text-orange-400 group-hover:border-orange-500/20 transition-colors">
                <IconComponent size={24} />
              </div>
              <h3 className="font-bold text-primary mb-1 group-hover:text-orange-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-secondary leading-tight">
                {category.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
