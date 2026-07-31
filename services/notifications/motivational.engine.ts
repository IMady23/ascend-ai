import { UserProfile, UserCustomGoals } from "@/types/user";

export type MessageCategory = "morning" | "workout" | "water" | "meal" | "sleep" | "achievement" | "weekly" | "missed_workout" | "custom";

export interface MessageContext {
  name: string;
  streak?: number;
  stepsRemaining?: number;
  caloriesRemaining?: number;
  waterRemaining?: number;
  level?: number;
  xp?: number;
}

const templates: Record<MessageCategory, string[]> = {
  morning: [
    "🌞 Good Morning, {{name}}! Every champion starts with a single decision—to get up. Today is another opportunity to become stronger than yesterday.",
    "☀️ Rise and shine, {{name}}! Your future self is built by the choices you make this morning. Let's make today count.",
    "🌅 A new day. A new chance. Don't chase motivation—build discipline. Ascend starts today.",
    "☕ Good morning! Small consistent actions create lasting results. Let's get to work, {{name}}."
  ],
  workout: [
    "💪 Your workout is waiting, {{name}}. Every rep today is an investment in tomorrow's strength.",
    "🔥 Excuses don't build muscle. Consistency does. Time to train.",
    "⚡ Future You will thank Present You. Let's begin today's workout.",
    "🏋️ The only bad workout is the one that didn't happen. Let's get moving, {{name}}!"
  ],
  water: [
    "💧 Your body is asking for water before it asks for rest. Take a sip and keep moving.",
    "🚰 Hydration fuels performance. One glass now keeps your momentum going.",
    "🧊 Keep the engine running smoothly, {{name}}. Time for some water!",
    "🌊 {{waterRemaining}}ml left to crush your daily goal. Drink up!"
  ],
  meal: [
    "🍽️ Fuel your body with purpose. Every healthy meal moves you closer to your goals.",
    "🥗 Don't just eat—recover, rebuild, and prepare for your next challenge.",
    "🍎 Nutrition is 80% of the battle, {{name}}. Let's make this meal count.",
    "🥦 Your training is only as good as your recovery. Time to refuel!"
  ],
  sleep: [
    "🌙 Recovery is part of training. Sleep isn't a reward—it's a requirement.",
    "😴 Great athletes grow while they sleep. Rest well and come back stronger tomorrow, {{name}}.",
    "🔋 Time to recharge. Tomorrow's victories are won tonight.",
    "🛌 Disconnect to reconnect. Have a great night's sleep, {{name}}."
  ],
  achievement: [
    "🎉 Incredible work, {{name}}! You've unlocked a new achievement. Keep proving to yourself what's possible.",
    "🚀 Progress isn't luck—it's consistency. Celebrate today, then aim even higher tomorrow.",
    "⭐ Level {{level}} unlocked! Your dedication is paying off. Keep ascending!"
  ],
  weekly: [
    "📈 Another week completed! Keep this momentum going, {{name}}!",
    "📊 Consistency is key. Here is your weekly summary. Let's make next week even better.",
    "🎯 Week in review: You're building habits that will last a lifetime."
  ],
  missed_workout: [
    "❤️ Missing one workout doesn't erase your progress. The next opportunity starts now. Let's get back on track.",
    "🌱 Tomorrow is another opportunity, {{name}}. Let's continue your journey.",
    "🔄 Setbacks happen. What matters is the comeback. Rest up and let's hit it next time."
  ],
  custom: [
    "🔔 Just a quick reminder, {{name}}: keep pushing forward!",
    "✨ Stay consistent. Stay strong. You've got this.",
    "🎯 Stay focused on your goals, {{name}}."
  ]
};

export class MotivationalEngine {
  static generateMessage(category: MessageCategory, context: MessageContext): { title: string, body: string } {
    const categoryTemplates = templates[category] || templates.custom;
    const randomIndex = Math.floor(Math.random() * categoryTemplates.length);
    let rawMessage = categoryTemplates[randomIndex];

    // Variable substitution
    rawMessage = rawMessage.replace(/{{name}}/g, context.name || "Commander");
    rawMessage = rawMessage.replace(/{{streak}}/g, (context.streak || 0).toString());
    
    if (context.waterRemaining) {
      rawMessage = rawMessage.replace(/{{waterRemaining}}/g, context.waterRemaining.toString());
    } else {
      rawMessage = rawMessage.replace(/{{waterRemaining}}ml left to crush your daily goal. /g, "");
    }
    
    if (context.level) {
      rawMessage = rawMessage.replace(/{{level}}/g, context.level.toString());
    }

    const titleMap: Record<MessageCategory, string> = {
      morning: "Good Morning 🌅",
      workout: "Time to Train 💪",
      water: "Hydration Reminder 💧",
      meal: "Fuel Up 🍎",
      sleep: "Time to Rest 😴",
      achievement: "Achievement Unlocked 🏆",
      weekly: "Weekly Report 📊",
      missed_workout: "Back on Track ❤️",
      custom: "Ascend AI Reminder 🔔"
    };

    return {
      title: titleMap[category],
      body: rawMessage
    };
  }

  static getCategoryForType(type: string): MessageCategory {
    switch(type) {
      case 'workout': return 'workout';
      case 'meal': return 'meal';
      case 'water': return 'water';
      case 'sleep': return 'sleep';
      case 'morning': return 'morning';
      case 'achievement': return 'achievement';
      case 'weekly': return 'weekly';
      default: return 'custom';
    }
  }
}
