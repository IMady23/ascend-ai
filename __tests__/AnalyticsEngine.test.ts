import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsEngine } from '../lib/intelligence/AnalyticsEngine';
import { InsightRepository } from '../services/repositories/insight.repository';
import { AscendEvent } from '../types/events';

vi.mock('../services/repositories/insight.repository', () => ({
  InsightRepository: {
    getStats: vi.fn(),
    saveStats: vi.fn(),
  }
}));

describe('AnalyticsEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process a WORKOUT_COMPLETED event and update stats', async () => {
    const mockEvent: AscendEvent = {
      id: 'test-event',
      type: 'WORKOUT_COMPLETED',
      userId: 'test-user',
      timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
      metadata: { totalVolume: 1000, durationMinutes: 60 },
      processed: false
    } as AscendEvent;

    (InsightRepository.getStats as any).mockResolvedValue(null);

    await AnalyticsEngine.processEvent(mockEvent);

    expect(InsightRepository.saveStats).toHaveBeenCalledTimes(5); // Daily, Weekly, Monthly, Yearly, Lifetime
    
    // Check one of the calls to ensure stats were updated correctly
    const firstCallArgs = (InsightRepository.saveStats as any).mock.calls[0];
    const savedStats = firstCallArgs[1];
    
    expect(savedStats.metrics.workoutsCompleted).toBe(1);
    expect(savedStats.metrics.totalVolumeKg).toBe(1000);
    expect(savedStats.metrics.avgWorkoutDuration).toBe(60);
  });
});
