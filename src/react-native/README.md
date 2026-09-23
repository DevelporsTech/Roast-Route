# Roast & Route: React Native & Three.js Architecture Specification

This codebase powers the complete **Roast & Route** coffee discovery, 3D interactive hero, real-time store locator, and daily caffeine wellness experience.

## 1. Modular Architecture Mapping

```
src/
├── components/          # Reusable UI widgets (StoreCard, Navbar, BottomNav, etc.)
│   ├── ThreeD/          # Three.js 3D Coffee Cup engine with particles & shaders
│   ├── StoreLocator/    # Store cards, interactive SVG/Canvas map, detail modal
│   ├── Ordering/        # Drink customizer, cart drawer, live order tracking
│   ├── CaffeineTracker/ # Personalized caffeine card & sleep impact modal
│   ├── Auth/            # OAuth authentication (Apple, Google) & digital loyalty pass
│   └── SeoGeoHub.tsx    # Generative Engine Optimization (GEO) & local city hubs
├── data/
│   └── storesData.ts    # Authentic North American specialty coffee roasters catalog
├── services/
│   ├── locationService.ts     # Haversine distance in US statute miles, GPS tracking
│   ├── caffeineEngine.ts      # FDA/Health Canada intake guidelines, bedtime half-life
│   └── notificationService.ts # Audio synthesis chime & Web Push alerts
├── types/
│   └── index.ts         # Central TypeScript domain models
└── react-native/        # React Native & Expo GL bridge components
```

## 2. 3D Three.js Integration
- **Web & Streaming Runtime**: Standard Three.js with ACESFilmicToneMapping, procedural lathe cup, specular ceramic shaders, particle steam system, and orbital beans.
- **React Native (Expo)**: Can be deployed to iOS and Android using `expo-gl` + `@react-three/fiber/native` or `@react-three/drei/native`.

## 3. Real-Time Tracking & US Localization
- Distances are computed in statute miles (`0.4 mi`, `1.2 mi`) with city transit estimates.
- Standard 12-hour AM/PM time formatting and US telephone numbering.
- Pricing in USD with accurate state sales tax and barista tip increments.

## 4. Personalized Caffeine Algorithm
- Tailored for age brackets (Adolescent 100mg limit up to Adult 400mg).
- Dynamic metabolic decay calculation: calculates milligrams remaining in the bloodstream by bedtime using a standard 5.5-hour half-life model.
