import React, { useState } from 'react';
import {
  CaffeineLogEntry,
  UserPreferences,
  CaffeineRecommendation
} from '../../types';
import {
  X,
  Zap,
  Moon,
  Trash2,
  Plus,
  HeartPulse,
  Clock,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';
import {
  CAFFEINE_LIMITS,
  estimateBedtimeCaffeine
} from '../../services/caffeineEngine';

interface CaffeineModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: CaffeineLogEntry[];
  preferences: UserPreferences;
  recommendation: CaffeineRecommendation;
  onAddLog: (drinkName: string, caffeineMg: number) => void;
  onRemoveLog: (id: string) => void;
  onUpdatePreferences: (newPrefs: Partial<UserPreferences>) => void;
}

export const CaffeineModal: React.FC<CaffeineModalProps> = ({
  isOpen,
  onClose,
  logs,
  preferences,
  recommendation,
  onAddLog,
  onRemoveLog,
  onUpdatePreferences,
}) => {
  const [customDrink, setCustomDrink] = useState('');
  const [customMg, setCustomMg] = useState(95);

  if (!isOpen) return null;

  const totalMg = logs.reduce((sum, item) => sum + item.caffeineMg, 0);
  const maxLimit = CAFFEINE_LIMITS[preferences.ageGroup] || 400;
  const bedtimeCaffeine = estimateBedtimeCaffeine(logs, preferences.bedtimeTarget);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDrink.trim()) return;
    onAddLog(customDrink.trim(), Number(customMg));
    setCustomDrink('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-coffee-50 dark:bg-[#160E0A] border border-coffee-200/80 dark:border-coffee-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-coffee-200/80 dark:border-coffee-800 flex items-center justify-between bg-white/80 dark:bg-coffee-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-roast-amber/20 text-roast-amber flex items-center justify-center">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-coffee-950 dark:text-cream-50">
                Daily Caffeine &amp; Sleep Tracker
              </h3>
              <p className="text-xs text-coffee-500 dark:text-coffee-400">
                Real-time metabolism, sleep impact &amp; intake wellness
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-coffee-100 dark:bg-coffee-900 text-coffee-700 dark:text-coffee-300 flex items-center justify-center hover:bg-coffee-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Metrics Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Daily Intake */}
            <div className="p-4 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800">
              <span className="text-[11px] font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wider block">
                Today's Total
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-coffee-950 dark:text-cream-50 font-mono">
                  {totalMg}
                </span>
                <span className="text-xs text-coffee-500">/ {maxLimit} mg</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-coffee-100 dark:bg-coffee-900 mt-2 overflow-hidden">
                <div
                  className="h-full bg-roast-amber rounded-full"
                  style={{ width: `${Math.min(100, (totalMg / maxLimit) * 100)}%` }}
                />
              </div>
            </div>

            {/* Estimated Bedtime Bloodstream Caffeine */}
            <div className="p-4 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800">
              <span className="text-[11px] font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wider block">
                At Bedtime ({preferences.bedtimeTarget})
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                  ~{bedtimeCaffeine}
                </span>
                <span className="text-xs text-coffee-500">mg remaining</span>
              </div>
              <span className="text-[11px] text-coffee-400 block mt-1">
                {bedtimeCaffeine < 40 ? '✅ Deep restorative sleep likely' : '⚠️ May prolong sleep latency'}
              </span>
            </div>
          </div>

          {/* User Profile & Safety Thresholds Form */}
          <div className="p-4 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 space-y-4">
            <h4 className="font-bold text-xs text-coffee-900 dark:text-cream-100 uppercase tracking-wider">
              Pacing &amp; Biology Preferences
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Age Group */}
              <div>
                <label className="text-[11px] font-semibold text-coffee-600 dark:text-coffee-400 block mb-1">
                  Age Bracket &amp; Health Guidelines
                </label>
                <select
                  value={preferences.ageGroup}
                  onChange={(e) => onUpdatePreferences({ ageGroup: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-coffee-50 dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-700 text-xs font-semibold text-coffee-900 dark:text-cream-100"
                >
                  <option value="teen">🧒 Adolescent / Teen (12–17) — 100 mg cap</option>
                  <option value="young_adult">🎓 Young Adult (18–25) — 350 mg cap</option>
                  <option value="adult">🧑 Adult (26–64) — 400 mg cap</option>
                  <option value="senior">🧓 Senior (65+) — 250 mg cap</option>
                </select>
              </div>

              {/* Bedtime Target */}
              <div>
                <label className="text-[11px] font-semibold text-coffee-600 dark:text-coffee-400 block mb-1">
                  Target Sleep / Bedtime
                </label>
                <input
                  type="time"
                  value={preferences.bedtimeTarget}
                  onChange={(e) => onUpdatePreferences({ bedtimeTarget: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-coffee-50 dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-700 text-xs font-semibold text-coffee-900 dark:text-cream-100"
                />
              </div>
            </div>

            {/* Contextual Clinical Note for Selected Age */}
            {preferences.ageGroup === 'teen' && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-950 dark:text-purple-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <span>🧒</span>
                  <span>Why the 100 mg Cap for Teens? (Pediatric Clinical Guideline)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-purple-900 dark:text-purple-300">
                  Adolescent bodies take longer to break down caffeine. Staying under 100 mg (~1 single espresso or small latte) prevents jittery spikes, protects mood stability, and safeguards the 9 hours of deep slow-wave REM sleep essential for physical growth.
                </p>
              </div>
            )}

            {preferences.ageGroup === 'senior' && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <span>🧓</span>
                  <span>Senior Circulation &amp; Stomach Pacing</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-300">
                  Capping at 250 mg supports steady blood pressure and gastrointestinal comfort while enjoying antioxidant-rich artisan brews.
                </p>
              </div>
            )}

            {/* Sensitivity Selection */}
            <div>
              <label className="text-[11px] font-semibold text-coffee-600 dark:text-coffee-400 block mb-1">
                Personal Sensitivity to Caffeine
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Fast Metabolizer', desc: 'Minimal jitters' },
                  { id: 'medium', label: 'Moderate', desc: 'Standard curve' },
                  { id: 'high', label: 'Sensitive', desc: 'Sleeps lightly' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onUpdatePreferences({ caffeineSensitivity: s.id as any })}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      preferences.caffeineSensitivity === s.id
                        ? 'border-roast-amber bg-roast-amber/15 text-coffee-950 dark:text-cream-50 font-bold'
                        : 'border-coffee-200 dark:border-coffee-800 text-coffee-700 dark:text-coffee-400'
                    }`}
                  >
                    <span className="block">{s.label}</span>
                    <span className="text-[10px] text-coffee-500 block font-normal">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Manual Quick Add Log */}
          <div className="p-4 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 space-y-3">
            <h4 className="font-bold text-xs text-coffee-900 dark:text-cream-100 uppercase tracking-wider">
              Log a Coffee or Tea
            </h4>

            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                value={customDrink}
                onChange={(e) => setCustomDrink(e.target.value)}
                placeholder="e.g. Aeropress Geisha or Chai"
                className="flex-1 px-3.5 py-2 rounded-xl bg-coffee-50 dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-700 text-xs text-coffee-900 dark:text-cream-100 placeholder:text-coffee-400 focus:outline-none"
              />
              <input
                type="number"
                value={customMg}
                onChange={(e) => setCustomMg(Number(e.target.value))}
                min="0"
                max="600"
                className="w-20 px-2 py-2 rounded-xl bg-coffee-50 dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-700 text-xs font-mono text-coffee-900 dark:text-cream-100"
                title="Caffeine in milligrams"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 text-xs font-bold shrink-0 hover:opacity-90 transition-opacity"
              >
                Log Drink
              </button>
            </form>
          </div>

          {/* Today's Logged Drinks List */}
          <div className="space-y-2.5">
            <span className="font-bold text-xs text-coffee-900 dark:text-cream-100 uppercase tracking-wider block">
              Today's Consumption History ({logs.length})
            </span>

            {logs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-coffee-950/40 border border-coffee-200/80 dark:border-coffee-800 text-center text-xs text-coffee-500">
                No drinks logged yet today. Log your morning roast to track your energy curve!
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-coffee-900 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                        ☕
                      </div>
                      <div>
                        <span className="font-bold text-coffee-950 dark:text-cream-100 block">
                          {log.drinkName}
                        </span>
                        <span className="text-[11px] text-coffee-500 dark:text-coffee-400">
                          {log.timeDisplay}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-roast-caramel dark:text-roast-amber">
                        +{log.caffeineMg} mg
                      </span>
                      <button
                        onClick={() => onRemoveLog(log.id)}
                        className="text-coffee-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Health Wellness Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-[11px] text-coffee-700 dark:text-amber-200/80 flex items-start gap-2.5 leading-relaxed">
            <Info className="w-4 h-4 text-roast-caramel shrink-0 mt-0.5" />
            <span>
              <strong>Wellness Advisory:</strong> Caffeine calculations utilize standard metabolic half-life estimates (~5.5 hrs). This provides general health guidance and is not medical advice. Individual tolerance varies based on genetic CYP1A2 activity, hydration, medications, and pregnancy.
            </span>
          </div>
        </div>

        {/* Modal Bottom Done */}
        <div className="p-4 bg-white/95 dark:bg-coffee-950/95 border-t border-coffee-200/80 dark:border-coffee-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 font-bold text-xs shadow-md hover:opacity-90 transition-all min-h-[44px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
