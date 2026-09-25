import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CoffeeStore } from '../../types';
import { Coordinates } from '../../services/locationService';
import { US_METRO_HUBS } from '../../data/storesData';
import { toWebp } from '../../utils/imageOptimizer';
import {
  MapPin,
  Navigation,
  Star,
  Coffee,
  ChevronRight,
  X,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Compass,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface StoreMapViewProps {
  stores: CoffeeStore[];
  allStores?: CoffeeStore[];
  userLocation: Coordinates;
  selectedStore: CoffeeStore | null;
  onSelectStore: (store: CoffeeStore) => void;
  onOpenStoreDetails: (store: CoffeeStore) => void;
  onGetDirections: (store: CoffeeStore) => void;
}

type MapTheme = 'voyager' | 'dark' | 'osm';

export const StoreMapView: React.FC<StoreMapViewProps> = ({
  stores,
  allStores = [],
  userLocation,
  selectedStore,
  onSelectStore,
  onOpenStoreDetails,
  onGetDirections,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  const [activePin, setActivePin] = useState<CoffeeStore | null>(
    selectedStore || stores[0] || allStores[0] || null
  );
  const [mapTheme, setMapTheme] = useState<MapTheme>(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'voyager';
  });
  const [activeMetro, setActiveMetro] = useState<string>('all');

  // If filtered stores is empty, fallback to allStores so map is never empty/broken
  const effectiveStores = stores.length > 0 ? stores : allStores;

  // Custom DivIcon generator for Roasteries
  const createStoreMarkerIcon = useCallback((store: CoffeeStore, isSelected: boolean) => {
    const isTopRated = store.rating >= 4.8;
    const bgGradient = isSelected
      ? 'background: linear-gradient(135deg, #E09F3E 0%, #C86D27 50%, #8A4A1C 100%);'
      : isTopRated
      ? 'background: linear-gradient(135deg, #2E1B12 0%, #4A2818 100%);'
      : 'background: #23160F;';

    const ringEffect = isSelected
      ? 'box-shadow: 0 0 0 4px #FFFFFF, 0 8px 24px rgba(224, 159, 62, 0.6);'
      : 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);';

    const shortName = store.name.split(' ')[0];
    const distText = store.distanceMiles !== undefined ? `${store.distanceMiles.toFixed(1)}mi` : '';

    const html = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 12px;
          ${bgGradient}
          ${ringEffect}
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFF;
          transition: transform 0.2s ease;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
          ${
            isSelected
              ? `<span style="position: absolute; top: -3px; right: -3px; width: 10px; height: 10px; border-radius: 50%; background: #10B981; border: 2px solid #FFF;"></span>`
              : ''
          }
        </div>
        <div style="
          margin-top: 4px;
          padding: 2px 7px;
          border-radius: 6px;
          background: rgba(26, 14, 10, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #FAF5EB;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          <span>${shortName}</span>
          <span style="color: #FBBF24;">★${store.rating}</span>
          ${distText ? `<span style="opacity: 0.7; font-size: 9px;">• ${distText}</span>` : ''}
        </div>
        <div style="width: 6px; height: 6px; background: rgba(26, 14, 10, 0.92); transform: rotate(45deg); margin-top: -3px;"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-store-pin',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }, []);

  // Custom DivIcon for User Location GPS Dot
  const createUserMarkerIcon = useCallback(() => {
    const html = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(59, 130, 246, 0.28); animation: pulse 2s infinite ease-in-out;"></div>
        <div style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background: rgba(37, 99, 235, 0.45); border: 2px solid #FFF;"></div>
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #2563EB; box-shadow: 0 0 6px rgba(37, 99, 235, 0.8);"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-user-gps-pin',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center on userLocation or first store
    const initialLat = userLocation?.lat || 37.7749;
    const initialLng = userLocation?.lng || -122.4194;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      maxBoundsViscosity: 0.8,
    });

    mapInstanceRef.current = map;

    // Create markers layer group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Add Tile Layer
    const getTileUrl = (theme: MapTheme) => {
      if (theme === 'dark') {
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png';
      }
      if (theme === 'osm') {
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      }
      // CartoDB Voyager: clean, warm artisanal palette
      return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    };

    const tileLayer = L.tileLayer(getTileUrl(mapTheme), {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Force map to adapt container dimensions properly
    const resizeTimeout = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(resizeTimeout);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer on Theme Change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const getTileUrl = (theme: MapTheme) => {
      if (theme === 'dark') {
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png';
      }
      if (theme === 'osm') {
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      }
      return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    };

    tileLayerRef.current.setUrl(getTileUrl(mapTheme));
  }, [mapTheme]);

  // Keep map properly sized if window/container resizes
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver && container) {
        resizeObserver.unobserve(container);
      }
    };
  }, []);

  // Render User Location and Stores Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Render User Location GPS Pin
    if (userLocation && typeof userLocation.lat === 'number' && typeof userLocation.lng === 'number') {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: createUserMarkerIcon(),
        zIndexOffset: 1000,
      });
      userMarker.addTo(markersGroup);
      userMarkerRef.current = userMarker;

      // 1-mile radius halo circle
      const userCircle = L.circle([userLocation.lat, userLocation.lng], {
        radius: 1609.34, // 1 mile in meters
        color: '#E09F3E',
        weight: 1.5,
        dashArray: '4, 6',
        fillColor: '#E09F3E',
        fillOpacity: 0.06,
      });
      userCircle.addTo(markersGroup);
      userCircleRef.current = userCircle;
    }

    // 2. Render Roastery Store Markers
    const bounds = L.latLngBounds([]);
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }

    effectiveStores.forEach((store) => {
      if (!store.coordinates || isNaN(store.coordinates.lat) || isNaN(store.coordinates.lng)) return;

      const isSelected = activePin?.id === store.id;
      const marker = L.marker([store.coordinates.lat, store.coordinates.lng], {
        icon: createStoreMarkerIcon(store, isSelected),
        zIndexOffset: isSelected ? 800 : 400,
      });

      marker.on('click', () => {
        setActivePin(store);
        onSelectStore(store);
        map.flyTo([store.coordinates.lat, store.coordinates.lng], Math.max(map.getZoom(), 14), {
          duration: 0.8,
        });
      });

      marker.addTo(markersGroup);
      bounds.extend([store.coordinates.lat, store.coordinates.lng]);
    });

    // Automatically frame all visible markers if initial load or bounds valid
    if (bounds.isValid() && effectiveStores.length > 0 && activeMetro === 'all') {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 14,
      });
    }
  }, [effectiveStores, userLocation, activePin, createStoreMarkerIcon, createUserMarkerIcon, onSelectStore, activeMetro]);

  // Center on Selected Store when prop changes
  useEffect(() => {
    if (selectedStore && mapInstanceRef.current) {
      setActivePin(selectedStore);
      mapInstanceRef.current.flyTo(
        [selectedStore.coordinates.lat, selectedStore.coordinates.lng],
        15,
        { duration: 0.8 }
      );
    }
  }, [selectedStore]);

  // Quick Metro Jumps
  const handleMetroJump = (hubName: string) => {
    setActiveMetro(hubName);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (hubName === 'all') {
      const bounds = L.latLngBounds([]);
      effectiveStores.forEach((s) => bounds.extend([s.coordinates.lat, s.coordinates.lng]));
      if (userLocation) bounds.extend([userLocation.lat, userLocation.lng]);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      return;
    }

    const hub = US_METRO_HUBS.find((h) => h.name.toLowerCase().includes(hubName.toLowerCase()));
    if (hub) {
      map.flyTo([hub.lat, hub.lng], 13, { duration: 1 });
      // Find roastery in this hub
      const matchingStore = effectiveStores.find(
        (s) => s.city.toLowerCase() === hubName.toLowerCase() || s.state === hub.name.split(', ')[1]
      );
      if (matchingStore) {
        setActivePin(matchingStore);
      }
    }
  };

  // Recenter GPS
  const handleRecenterUser = () => {
    if (mapInstanceRef.current && userLocation) {
      setActiveMetro('user');
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 0.8 });
    }
  };

  // Zoom Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Reset to All USA
  const handleFitAll = () => {
    handleMetroJump('all');
  };

  return (
    <div className="relative w-full h-[540px] sm:h-[600px] rounded-3xl overflow-hidden border border-coffee-200/80 dark:border-coffee-800/80 shadow-xl bg-coffee-100 dark:bg-[#120B08] select-none">
      {/* Real Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 0 }} />

      {/* Top Bar: Metro Hub Quick-Jump Selector */}
      <div className="absolute top-3 left-3 right-16 sm:right-auto z-10 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full sm:max-w-2xl">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/90 dark:bg-coffee-950/90 backdrop-blur-md border border-coffee-200/80 dark:border-coffee-800 shadow-md text-xs font-semibold">
          <button
            onClick={() => handleMetroJump('all')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap min-h-[32px] ${
              activeMetro === 'all'
                ? 'bg-coffee-900 text-white dark:bg-roast-amber dark:text-coffee-950 font-bold shadow-sm'
                : 'text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100 dark:hover:bg-coffee-900'
            }`}
          >
            All USA ({effectiveStores.length})
          </button>

          {[
            { id: 'san francisco', label: 'SF' },
            { id: 'seattle', label: 'Seattle' },
            { id: 'new york', label: 'NYC' },
            { id: 'austin', label: 'Austin' },
            { id: 'chicago', label: 'Chicago' },
            { id: 'los angeles', label: 'LA' },
            { id: 'portland', label: 'Portland' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleMetroJump(item.id)}
              className={`px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap min-h-[32px] ${
                activeMetro === item.id
                  ? 'bg-coffee-900 text-white dark:bg-roast-amber dark:text-coffee-950 font-bold shadow-sm'
                  : 'text-coffee-700 dark:text-coffee-300 hover:bg-coffee-100 dark:hover:bg-coffee-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Map Zoom & Action Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-xl bg-white/95 dark:bg-coffee-950/95 text-coffee-800 dark:text-cream-100 border border-coffee-200/80 dark:border-coffee-800 flex items-center justify-center font-bold text-lg shadow-md hover:bg-coffee-100 active:scale-95 transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-xl bg-white/95 dark:bg-coffee-950/95 text-coffee-800 dark:text-cream-100 border border-coffee-200/80 dark:border-coffee-800 flex items-center justify-center font-bold text-lg shadow-md hover:bg-coffee-100 active:scale-95 transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleRecenterUser}
          className="w-9 h-9 rounded-xl bg-white/95 dark:bg-coffee-950/95 text-blue-600 dark:text-blue-400 border border-coffee-200/80 dark:border-coffee-800 flex items-center justify-center shadow-md hover:bg-coffee-100 active:scale-95 transition-all"
          title="Recenter on My GPS Location"
        >
          <Navigation className="w-4 h-4 fill-current" />
        </button>
        <button
          onClick={handleFitAll}
          className="w-9 h-9 rounded-xl bg-white/95 dark:bg-coffee-950/95 text-roast-amber border border-coffee-200/80 dark:border-coffee-800 flex items-center justify-center shadow-md hover:bg-coffee-100 active:scale-95 transition-all"
          title="Fit All Roasteries in View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            setMapTheme((t) => (t === 'voyager' ? 'dark' : t === 'dark' ? 'osm' : 'voyager'))
          }
          className="w-9 h-9 rounded-xl bg-white/95 dark:bg-coffee-950/95 text-coffee-700 dark:text-cream-200 border border-coffee-200/80 dark:border-coffee-800 flex items-center justify-center shadow-md hover:bg-coffee-100 active:scale-95 transition-all"
          title={`Current style: ${mapTheme}. Tap to change map layer.`}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Fallback Notice if current filter yielded 0 local stores */}
      {stores.length === 0 && allStores.length > 0 && (
        <div className="absolute top-16 left-3 right-3 sm:left-auto sm:right-16 z-10 p-2.5 px-4 rounded-2xl bg-amber-500/90 text-coffee-950 font-bold text-xs backdrop-blur-md shadow-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>No roasteries matched within radius filter. Displaying all {allStores.length} US Roasteries!</span>
        </div>
      )}

      {/* Selected Roastery Bottom Floating Card */}
      {activePin && (
        <div className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-auto sm:w-[400px] z-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="glass-panel p-4 rounded-3xl shadow-2xl border border-coffee-200/90 dark:border-coffee-800 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {activePin.image && (
                  <img
                    src={toWebp(activePin.image, 160, 75)}
                    alt={`Storefront of ${activePin.name}`}
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-2xl object-cover border border-coffee-200/60 dark:border-coffee-700 shadow-sm shrink-0"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                        activePin.isOpen
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {activePin.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="text-xs font-semibold text-coffee-600 dark:text-coffee-300">
                      {activePin.priceLevel}
                    </span>
                    <span className="text-[11px] text-roast-caramel dark:text-roast-amber font-bold">
                      {activePin.roastStyle}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-coffee-950 dark:text-cream-50 font-serif mt-0.5 line-clamp-1">
                    {activePin.name}
                  </h4>
                  <p className="text-xs text-coffee-600 dark:text-coffee-400 mt-0.5 line-clamp-1">
                    {activePin.address}, {activePin.city}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActivePin(null)}
                className="p-1.5 rounded-full text-coffee-400 hover:text-coffee-800 dark:hover:text-cream-100 transition-colors"
                title="Dismiss Card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Distance & Ratings Bar */}
            <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-coffee-100/70 dark:bg-coffee-900/60 text-coffee-800 dark:text-coffee-200">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="font-bold">{activePin.rating}</span>
                <span className="text-coffee-500 text-[11px]">({activePin.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <Navigation className="w-3.5 h-3.5 text-roast-caramel" />
                <span>{activePin.distanceMiles !== undefined ? `${activePin.distanceMiles} mi away` : 'Selected'}</span>
                {activePin.travelTimeMinutes && (
                  <span className="text-coffee-400">• ~{activePin.travelTimeMinutes} min</span>
                )}
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-0.5">
              <button
                onClick={() => onGetDirections(activePin)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-white/90 dark:bg-coffee-900 hover:bg-coffee-100 dark:hover:bg-coffee-800 border border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-cream-100 font-bold text-xs transition-colors min-h-[44px]"
              >
                <Navigation className="w-3.5 h-3.5 text-roast-amber" />
                <span>Directions</span>
                <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
              </button>
              <button
                onClick={() => onOpenStoreDetails(activePin)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-coffee-900 dark:bg-roast-amber hover:opacity-90 text-white dark:text-coffee-950 font-bold text-xs transition-all shadow-md active:scale-98 min-h-[44px]"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>View Menu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend Overlay (Bottom Right) */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 dark:bg-coffee-950/85 backdrop-blur-md border border-coffee-200/60 dark:border-coffee-800 text-[11px] font-semibold text-coffee-800 dark:text-coffee-200 shadow-md">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-500/30" />
        <span>Your GPS</span>
        <span className="text-coffee-300 dark:text-coffee-700">•</span>
        <span className="w-2.5 h-2.5 rounded-full bg-roast-caramel" />
        <span>Craft Roastery</span>
      </div>
    </div>
  );
};
