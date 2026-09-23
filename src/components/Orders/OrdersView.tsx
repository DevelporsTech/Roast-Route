import React from 'react';
import { Order, CoffeeStore } from '../../types';
import { OrderHistoryList } from './OrderHistoryList';
import {
  ShoppingBag,
  Clock,
  Sparkles,
  MapPin,
  Coffee,
  ArrowRight,
  Receipt,
  Award,
  Lock
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  stores: CoffeeStore[];
  onReorder: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
  onExploreShops: () => void;
  onOpenLoyalty: () => void;
  onOpenBaristaKds?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  stores,
  onReorder,
  onTrackOrder,
  onExploreShops,
  onOpenLoyalty,
  onOpenBaristaKds,
}) => {
  // Aggregate stats
  const totalItemsOrdered = orders.reduce((sum, o) => {
    return sum + (o.totalItems || o.items.reduce((s, i) => s + i.quantity, 0));
  }, 0);

  const totalPointsEarned = orders.reduce((sum, o) => sum + o.pointsEarned, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-coffee-950 via-coffee-900 to-[#2A160F] p-6 sm:p-8 text-white shadow-xl border border-coffee-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-roast-amber/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-roast-amber/20 border border-roast-amber/30 text-roast-amber text-xs font-bold tracking-wide">
              <Receipt className="w-3.5 h-3.5" />
              <span>Digital Coffee Receipts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
              Past Coffee Orders
            </h1>
            <p className="text-xs sm:text-sm text-cream-200/80 max-w-lg leading-relaxed">
              Every single-origin pour-over, oat milk cortado, and artisanal treat ordered across our nationwide specialty roaster network.
            </p>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
            {onOpenBaristaKds && (
              <button
                onClick={onOpenBaristaKds}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-coffee-800/90 hover:bg-coffee-700 text-cream-100 border border-coffee-700 font-bold text-xs shadow-lg transition-all"
                title="Barista Kitchen Display System: Password protected staff terminal"
              >
                <Lock className="w-3.5 h-3.5 text-roast-amber" />
                <span>Barista Kitchen POS</span>
                <span className="px-1.5 py-0.5 rounded bg-roast-amber/20 text-roast-amber text-[9px] font-extrabold uppercase">
                  STAFF
                </span>
              </button>
            )}

            <button
              onClick={onExploreShops}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-roast-amber text-coffee-950 font-bold text-xs shadow-lg hover:brightness-105 active:scale-95 transition-all"
            >
              <Coffee className="w-4 h-4" />
              <span>Order Ahead Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Quick Order Statistics */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-coffee-800/80">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-cream-200/60 font-semibold block">
              Total Orders
            </span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-cream-50">
              {orders.length}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-cream-200/60 font-semibold block">
              Items Savored
            </span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-roast-amber">
              {totalItemsOrdered}
            </span>
          </div>

          <div className="space-y-0.5 cursor-pointer hover:opacity-80 transition-opacity" onClick={onOpenLoyalty}>
            <span className="text-[10px] uppercase tracking-wider text-cream-200/60 font-semibold flex items-center gap-1">
              <span>Points Earned</span>
              <Award className="w-3 h-3 text-roast-amber" />
            </span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-cream-50">
              +{totalPointsEarned}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List Component */}
      <OrderHistoryList
        orders={orders}
        onReorder={onReorder}
        onTrackOrder={onTrackOrder}
        onExploreShops={onExploreShops}
      />
    </div>
  );
};
