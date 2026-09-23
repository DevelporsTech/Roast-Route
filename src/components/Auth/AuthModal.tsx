import React, { useState, useEffect } from 'react';
import { UserProfile, Order, CoffeeStore } from '../../types';
import { OrderHistoryList } from '../Orders/OrderHistoryList';
import { toWebp } from '../../utils/imageOptimizer';
import {
  X,
  ShieldCheck,
  Award,
  Sparkles,
  QrCode,
  Heart,
  Clock,
  LogOut,
  Mail,
  User,
  Coffee,
  CheckCircle2,
  Receipt
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  orders: Order[];
  stores: CoffeeStore[];
  onLogin: (provider: 'google' | 'apple' | 'email', email?: string) => void;
  onLogout: () => void;
  initialTab?: 'profile' | 'loyalty' | 'orders';
  onReorder?: (order: Order) => void;
  onTrackOrder?: (order: Order) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  stores,
  onLogin,
  onLogout,
  initialTab,
  onReorder,
  onTrackOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'loyalty' | 'orders'>(initialTab || 'loyalty');
  const [emailInput, setEmailInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleOAuth = (provider: 'google' | 'apple') => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin(provider);
      setIsAuthenticating(false);
    }, 700);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin('email', emailInput.trim());
      setIsAuthenticating(false);
    }, 700);
  };

  // Filter user's saved stores
  const favoriteStores = stores.filter((s) => user.savedStores.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-coffee-50 dark:bg-[#160E0A] border border-coffee-200/80 dark:border-coffee-800 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-coffee-200/80 dark:border-coffee-800 flex items-center justify-between bg-white/80 dark:bg-coffee-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-lg text-coffee-950 dark:text-cream-50">
              {user.isLoggedIn ? 'Roast Rewards Member' : 'Secure Member Sign-In'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-coffee-100 dark:bg-coffee-900 text-coffee-700 dark:text-coffee-300 flex items-center justify-center hover:bg-coffee-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If NOT logged in: Show OAuth Sign In Form */}
        {!user.isLoggedIn ? (
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-coffee-800 to-roast-amber mx-auto flex items-center justify-center text-white shadow-lg mb-2">
                <Coffee className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-serif font-bold text-coffee-950 dark:text-cream-100">
                Unlock 1-Tap Ordering &amp; Rewards
              </h4>
              <p className="text-xs text-coffee-600 dark:text-coffee-400">
                Sign in securely with Google or Apple to track orders and earn free artisanal drinks.
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => handleOAuth('google')}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white dark:bg-coffee-900 border border-coffee-200/90 dark:border-coffee-700 text-coffee-800 dark:text-cream-100 font-bold text-xs shadow-sm hover:bg-coffee-50 active:scale-98 transition-all min-h-[46px]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => handleOAuth('apple')}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow-sm hover:opacity-90 active:scale-98 transition-all min-h-[46px]"
              >
                <span className="text-base leading-none"></span>
                <span>Continue with Apple</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-coffee-200 dark:border-coffee-800 w-full" />
              <span className="bg-coffee-50 dark:bg-[#160E0A] px-3 text-[11px] text-coffee-400 font-semibold uppercase">
                or email magic link
              </span>
            </div>

            {/* Email OTP Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-coffee-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-700 text-xs text-coffee-950 dark:text-cream-100 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-roast-amber"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-2.5 rounded-xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 text-xs font-bold shadow-md hover:opacity-90 transition-all min-h-[44px]"
              >
                Send One-Time Passcode
              </button>
            </form>

            <p className="text-[10px] text-coffee-400 text-center leading-relaxed">
              By signing in, you agree to our Terms of Service &amp; Privacy Policy. Zero password vulnerabilities with OAuth 2.0 PKCE.
            </p>
          </div>
        ) : (
          /* If LOGGED IN: Show Member Dashboard & Loyalty QR Pass */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Tabs */}
            <div className="flex rounded-xl bg-coffee-100 dark:bg-coffee-900 p-1 text-xs font-semibold">
              {(['loyalty', 'profile', 'orders'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 rounded-lg capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-coffee-950 text-coffee-950 dark:text-cream-100 shadow-sm font-bold'
                      : 'text-coffee-600 dark:text-coffee-400'
                  }`}
                >
                  {tab === 'loyalty' ? 'Digital Pass' : tab}
                </button>
              ))}
            </div>

            {/* TAB 1: Digital Loyalty Card & QR */}
            {activeTab === 'loyalty' && (
              <div className="space-y-4 animate-in fade-in">
                {/* Virtual Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-[#2D1B13] via-[#3B2217] to-[#120B08] text-white shadow-xl border border-coffee-700 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-roast-amber font-extrabold block">
                        Roast &amp; Route Club
                      </span>
                      <h4 className="text-xl font-serif font-bold text-cream-50 mt-0.5">
                        {user.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-roast-amber/20 border border-roast-amber/40 text-roast-amber text-xs font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>{user.memberTier}</span>
                    </div>
                  </div>

                  {/* Points Counter */}
                  <div className="my-5 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold font-mono text-roast-amber">
                      {user.loyaltyPoints}
                    </span>
                    <span className="text-xs text-cream-200/80 font-medium">Roast Points</span>
                  </div>

                  {/* Free Drink Milestone Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-cream-200/80">
                      <span>Next Free Pour-Over: 300 pts</span>
                      <span>{Math.max(0, 300 - user.loyaltyPoints)} pts to go</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-roast-amber to-roast-caramel rounded-full"
                        style={{ width: `${Math.min(100, (user.loyaltyPoints / 300) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Digital Barcode Scannable */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-cream-300/60 uppercase font-mono tracking-widest block">
                        Member ID
                      </span>
                      <span className="font-mono text-xs font-bold tracking-widest text-cream-100">
                        ROAST-9410-VIP
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-black" />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 text-xs space-y-1">
                  <span className="font-bold text-coffee-950 dark:text-cream-100 block">
                    How Points Work
                  </span>
                  <p className="text-coffee-600 dark:text-coffee-400 text-[11px]">
                    Earn 10 points for every $1 spent at participating craft roasters. Redeem 300 points for any artisanal single-origin pour-over or cortado.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Profile & Saved Stores */}
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-in fade-in text-xs">
                <div className="p-4 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={toWebp(user.avatar, 120, 75)}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-roast-amber"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-coffee-950 dark:text-cream-100">
                        {user.name}
                      </h4>
                      <p className="text-coffee-500">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={onLogout}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Saved Favorite Roasters */}
                <div className="space-y-2">
                  <span className="font-bold text-coffee-900 dark:text-cream-100 uppercase tracking-wider block">
                    Saved Favorite Roasters ({favoriteStores.length})
                  </span>
                  {favoriteStores.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-white dark:bg-coffee-950/50 border border-coffee-200/80 dark:border-coffee-800 text-center text-coffee-400">
                      Tap the heart icon on any coffee shop to save it here.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {favoriteStores.map((s) => (
                        <div
                          key={s.id}
                          className="p-3 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-coffee-950 dark:text-cream-100 block">
                              {s.name}
                            </span>
                            <span className="text-[11px] text-coffee-500">{s.city} • {s.distanceMiles} mi</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {s.isOpen ? 'Open' : 'Closed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Recent Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-3 animate-in fade-in text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-coffee-900 dark:text-cream-100 uppercase tracking-wider block">
                    Past Coffee Orders &amp; Receipts ({orders.length})
                  </span>
                  <span className="text-[11px] text-coffee-500 font-medium">
                    {orders.reduce((sum, o) => sum + (o.totalItems || o.items.reduce((s, i) => s + i.quantity, 0)), 0)} items savored
                  </span>
                </div>

                <OrderHistoryList
                  orders={orders}
                  onReorder={(o) => {
                    if (onReorder) {
                      onReorder(o);
                      onClose();
                    }
                  }}
                  onTrackOrder={(o) => {
                    if (onTrackOrder) {
                      onTrackOrder(o);
                      onClose();
                    }
                  }}
                  onExploreShops={onClose}
                  compact={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Modal Bottom Bar */}
        <div className="p-4 bg-white/95 dark:bg-coffee-950/95 border-t border-coffee-200/80 dark:border-coffee-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 font-bold text-xs shadow-md hover:opacity-90 transition-all min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
