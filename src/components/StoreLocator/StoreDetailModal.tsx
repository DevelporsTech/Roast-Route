import React, { useState } from 'react';
import { CoffeeStore, MenuItem, DrinkCategory } from '../../types';
import { toWebp } from '../../utils/imageOptimizer';
import {
  X,
  Star,
  Navigation,
  Phone,
  Clock,
  Heart,
  Share2,
  CheckCircle,
  Plus,
  Zap,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface StoreDetailModalProps {
  store: CoffeeStore | null;
  onClose: () => void;
  onSelectMenuItem: (item: MenuItem, store: CoffeeStore) => void;
  onToggleFavorite: (storeId: string) => void;
  onGetDirections: (store: CoffeeStore) => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({
  store,
  onClose,
  onSelectMenuItem,
  onToggleFavorite,
  onGetDirections,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!store) return null;

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'espresso', label: 'Espresso & Milk' },
    { id: 'filter', label: 'Pour-Over & Drip' },
    { id: 'cold_brew', label: 'Cold Brew' },
    { id: 'specialty', label: 'Signatures' },
    { id: 'bakery', label: 'Pastries' },
  ];

  const filteredMenu = activeCategory === 'all'
    ? store.menu
    : store.menu.filter((item) => item.category === activeCategory);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${store.name} - Roast & Route`,
        text: `Check out ${store.name} on Roast & Route! Located at ${store.address}, ${store.city}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${store.name} - ${store.address}, ${store.city}. Find your artisanal brew on Roast & Route!`
      );
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-coffee-50 dark:bg-[#160E0A] border border-coffee-200/80 dark:border-coffee-800 shadow-2xl overflow-hidden">
        {/* Modal Top Header with Store Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 bg-coffee-900">
          <img
            src={toWebp(store.image, 800, 75)}
            alt={store.name}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#160E0A] via-black/30 to-transparent" />

          {/* Floating Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md min-h-[44px]"
              title="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md min-h-[44px]"
                title="Share store"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleFavorite(store.id)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md min-h-[44px]"
                title={store.isFavorite ? 'Remove from favorites' : 'Save favorite'}
              >
                <Heart
                  className={`w-4 h-4 ${
                    store.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Store Info Banner on Header Bottom */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                store.isOpen ? 'bg-emerald-500 text-white' : 'bg-zinc-700 text-zinc-300'
              }`}>
                {store.isOpen ? 'Open Now' : 'Closed'}
              </span>
              <span className="text-xs font-semibold text-cream-200/90">{store.priceLevel}</span>
              <span className="text-xs text-cream-300/60">•</span>
              <span className="text-xs text-roast-crema font-medium uppercase tracking-wider">
                {store.roastStyle}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold drop-shadow-md">
              {store.name}
            </h2>
            <p className="text-xs sm:text-sm text-cream-200/90 line-clamp-1 mt-0.5">
              {store.tagline}
            </p>
          </div>
        </div>

        {/* Share toast feedback */}
        {copiedShare && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-roast-amber text-coffee-950 text-xs font-bold shadow-lg animate-bounce">
            Link copied to clipboard!
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white dark:bg-coffee-950/80 border border-coffee-200/70 dark:border-coffee-800 text-center text-xs">
            <div className="flex flex-col items-center justify-center p-1">
              <div className="flex items-center gap-1 font-bold text-coffee-900 dark:text-cream-100 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{store.rating}</span>
              </div>
              <span className="text-[11px] text-coffee-500 dark:text-coffee-400">
                {store.reviewCount} reviews
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1 border-x border-coffee-200/50 dark:border-coffee-800">
              <div className="flex items-center gap-1 font-bold text-coffee-900 dark:text-cream-100 text-sm">
                <Navigation className="w-4 h-4 text-roast-amber" />
                <span>{store.distanceMiles} mi</span>
              </div>
              <span className="text-[11px] text-coffee-500 dark:text-coffee-400">
                ~{store.travelTimeMinutes} min travel
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1">
              <div className="flex items-center gap-1 font-bold text-coffee-900 dark:text-cream-100 text-sm">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>{store.isOpen ? 'Open' : 'Closed'}</span>
              </div>
              <span className="text-[11px] text-coffee-500 dark:text-coffee-400 truncate max-w-[90px]">
                {store.openingHours.split('–')[0]}
              </span>
            </div>
          </div>

          {/* Location & Contact Details */}
          <div className="p-4 rounded-2xl bg-white dark:bg-coffee-950/60 border border-coffee-200/70 dark:border-coffee-800 space-y-3 text-xs sm:text-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-semibold text-coffee-950 dark:text-cream-100">
                  {store.address}, {store.city}, {store.state} {store.zipCode}
                </p>
                <p className="text-xs text-coffee-500 dark:text-coffee-400">
                  Hours: {store.openingHours}
                </p>
                <p className="text-xs text-coffee-500 dark:text-coffee-400">
                  Phone: <a href={`tel:${store.phone}`} className="text-roast-caramel hover:underline">{store.phone}</a>
                </p>
              </div>

              <button
                onClick={() => onGetDirections(store)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 font-bold text-xs shrink-0 shadow-sm hover:opacity-90 active:scale-95 transition-all min-h-[44px]"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </button>
            </div>

            {/* Amenities Grid */}
            <div className="pt-2 border-t border-coffee-100 dark:border-coffee-800/80">
              <span className="text-xs font-bold text-coffee-600 dark:text-coffee-400 uppercase tracking-wider block mb-2">
                Available Amenities
              </span>
              <div className="flex flex-wrap gap-2">
                {store.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-coffee-100/70 dark:bg-coffee-900/60 text-coffee-800 dark:text-coffee-200 text-xs font-medium"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Artisanal Drink & Pastry Menu Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-coffee-950 dark:text-cream-50">
                  Artisanal In-Store Menu
                </h3>
                <p className="text-xs text-coffee-500 dark:text-coffee-400">
                  Select any craft drink to customize milk, espresso shots, or caffeine intake
                </p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] ${
                    activeCategory === cat.id
                      ? 'bg-coffee-800 dark:bg-roast-amber text-white dark:text-coffee-950 shadow-sm'
                      : 'bg-white dark:bg-coffee-950 text-coffee-700 dark:text-coffee-300 border border-coffee-200/80 dark:border-coffee-800 hover:bg-coffee-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Menu Items List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectMenuItem(item, store)}
                  className="group p-3 rounded-2xl bg-white dark:bg-coffee-950/70 border border-coffee-200/80 dark:border-coffee-800 hover:border-roast-caramel dark:hover:border-roast-amber hover:shadow-md transition-all cursor-pointer flex gap-3 items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="font-bold text-sm text-coffee-950 dark:text-cream-100 truncate group-hover:text-roast-caramel dark:group-hover:text-roast-amber transition-colors">
                        {item.name}
                      </h4>
                      {item.popular && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-[10px] font-extrabold uppercase shrink-0">
                          Top Pick
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-coffee-600 dark:text-coffee-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="font-extrabold text-coffee-950 dark:text-cream-50">
                        ${item.basePrice.toFixed(2)}
                      </span>
                      {item.caffeineMg > 0 && (
                        <span className="flex items-center gap-0.5 text-[11px] text-coffee-500 dark:text-coffee-400 font-medium">
                          <Zap className="w-3 h-3 text-roast-amber fill-roast-amber" />
                          {item.caffeineMg}mg caffeine
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail & Order Plus Button */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-coffee-200 dark:bg-coffee-900">
                    <img
                      src={toWebp(item.image, 200, 75)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-7 h-7 rounded-full bg-white text-coffee-900 flex items-center justify-center shadow-lg">
                        <Plus className="w-4 h-4 font-bold" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="p-4 bg-white/95 dark:bg-coffee-950/95 backdrop-blur-md border-t border-coffee-200/80 dark:border-coffee-800 flex items-center justify-between gap-4">
          <div className="text-xs">
            <span className="text-coffee-500 dark:text-coffee-400 block">Pick up at</span>
            <span className="font-bold text-coffee-900 dark:text-cream-100 line-clamp-1">{store.name}</span>
          </div>

          <button
            onClick={() => onGetDirections(store)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-5 rounded-2xl bg-coffee-900 dark:bg-roast-amber hover:opacity-90 text-white dark:text-coffee-950 font-bold text-sm shadow-md transition-all min-h-[48px]"
          >
            <Navigation className="w-4 h-4" />
            <span>Navigate to Store ({store.distanceMiles} mi)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
