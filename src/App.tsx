import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import {
  CoffeeStore,
  MenuItem,
  CartItem,
  Order,
  CaffeineLogEntry,
  UserPreferences,
  UserProfile,
  CaffeineRecommendation
} from './types';
import { INITIAL_STORES, US_METRO_HUBS, SAMPLE_PAST_ORDERS } from './data/storesData';
import {
  getCurrentUserLocation,
  calculateDistanceMiles,
  estimateTravelTime,
  Coordinates
} from './services/locationService';
import {
  generateDailyRecommendation,
  estimateBedtimeCaffeine
} from './services/caffeineEngine';
import {
  sendPushAlert,
  requestNotificationPermission
} from './services/notificationService';

// Primary Components (Critical Path)
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StoreLocator } from './components/StoreLocator/StoreLocator';
import { DailyCaffeineCard } from './components/CaffeineTracker/DailyCaffeineCard';
import { BottomNav } from './components/BottomNav';

// Lazy Loaded Modals, Sub-views & Below-the-fold Sections (Non-Critical Path)
const SeoGeoHub = lazy(() =>
  import('./components/SeoGeoHub').then((m) => ({ default: m.SeoGeoHub }))
);
const StoreDetailModal = lazy(() =>
  import('./components/StoreLocator/StoreDetailModal').then((m) => ({ default: m.StoreDetailModal }))
);
const DrinkCustomizerModal = lazy(() =>
  import('./components/Ordering/DrinkCustomizerModal').then((m) => ({ default: m.DrinkCustomizerModal }))
);
const CartDrawer = lazy(() =>
  import('./components/Ordering/CartDrawer').then((m) => ({ default: m.CartDrawer }))
);
const OrderTrackerModal = lazy(() =>
  import('./components/Ordering/OrderTrackerModal').then((m) => ({ default: m.OrderTrackerModal }))
);
const CaffeineModal = lazy(() =>
  import('./components/CaffeineTracker/CaffeineModal').then((m) => ({ default: m.CaffeineModal }))
);
const AuthModal = lazy(() =>
  import('./components/Auth/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const OrdersView = lazy(() =>
  import('./components/Orders/OrdersView').then((m) => ({ default: m.OrdersView }))
);
const BaristaKdsModal = lazy(() =>
  import('./components/Orders/BaristaKdsModal').then((m) => ({ default: m.BaristaKdsModal }))
);
import { CheckCircle2, Bell, Sparkles } from 'lucide-react';

export function App() {
  // --- Dark Mode State ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rr_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rr_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rr_theme', 'light');
    }
  }, [darkMode]);

  // --- Location State ---
  const [userLocation, setUserLocation] = useState<Coordinates>({
    lat: 37.7749,
    lng: -122.4194, // Default SF
  });
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('San Francisco, CA');

  // --- Stores Catalog State with distances calculated ---
  const [stores, setStores] = useState<CoffeeStore[]>(() => {
    return INITIAL_STORES.map((store) => {
      const dist = calculateDistanceMiles({ lat: 37.7749, lng: -122.4194 }, store.coordinates);
      const { walkMinutes, driveMinutes } = estimateTravelTime(dist);
      return {
        ...store,
        distanceMiles: dist,
        travelTimeMinutes: dist <= 1.2 ? walkMinutes : driveMinutes,
      };
    });
  });

  // Recalculate distance whenever user location changes (skipping initial mount)
  const isInitialLocationMount = React.useRef(true);
  useEffect(() => {
    if (isInitialLocationMount.current) {
      isInitialLocationMount.current = false;
      return;
    }
    setStores((prev) =>
      prev.map((store) => {
        const dist = calculateDistanceMiles(userLocation, store.coordinates);
        const { walkMinutes, driveMinutes } = estimateTravelTime(dist);
        return {
          ...store,
          distanceMiles: dist,
          travelTimeMinutes: dist <= 1.2 ? walkMinutes : driveMinutes,
        };
      })
    );
  }, [userLocation]);

  // --- User Profile & Loyalty State ---
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rr_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      id: 'usr_guest',
      name: 'Guest Brewer',
      email: 'guest@roastroute.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=75&fm=webp',
      memberTier: 'Gold Roaster',
      loyaltyPoints: 240,
      lifetimeDrinks: 18,
      savedStores: ['sf-ritual-valencia'],
      isLoggedIn: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('rr_user', JSON.stringify(user));
  }, [user]);

  // --- Cart State ---
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rr_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('rr_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Orders State ---
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rr_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SAMPLE_PAST_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('rr_orders', JSON.stringify(orders));
  }, [orders]);

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [isBaristaKdsOpen, setIsBaristaKdsOpen] = useState<boolean>(false);

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // --- Caffeine Logs & Preferences ---
  const [caffeinePreferences, setCaffeinePreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('rr_caffeine_prefs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      ageGroup: 'adult',
      caffeineSensitivity: 'medium',
      bedtimeTarget: '22:30',
      preferredCoffeeTypes: ['Pour-Over', 'Cortado'],
      dailyConsumptionHabit: '2-3 cups',
      maxDailyCaffeineMg: 400,
    };
  });

  const [caffeineLogs, setCaffeineLogs] = useState<CaffeineLogEntry[]>(() => {
    const saved = localStorage.getItem('rr_caffeine_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Default morning log
    return [
      {
        id: 'log-1',
        drinkName: 'Morning Pour-Over Batch Brew',
        caffeineMg: 140,
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
        timeDisplay: '8:15 AM',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('rr_caffeine_prefs', JSON.stringify(caffeinePreferences));
  }, [caffeinePreferences]);

  useEffect(() => {
    localStorage.setItem('rr_caffeine_logs', JSON.stringify(caffeineLogs));
  }, [caffeineLogs]);

  // Daily Caffeine Recommendation calculation
  const recommendation = useMemo(() => {
    return generateDailyRecommendation(caffeinePreferences, caffeineLogs);
  }, [caffeinePreferences, caffeineLogs]);

  // --- UI Modal & View States ---
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [mobileTab, setMobileTab] = useState<'home' | 'stores' | 'map' | 'orders' | 'caffeine' | 'rewards'>('home');
  const [authModalTab, setAuthModalTab] = useState<'profile' | 'loyalty' | 'orders'>('loyalty');
  const [selectedStore, setSelectedStore] = useState<CoffeeStore | null>(null);
  const [customizingItem, setCustomizingItem] = useState<{
    item: MenuItem;
    store: CoffeeStore;
  } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCaffeineModalOpen, setIsCaffeineModalOpen] = useState(false);

  // In-app floating toast alerts
  const [toastMessage, setToastMessage] = useState<{ title: string; body: string } | null>(null);

  // --- Notification & Toast Dispatcher ---
  const handleTriggerNotification = (title: string, body: string) => {
    sendPushAlert(title, body);
    setToastMessage({ title, body });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Detect GPS
  const handleDetectGps = async () => {
    const result = await getCurrentUserLocation();
    setUserLocation(result.coords);
    setIsGpsActive(result.isRealGps);
    if (result.isRealGps) {
      handleTriggerNotification(
        'GPS Location Updated 📍',
        'Showing specialty roasters calibrated to your live GPS coordinates.'
      );
    }
  };

  // Select City Hub
  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName);
    setIsGpsActive(false);
    const hub = US_METRO_HUBS.find((h) => h.name === cityName);
    if (hub) {
      setUserLocation({ lat: hub.lat, lng: hub.lng });
    }
  };

  // Toggle store favorite
  const handleToggleFavorite = (storeId: string) => {
    setUser((prev) => {
      const exists = prev.savedStores.includes(storeId);
      const updatedStores = exists
        ? prev.savedStores.filter((id) => id !== storeId)
        : [...prev.savedStores, storeId];
      return { ...prev, savedStores: updatedStores };
    });

    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
  };

  // Directions launcher
  const handleGetDirections = (store: CoffeeStore) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  // Add to cart handler
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    handleTriggerNotification(
      'Added to Order ☕',
      `${item.quantity}x ${item.menuItem.name} added to your cart.`
    );
  };

  // Cart quantity updater
  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const unitPrice = item.totalPrice / item.quantity;
            return {
              ...item,
              quantity: newQty,
              totalPrice: unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Cart remove
  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  // Order placed handler
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + newOrder.pointsEarned,
      lifetimeDrinks: prev.lifetimeDrinks + newOrder.items.length,
    }));
    setActiveTrackingOrder(newOrder);

    // Request notification permission smoothly
    requestNotificationPermission();

    handleTriggerNotification(
      'Order Confirmed! 🚀',
      `Order #${newOrder.id} placed at ${newOrder.storeName}. Pickup counter code: ${newOrder.pickupCounterCode}.`
    );
  };

  // Reorder past order handler
  const handleReorder = (order: Order) => {
    const newItems: CartItem[] = order.items.map((item, idx) => ({
      ...item,
      cartItemId: `reorder-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
    }));

    setCartItems((prev) => [...prev, ...newItems]);
    setIsCartOpen(true);
    handleTriggerNotification(
      'Items Added to Cart! ☕',
      `Added ${order.items.length} item(s) from Order #${order.id} for quick checkout at ${order.storeName}.`
    );
  };

  // Track past order handler
  const handleTrackOrder = (order: Order) => {
    setActiveTrackingOrder(order);
  };

  // Caffeine Quick Log
  const handleQuickLog = (drinkName: string, mg: number) => {
    const newLog: CaffeineLogEntry = {
      id: `log-${Date.now()}`,
      drinkName,
      caffeineMg: mg,
      timestamp: new Date().toISOString(),
      timeDisplay: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
    setCaffeineLogs((prev) => [...prev, newLog]);
    handleTriggerNotification(
      'Caffeine Logged ⚡',
      `+${mg}mg recorded. Total today: ${caffeineLogs.reduce((s, i) => s + i.caffeineMg, 0) + mg}mg.`
    );
  };

  // Auth Login simulator
  const handleLogin = (provider: 'google' | 'apple' | 'email', email?: string) => {
    setUser({
      id: `usr_${Date.now()}`,
      name: provider === 'google' ? 'Alex Mercer' : provider === 'apple' ? 'Jordan Hayes' : email?.split('@')[0] || 'Coffee Explorer',
      email: email || (provider === 'google' ? 'alex.mercer@gmail.com' : 'jordan.hayes@icloud.com'),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=75&fm=webp',
      memberTier: 'Gold Roaster',
      loyaltyPoints: 320,
      lifetimeDrinks: 24,
      savedStores: ['sf-ritual-valencia', 'sf-sightglass-7th'],
      isLoggedIn: true,
    });
    setIsAuthOpen(false);
    handleTriggerNotification(
      'Welcome to Roast Rewards! 🌟',
      `Signed in securely via ${provider.toUpperCase()}. You have 320 points available!`
    );
  };

  const handleLogout = () => {
    setUser({
      id: 'usr_guest',
      name: 'Guest Brewer',
      email: '',
      avatar: '',
      memberTier: 'Bronze Brewer',
      loyaltyPoints: 0,
      lifetimeDrinks: 0,
      savedStores: [],
      isLoggedIn: false,
    });
    setIsAuthOpen(false);
  };

  const openStoresCount = stores.filter((s) => s.isOpen).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#0E0805] text-coffee-950 dark:text-cream-100 transition-colors duration-300 pb-16 sm:pb-0">
      {/* Floating In-App Push Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 rounded-3xl bg-coffee-900/95 dark:bg-coffee-950/95 text-white backdrop-blur-xl border border-roast-amber/40 shadow-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-roast-amber text-coffee-950 flex items-center justify-center font-bold shrink-0 mt-0.5">
              <Bell className="w-4 h-4 fill-current" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-roast-amber">{toastMessage.title}</h5>
              <p className="text-xs text-cream-200/90 leading-relaxed mt-0.5">{toastMessage.body}</p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onOpenAuth={() => {
          setAuthModalTab('loyalty');
          setIsAuthOpen(true);
        }}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        onDetectGps={handleDetectGps}
        isGpsActive={isGpsActive}
        ordersCount={orders.length}
        onOpenOrders={() => setMobileTab('orders')}
        onGoHome={() => {
          setMobileTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreMap={() => {
          setMobileTab('home');
          setActiveView('map');
          const el = document.getElementById('locator-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main App Content Body */}
      <main className="flex-1 pb-20 sm:pb-0">
        {/* Mobile View Switches */}
        {mobileTab === 'home' && (
          <>
            {/* 3D Interactive Hero */}
            <HeroSection
              onFindNearby={() => {
                const el = document.getElementById('locator-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreMap={() => {
                setActiveView('map');
                const el = document.getElementById('locator-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              openStoreCount={openStoresCount}
            />

            {/* Personalized Daily Caffeine Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 my-4">
              <DailyCaffeineCard
                recommendation={recommendation}
                logs={caffeineLogs}
                preferences={caffeinePreferences}
                onOpenCaffeineDashboard={() => setIsCaffeineModalOpen(true)}
                onQuickLog={handleQuickLog}
                onUpdatePreferences={(newPrefs) =>
                  setCaffeinePreferences((prev) => ({ ...prev, ...newPrefs }))
                }
              />
            </div>

            {/* Store Locator Section */}
            <StoreLocator
              stores={stores}
              userLocation={userLocation}
              onSelectStore={(s) => setSelectedStore(s)}
              onToggleFavorite={handleToggleFavorite}
              onGetDirections={handleGetDirections}
              activeView={activeView}
              onChangeView={(v) => setActiveView(v)}
            />

            {/* SEO & GEO Citations Hub (Deferred) */}
            <Suspense fallback={
              <div className="w-full py-8 text-center text-xs text-coffee-500">
                <span className="text-xs font-semibold">Loading Roastery Directory...</span>
              </div>
            }>
              <SeoGeoHub onSelectCity={handleSelectCity} />
            </Suspense>
          </>
        )}

        {mobileTab === 'stores' && (
          <div className="pt-4">
            <StoreLocator
              stores={stores}
              userLocation={userLocation}
              onSelectStore={(s) => setSelectedStore(s)}
              onToggleFavorite={handleToggleFavorite}
              onGetDirections={handleGetDirections}
              activeView="list"
              onChangeView={(v) => setActiveView(v)}
            />
          </div>
        )}

        {mobileTab === 'map' && (
          <div className="pt-4 max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <h2 className="text-2xl font-serif font-bold">Interactive Roastery Map</h2>
            <StoreLocator
              stores={stores}
              userLocation={userLocation}
              onSelectStore={(s) => setSelectedStore(s)}
              onToggleFavorite={handleToggleFavorite}
              onGetDirections={handleGetDirections}
              activeView="map"
              onChangeView={(v) => setActiveView(v)}
            />
          </div>
        )}

        {mobileTab === 'orders' && (
          <div className="pt-4">
            <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-coffee-600 dark:text-coffee-400">Loading Orders...</div>}>
              <OrdersView
                orders={orders}
                stores={stores}
                onReorder={handleReorder}
                onTrackOrder={handleTrackOrder}
                onExploreShops={() => setMobileTab('stores')}
                onOpenLoyalty={() => {
                  setAuthModalTab('loyalty');
                  setIsAuthOpen(true);
                }}
                onOpenBaristaKds={() => setIsBaristaKdsOpen(true)}
              />
            </Suspense>
          </div>
        )}

        {mobileTab === 'caffeine' && (
          <div className="pt-6 max-w-2xl mx-auto px-4 space-y-6">
            <DailyCaffeineCard
              recommendation={recommendation}
              logs={caffeineLogs}
              preferences={caffeinePreferences}
              onOpenCaffeineDashboard={() => setIsCaffeineModalOpen(true)}
              onQuickLog={handleQuickLog}
              onUpdatePreferences={(newPrefs) =>
                setCaffeinePreferences((prev) => ({ ...prev, ...newPrefs }))
              }
            />
            <button
              onClick={() => setIsCaffeineModalOpen(true)}
              className="w-full py-3 rounded-2xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 font-bold text-xs"
            >
              Open Full Caffeine &amp; Sleep Calculator
            </button>
          </div>
        )}

        {mobileTab === 'rewards' && (
          <div className="pt-6 max-w-md mx-auto px-4">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-full py-3 rounded-2xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 font-bold text-xs"
            >
              Open Member Loyalty Pass
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-white dark:bg-[#120B08] border-t border-coffee-200/80 dark:border-coffee-800 text-xs text-coffee-600 dark:text-coffee-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="font-serif font-extrabold text-base text-coffee-950 dark:text-cream-50 block">
              Roast &amp; Route USA
            </span>
            <p className="text-[11px] max-w-sm">
              Supporting independent specialty roasters, zero-waste farm partnerships, and mindful daily caffeine wellness.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold">
            <button onClick={() => setIsCaffeineModalOpen(true)} className="hover:text-roast-caramel">
              Caffeine Health Calculator
            </button>
            <button onClick={() => setIsAuthOpen(true)} className="hover:text-roast-caramel">
              Loyalty Pass
            </button>
            <button onClick={handleDetectGps} className="hover:text-roast-caramel">
              GPS Calibration
            </button>
          </div>

          <div className="text-[11px] text-coffee-400">
            © {new Date().getFullYear()} Roast &amp; Route Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={mobileTab}
        onChangeTab={(t) => {
          setMobileTab(t);
          if (t === 'rewards') {
            setAuthModalTab('loyalty');
            setIsAuthOpen(true);
          }
          if (t === 'caffeine') setIsCaffeineModalOpen(true);
        }}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        ordersCount={orders.length}
      />

      {/* Modals wrapped in Suspense for code splitting */}
      <Suspense fallback={null}>
        {selectedStore && (
          <StoreDetailModal
            store={selectedStore}
            onClose={() => setSelectedStore(null)}
            onSelectMenuItem={(item, store) => setCustomizingItem({ item, store })}
            onToggleFavorite={handleToggleFavorite}
            onGetDirections={handleGetDirections}
          />
        )}

        {customizingItem && (
          <DrinkCustomizerModal
            item={customizingItem.item}
            store={customizingItem.store}
            onClose={() => setCustomizingItem(null)}
            onAddToCart={handleAddToCart}
          />
        )}

        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            items={cartItems}
            stores={stores}
            onClose={() => setIsCartOpen(false)}
            onRemoveItem={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOrderPlaced={handleOrderPlaced}
            userPoints={user.loyaltyPoints}
          />
        )}

        {activeTrackingOrder && (
          <OrderTrackerModal
            order={activeTrackingOrder}
            onClose={() => setActiveTrackingOrder(null)}
            onSendNotification={handleTriggerNotification}
          />
        )}

        {isBaristaKdsOpen && (
          <BaristaKdsModal
            isOpen={isBaristaKdsOpen}
            onClose={() => setIsBaristaKdsOpen(false)}
            orders={orders}
            stores={stores}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {isCaffeineModalOpen && (
          <CaffeineModal
            isOpen={isCaffeineModalOpen}
            onClose={() => setIsCaffeineModalOpen(false)}
            logs={caffeineLogs}
            preferences={caffeinePreferences}
            recommendation={recommendation}
            onAddLog={(name, mg) => handleQuickLog(name, mg)}
            onRemoveLog={(id) => setCaffeineLogs((p) => p.filter((l) => l.id !== id))}
            onUpdatePreferences={(newP) => setCaffeinePreferences((p) => ({ ...p, ...newP }))}
          />
        )}

        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            user={user}
            orders={orders}
            stores={stores}
            onLogin={handleLogin}
            onLogout={handleLogout}
            initialTab={authModalTab}
            onReorder={handleReorder}
            onTrackOrder={handleTrackOrder}
          />
        )}
      </Suspense>
    </div>
  );
}
export default App;
