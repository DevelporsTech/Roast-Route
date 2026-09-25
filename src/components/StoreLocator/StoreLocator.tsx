import React, { useState, useMemo, lazy, Suspense } from 'react';
import { CoffeeStore, FilterState } from '../../types';
import { Coordinates } from '../../services/locationService';
import { StoreCard } from './StoreCard';
import { POPULAR_AMENITIES } from '../../data/storesData';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  List,
  Map,
  Clock,
  Star,
  Check,
  RotateCcw,
  Sparkles,
  Loader2
} from 'lucide-react';

const StoreMapView = lazy(() =>
  import('./StoreMapView').then((m) => ({ default: m.StoreMapView }))
);

interface StoreLocatorProps {
  stores: CoffeeStore[];
  userLocation: Coordinates;
  onSelectStore: (store: CoffeeStore) => void;
  onToggleFavorite: (storeId: string) => void;
  onGetDirections: (store: CoffeeStore) => void;
  activeView: 'list' | 'map';
  onChangeView: (view: 'list' | 'map') => void;
}

export const StoreLocator: React.FC<StoreLocatorProps> = ({
  stores,
  userLocation,
  onSelectStore,
  onToggleFavorite,
  onGetDirections,
  activeView,
  onChangeView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'popular'>('distance');
  const [maxRadiusMiles, setMaxRadiusMiles] = useState<number>(25);
  const [selectedPinStore, setSelectedPinStore] = useState<CoffeeStore | null>(null);

  // Toggle amenity chip
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setOpenNowOnly(false);
    setSelectedAmenities([]);
    setMinRating(0);
    setMaxRadiusMiles(25);
    setSortBy('distance');
  };

  // Filter and sort logic
  const filteredStores = useMemo(() => {
    return stores
      .filter((store) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = store.name.toLowerCase().includes(q);
          const matchesCity = store.city.toLowerCase().includes(q);
          const matchesZip = store.zipCode.includes(q);
          const matchesCategory = store.categories.some((c) => c.toLowerCase().includes(q));
          const matchesFeatured = store.featuredDrink.toLowerCase().includes(q);
          if (!matchesName && !matchesCity && !matchesZip && !matchesCategory && !matchesFeatured) {
            return false;
          }
        }

        // Open now filter
        if (openNowOnly && !store.isOpen) {
          return false;
        }

        // Minimum rating filter
        if (minRating > 0 && store.rating < minRating) {
          return false;
        }

        // Maximum distance filter
        if (store.distanceMiles !== undefined && store.distanceMiles > maxRadiusMiles) {
          return false;
        }

        // Amenities filter
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((a) => store.amenities.includes(a));
          if (!hasAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return (a.distanceMiles || 0) - (b.distanceMiles || 0);
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'popular') {
          return b.reviewCount - a.reviewCount;
        }
        return 0;
      });
  }, [stores, searchQuery, openNowOnly, minRating, maxRadiusMiles, selectedAmenities, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    openNowOnly ||
    selectedAmenities.length > 0 ||
    minRating > 0 ||
    maxRadiusMiles < 25;

  return (
    <section id="locator-section" className="w-full py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Section Title & View Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-roast-amber" />
              <span className="text-xs font-bold uppercase tracking-wider text-roast-caramel dark:text-roast-amber">
                Real-Time Store Locator
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-coffee-950 dark:text-cream-50">
              Find Roasteries &amp; Artisanal Cafés
            </h2>
            <p className="text-xs sm:text-sm text-coffee-600 dark:text-coffee-300/80 mt-1">
              Showing {filteredStores.length} craft coffee locations near you
            </p>
          </div>

          {/* List vs Map Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-coffee-950/80 border border-coffee-200/80 dark:border-coffee-800 shadow-sm self-start md:self-auto">
            <button
              onClick={() => onChangeView('list')}
              aria-label="Switch to Card List view"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
                activeView === 'list'
                  ? 'bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 shadow-sm'
                  : 'text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100 dark:hover:bg-coffee-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Card List</span>
            </button>

            <button
              onClick={() => onChangeView('map')}
              aria-label="Switch to Interactive Map view"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
                activeView === 'map'
                  ? 'bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 shadow-sm'
                  : 'text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100 dark:hover:bg-coffee-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Primary Filter Controls */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-coffee-950/70 backdrop-blur-md border border-coffee-200/80 dark:border-coffee-800 shadow-sm space-y-4">
          {/* Instant Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-coffee-400 absolute left-4 top-3.5" />
            <input
              id="store-search-input"
              type="text"
              aria-label="Search coffee shops by name, neighborhood, city, or ZIP code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by shop name, neighborhood, city, or ZIP code (e.g. Ritual, 94110, Brooklyn)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-coffee-50 dark:bg-coffee-900/60 border border-coffee-200/80 dark:border-coffee-700 text-xs sm:text-sm text-coffee-950 dark:text-cream-100 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-roast-amber min-h-[48px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
                className="absolute right-3.5 top-3 text-xs text-coffee-400 hover:text-coffee-700 p-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left side quick toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Open Now Chip */}
              <button
                onClick={() => setOpenNowOnly(!openNowOnly)}
                aria-label="Filter stores open now"
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all min-h-[34px] ${
                  openNowOnly
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-coffee-100/80 dark:bg-coffee-900/70 text-coffee-700 dark:text-coffee-300 hover:bg-coffee-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Open Now Only</span>
              </button>

              {/* 4.8+ Rating Chip */}
              <button
                onClick={() => setMinRating(minRating === 4.8 ? 0 : 4.8)}
                aria-label="Filter stores with 4.8 or higher rating"
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all min-h-[34px] ${
                  minRating === 4.8
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-coffee-100/80 dark:bg-coffee-900/70 text-coffee-700 dark:text-coffee-300 hover:bg-coffee-200'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Top Rated (4.8+)</span>
              </button>

              {/* Distance Radius Dropdown */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-coffee-100/80 dark:bg-coffee-900/70 text-coffee-800 dark:text-coffee-200 font-semibold min-h-[34px]">
                <MapPin className="w-3.5 h-3.5 text-roast-amber" />
                <select
                  id="distance-radius-select"
                  aria-label="Filter stores by maximum distance"
                  value={maxRadiusMiles}
                  onChange={(e) => setMaxRadiusMiles(Number(e.target.value))}
                  className="bg-transparent focus:outline-none cursor-pointer text-xs font-bold text-coffee-900 dark:text-cream-100"
                >
                  <option value={1} className="dark:bg-coffee-950">Within 1 mile</option>
                  <option value={3} className="dark:bg-coffee-950">Within 3 miles</option>
                  <option value={5} className="dark:bg-coffee-950">Within 5 miles</option>
                  <option value={10} className="dark:bg-coffee-950">Within 10 miles</option>
                  <option value={25} className="dark:bg-coffee-950">Within 25 miles</option>
                  <option value={100} className="dark:bg-coffee-950">Within 100 miles</option>
                  <option value={5000} className="dark:bg-coffee-950">All USA (Nationwide)</option>
                </select>
              </div>

              {/* Reset button if active */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  aria-label="Reset all search filters"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Right side Sort Dropdown */}
            <div className="flex items-center gap-1.5 font-semibold text-coffee-700 dark:text-coffee-300">
              <span className="text-coffee-500 dark:text-coffee-400 text-[11px]">Sort:</span>
              <select
                id="sort-by-select"
                aria-label="Sort coffee shops"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl bg-coffee-100/80 dark:bg-coffee-900/70 text-coffee-900 dark:text-cream-100 font-bold focus:outline-none cursor-pointer"
              >
                <option value="distance" className="dark:bg-coffee-950">Nearest Distance</option>
                <option value="rating" className="dark:bg-coffee-950">Highest Rated</option>
                <option value="popular" className="dark:bg-coffee-950">Most Reviewed</option>
              </select>
            </div>
          </div>

          {/* Popular Amenities Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            <span className="text-[11px] font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wider shrink-0 mr-1">
              Amenities:
            </span>
            {POPULAR_AMENITIES.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  aria-label={`Filter by ${amenity}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 min-h-[32px] ${
                    isSelected
                      ? 'bg-roast-caramel text-white shadow-sm font-bold'
                      : 'bg-coffee-100/60 dark:bg-coffee-900/40 text-coffee-700 dark:text-coffee-300 hover:bg-coffee-200/70 border border-coffee-200/50 dark:border-coffee-800'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Display: List View or Map View */}
        {activeView === 'map' ? (
          <Suspense
            fallback={
              <div className="w-full h-[600px] rounded-3xl bg-coffee-100 dark:bg-coffee-950/80 border border-coffee-200 dark:border-coffee-800 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-roast-amber" />
                <span className="text-xs font-bold text-coffee-700 dark:text-coffee-300">
                  Loading Interactive Roastery Map...
                </span>
              </div>
            }
          >
            <StoreMapView
              stores={filteredStores}
              allStores={stores}
              userLocation={userLocation}
              selectedStore={selectedPinStore}
              onSelectStore={(s) => {
                setSelectedPinStore(s);
              }}
              onOpenStoreDetails={(s) => onSelectStore(s)}
              onGetDirections={onGetDirections}
            />
          </Suspense>
        ) : (
          <div>
            {filteredStores.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-coffee-950/60 border border-coffee-200/80 dark:border-coffee-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-coffee-100 dark:bg-coffee-900 mx-auto flex items-center justify-center text-3xl">
                  🔍
                </div>
                <h3 className="font-serif font-bold text-lg text-coffee-950 dark:text-cream-100">
                  No Roasteries Found Matching Filters
                </h3>
                <p className="text-xs text-coffee-600 dark:text-coffee-400 max-w-md mx-auto">
                  Try broadening your distance radius, disabling the "Open Now" filter, or clearing specific amenities.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-2xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 font-bold text-xs shadow-md hover:opacity-90 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    onSelect={onSelectStore}
                    onToggleFavorite={onToggleFavorite}
                    onGetDirections={onGetDirections}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
