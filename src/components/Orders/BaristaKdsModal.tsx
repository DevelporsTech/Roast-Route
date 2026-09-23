import React, { useState } from 'react';
import { Order, CoffeeStore } from '../../types';
import {
  Store,
  Clock,
  CheckCircle2,
  Flame,
  Coffee,
  RefreshCw,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  Volume2,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

export const SUGGESTED_BARISTA_PASSWORD = 'BARISTA2026';

interface BaristaKdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  stores: CoffeeStore[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
}

export const BaristaKdsModal: React.FC<BaristaKdsModalProps> = ({
  isOpen,
  onClose,
  orders,
  stores,
  onUpdateOrderStatus,
}) => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'placed' | 'brewing' | 'ready' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('rr_kds_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passwordInput.trim().toUpperCase();
    if (cleanInput === SUGGESTED_BARISTA_PASSWORD || cleanInput === '1892') {
      setIsAuthenticated(true);
      sessionStorage.setItem('rr_kds_authenticated', 'true');
      setErrorMsg('');
      setPasswordInput('');
    } else {
      setErrorMsg('Access Denied: Incorrect staff password. Authorized personnel only.');
    }
  };

  const handleLockTerminal = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('rr_kds_authenticated');
    setPasswordInput('');
    setErrorMsg('');
  };

  // Filter orders by shop and status
  const filteredOrders = orders.filter((order) => {
    const matchesStore = selectedStoreId === 'all' || order.storeId === selectedStoreId;
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pickupCounterCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i: any) => (i.menuItem?.name || i.name || '').toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStore && matchesStatus && matchesSearch;
  });

  const activeOrdersCount = orders.filter((o) => o.status !== 'completed').length;
  const brewingCount = orders.filter((o) => o.status === 'brewing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* If not authenticated, display Staff Security Gate */}
      {!isAuthenticated ? (
        <div className="bg-coffee-950 border border-coffee-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 text-cream-100 shadow-2xl relative overflow-hidden space-y-6 animate-in zoom-in-95 duration-200">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-roast-amber/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header & Lock Icon */}
          <div className="text-center space-y-2 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-roast-amber/30 to-roast-caramel/20 border border-roast-amber/50 text-roast-amber mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10 mb-3">
              <Lock className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-roast-amber border border-amber-500/30 text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
              <span>🔒</span> Staff Access Only
            </span>

            <h2 className="text-2xl font-serif font-bold text-cream-50 pt-1">
              Barista Kitchen Display (KDS &amp; POS)
            </h2>

            <p className="text-xs text-coffee-300 leading-relaxed max-w-sm mx-auto">
              Live customer order tickets, temperature controls, and brewing queue updates are restricted to cafe staff.
            </p>
          </div>

          {/* Security Notice (Password NOT revealed) */}
          <div className="relative z-10 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-coffee-300 font-semibold text-xs">
              <KeyRound className="w-4 h-4 text-roast-amber shrink-0" />
              <span>Restricted System • Staff Authorization Required</span>
            </div>
            <p className="text-[11px] text-coffee-400 leading-relaxed">
              This terminal controls espresso extraction timers, order queues, and guest dispatch. Please enter the authorized barista passcode to unlock the kitchen display.
            </p>
          </div>

          {/* Password Entry Form */}
          <form onSubmit={handleAuthenticate} className="space-y-3 relative z-10">
            <div className="space-y-1">
              <label className="text-xs font-bold text-cream-200 flex items-center justify-between">
                <span>Enter Barista Password:</span>
                <span className="text-[11px] text-coffee-400 font-normal">Case-insensitive</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Type password..."
                  className="w-full px-4 py-3 rounded-xl bg-coffee-900/90 border border-coffee-700 focus:border-roast-amber text-cream-100 text-sm font-mono tracking-wider focus:outline-none transition-colors pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-cream-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-roast-amber hover:brightness-110 text-coffee-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Kitchen Display (KDS &amp; POS)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-coffee-400 hover:text-cream-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel &amp; Return to Customer View</span>
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Barista Kitchen Display */
        <div className="bg-coffee-950 border border-coffee-800 rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden text-cream-100 shadow-2xl">
          {/* Top Header Bar */}
          <div className="px-4 sm:px-6 py-4 border-b border-coffee-800 bg-coffee-900/90 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-roast-amber text-coffee-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-cream-50">
                    Barista Kitchen Display (KDS &amp; POS)
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold uppercase tracking-wider animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Queue
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-400" /> Staff Verified
                  </span>
                </div>
                <p className="text-[11px] text-coffee-400">
                  Partner Cafe Real-Time Order Management, Extraction Control &amp; Pickup Dispatch
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Station Stats */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-coffee-950/60 border border-coffee-800 text-xs">
                <span className="text-coffee-400">Queue:</span>
                <span className="font-bold text-roast-amber">{activeOrdersCount}</span>
                <span className="text-coffee-600">|</span>
                <span className="text-coffee-400">Brewing:</span>
                <span className="font-bold text-blue-400">{brewingCount}</span>
                <span className="text-coffee-600">|</span>
                <span className="text-coffee-400">Ready:</span>
                <span className="font-bold text-emerald-400">{readyCount}</span>
              </div>

              {/* Lock Terminal Button */}
              <button
                onClick={handleLockTerminal}
                className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Lock POS terminal when stepping away from the coffee bar"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock POS</span>
              </button>

              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-coffee-800 hover:bg-coffee-700 text-cream-100 font-bold text-xs transition-colors"
              >
                Close POS
              </button>
            </div>
          </div>

          {/* Filter & Controls Toolbar */}
          <div className="p-3 sm:p-4 bg-coffee-900/50 border-b border-coffee-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              {/* Store Picker */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coffee-950 border border-coffee-800">
                <Store className="w-3.5 h-3.5 text-roast-amber shrink-0" />
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="bg-transparent text-cream-100 font-semibold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all">All Coffee Roasteries</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id} className="bg-coffee-950 text-cream-100">
                      {s.name} ({s.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center rounded-xl bg-coffee-950 p-1 border border-coffee-800">
                {(['all', 'placed', 'brewing', 'ready', 'completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg capitalize font-bold text-xs transition-colors ${
                      statusFilter === st
                        ? 'bg-roast-amber text-coffee-950'
                        : 'text-coffee-400 hover:text-cream-200'
                    }`}
                  >
                    {st === 'placed' ? 'Queued' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Search Bar */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-coffee-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket #, item, name..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-coffee-950 border border-coffee-800 text-cream-100 text-xs focus:outline-none focus:border-roast-amber"
              />
            </div>
          </div>

          {/* Orders Ticket Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-coffee-950/70">
            {filteredOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <Coffee className="w-12 h-12 text-coffee-700 stroke-1" />
                <h3 className="font-bold text-base text-cream-200">No Orders in Kitchen Queue</h3>
                <p className="text-xs text-coffee-400 max-w-sm">
                  There are currently no tickets matching this store or status filter. New mobile app orders appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => {
                  const isPlaced = order.status === 'placed';
                  const isBrewing = order.status === 'brewing';
                  const isReady = order.status === 'ready';
                  const isCompleted = order.status === 'completed';

                  return (
                    <div
                      key={order.id}
                      className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-lg transition-all ${
                        isBrewing
                          ? 'border-blue-500/60 bg-[#16131F]'
                          : isReady
                          ? 'border-emerald-500/60 bg-[#0F1B14]'
                          : isCompleted
                          ? 'border-coffee-800/40 bg-coffee-900/30 opacity-70'
                          : 'border-amber-500/40 bg-coffee-900/60'
                      }`}
                    >
                      {/* Ticket Header */}
                      <div className="p-3.5 border-b border-coffee-800/60 flex items-center justify-between bg-black/20">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-roast-amber">
                              #{order.pickupCounterCode}
                            </span>
                            <span className="text-[10px] text-coffee-400 font-mono">
                              ({order.id})
                            </span>
                          </div>
                          <span className="text-[11px] text-cream-300 font-semibold block truncate max-w-[180px]">
                            {order.storeName}
                          </span>
                        </div>

                        {/* Status Chip */}
                        <div className="text-right">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider block ${
                              isBrewing
                                ? 'bg-blue-900/80 text-blue-300 border border-blue-500/40'
                                : isReady
                                ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40'
                                : isCompleted
                                ? 'bg-coffee-800 text-coffee-400'
                                : 'bg-amber-900/80 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {order.status === 'placed' ? 'Queued' : order.status}
                          </span>
                          <span className="text-[10px] text-coffee-400 mt-0.5 block">
                            {order.placedAt || order.date || (order.timestamp ? new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now')}
                          </span>
                        </div>
                      </div>

                      {/* Ticket Items Breakdown */}
                      <div className="p-3.5 space-y-2 flex-1">
                        {order.items.map((rawItem: any, idx) => {
                          const itemName = rawItem.menuItem?.name || rawItem.name || 'Artisan Coffee';
                          const itemPrice = rawItem.totalPrice ? rawItem.totalPrice / rawItem.quantity : (rawItem.price || 5.0);
                          const cust = rawItem.customization || rawItem.customizations || {};
                          const recipient = cust.recipientGroup;

                          return (
                            <div key={idx} className="flex items-start justify-between gap-2 text-xs border-b border-coffee-800/40 pb-2 last:border-0 last:pb-0">
                              <div className="flex items-start gap-2">
                                <span className="w-5 h-5 rounded-md bg-roast-amber/20 text-roast-amber font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  {rawItem.quantity}x
                                </span>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-cream-100">{itemName}</span>
                                    {recipient === 'child' && (
                                      <span className="px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-500 text-[10px] font-extrabold flex items-center gap-1">
                                        <span>🧒</span> Child Safe (125-130°F)
                                      </span>
                                    )}
                                    {recipient === 'senior' && (
                                      <span className="px-2 py-0.5 rounded-full bg-amber-900/80 text-amber-200 border border-amber-500 text-[10px] font-extrabold flex items-center gap-1">
                                        <span>🧓</span> Over-Aged (Gentle Brew)
                                      </span>
                                    )}
                                    {recipient === 'adult' && (
                                      <span className="px-1.5 py-0.2 rounded-full bg-coffee-800 text-coffee-300 text-[9px] font-medium">
                                        🧑 Adult
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-coffee-300">
                                    {cust.size && (
                                      <span className="px-1.5 py-0.2 rounded bg-coffee-800/80 capitalize">
                                        Size: {cust.size}
                                      </span>
                                    )}
                                    {cust.milk && (
                                      <span className="px-1.5 py-0.2 rounded bg-coffee-800/80 capitalize">
                                        Milk: {cust.milk}
                                      </span>
                                    )}
                                    {(cust.espressoShots || cust.shots) ? (
                                      <span className="px-1.5 py-0.2 rounded bg-coffee-800/80">
                                        +{cust.espressoShots || cust.shots} shots
                                      </span>
                                    ) : null}
                                    {cust.sweetness && (
                                      <span className="px-1.5 py-0.2 rounded bg-coffee-800/80 capitalize">
                                        Sweet: {cust.sweetness}
                                      </span>
                                    )}
                                    {(cust.specialNotes || cust.specialInstructions) && (
                                      <p className="w-full text-amber-300 italic text-[10px] mt-0.5">
                                        Note: "{cust.specialNotes || cust.specialInstructions}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className="font-mono text-coffee-300 text-xs font-semibold shrink-0">
                                ${(itemPrice * rawItem.quantity).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total & Barista Action Buttons */}
                      <div className="p-3.5 bg-black/30 border-t border-coffee-800/60 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-coffee-400">Total Charged:</span>
                          <span className="font-mono font-bold text-cream-50 text-sm">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>

                        {/* Status Pipeline Step Buttons */}
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'placed')}
                            className={`py-1.5 rounded-xl font-bold text-xs transition-colors ${
                              isPlaced
                                ? 'bg-amber-500 text-coffee-950 font-extrabold shadow-md'
                                : 'bg-coffee-900 text-coffee-400 hover:text-cream-100'
                            }`}
                          >
                            Queued
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'brewing')}
                            className={`py-1.5 rounded-xl font-bold text-xs transition-colors ${
                              isBrewing
                                ? 'bg-blue-500 text-white font-extrabold shadow-md'
                                : 'bg-coffee-900 text-coffee-400 hover:text-cream-100'
                            }`}
                          >
                            Brewing
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                            className={`py-1.5 rounded-xl font-bold text-xs transition-colors ${
                              isReady
                                ? 'bg-emerald-500 text-coffee-950 font-extrabold shadow-md'
                                : 'bg-coffee-900 text-coffee-400 hover:text-cream-100'
                            }`}
                          >
                            Ready
                          </button>
                        </div>

                        {order.status === 'ready' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                            className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Guest Picked Up (Complete Order)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="px-4 py-3 border-t border-coffee-800 bg-coffee-900/90 flex flex-wrap items-center justify-between gap-2 text-[11px] text-coffee-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Connected to Local POS &amp; Thermal Receipt Printer Relay</span>
            </div>
            <span>Updates sync automatically with customer mobile order trackers</span>
          </div>
        </div>
      )}
    </div>
  );
};
