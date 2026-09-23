import React from 'react';
import { CoffeeStore } from '../../types';
import { toWebp } from '../../utils/imageOptimizer';
import { Star, Navigation, Clock, Heart, Coffee, Wifi, Sparkles, ChevronRight, Car } from 'lucide-react';

interface StoreCardProps {
  store: CoffeeStore;
  onSelect: (store: CoffeeStore) => void;
  onToggleFavorite: (storeId: string) => void;
  onGetDirections: (store: CoffeeStore) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onSelect,
  onToggleFavorite,
  onGetDirections,
}) => {
  return (
    <div className="group relative rounded-3xl bg-white dark:bg-[#1A100B] border border-coffee-200/80 dark:border-coffee-800/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Store Photo Hero with gradient overlay */}
        <div className="relative h-44 w-full overflow-hidden bg-coffee-200 dark:bg-coffee-900">
          <img
            src={toWebp(store.image, 600, 75)}
            alt={store.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Top Status & Favorite Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-md shadow-sm ${
                store.isOpen
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-zinc-800/90 text-zinc-300'
              }`}
            >
              {store.isOpen ? 'Open Now' : 'Closed'}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(store.id);
              }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-rose-400 hover:scale-110 active:scale-95 transition-all shadow-md"
              title={store.isFavorite ? 'Remove from favorites' : 'Save store to favorites'}
            >
              <Heart
                className={`w-4 h-4 ${
                  store.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </button>
          </div>

          {/* Bottom Photo Title & Distance */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-cream-200/90 tracking-wide uppercase">
                {store.roastStyle}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{store.rating}</span>
                <span className="text-cream-300/80 font-normal">({store.reviewCount})</span>
              </div>
            </div>
            <h3 className="text-lg font-bold font-serif leading-snug mt-0.5 drop-shadow-sm">
              {store.name}
            </h3>
          </div>
        </div>

        {/* Card Body Details */}
        <div className="p-4 flex flex-col gap-3">
          {/* Address & Distance Info */}
          <div className="flex items-center justify-between text-xs text-coffee-600 dark:text-coffee-300">
            <span className="line-clamp-1">{store.address}, {store.city}</span>
            <div className="flex items-center gap-1 font-bold text-coffee-900 dark:text-roast-amber whitespace-nowrap ml-2">
              <Navigation className="w-3 h-3 text-roast-caramel" />
              <span>{store.distanceMiles} mi</span>
              <span className="text-coffee-400 font-normal">({store.travelTimeMinutes} min)</span>
            </div>
          </div>

          {/* Featured Artisanal Drink */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-coffee-50 dark:bg-coffee-950/60 border border-coffee-100 dark:border-coffee-800/70 text-xs">
            <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-coffee-800 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Coffee className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-coffee-400 uppercase font-bold tracking-wider block">Featured Brew</span>
              <span className="font-semibold text-coffee-900 dark:text-cream-100 truncate block">
                {store.featuredDrink}
              </span>
            </div>
          </div>

          {/* Amenities Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {store.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="px-2.5 py-1 rounded-lg bg-coffee-100/70 dark:bg-coffee-900/60 text-coffee-700 dark:text-coffee-300 text-[11px] font-medium"
              >
                {amenity}
              </span>
            ))}
            {store.amenities.length > 3 && (
              <span className="px-2 py-1 rounded-lg text-coffee-500 dark:text-coffee-400 text-[11px] font-medium">
                +{store.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={() => onGetDirections(store)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-coffee-100 dark:bg-coffee-900/80 hover:bg-coffee-200 dark:hover:bg-coffee-800 text-coffee-900 dark:text-cream-100 font-bold text-xs transition-colors min-h-[44px]"
        >
          <Navigation className="w-3.5 h-3.5 text-roast-amber" />
          <span>Directions</span>
        </button>

        <button
          onClick={() => onSelect(store)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-coffee-900 dark:bg-roast-amber hover:bg-coffee-800 dark:hover:bg-roast-caramel text-white dark:text-coffee-950 font-bold text-xs transition-all shadow-sm active:scale-98 min-h-[44px]"
        >
          <span>Order Menu</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
