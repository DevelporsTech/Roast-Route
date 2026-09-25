import React from 'react';
import { ShoppingBag, Moon, Sun, User, MapPin, Sparkles, Navigation, Receipt, Map } from 'lucide-react';
import { UserProfile, CartItem } from '../types';
import { US_METRO_HUBS } from '../data/storesData';
import { toWebp } from '../utils/imageOptimizer';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  user: UserProfile;
  onOpenAuth: () => void;
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
  onDetectGps: () => void;
  isGpsActive: boolean;
  ordersCount?: number;
  onOpenOrders?: () => void;
  onGoHome?: () => void;
  onExploreMap?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  cartItems,
  onOpenCart,
  user,
  onOpenAuth,
  selectedCity,
  onSelectCity,
  onDetectGps,
  isGpsActive,
  ordersCount = 0,
  onOpenOrders,
  onGoHome,
  onExploreMap,
}) => {
  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-cream-50/90 dark:bg-[#120B08]/90 backdrop-blur-md border-b border-coffee-200/70 dark:border-coffee-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo / Home Button */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer select-none group transition-transform active:scale-95"
          role="button"
          tabIndex={0}
          title="Return to Home Page"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onGoHome?.();
            }
          }}
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-coffee-800 to-roast-amber flex items-center justify-center text-white shadow-md shadow-coffee-950/15 group-hover:scale-105 transition-transform">
            <span className="text-xl">☕</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-extrabold text-lg sm:text-xl tracking-tight text-coffee-950 dark:text-cream-50 group-hover:text-roast-amber transition-colors">
                Roast &amp; Route
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-roast-amber/20 text-roast-amber dark:text-roast-crema">
                USA
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-coffee-600 dark:text-coffee-400 block -mt-0.5 tracking-wide">
              Artisanal Coffee &amp; Real-Time Locator
            </span>
          </div>
        </div>

        {/* City Metro Hub Selector & GPS Trigger */}
        <div className="hidden lg:flex items-center gap-2 p-1 rounded-2xl bg-white/80 dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 text-xs shadow-sm">
          <button
            onClick={onDetectGps}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all min-h-[36px] ${
              isGpsActive
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100 dark:hover:bg-coffee-900'
            }`}
            title="Use current GPS location"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-500 fill-current" />
            <span>Nearby GPS</span>
          </button>

          <span className="text-coffee-300 dark:text-coffee-700">|</span>

          <div className="flex items-center gap-1 px-2">
            <MapPin className="w-3.5 h-3.5 text-roast-caramel" />
            <select
              id="desktop-metro-select"
              aria-label="Select Metro City Hub"
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent font-semibold text-coffee-900 dark:text-cream-100 focus:outline-none cursor-pointer text-xs"
            >
              {US_METRO_HUBS.map((hub) => (
                <option key={hub.name} value={hub.name} className="dark:bg-coffee-950 text-coffee-900 dark:text-cream-100">
                  {hub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls: Theme, Cart, Auth Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 text-coffee-700 dark:text-cream-200 flex items-center justify-center hover:bg-coffee-100 dark:hover:bg-coffee-900 transition-colors shadow-sm"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-coffee-800" />}
          </button>

          {/* Interactive Roastery Map Link */}
          <button
            onClick={() => {
              if (onExploreMap) {
                onExploreMap();
              } else {
                const el = document.getElementById('locator-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label="Explore Interactive Roasteries Map"
            className="hidden md:flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-white/80 dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 text-coffee-800 dark:text-cream-100 hover:bg-coffee-100 dark:hover:bg-coffee-900 transition-colors shadow-sm min-h-[40px]"
            title="Explore Interactive Roasteries Map"
          >
            <Map className="w-3.5 h-3.5 text-roast-amber" />
            <span className="text-xs font-bold">Map</span>
          </button>

          {/* Orders History Button */}
          {onOpenOrders && (
            <button
              onClick={onOpenOrders}
              aria-label="View Past Coffee Orders & Receipts"
              className="relative hidden sm:flex items-center justify-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 text-coffee-800 dark:text-cream-100 hover:bg-coffee-100 dark:hover:bg-coffee-900 transition-colors shadow-sm min-h-[40px]"
              title="View Past Coffee Orders & Receipts"
            >
              <Receipt className="w-4 h-4 text-roast-amber" />
              <span className="text-xs font-bold">Orders</span>
              {ordersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-coffee-200 dark:bg-coffee-800 text-coffee-900 dark:text-cream-100 text-[10px] font-mono font-extrabold leading-none">
                  {ordersCount}
                </span>
              )}
            </button>
          )}

          {/* Cart Icon & Badge */}
          <button
            onClick={onOpenCart}
            aria-label="Open Order Cart"
            className="relative w-10 h-10 sm:w-auto sm:px-3.5 sm:py-2 rounded-2xl bg-white/80 dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 text-coffee-800 dark:text-cream-100 flex items-center justify-center gap-2 hover:bg-coffee-100 dark:hover:bg-coffee-900 transition-colors shadow-sm min-h-[40px]"
            title="Open Order Cart"
          >
            <ShoppingBag className="w-4 h-4 text-roast-amber" />
            <span className="hidden sm:inline-block text-xs font-bold">Order</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 sm:static px-1.5 py-0.5 rounded-full bg-roast-amber text-coffee-950 text-[10px] font-extrabold leading-none animate-scale">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Profile / Rewards Pill */}
          <button
            onClick={onOpenAuth}
            aria-label={user.isLoggedIn ? `Member loyalty profile for ${user.name}` : 'Sign in to account'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-coffee-900 dark:bg-roast-amber hover:opacity-90 text-white dark:text-coffee-950 text-xs font-bold shadow-md transition-all min-h-[40px]"
          >
            {user.isLoggedIn ? (
              <>
                <img
                  src={toWebp(user.avatar, 80, 75)}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-white/50"
                  decoding="async"
                />
                <span className="hidden sm:inline-block font-mono">{user.loyaltyPoints} pts</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Header Bar: GPS & City Picker */}
      <div className="lg:hidden flex items-center justify-between gap-2 px-4 py-1.5 bg-coffee-100/70 dark:bg-coffee-950/90 border-t border-coffee-200/50 dark:border-coffee-800/60 text-xs">
        <button
          onClick={onDetectGps}
          aria-label="Calibrate GPS location"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-all min-h-[32px] ${
            isGpsActive
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
              : 'bg-white/80 dark:bg-coffee-900/80 text-coffee-700 dark:text-coffee-300 border border-coffee-200 dark:border-coffee-700'
          }`}
        >
          <Navigation className="w-3 h-3 text-blue-500 fill-current" />
          <span>{isGpsActive ? 'Live GPS' : 'Use GPS'}</span>
        </button>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/80 dark:bg-coffee-900/80 border border-coffee-200 dark:border-coffee-700">
          <MapPin className="w-3 h-3 text-roast-caramel shrink-0" />
          <select
            id="mobile-metro-select"
            aria-label="Select Metro City Hub"
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
            className="bg-transparent font-bold text-coffee-900 dark:text-cream-100 focus:outline-none cursor-pointer text-[11px] pr-1"
          >
            {US_METRO_HUBS.map((hub) => (
              <option key={hub.name} value={hub.name} className="dark:bg-coffee-950 text-coffee-900 dark:text-cream-100">
                {hub.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
