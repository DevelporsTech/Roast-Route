import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navigation, MapPin, Coffee, Loader2, Sparkles, RefreshCw, Eye } from 'lucide-react';

const CoffeeCup3D = lazy(() =>
  import('./ThreeD/CoffeeCup3D').then((m) => ({ default: m.CoffeeCup3D }))
);

type QuickFlavor = 'latte' | 'cappuccino' | 'caramel' | 'matcha' | 'espresso';

const FLAVOR_CREMA_COLORS: Record<QuickFlavor, { base: string; crema: string; foam: string; name: string }> = {
  latte: {
    base: '#3B1B08',
    crema: 'radial-gradient(circle, #A66832 0%, #693714 50%, #220D04 100%)',
    foam: '#FAF5EC',
    name: 'Single-Origin Oat Latte'
  },
  cappuccino: {
    base: '#3D1C08',
    crema: 'radial-gradient(circle, #B37842 0%, #6C3915 55%, #220E04 100%)',
    foam: '#FFF9F0',
    name: 'Artisan Microfoam Cappuccino'
  },
  caramel: {
    base: '#4A210A',
    crema: 'radial-gradient(circle, #C27C38 0%, #8A4A1C 50%, #281005 100%)',
    foam: '#F8E9D2',
    name: 'Bourbon Caramel Macchiato'
  },
  matcha: {
    base: '#2D4E24',
    crema: 'radial-gradient(circle, #7EA672 0%, #4B7340 50%, #1E3817 100%)',
    foam: '#F0FCEB',
    name: 'Kyoto Ceremonial Matcha'
  },
  espresso: {
    base: '#2E1305',
    crema: 'radial-gradient(circle, #9E5B26 0%, #5C2D0C 50%, #160802 100%)',
    foam: '#C48148',
    name: 'Double Ristretto Crema'
  },
};

