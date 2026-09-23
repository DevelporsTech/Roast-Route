import React, { useEffect, useState } from 'react';
import { Order } from '../../types';
import { X, CheckCircle2, Clock, Coffee, Bell, Sparkles, Navigation, QrCode } from 'lucide-react';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onSendNotification: (title: string, body: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
  onSendNotification,
}) => {
  if (!order) return null;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);

  useEffect(() => {
    // Step 1 -> 2: Brewing after 7s
    const t1 = setTimeout(() => {
      setCurrentStep(2);
      onSendNotification(
        'Roast & Route: Brew in Progress ☕',
        `Your barista at ${order.storeName} is grinding single-origin beans and steaming microfoam!`
      );
    }, 7000);

    // Step 2 -> 3: Finishing pour after 16s
    const t2 = setTimeout(() => {
      setCurrentStep(3);
    }, 16000);

    // Step 3 -> 4: Ready for pickup after 24s
    const t3 = setTimeout(() => {
      setCurrentStep(4);
      onSendNotification(
        'Order Ready for Pickup! 🎉',
        `Your order #${order.id} is waiting at ${order.pickupCounterCode} at ${order.storeName}!`
      );
    }, 24000);

    // Countdown interval
    const countdown = setInterval(() => {
      setSecondsRemaining((s) => Math.max(0, s - 1));
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(countdown);
    };
  }, [order.id]);

  const steps = [
    { title: 'Order Received', desc: 'Sent to espresso bar POS system' },
    { title: 'Grinding & Extraction', desc: 'Precision 28-second double shot extraction' },
    { title: 'Microfoam & Finish', desc: 'Silk oat milk textured to 140°F' },
    { title: 'Ready at Counter', desc: `Waiting at pickup bay ${order.pickupCounterCode}` },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-coffee-50 dark:bg-[#160E0A] border border-coffee-200/80 dark:border-coffee-800 shadow-2xl overflow-hidden flex flex-col p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-coffee-200/70 dark:border-coffee-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-roast-caramel dark:text-roast-amber">
                Live Order #{order.id}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h3 className="text-xl font-serif font-bold text-coffee-950 dark:text-cream-50 mt-0.5">
              {order.storeName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-coffee-100 dark:bg-coffee-900 text-coffee-700 dark:text-coffee-300 flex items-center justify-center hover:bg-coffee-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Pickup Code Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-coffee-900 to-coffee-950 dark:from-[#25150E] dark:to-[#120B08] text-white flex items-center justify-between shadow-lg border border-coffee-800">
          <div>
            <span className="text-[11px] text-cream-200/80 uppercase tracking-widest font-semibold block">
              Pickup Station Code
            </span>
            <span className="text-3xl font-extrabold tracking-wider text-roast-amber block">
              {order.pickupCounterCode}
            </span>
            <span className="text-xs text-cream-200/70 block mt-0.5">
              Show to barista or grab from curbside shelf
            </span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center">
            <QrCode className="w-10 h-10 text-cream-100" />
          </div>
        </div>

        {/* Live Brewing Progress Pipeline */}
        <div className="space-y-4 p-4 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-coffee-900 dark:text-cream-100">
              Barista Status
            </span>
            <span className="font-bold text-roast-caramel dark:text-roast-amber flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {currentStep >= 4 ? 'Ready Now!' : `~${secondsRemaining}s remaining`}
            </span>
          </div>

          <div className="space-y-3.5">
            {steps.map((step, idx) => {
              const stepNumber = idx + 1;
              const isDone = currentStep > stepNumber;
              const isCurrent = currentStep === stepNumber;

              return (
                <div key={step.title} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-roast-amber text-coffee-950 ring-4 ring-roast-amber/20 animate-pulse'
                          : 'bg-coffee-100 dark:bg-coffee-900 text-coffee-400 border border-coffee-200 dark:border-coffee-800'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNumber}
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-5 my-1 transition-colors ${
                          isDone ? 'bg-emerald-500' : 'bg-coffee-200 dark:bg-coffee-800'
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pt-0.5">
                    <h5
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-coffee-950 dark:text-cream-100'
                          : isDone
                          ? 'text-coffee-700 dark:text-coffee-300'
                          : 'text-coffee-400 dark:text-coffee-600'
                      }`}
                    >
                      {step.title}
                    </h5>
                    <p className="text-[11px] text-coffee-500 dark:text-coffee-400 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ordered Drinks Summary */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 space-y-2 text-xs">
          <span className="font-bold text-coffee-900 dark:text-cream-100 block">
            Items in This Order
          </span>
          <div className="space-y-1.5">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="flex justify-between items-center text-coffee-700 dark:text-coffee-300">
                <span className="truncate pr-2">
                  <span className="font-bold">{item.quantity}x {item.menuItem.name}</span>
                  <span className="text-[11px] text-coffee-500 ml-1">
                    ({item.customization.size}, {item.customization.milk} milk
                    {item.customization.recipientGroup === 'child' && ' • 🧒 Child Safe'}
                    {item.customization.recipientGroup === 'senior' && ' • 🧓 Over-Aged Gentle'}
                    {item.customization.recipientGroup === 'adult' && ' • 🧑 Adult'})
                  </span>
                </span>
                <span className="font-semibold text-coffee-900 dark:text-cream-100 shrink-0">
                  ${item.totalPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 font-bold text-xs shadow-md hover:opacity-90 transition-all min-h-[44px]"
        >
          {currentStep >= 4 ? 'Done / Picked Up' : 'Keep Tracking in Background'}
        </button>
      </div>
    </div>
  );
};
