import React from 'react';
import { Home, Coffee, Map, Receipt, Zap, Award, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface BottomNavProps {
  currentTab: 'home' | 'stores' | 'map' | 'orders' | 'caffeine' | 'rewards';
  onChangeTab: (tab: 'home' | 'stores' | 'map' | 'orders' | 'caffeine' | 'rewards') => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  ordersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  cartItems,
  onOpenCart,
  ordersCount = 0,
}) => {
  const totalCart = cartItems.reduce((s, i) => s + i.quantity, 0);

  const navItems: Array<{
    id: 'home' | 'stores' | 'map' | 'orders' | 'caffeine' | 'rewards';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'stores', label: 'Roasters', icon: Coffee },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'orders', label: 'Orders', icon: Receipt, badge: ordersCount },
    { id: 'caffeine', label: 'Caffeine', icon: Zap },
    { id: 'rewards', label: 'Rewards', icon: Award },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50/95 dark:bg-[#120B08]/95 backdrop-blur-md border-t border-coffee-200/80 dark:border-coffee-800/80 px-1 py-1 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              aria-label={item.label}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-h-[48px] ${
                isActive
                  ? 'text-roast-amber dark:text-roast-amber font-bold scale-105'
                  : 'text-coffee-600 dark:text-coffee-400 hover:text-coffee-950'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.id === 'orders' && ordersCount > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-roast-amber text-coffee-950 text-[9px] font-extrabold leading-tight">
                    {ordersCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* Floating Mini Cart Trigger */}
        {totalCart > 0 && (
          <button
            onClick={onOpenCart}
            aria-label={`Open Cart with ${totalCart} items`}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-roast-caramel font-bold min-h-[48px] relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-roast-amber" />
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-roast-amber text-coffee-950 text-[9px] font-extrabold leading-tight">
                {totalCart}
              </span>
            </div>
            <span className="text-[10px]">Cart</span>
          </button>
        )}
      </div>
    </nav>
  );
};
