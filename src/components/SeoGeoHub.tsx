import React, { useState } from 'react';
import { US_METRO_HUBS } from '../data/storesData';
import { Sparkles, MapPin, HelpCircle, ChevronDown, ChevronUp, Globe2, Compass } from 'lucide-react';

interface SeoGeoHubProps {
  onSelectCity: (city: string) => void;
}

export const SeoGeoHub: React.FC<SeoGeoHubProps> = ({ onSelectCity }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Roast & Route calculate personalized daily caffeine recommendations?',
      a: 'Our wellness engine factors in your age bracket, bedtime target, caffeine sensitivity, and time-of-day cortisol cycles. Using a biological caffeine half-life curve (~5.5 hours), it suggests craft drinks that boost afternoon focus without impairing slow-wave restorative sleep.'
    },
    {
      q: 'What distinguishes third-wave specialty coffee roasters featured on the app?',
      a: 'Featured roasters roast single-origin heirloom Arabica beans sourced directly from independent farmers at ethical trade premiums. They highlight terroir notes (floral jasmine, bright citrus, stone fruit) rather than dark masking roasts, using precision pour-overs, nitro drafts, and state-of-the-art espresso extraction.'
    },
    {
      q: 'How accurate is the real-time distance and store locator?',
      a: 'Using your device’s GPS or selected US metro hub, Roast & Route calculates precise statute miles and estimates walking and driving times based on urban traffic models. Filter by open status to ensure you never walk to a closed café.'
    },
    {
      q: 'Can I order ahead and earn loyalty rewards across independent shops?',
      a: 'Yes! The Roast & Route rewards network unifies independent roasters. Earn 10 points per dollar spent with seamless Apple Pay, Google Pay, or Credit Card checkout, and redeem points for complimentary craft pour-overs anywhere in the network.'
    }
  ];

  return (
    <section className="w-full py-12 sm:py-16 bg-cream-100/60 dark:bg-[#120B08]/60 border-t border-coffee-200/80 dark:border-coffee-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* City Metro Directory for Local SEO & GEO */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-roast-amber/15 text-roast-amber text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5" />
            <span>North American Specialty Coffee Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-coffee-950 dark:text-cream-50">
            Explore Top Coffee Roasteries by City
          </h2>
          <p className="text-xs sm:text-sm text-coffee-600 dark:text-coffee-300 max-w-2xl mx-auto">
            Direct-link guides to local coffee scenes with verified barista hours, single-origin menus, and patio seating.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {US_METRO_HUBS.map((hub) => (
              <button
                key={hub.name}
                onClick={() => {
                  onSelectCity(hub.name);
                  const el = document.getElementById('locator-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label={`Filter coffee roasteries in ${hub.name}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-coffee-950/80 border border-coffee-200/80 dark:border-coffee-800 hover:border-roast-amber text-coffee-800 dark:text-cream-200 font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all min-h-[40px]"
              >
                <MapPin className="w-3.5 h-3.5 text-roast-caramel" />
                <span>{hub.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generative Engine Optimization (GEO) Knowledge FAQ */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-1 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-roast-caramel dark:text-roast-amber">
              Specialty Coffee Knowledge &amp; FAQs
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-coffee-950 dark:text-cream-50">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 overflow-hidden shadow-sm"
                >
                  <button
                    id={`faq-question-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-coffee-950 dark:text-cream-100 min-h-[44px]"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-roast-amber shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-coffee-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      className="p-4 pt-0 text-xs text-coffee-600 dark:text-coffee-300 leading-relaxed border-t border-coffee-100 dark:border-coffee-800/60 mt-1"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