interface HeroSectionProps {
  onFindNearby: () => void;
  onExploreMap: () => void;
  openStoreCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onFindNearby,
  onExploreMap,
  openStoreCount,
}) => {
  const [show3D, setShow3D] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<QuickFlavor>('latte');

  // Progressive enhancement for desktop: defer 3D load until after initial paint & idle
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const timer = setTimeout(() => {
        setShow3D(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const currentFlavorData = FLAVOR_CREMA_COLORS[selectedFlavor];

  return (
    <section className="relative w-full pt-4 pb-8 sm:py-12 overflow-hidden">
      {/* Background ambient lighting blobs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-roast-amber/10 dark:bg-roast-amber/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-roast-caramel/10 dark:bg-roast-caramel/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & High-Speed CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-coffee-950/80 border border-coffee-200/80 dark:border-coffee-800 shadow-sm text-xs font-semibold text-coffee-800 dark:text-coffee-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{openStoreCount} Specialty Roasteries Open Now in USA</span>
              <span className="text-coffee-300 dark:text-coffee-700">|</span>
              <span className="text-roast-caramel dark:text-roast-amber font-bold">Real-Time GPS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-coffee-950 dark:text-cream-50 leading-[1.15]">
              Every Great Day Starts with the{' '}
              <span className="bg-gradient-to-r from-coffee-800 via-roast-caramel to-roast-amber bg-clip-text text-transparent dark:from-roast-crema dark:to-roast-amber">
                Perfect Pour.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-coffee-700 dark:text-coffee-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore North America’s top independent coffee roasters. Real-time distance tracking, customized caffeine intake pacing, and contactless 1-tap mobile ordering.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onFindNearby}
                aria-label="Find specialty coffee roasters near current location"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-coffee-900 dark:bg-roast-amber hover:opacity-95 text-white dark:text-coffee-950 font-bold text-sm shadow-xl shadow-coffee-950/15 active:scale-98 transition-all min-h-[52px]"
              >
                <Navigation className="w-4 h-4 fill-current" />
                <span>Find Roasters Near Me</span>
              </button>

              <button
                onClick={onExploreMap}
                aria-label="Open interactive roastery map"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/80 dark:bg-coffee-950/70 hover:bg-coffee-100 dark:hover:bg-coffee-900 border border-coffee-200/80 dark:border-coffee-800 text-coffee-900 dark:text-cream-100 font-bold text-sm shadow-sm active:scale-98 transition-all min-h-[52px]"
              >
                <MapPin className="w-4 h-4 text-roast-caramel" />
                <span>Interactive Map View</span>
              </button>
            </div>

            {/* Value Trust Markers */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-coffee-200/60 dark:border-coffee-800/60 text-left">
              <div>
                <span className="font-extrabold text-base text-coffee-950 dark:text-cream-50 block font-mono">
                  4.8★
                </span>
                <span className="text-[11px] text-coffee-600 dark:text-coffee-300 font-medium block">
                  Average shop rating
                </span>
              </div>
              <div>
                <span className="font-extrabold text-base text-coffee-950 dark:text-cream-50 block font-mono">
                  &lt; 0.5 mi
                </span>
                <span className="text-[11px] text-coffee-600 dark:text-coffee-300 font-medium block">
                  Typical walking radius
                </span>
              </div>
              <div>
                <span className="font-extrabold text-base text-coffee-950 dark:text-cream-50 block font-mono">
                  100%
                </span>
                <span className="text-[11px] text-coffee-600 dark:text-coffee-300 font-medium block">
                  Ethical direct trade
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Mobile-Optimized Artisan Brew Showcase with On-Demand 3D WebGL */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-2 rounded-3xl bg-white/50 dark:bg-coffee-950/40 backdrop-blur-xl border border-coffee-200/70 dark:border-coffee-800/60 shadow-xl h-[420px] flex flex-col items-center justify-center overflow-hidden relative">
              {show3D ? (
                <Suspense
                  fallback={
                    <div className="w-full h-full rounded-2xl bg-coffee-100/50 dark:bg-coffee-900/50 flex flex-col items-center justify-center gap-3 text-coffee-600 dark:text-coffee-300">
                      <div className="w-16 h-16 rounded-full bg-roast-amber/20 flex items-center justify-center animate-pulse">
                        <Coffee className="w-8 h-8 text-roast-amber animate-bounce" />
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-roast-amber" />
                        <span>Initializing 3D Canvas...</span>
                      </div>
                    </div>
                  }
                >
                  <CoffeeCup3D />
                </Suspense>
              ) : (
                /* High-Speed Instant Native Brew Preview (Zero JS Overhead, 100% Mobile CWV Pass) */
                <div className="w-full h-full flex flex-col items-center justify-between p-4 text-center select-none">
                  {/* Top Bar: Drink Style & Launch 3D CTA */}
                  <div className="w-full flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-coffee-900 dark:text-cream-100 truncate">
                      {currentFlavorData.name}
                    </span>
                    <button
                      onClick={() => setShow3D(true)}
                      aria-label="Launch interactive 3D WebGL coffee cup"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-coffee-900 text-white dark:bg-roast-amber dark:text-coffee-950 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-roast-amber dark:text-coffee-950" />
                      <span>Launch 3D Cup</span>
                    </button>
                  </div>

                  {/* Center: Ceramic Cup & Latte Art SVG Illustration */}
                  <div className="relative my-auto flex flex-col items-center justify-center">
                    {/* Steam Particle Effects (Lightweight CSS Animation) */}
                    <div className="flex gap-4 mb-2 pointer-events-none opacity-75">
                      <span className="w-1.5 h-6 rounded-full bg-gradient-to-t from-roast-amber/40 to-transparent animate-steam" style={{ animationDelay: '0s' }} />
                      <span className="w-1.5 h-8 rounded-full bg-gradient-to-t from-roast-amber/50 to-transparent animate-steam" style={{ animationDelay: '0.8s' }} />
                      <span className="w-1.5 h-6 rounded-full bg-gradient-to-t from-roast-amber/40 to-transparent animate-steam" style={{ animationDelay: '1.4s' }} />
                    </div>

                    {/* Saucer and Cup Stack */}
                    <div className="relative">
                      {/* Saucer */}
                      <div className="w-52 h-14 rounded-[100%] bg-gradient-to-b from-[#2E1C14] to-[#120B08] border-2 border-roast-amber/30 shadow-2xl mx-auto -mb-6" />

                      {/* Ceramic Cup Body */}
                      <div className="w-40 h-28 rounded-b-[44px] rounded-t-[10px] bg-gradient-to-b from-[#25150E] via-[#1E110A] to-[#140A06] border-2 border-roast-amber/40 shadow-xl relative overflow-hidden flex flex-col items-center justify-start p-1.5 mx-auto">
                        {/* Crema Surface with Latte Art Rosette */}
                        <div
                          className="w-36 h-14 rounded-[100%] shadow-inner flex items-center justify-center relative transition-all duration-500"
                          style={{ background: currentFlavorData.crema }}
                        >
                          {/* Latte Art Foam Heart */}
                          <div className="w-12 h-9 flex items-center justify-center drop-shadow-md">
                            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white/90 drop-shadow" aria-hidden="true">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </div>
                        </div>

                        {/* Ceramic Gloss Highlight Reflection */}
                        <div className="absolute inset-x-4 top-2 h-16 rounded-full bg-gradient-to-b from-white/10 to-transparent blur-[1px] pointer-events-none" />
                      </div>

                      {/* Cup Handle */}
                      <div className="absolute top-10 right-2 w-8 h-14 rounded-r-2xl border-4 border-[#25150E] border-l-0 shadow-md" />
                    </div>

                    <p className="text-[11px] text-coffee-600 dark:text-coffee-300 font-medium mt-3">
                      SCA 86+ Point Micro-Lot Roast
                    </p>
                  </div>

                  {/* Bottom: Fast Flavor Chips Selector & 3D Hint */}
                  <div className="w-full space-y-2">
                    <div className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-white/70 dark:bg-coffee-950/80 border border-coffee-200/70 dark:border-coffee-800 text-[11px] font-semibold">
                      {(['latte', 'cappuccino', 'caramel', 'matcha', 'espresso'] as QuickFlavor[]).map((f) => (
                        <button
                          key={f}
                          onClick={() => setSelectedFlavor(f)}
                          aria-label={`Select ${f} flavor preview`}
                          className={`py-1.5 px-1 rounded-xl capitalize transition-all ${
                            selectedFlavor === f
                              ? 'bg-coffee-900 text-white dark:bg-roast-amber dark:text-coffee-950 shadow-sm'
                              : 'text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100 dark:hover:bg-coffee-900/60'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-coffee-500 dark:text-coffee-400 px-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-roast-caramel" />
                        <span>Instant Preview</span>
                      </span>
                      <button
                        onClick={() => setShow3D(true)}
                        className="font-bold text-roast-caramel dark:text-roast-amber hover:underline flex items-center gap-1"
                      >
                        <span>Explore 360° View</span>
                        <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
