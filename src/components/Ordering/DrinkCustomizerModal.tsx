import React, { useState } from 'react';
import { MenuItem, CoffeeStore, CustomizationOptions, CartItem, RecipientAgeGroup } from '../../types';
import { toWebp } from '../../utils/imageOptimizer';
import { X, Plus, Minus, Zap, Check, Coffee, Sparkles, User, Heart, ShieldAlert } from 'lucide-react';

interface DrinkCustomizerModalProps {
  item: MenuItem | null;
  store: CoffeeStore | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const DrinkCustomizerModal: React.FC<DrinkCustomizerModalProps> = ({
  item,
  store,
  onClose,
  onAddToCart,
}) => {
  if (!item || !store) return null;

  const [recipientGroup, setRecipientGroup] = useState<RecipientAgeGroup>('adult');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [milk, setMilk] = useState<'whole' | 'oat' | 'almond' | 'breve' | 'none'>('oat');
  const [extraShots, setExtraShots] = useState<number>(0);
  const [sweetness, setSweetness] = useState<'none' | 'less' | 'regular' | 'extra'>('regular');
  const [quantity, setQuantity] = useState<number>(1);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  // Price calculations
  const sizePriceMultiplier = { small: 0, medium: 0.65, large: 1.25 };
  const milkSurcharge = milk === 'oat' || milk === 'almond' ? 0.75 : 0;
  const shotPrice = extraShots * 1.25;
  const itemUnitPrice = item.basePrice + sizePriceMultiplier[size] + milkSurcharge + shotPrice;
  const totalPrice = itemUnitPrice * quantity;

  // Caffeine calculation
  const sizeCaffeineMultiplier = { small: 0.8, medium: 1.0, large: 1.3 };
  const calculatedCaffeine = Math.round((item.caffeineMg * sizeCaffeineMultiplier[size]) + (extraShots * 65));

  const handleAdd = () => {
    const customization: CustomizationOptions = {
      size,
      milk,
      espressoShots: extraShots,
      sweetness,
      recipientGroup,
      specialNotes: specialNotes.trim() || undefined,
    };

    const cartItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}`,
      menuItem: item,
      storeId: store.id,
      storeName: store.name,
      customization,
      quantity,
      totalPrice,
    };

    onAddToCart(cartItem);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-coffee-50 dark:bg-[#160E0A] border border-coffee-200/80 dark:border-coffee-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Preview */}
        <div className="relative h-44 w-full shrink-0 bg-coffee-900">
          <img
            src={toWebp(item.image, 500, 75)}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#160E0A] via-black/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[11px] font-semibold text-roast-crema uppercase tracking-wider block">
              {store.name}
            </span>
            <h3 className="text-xl font-serif font-bold drop-shadow-sm">{item.name}</h3>
            <p className="text-xs text-cream-200/80 line-clamp-1 mt-0.5">{item.description}</p>
          </div>
        </div>

        {/* Customization Options Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Caffeine & Price Pill */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-coffee-800 dark:text-coffee-200">
              <Zap className="w-4 h-4 text-roast-amber fill-roast-amber" />
              <span>Estimated: <strong>{calculatedCaffeine} mg</strong> caffeine</span>
            </div>
            <span className="text-base font-extrabold text-coffee-950 dark:text-cream-50">
              ${itemUnitPrice.toFixed(2)}
            </span>
          </div>

          {/* QUESTION: Who is this coffee for? (Child, Adult, Over-Aged) */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-coffee-100/60 dark:bg-coffee-900/40 border border-coffee-200/90 dark:border-coffee-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-coffee-900 dark:text-cream-100 uppercase tracking-wider flex items-center gap-1.5">
                <span>Who is this coffee for?</span>
                <span className="text-roast-caramel dark:text-roast-amber font-extrabold">*</span>
              </label>
              <span className="text-[10px] font-semibold text-coffee-500 dark:text-coffee-400">
                Tailored temp &amp; brew
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'child' as const,
                  emoji: '🧒',
                  label: 'Child',
                  sub: 'Kids (Safe Temp)',
                  badge: '125°F-130°F',
                },
                {
                  id: 'adult' as const,
                  emoji: '🧑',
                  label: 'Adult',
                  sub: 'Standard Barista',
                  badge: 'Full extraction',
                },
                {
                  id: 'senior' as const,
                  emoji: '🧓',
                  label: 'Over-Aged',
                  sub: 'Senior Gentle',
                  badge: 'Low acidity',
                },
              ].map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => {
                    setRecipientGroup(grp.id);
                    if (grp.id === 'child') {
                      setExtraShots(0);
                    }
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    recipientGroup === grp.id
                      ? 'border-roast-amber bg-white dark:bg-coffee-950 text-coffee-950 dark:text-cream-50 ring-2 ring-roast-amber/40 shadow-sm'
                      : 'border-coffee-200/80 dark:border-coffee-800 bg-white/70 dark:bg-coffee-950/40 text-coffee-700 dark:text-coffee-300 hover:border-coffee-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{grp.emoji}</span>
                    {recipientGroup === grp.id && (
                      <span className="w-2 h-2 rounded-full bg-roast-amber" />
                    )}
                  </div>
                  <div className="mt-1.5">
                    <span className="font-bold text-xs block leading-tight">{grp.label}</span>
                    <span className="text-[10px] text-coffee-500 dark:text-coffee-400 block font-normal mt-0.5">
                      {grp.sub}
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold text-roast-caramel dark:text-roast-amber mt-1 block">
                    {grp.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Contextual guidance alert based on selection */}
            {recipientGroup === 'child' && (
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-200 text-[11px] flex items-start gap-2">
                <span className="text-base shrink-0">🧒</span>
                <div>
                  <strong>Child-Safe Preparation:</strong> Steamed to a warm, burn-safe temperature (~125°F-130°F), low bitterness, and no extra espresso shots.
                </div>
              </div>
            )}

            {recipientGroup === 'senior' && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-[11px] flex items-start gap-2">
                <span className="text-base shrink-0">🧓</span>
                <div>
                  <strong>Over-Aged / Senior Gentle Cup:</strong> Prepared with stomach-friendly low acidity, soothing sipping warmth, and velvety texture.
                </div>
              </div>
            )}

            {recipientGroup === 'adult' && (
              <div className="p-2 rounded-xl bg-coffee-50 dark:bg-coffee-900/30 border border-coffee-200/50 dark:border-coffee-800/50 text-coffee-600 dark:text-coffee-300 text-[10px] flex items-center gap-1.5">
                <span>🧑</span>
                <span>Standard barista profile: full roast flavor notes, specialty extraction, and standard caffeine level.</span>
              </div>
            )}
          </div>

          {/* Size Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-coffee-800 dark:text-coffee-200 uppercase tracking-wider block">
              Serving Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'small', label: 'Small', desc: '8-10 oz', price: '+$0.00' },
                { id: 'medium', label: 'Medium', desc: '12 oz', price: '+$0.65' },
                { id: 'large', label: 'Large', desc: '16 oz', price: '+$1.25' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id as any)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    size === s.id
                      ? 'border-roast-caramel dark:border-roast-amber bg-amber-50/50 dark:bg-amber-950/30 text-coffee-950 dark:text-cream-100 ring-2 ring-roast-amber/20'
                      : 'border-coffee-200/70 dark:border-coffee-800 bg-white dark:bg-coffee-950/50 text-coffee-700 dark:text-coffee-300'
                  }`}
                >
                  <span className="font-bold text-xs block">{s.label}</span>
                  <span className="text-[11px] text-coffee-500 dark:text-coffee-400 block">{s.desc}</span>
                  <span className="text-[10px] font-semibold text-roast-caramel dark:text-roast-amber block mt-1">
                    {s.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Milk Selection (for espresso/milk drinks) */}
          {item.category !== 'filter' && item.category !== 'bakery' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-coffee-800 dark:text-coffee-200 uppercase tracking-wider block">
                Milk & Plant Base
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'oat', name: 'Oat Milk (Oatly)', extra: '+$0.75' },
                  { id: 'almond', name: 'Almond Milk', extra: '+$0.75' },
                  { id: 'whole', name: 'Organic Whole', extra: 'Included' },
                  { id: 'breve', name: 'Half & Half Breve', extra: 'Included' },
                  { id: 'none', name: 'No Milk (Black)', extra: 'Included' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMilk(m.id as any)}
                    className={`p-2.5 rounded-xl text-left text-xs border transition-all ${
                      milk === m.id
                        ? 'border-roast-caramel dark:border-roast-amber bg-amber-50/50 dark:bg-amber-950/30 text-coffee-950 dark:text-cream-100 font-bold'
                        : 'border-coffee-200/70 dark:border-coffee-800 bg-white dark:bg-coffee-950/50 text-coffee-700 dark:text-coffee-300'
                    }`}
                  >
                    <span className="block truncate">{m.name}</span>
                    <span className="text-[10px] text-coffee-500 font-normal block">{m.extra}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Espresso Shots */}
          {item.category !== 'bakery' && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-coffee-950/60 border border-coffee-200/80 dark:border-coffee-800">
              <div>
                <span className="text-xs font-bold text-coffee-950 dark:text-cream-100 block">
                  Additional Espresso Shots
                </span>
                <span className="text-[11px] text-coffee-500 dark:text-coffee-400 block">
                  +$1.25 &amp; +65mg caffeine per shot
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExtraShots((s) => Math.max(0, s - 1))}
                  disabled={extraShots === 0}
                  className="w-8 h-8 rounded-full border border-coffee-300 dark:border-coffee-700 flex items-center justify-center text-coffee-800 dark:text-coffee-200 disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm min-w-[20px] text-center">{extraShots}</span>
                <button
                  onClick={() => setExtraShots((s) => Math.min(4, s + 1))}
                  className="w-8 h-8 rounded-full bg-coffee-800 dark:bg-roast-amber text-white dark:text-coffee-950 flex items-center justify-center font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Sweetness Level */}
          {item.category !== 'bakery' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-coffee-800 dark:text-coffee-200 uppercase tracking-wider block">
                Sweetness Preference
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'none', label: 'Unsweet' },
                  { id: 'less', label: 'Light' },
                  { id: 'regular', label: 'Standard' },
                  { id: 'extra', label: 'Sweet' },
                ].map((sw) => (
                  <button
                    key={sw.id}
                    onClick={() => setSweetness(sw.id as any)}
                    className={`py-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                      sweetness === sw.id
                        ? 'border-roast-amber bg-roast-amber text-coffee-950 shadow-sm'
                        : 'border-coffee-200 dark:border-coffee-800 bg-white dark:bg-coffee-950 text-coffee-700 dark:text-coffee-300'
                    }`}
                  >
                    {sw.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-coffee-800 dark:text-coffee-200 uppercase tracking-wider block">
              Barista Notes (Optional)
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Extra hot, cinnamon dust on foam..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 text-xs text-coffee-950 dark:text-cream-100 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-roast-amber"
            />
          </div>
        </div>

        {/* Modal Bottom Add Bar */}
        <div className="p-4 bg-white/95 dark:bg-coffee-950/95 backdrop-blur-md border-t border-coffee-200/80 dark:border-coffee-800 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-coffee-100 dark:bg-coffee-900 border border-coffee-200/60 dark:border-coffee-800">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-full flex items-center justify-center text-coffee-800 dark:text-coffee-200 hover:bg-coffee-200 dark:hover:bg-coffee-800 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-extrabold text-sm min-w-[16px] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-coffee-800 dark:text-coffee-200 hover:bg-coffee-200 dark:hover:bg-coffee-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Order Button */}
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-between py-3 px-5 rounded-2xl bg-coffee-900 dark:bg-roast-amber hover:opacity-90 active:scale-98 text-white dark:text-coffee-950 font-bold text-sm shadow-md transition-all min-h-[48px]"
          >
            <span>{isAdded ? 'Added to Order!' : 'Add to Order'}</span>
            <span className="font-extrabold">${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
