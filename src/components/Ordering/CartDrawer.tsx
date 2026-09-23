import React, { useState } from 'react';
import { CartItem, Order, CoffeeStore } from '../../types';
import { X, Trash2, ShieldCheck, CreditCard, Sparkles, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  stores?: CoffeeStore[];
  onClose: () => void;
  onRemoveItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onOrderPlaced: (order: Order) => void;
  userPoints: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  stores,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onOrderPlaced,
  userPoints,
}) => {
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'google_pay' | 'card'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.0875; // Standard 8.75% US metro sales tax
  const tip = subtotal * (tipPercent / 100);
  const total = subtotal + tax + tip;
  const pointsToEarn = Math.round(total * 10);

  const primaryStoreName = items[0]?.storeName || 'Specialty Roastery';
  const primaryStoreId = items[0]?.storeId || 'store-1';

  const handleCheckout = () => {
    if (items.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E09F3E', '#C86D27', '#9B7153', '#F4ECE4'],
        });
      } catch {}

      const primaryStore = stores?.find((s) => s.id === primaryStoreId || s.name === primaryStoreName);
      const storeLocation = primaryStore
        ? `${primaryStore.address}, ${primaryStore.city}, ${primaryStore.state} ${primaryStore.zipCode}`
        : 'San Francisco, CA';

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      const totalItemsCount = items.reduce((s, i) => s + i.quantity, 0);

      const newOrder: Order = {
        id: `RR-${Math.floor(100000 + Math.random() * 900000)}`,
        storeId: primaryStoreId,
        storeName: primaryStoreName,
        storeLocation,
        date: dateStr,
        totalItems: totalItemsCount,
        items: [...items],
        subtotal,
        tax,
        tip,
        total,
        pointsEarned: pointsToEarn,
        status: 'placed',
        timestamp: now.toISOString(),
        placedAt: timeStr,
        estimatedPickupMinutes: 10,
        pickupCounterCode: `BAY-${Math.floor(10 + Math.random() * 90)}`,
      };

      setIsProcessing(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-coffee-50 dark:bg-[#150D09] border-l border-coffee-200/80 dark:border-coffee-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-coffee-200/80 dark:border-coffee-800 flex items-center justify-between bg-white/80 dark:bg-coffee-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-coffee-950 dark:text-cream-50">
              Mobile Order Cart
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-roast-amber/20 text-roast-amber text-xs font-bold">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-coffee-100 dark:bg-coffee-900 text-coffee-700 dark:text-coffee-300 flex items-center justify-center hover:bg-coffee-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Items & Billing Breakdown */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-coffee-100 dark:bg-coffee-900 text-coffee-400 flex items-center justify-center">
                <span className="text-3xl">☕</span>
              </div>
              <h4 className="font-bold text-base text-coffee-900 dark:text-cream-100">
                Your cart is empty
              </h4>
              <p className="text-xs text-coffee-500 dark:text-coffee-400 max-w-xs">
                Browse nearby coffee roasters and add freshly crafted pour-overs, cortados, or pastries to your order.
              </p>
            </div>
          ) : (
            <>
              {/* Pickup location notice */}
              <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-roast-caramel shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-coffee-600 dark:text-cream-200 font-semibold block truncate">
                    Curbside &amp; Counter Pickup at:
                  </span>
                  <span className="font-bold text-coffee-950 dark:text-roast-amber block truncate">
                    {primaryStoreName} (~10 min prep)
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((cartItem) => (
                  <div
                    key={cartItem.cartItemId}
                    className="p-3.5 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 flex gap-3 items-start justify-between shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-coffee-950 dark:text-cream-100 truncate">
                          {cartItem.menuItem.name}
                        </h4>
                        <span className="font-extrabold text-sm text-coffee-950 dark:text-cream-50 ml-2">
                          ${cartItem.totalPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Customization Details */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {/* Age Group Recipient Badge */}
                        {cartItem.customization.recipientGroup === 'child' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-900 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                            <span>🧒</span> For Child (Safe Temp)
                          </span>
                        )}
                        {cartItem.customization.recipientGroup === 'senior' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                            <span>🧓</span> For Over-Aged (Gentle Brew)
                          </span>
                        )}
                        {(!cartItem.customization.recipientGroup || cartItem.customization.recipientGroup === 'adult') && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-coffee-100 dark:bg-coffee-900 text-coffee-800 dark:text-coffee-300 text-[10px] font-semibold border border-coffee-200 dark:border-coffee-700">
                            <span>🧑</span> For Adult
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-coffee-500 dark:text-coffee-400 mt-1 capitalize leading-snug">
                        {cartItem.customization.size} • {cartItem.customization.milk} milk
                        {cartItem.customization.espressoShots > 0 && ` • +${cartItem.customization.espressoShots} shot`}
                        {cartItem.customization.sweetness !== 'regular' && ` • ${cartItem.customization.sweetness} sweet`}
                        {cartItem.customization.specialNotes && ` • "${cartItem.customization.specialNotes}"`}
                      </p>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-coffee-100 dark:bg-coffee-900 text-xs font-bold">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.cartItemId, -1)}
                            className="text-coffee-600 dark:text-coffee-300 hover:text-coffee-950"
                          >
                            -
                          </button>
                          <span>{cartItem.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.cartItemId, 1)}
                            className="text-coffee-600 dark:text-coffee-300 hover:text-coffee-950"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(cartItem.cartItemId)}
                          className="text-coffee-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Barista Tip Selector */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-coffee-900 dark:text-cream-100">
                    Support Local Baristas Tip
                  </span>
                  <span className="font-semibold text-roast-caramel dark:text-roast-amber">
                    ${tip.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[15, 18, 20, 0].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setTipPercent(pct)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        tipPercent === pct
                          ? 'border-roast-amber bg-roast-amber text-coffee-950'
                          : 'border-coffee-200 dark:border-coffee-800 bg-coffee-50 dark:bg-coffee-900/60 text-coffee-700 dark:text-coffee-300'
                      }`}
                    >
                      {pct === 0 ? 'No tip' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800">
                <span className="text-xs font-bold text-coffee-900 dark:text-cream-100 block">
                  Express Frictionless Payment
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-2.5 rounded-xl text-center border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-coffee-900 dark:border-white bg-coffee-900 text-white dark:bg-white dark:text-coffee-950 shadow-sm'
                        : 'border-coffee-200 dark:border-coffee-800 text-coffee-700 dark:text-coffee-300'
                    }`}
                  >
                    <span> Apple Pay</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`p-2.5 rounded-xl text-center border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'google_pay'
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-coffee-200 dark:border-coffee-800 text-coffee-700 dark:text-coffee-300'
                    }`}
                  >
                    <span>G Pay</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl text-center border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-roast-amber bg-roast-amber text-coffee-950 shadow-sm'
                        : 'border-coffee-200 dark:border-coffee-800 text-coffee-700 dark:text-coffee-300'
                    }`}
                  >
                    <span>Credit Card</span>
                  </button>
                </div>
              </div>

              {/* Loyalty Reward Earn Banner */}
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-roast-amber/15 via-roast-caramel/15 to-transparent border border-roast-amber/30 text-xs">
                <Sparkles className="w-4 h-4 text-roast-amber shrink-0" />
                <span className="text-coffee-900 dark:text-cream-100">
                  You'll earn <strong>+{pointsToEarn} Roast Points</strong> with this order!
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 text-xs border-t border-coffee-200/70 dark:border-coffee-800 text-coffee-600 dark:text-coffee-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Sales Tax (8.75%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Barista Gratuity</span>
                  <span>${tip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-coffee-950 dark:text-cream-50 pt-1.5 border-t border-coffee-200/70 dark:border-coffee-800">
                  <span>Total Due</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Checkout Action */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white/95 dark:bg-coffee-950/95 backdrop-blur-md border-t border-coffee-200/80 dark:border-coffee-800">
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full flex items-center justify-between py-3.5 px-6 rounded-2xl bg-coffee-900 dark:bg-roast-amber hover:opacity-95 active:scale-98 text-white dark:text-coffee-950 font-bold text-sm shadow-xl transition-all disabled:opacity-50 min-h-[50px]"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2 mx-auto">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Payment...</span>
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 dark:text-coffee-950" />
                    <span>Pay with {paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'google_pay' ? 'Google Pay' : 'Card'}</span>
                  </span>
                  <span className="text-base font-extrabold">${total.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
