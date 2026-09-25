import React, { useState } from 'react';
import { CaffeineRecommendation, CaffeineLogEntry, UserPreferences } from '../../types';
import {
  Zap,
  Moon,
  ChevronRight,
  Plus,
  Sparkles,
  ShieldAlert,
  HeartPulse,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Coffee,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CAFFEINE_LIMITS } from '../../services/caffeineEngine';

interface DailyCaffeineCardProps {
  recommendation: CaffeineRecommendation;
  logs: CaffeineLogEntry[];
  preferences: UserPreferences;
  onOpenCaffeineDashboard: () => void;
  onQuickLog: (drinkName: string, mg: number) => void;
  onUpdatePreferences?: (newPrefs: Partial<UserPreferences>) => void;
}

export const DailyCaffeineCard: React.FC<DailyCaffeineCardProps> = ({
  recommendation,
  logs,
  preferences,
  onOpenCaffeineDashboard,
  onQuickLog,
  onUpdatePreferences,
}) => {
  const isTeen = preferences.ageGroup === 'teen';
  const [showTeenGuide, setShowTeenGuide] = useState(isTeen);

  const currentTotal = logs.reduce((sum, item) => sum + item.caffeineMg, 0);
  const maxLimit = CAFFEINE_LIMITS[preferences.ageGroup] || 400;
  const remainingBudget = Math.max(0, maxLimit - currentTotal);
  const progressPercent = Math.min(100, Math.round((currentTotal / maxLimit) * 100));

  // Determine current pacing wellness status
  let pacingStatus: {
    label: string;
    sub: string;
    color: string;
    borderColor: string;
    bgColor: string;
    icon: React.ReactNode;
  };

  if (currentTotal === 0) {
    pacingStatus = {
      label: 'Zero Caffeine Consumed Today',
      sub: `Full safe budget of ${maxLimit} mg available`,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-950/40',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    };
  } else if (currentTotal <= maxLimit * 0.5) {
    pacingStatus = {
      label: isTeen ? 'Optimal Teen Safe Zone' : 'Balanced Wellness Pacing',
      sub: `${remainingBudget} mg remaining within healthy limits`,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-950/40',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    };
  } else if (currentTotal <= maxLimit) {
    pacingStatus = {
      label: isTeen ? 'Approaching Adolescent 100 mg Cap' : 'Moderate Intake Level',
      sub: isTeen ? 'Switch to herbal, water, or decaf drinks now' : `${remainingBudget} mg remaining today`,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-950/40',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    };
  } else {
    pacingStatus = {
      label: isTeen ? 'Adolescent Daily Limit Exceeded' : 'Daily Limit Reached',
      sub: isTeen ? 'Pediatric guidelines recommend stopping caffeine and hydrating with water' : 'Pause caffeine to protect restorative sleep',
      color: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      bgColor: 'bg-rose-950/50',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />,
    };
  }

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#2D1B13] via-[#1E110B] to-[#120B08] text-white p-5 sm:p-6 shadow-2xl border border-coffee-800/80 overflow-hidden">
      {/* Background ambient lighting accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-roast-amber/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-5">
        {/* Top Header & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-roast-amber/30 to-roast-caramel/20 border border-roast-amber/40 text-roast-amber flex items-center justify-center shadow-inner shrink-0 mt-0.5 sm:mt-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-cream-50 leading-tight">
                  Personalized Caffeine Intake
                </h2>
                {isTeen && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-[11px] font-extrabold tracking-wide uppercase">
                    Adolescent Safe Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-cream-300/80 mt-0.5">
                {isTeen
                  ? 'Safe wellness pacing for teens (Ages 12–17) • 100 mg Pediatric Max'
                  : `Safe wellness pacing for ${preferences.ageGroup.replace('_', ' ')} • ${maxLimit} mg daily cap`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowTeenGuide(!showTeenGuide)}
              aria-label="Learn about teen and adolescent caffeine safety"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-cream-100 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/5"
              title="Learn about teen & adolescent caffeine safety"
            >
              <Info className="w-3.5 h-3.5 text-roast-amber" />
              <span>{isTeen ? 'Why 100mg Cap?' : 'Safety Rules'}</span>
              {showTeenGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onOpenCaffeineDashboard}
              className="px-3 py-1.5 rounded-xl bg-roast-amber/20 hover:bg-roast-amber/30 text-roast-amber text-xs font-bold flex items-center gap-1 transition-colors border border-roast-amber/30"
            >
              <span>Log &amp; Stats</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Age Group Quick Switcher Tabs */}
        {onUpdatePreferences && (
          <div className="p-1 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'teen', label: '🧒 Teen (12–17)', cap: '100 mg Cap' },
              { id: 'young_adult', label: '🎓 Young Adult (18–25)', cap: '350 mg' },
              { id: 'adult', label: '🧑 Adult (26–64)', cap: '400 mg' },
              { id: 'senior', label: '🧓 Senior (65+)', cap: '250 mg' },
            ].map((grp) => {
              const active = preferences.ageGroup === grp.id;
              return (
                <button
                  key={grp.id}
                  onClick={() => onUpdatePreferences({ ageGroup: grp.id as any })}
                  className={`flex-1 min-w-[120px] py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center ${
                    active
                      ? 'bg-roast-amber text-coffee-950 shadow-md ring-1 ring-white/20'
                      : 'text-cream-300/70 hover:text-cream-100 hover:bg-white/5'
                  }`}
                >
                  <span className="leading-tight text-[11px]">{grp.label}</span>
                  <span className={`text-[9px] font-semibold ${active ? 'text-coffee-900' : 'text-cream-300/50'}`}>
                    {grp.cap}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Educational Explainer Panel: What "Safe Wellness Pacing for Teen" Means */}
        {showTeenGuide && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-purple-900/20 to-black/30 border border-purple-400/30 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧒</span>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-purple-100">
                    Understanding Adolescent Caffeine Pacing (Ages 12–17)
                  </h3>
                  <p className="text-[11px] text-purple-200/80">
                    Clinical standards backed by the American Academy of Pediatrics (AAP) &amp; FDA
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-400/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-200 text-[11px]">
                  <span>🛡️</span>
                  <span>100 mg Daily Cap</span>
                </div>
                <p className="text-[11px] text-purple-100/75 leading-relaxed">
                  Adolescent liver enzymes process caffeine slower. 100 mg (~1 small coffee) prevents jittery heart rates and nervousness.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-400/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-200 text-[11px]">
                  <span>🌙</span>
                  <span>Growth &amp; REM Sleep</span>
                </div>
                <p className="text-[11px] text-purple-100/75 leading-relaxed">
                  Deep slow-wave sleep triggers growth hormone release. Caffeine past 2:00 PM disrupts critical adolescent brain consolidation.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-400/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-200 text-[11px]">
                  <span>⏰</span>
                  <span>2:00 PM Curfew</span>
                </div>
                <p className="text-[11px] text-purple-100/75 leading-relaxed">
                  With a 5.5h half-life, a 65 mg drink at 2 PM leaves under 20 mg by bedtime (10:30 PM), keeping sleep healthy.
                </p>
              </div>
            </div>

            {/* Drink Equivalency Guide for Teens */}
            <div className="pt-2 border-t border-purple-400/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-purple-200/90 font-bold">What fits in the 100 mg budget?</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-200 border border-emerald-500/40">
                  ✅ Single Espresso (65mg)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-200 border border-emerald-500/40">
                  ✅ Light Black Tea (35-45mg)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-200 border border-emerald-500/40">
                  ✅ Swiss Decaf (5-8mg)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-900/60 text-rose-200 border border-rose-500/40">
                  ❌ 16oz Cold Brew (200mg+)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Consumption Pacing Progress */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-cream-100 font-bold">Today's Intake Status:</span>
              <span className="font-mono text-roast-amber font-extrabold text-sm">
                {currentTotal} mg
              </span>
              <span className="text-cream-300/60">of {maxLimit} mg safe guideline</span>
            </div>

            <div className="text-[11px] font-semibold text-cream-300/80">
              Remaining Safe Budget: <strong className="text-cream-50 font-mono">{remainingBudget} mg</strong>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent > 100
                  ? 'bg-rose-500'
                  : progressPercent > 80
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-emerald-400 via-roast-amber to-roast-caramel'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Current Pacing Status Banner */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${pacingStatus.bgColor} ${pacingStatus.borderColor}`}>
            <div className="flex items-center gap-2">
              {pacingStatus.icon}
              <div>
                <span className={`font-bold block ${pacingStatus.color}`}>{pacingStatus.label}</span>
                <span className="text-[11px] text-cream-200/80 block">{pacingStatus.sub}</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-cream-300/70 shrink-0 font-bold">
              {progressPercent}% limit used
            </span>
          </div>
        </div>

        {/* AI Calibrated Drink Recommendation */}
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-roast-amber text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {isTeen ? 'Adolescent-Calibrated Recommendation' : 'Recommended Drink Pick'}
            </span>
            <span className="text-[11px] text-cream-100 font-semibold bg-white/15 px-2.5 py-0.5 rounded-md border border-white/10">
              {recommendation.caffeineMg} mg • {recommendation.timeWindow}
            </span>
          </div>

          <div>
            <h3 className="font-serif font-bold text-base text-cream-50">
              {recommendation.drinkName}
            </h3>
            <span className="text-[11px] text-roast-amber/90 font-medium block">
              Serving: {recommendation.servingSize}
            </span>
          </div>

          <p className="text-xs text-cream-200/90 leading-relaxed bg-black/20 p-2.5 rounded-xl border border-white/5">
            {recommendation.reason}
          </p>

          <div className="flex items-center justify-between pt-1 text-[11px] text-cream-300/80 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
              <span>Target Bedtime: <strong>{preferences.bedtimeTarget}</strong></span>
            </div>
            <span className="text-indigo-200 font-semibold">
              ~{recommendation.sleepImpactHours}h metabolic clearance
            </span>
          </div>
        </div>

        {/* Quick Log Action Pill Buttons */}
        <div className="space-y-1.5 pt-1 text-xs">
          <div className="flex items-center justify-between text-[11px] text-cream-300/80">
            <span className="font-bold uppercase tracking-wider">Quick Log Coffee:</span>
            {isTeen && (
              <span className="text-purple-300 font-semibold">
                *Options flagged for adolescent 100 mg budget
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                name: 'Single Espresso',
                mg: 65,
                safeForTeen: true,
                note: 'Safe (65mg)',
              },
              {
                name: 'Oat Cortado',
                mg: 85,
                safeForTeen: true,
                note: 'Safe (85mg)',
              },
              {
                name: 'Swiss Water Decaf',
                mg: 8,
                safeForTeen: true,
                note: 'Ultra Safe (8mg)',
              },
              {
                name: 'Cold Brew / Drip',
                mg: 180,
                safeForTeen: false,
                note: isTeen ? 'Exceeds 100mg Cap' : 'High caffeine',
              },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => onQuickLog(item.name, item.mg)}
                aria-label={`Log ${item.name} with ${item.mg} milligrams of caffeine`}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between active:scale-95 ${
                  isTeen && !item.safeForTeen
                    ? 'bg-rose-950/30 border-rose-500/30 text-cream-200/70 hover:bg-rose-900/40'
                    : 'bg-white/10 hover:bg-white/20 border-white/10 text-cream-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs truncate">{item.name}</span>
                  <Plus className="w-3.5 h-3.5 text-roast-amber shrink-0" />
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="font-mono text-roast-amber font-bold">{item.mg} mg</span>
                  <span className={item.safeForTeen ? 'text-emerald-400 font-medium' : 'text-rose-400 font-semibold'}>
                    {item.note}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
