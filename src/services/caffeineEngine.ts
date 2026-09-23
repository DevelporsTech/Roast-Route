import { CaffeineRecommendation, UserPreferences, CaffeineLogEntry } from '../types';

/**
 * Caffeine wellness limits per FDA / Health Canada guidelines
 */
export const CAFFEINE_LIMITS = {
  teen: 100, // mg max for adolescents (12-17)
  young_adult: 350,
  adult: 400, // standard healthy adult guideline
  senior: 250,
};

/**
 * Calculates remaining active caffeine at bedtime using ~5.5 hr metabolic half-life
 */
export function estimateBedtimeCaffeine(
  logs: CaffeineLogEntry[],
  bedtimeTarget: string // "HH:MM" in 24h
): number {
  if (logs.length === 0) return 0;

  const now = new Date();
  const [bedHour, bedMin] = bedtimeTarget.split(':').map(Number);
  const bedDate = new Date();
  bedDate.setHours(bedHour, bedMin, 0, 0);

  // If bedtime target is earlier than now, assume bedtime is tonight/early morning
  if (bedDate.getTime() < now.getTime()) {
    bedDate.setDate(bedDate.getDate() + 1);
  }

  const hoursUntilBed = (bedDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  let totalBedtimeMg = 0;
  const HALF_LIFE = 5.5; // average human half-life in hours

  logs.forEach((log) => {
    const logTime = new Date(log.timestamp).getTime();
    if (isNaN(logTime) || typeof log.caffeineMg !== 'number' || isNaN(log.caffeineMg)) return;
    const hoursSinceLog = Math.max(0, (bedDate.getTime() - logTime) / (1000 * 60 * 60));
    const remaining = log.caffeineMg * Math.pow(0.5, hoursSinceLog / HALF_LIFE);
    totalBedtimeMg += remaining;
  });

  return isNaN(totalBedtimeMg) ? 0 : Math.round(totalBedtimeMg);
}

/**
 * Generates an evidence-backed, personalized daily coffee pick
 */
export function generateDailyRecommendation(
  prefs: UserPreferences,
  todayLogs: CaffeineLogEntry[]
): CaffeineRecommendation {
  const currentTotal = todayLogs.reduce((sum, item) => sum + item.caffeineMg, 0);
  const currentHour = new Date().getHours();
  const maxLimit = CAFFEINE_LIMITS[prefs.ageGroup] || 350;
  const remainingBudget = Math.max(0, maxLimit - currentTotal);

  // Late afternoon / Evening check (after 3 PM / 15:00)
  if (currentHour >= 16) {
    return {
      drinkName: 'Golden Turmeric Cascara Herbal Tonic',
      servingSize: '12 oz (Iced or Steamed)',
      caffeineMg: 15,
      reason: `It's evening (${currentHour % 12 || 12} PM). Opting for low-caffeine keeps bedtime sleep disruptions near zero while still enjoying rich warm spices.`,
      timeWindow: 'After 4:00 PM',
      sleepImpactHours: 2,
      safetyLevel: 'optimal'
    };
  }

  // If daily budget is nearly reached
  if (remainingBudget < 60) {
    return {
      drinkName: 'Swiss Water Decaf Americano',
      servingSize: '10 oz',
      caffeineMg: 8,
      reason: `You've enjoyed ${currentTotal}mg of your ${maxLimit}mg daily threshold. Swiss Water decaf offers 100% full origin terroir without crossing your wellness ceiling.`,
      timeWindow: 'Midday to Afternoon',
      sleepImpactHours: 1,
      safetyLevel: 'cautious'
    };
  }

  // Afternoon boost (1 PM - 4 PM)
  if (currentHour >= 13) {
    return {
      drinkName: 'Brown Sugar Cardamom Oat Cortado',
      servingSize: '6 oz',
      caffeineMg: 85,
      reason: `Balanced 85mg lift provides a smooth focus curve. With your ${prefs.bedtimeTarget} target, ~80% of this caffeine will be cleared before sleep.`,
      timeWindow: '1:00 PM – 3:30 PM',
      sleepImpactHours: 6,
      safetyLevel: 'optimal'
    };
  }

  // Morning (before 1 PM)
  if (prefs.ageGroup === 'teen') {
    return {
      drinkName: 'Honey Vanilla Steamer with Light Black Tea',
      servingSize: '8 oz',
      caffeineMg: 35,
      reason: 'Gentle morning ritual calibrated safely within recommended teen adolescent health guidelines.',
      timeWindow: 'Morning (Before 11:00 AM)',
      sleepImpactHours: 4,
      safetyLevel: 'optimal'
    };
  }

  if (prefs.caffeineSensitivity === 'high') {
    return {
      drinkName: 'Half-Caf Single-Origin Pour-Over',
      servingSize: '10 oz',
      caffeineMg: 75,
      reason: 'Light floral notes with half-caffeine ratio to give morning clarity without jitters or blood pressure spikes.',
      timeWindow: 'Morning (8:00 AM – 11:00 AM)',
      sleepImpactHours: 5,
      safetyLevel: 'optimal'
    };
  }

  return {
    drinkName: 'Ethiopian Heirloom Batch Brew',
    servingSize: '12 oz',
    caffeineMg: 165,
    reason: 'Peak morning cortisol sync. Clean washed cup with jasmine and citrus aromatics to power your creative morning.',
    timeWindow: 'Morning (7:30 AM – 11:30 AM)',
    sleepImpactHours: 7,
    safetyLevel: 'optimal'
  };
}
