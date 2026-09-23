export type DrinkCategory = 'espresso' | 'filter' | 'cold_brew' | 'specialty' | 'tea' | 'bakery';

export type RecipientAgeGroup = 'child' | 'adult' | 'senior'; // Child, Adult, and Over-Aged / Senior

export interface CustomizationOptions {
  size: 'small' | 'medium' | 'large';
  milk: 'whole' | 'oat' | 'almond' | 'breve' | 'none';
  espressoShots: number;
  sweetness: 'none' | 'less' | 'regular' | 'extra';
  iceLevel?: 'none' | 'light' | 'regular' | 'extra';
  recipientGroup?: RecipientAgeGroup; // 'child' | 'adult' | 'senior'
  specialNotes?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: DrinkCategory;
  description: string;
  basePrice: number;
  caffeineMg: number;
  image: string;
  popular?: boolean;
  dietary?: string[]; // e.g. ['Vegan', 'Gluten-Free', 'Single-Origin']
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface CoffeeStore {
  id: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceMiles?: number;
  travelTimeMinutes?: number;
  rating: number;
  reviewCount: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  isOpen: boolean;
  openingHours: string;
  image: string;
  categories: string[];
  amenities: string[];
  roastStyle: string; // e.g. 'Light Nordic', 'Medium Artisanal', 'Direct Trade'
  menu: MenuItem[];
  featuredDrink: string;
  isFavorite?: boolean;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  storeId: string;
  storeName: string;
  customization: CustomizationOptions;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  storeLocation?: string;
  date?: string;
  totalItems?: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  pointsEarned: number;
  status: 'placed' | 'brewing' | 'ready' | 'completed';
  timestamp: string;
  placedAt?: string;
  estimatedPickupMinutes: number;
  pickupCounterCode: string;
}

export interface CaffeineLogEntry {
  id: string;
  drinkName: string;
  caffeineMg: number;
  timestamp: string;
  timeDisplay: string;
  icon?: string;
}

export interface CaffeineRecommendation {
  drinkName: string;
  servingSize: string;
  caffeineMg: number;
  reason: string;
  timeWindow: string;
  sleepImpactHours: number;
  safetyLevel: 'optimal' | 'moderate' | 'cautious';
}

export interface UserPreferences {
  ageGroup: 'teen' | 'young_adult' | 'adult' | 'senior';
  caffeineSensitivity: 'low' | 'medium' | 'high';
  bedtimeTarget: string; // e.g. "22:30"
  preferredCoffeeTypes: string[];
  dailyConsumptionHabit: '1 cup' | '2-3 cups' | '4+ cups';
  maxDailyCaffeineMg: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  memberTier: 'Bronze Brewer' | 'Silver Bean' | 'Gold Roaster' | 'Artisan Elite';
  loyaltyPoints: number;
  lifetimeDrinks: number;
  savedStores: string[];
  isLoggedIn: boolean;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  openNowOnly: boolean;
  minRating: number;
  selectedAmenities: string[];
  maxDistanceMiles: number;
  category: string;
  sortBy: 'distance' | 'rating' | 'popular';
}
