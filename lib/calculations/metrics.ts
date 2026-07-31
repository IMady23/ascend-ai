export const MET_TABLE: Record<string, number> = {
  Walking: 3.5,
  Running: 9.8,
  Jogging: 7.0,
  Cycling: 7.5,
  Trekking: 7.0,
  Dancing: 5.0,
};

/**
 * Calculates calories burned during cardio.
 * @param activityType The type of activity (Walking, Running, etc.)
 * @param durationMinutes The duration of the activity in minutes
 * @param weightKg The user's weight in kg (default 70)
 * @returns Calories burned
 */
export function CalculateCardioCalories(activityType: string, durationMinutes: number, weightKg: number = 70): number {
  const met = MET_TABLE[activityType] || 5.0; // Default MET if not found
  const rawCalories = (durationMinutes * met * 3.5 * weightKg) / 200;
  return Number(rawCalories.toFixed(1));
}

/**
 * Calculates XP earned during cardio.
 * @param distanceKm Distance covered in km
 * @param durationMinutes Duration in minutes
 * @param elevationM Elevation gained in meters
 * @returns XP earned
 */
export function CalculateCardioXP(distanceKm: number = 0, durationMinutes: number = 0, elevationM: number = 0): number {
  return Math.round((distanceKm * 100) + (durationMinutes * 10) + (elevationM * 2));
}

/**
 * Calculates pace in minutes per km.
 * @param durationMinutes Duration in minutes
 * @param distanceKm Distance covered in km
 * @returns Pace in minutes per km
 */
export function CalculatePace(durationMinutes: number, distanceKm: number): number {
  if (distanceKm === 0) return 0;
  return durationMinutes / distanceKm;
}
