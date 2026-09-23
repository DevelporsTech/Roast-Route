import React, { useState } from 'react';
import { Order, CartItem } from '../../types';
import {
  Clock,
  MapPin,
  Coffee,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Receipt,
  QrCode,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface OrderHistoryListProps {
  orders: Order[];
  onReorder?: (order: Order) => void;
  onTrackOrder?: (order: Order) => void;
  onExploreShops?: () => void;
  compact?: boolean;
}

export const OrderHistoryList: React.FC<OrderHistoryListProps> = ({
  orders,
  onReorder,
  onTrackOrder,
  onExploreShops,
  compact = false,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'completed') return o.status === 'completed';
    if (filterStatus === 'active') return o.status !== 'completed';
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold animate-pulse border border-amber-300">
            <QrCode className="w-3 h-3" />
            <span>Ready for Pickup</span>
          </span>
        );
      case 'brewing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold border border-blue-200">
            <Coffee className="w-3 h-3 animate-spin" />
            <span>Brewing</span>
          </span>
        );
      case 'placed':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-coffee-100 dark:bg-coffee-900 text-coffee-800 dark:text-cream-200 text-[10px] font-bold border border-coffee-200 dark:border-coffee-700">
            <Clock className="w-3 h-3" />
            <span>Order Placed</span>
          </span>
        );
    }
  };

  if (orders.length === 0) {
    return (
      <div className={`p-8 text-center rounded-3xl bg-white dark:bg-coffee-950/50 border border-coffee-200/80 dark:border-coffee-800 space-y-4 ${compact ? 'my-2' : 'my-6'}`}>
        <div className="w-16 h-16 rounded-2xl bg-coffee-100 dark:bg-coffee-900 mx-auto flex items-center justify-center text-3xl shadow-inner text-roast-amber">
          <Receipt className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-base text-coffee-950 dark:text-cream-100">
            No Past Coffee Orders Yet
          </h4>
          <p className="text-xs text-coffee-600 dark:text-coffee-400 max-w-sm mx-auto mt-1 leading-relaxed">
            Order ahead from independent specialty roasteries near you to skip the line and track your past orders here.
          </p>
        </div>
        {onExploreShops && (
          <button
            onClick={onExploreShops}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 text-xs font-bold shadow-md hover:opacity-90 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Find Roasteries &amp; Order</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Filter Chips */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-coffee-100/70 dark:bg-coffee-900/60 border border-coffee-200/60 dark:border-coffee-800 text-[11px] font-semibold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-coffee-950 text-coffee-950 dark:text-cream-100 shadow-sm font-bold'
                : 'text-coffee-600 dark:text-coffee-400 hover:text-coffee-950'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterStatus === 'completed'
                ? 'bg-white dark:bg-coffee-950 text-coffee-950 dark:text-cream-100 shadow-sm font-bold'
                : 'text-coffee-600 dark:text-coffee-400 hover:text-coffee-950'
            }`}
          >
            Past Receipts
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterStatus === 'active'
                ? 'bg-white dark:bg-coffee-950 text-coffee-950 dark:text-cream-100 shadow-sm font-bold'
                : 'text-coffee-600 dark:text-coffee-400 hover:text-coffee-950'
            }`}
          >
            Active
          </button>
        </div>

        <span className="text-[11px] text-coffee-500 font-medium">
          Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      {/* Orders Cards List */}
      <div className="space-y-3.5">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          const totalItemsCount =
            order.totalItems || order.items.reduce((sum, item) => sum + item.quantity, 0);
          const locationDisplay =
            order.storeLocation || 'San Francisco, CA';
          const orderDate = order.date || 'Sep 21, 2026';

          return (
            <div
              key={order.id}
              className="rounded-2xl bg-white dark:bg-coffee-950/80 border border-coffee-200/80 dark:border-coffee-800/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Card Primary Header */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-coffee-100 dark:border-coffee-800/70 pb-3">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coffee-800 to-roast-amber flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-coffee-950 dark:text-cream-50">
                          {order.storeName}
                        </h4>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Store Location */}
                      <div className="flex items-center gap-1 text-[11px] text-coffee-600 dark:text-coffee-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-roast-caramel shrink-0" />
                        <span className="truncate font-medium">{locationDisplay}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total price & points */}
                  <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end pt-1 sm:pt-0">
                    <span className="text-base sm:text-lg font-extrabold font-mono text-coffee-950 dark:text-cream-50">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-bold text-roast-caramel dark:text-roast-amber">
                      +{order.pointsEarned} Roast Points
                    </span>
                  </div>
                </div>

                {/* Secondary Meta Row: Total Items, Date, Pickup Code */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs py-1">
                  {/* Total Items count badge */}
                  <div className="p-2 rounded-xl bg-coffee-50 dark:bg-coffee-900/40 border border-coffee-200/50 dark:border-coffee-800/60">
                    <span className="text-[10px] uppercase font-bold text-coffee-400 tracking-wider block">
                      Total Items
                    </span>
                    <span className="font-extrabold text-coffee-900 dark:text-cream-100 flex items-center gap-1 mt-0.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-roast-amber" />
                      <span>{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}</span>
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="p-2 rounded-xl bg-coffee-50 dark:bg-coffee-900/40 border border-coffee-200/50 dark:border-coffee-800/60">
                    <span className="text-[10px] uppercase font-bold text-coffee-400 tracking-wider block">
                      Order Date
                    </span>
                    <span className="font-extrabold text-coffee-900 dark:text-cream-100 flex items-center gap-1 mt-0.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-roast-caramel" />
                      <span>{orderDate} • {order.timestamp}</span>
                    </span>
                  </div>

                  {/* Order Number & Station Code */}
                  <div className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-coffee-50 dark:bg-coffee-900/40 border border-coffee-200/50 dark:border-coffee-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-coffee-400 tracking-wider block">
                        Pickup Bay
                      </span>
                      <span className="font-mono font-extrabold text-roast-caramel dark:text-roast-amber text-xs">
                        {order.pickupCounterCode}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-coffee-400">
                      #{order.id}
                    </span>
                  </div>
                </div>

                {/* Items Summary Quick Preview */}
                <div className="text-xs text-coffee-700 dark:text-coffee-300/90 bg-coffee-50/50 dark:bg-coffee-900/20 p-2.5 rounded-xl border border-coffee-200/40 dark:border-coffee-800/40">
                  <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-coffee-500 uppercase tracking-wider">
                    <span>Items In Order</span>
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-roast-caramel dark:text-roast-amber hover:underline flex items-center gap-0.5 lowercase font-normal"
                    >
                      {isExpanded ? (
                        <>
                          <span>collapse details</span>
                          <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          <span>view breakdown</span>
                          <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>

                  <ul className="space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center text-xs">
                        <span className="truncate">
                          <span className="font-bold text-roast-amber">{item.quantity}x</span>{' '}
                          <span className="font-semibold text-coffee-950 dark:text-cream-100">
                            {item.menuItem.name}
                          </span>{' '}
                          <span className="text-[11px] text-coffee-400">
                            ({item.customization.size}, {item.customization.milk !== 'none' ? `${item.customization.milk} milk` : 'black'}
                            {item.customization.recipientGroup === 'child' && ' • 🧒 Child'}
                            {item.customization.recipientGroup === 'senior' && ' • 🧓 Over-Aged'}
                            {item.customization.recipientGroup === 'adult' && ' • 🧑 Adult'})
                          </span>
                        </span>
                        <span className="font-mono text-coffee-600 dark:text-coffee-400 ml-2">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-coffee-900/60 border border-coffee-200 dark:border-coffee-800 space-y-2.5 text-xs animate-in fade-in duration-200">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-coffee-500 block">
                      Receipt Summary
                    </span>

                    <div className="space-y-1 text-coffee-600 dark:text-coffee-300 text-xs">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>State &amp; Metro Sales Tax</span>
                        <span className="font-mono">${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Barista Tip</span>
                        <span className="font-mono">${order.tip.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-coffee-200 dark:border-coffee-700 pt-1.5 flex justify-between font-bold text-coffee-950 dark:text-cream-50">
                        <span>Total Paid</span>
                        <span className="font-mono text-sm">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-coffee-200/60 dark:border-coffee-800 flex items-center justify-between text-[11px] text-coffee-500">
                      <span>Payment Method: Apple Pay / Card</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Verified Contactless
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Action Controls */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    {/* Live Tracker button */}
                    {onTrackOrder && (
                      <button
                        onClick={() => onTrackOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-coffee-100 dark:bg-coffee-900 text-coffee-800 dark:text-cream-200 font-bold text-xs hover:bg-coffee-200 dark:hover:bg-coffee-800 transition-colors flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-roast-amber" />
                        <span>Pickup Status</span>
                      </button>
                    )}

                    {/* Directions link */}
                    <button
                      onClick={() => {
                        const q = encodeURIComponent(`${order.storeName}, ${locationDisplay}`);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
                      }}
                      className="px-3 py-1.5 rounded-xl text-coffee-600 dark:text-coffee-400 hover:text-coffee-950 dark:hover:text-cream-100 text-xs font-semibold flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </button>
                  </div>

                  {/* Quick Reorder Button */}
                  {onReorder && (
                    <button
                      onClick={() => onReorder(order)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 font-bold text-xs shadow-sm hover:opacity-90 active:scale-95 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
