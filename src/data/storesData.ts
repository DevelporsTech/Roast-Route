import { CoffeeStore, Order } from '../types';

export const INITIAL_STORES: CoffeeStore[] = [
  {
    id: 'sf-ritual-valencia',
    name: 'Ritual Coffee Roasters',
    tagline: 'Pioneering light-roast single origin specialty coffee since 2005',
    address: '1026 Valencia St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94110',
    phone: '(415) 641-1011',
    coordinates: { lat: 37.7563, lng: -122.4211 },
    rating: 4.8,
    reviewCount: 1420,
    priceLevel: '$$',
    isOpen: true,
    openingHours: '6:30 AM – 6:00 PM',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=75&fm=webp',
    categories: ['Single Origin', 'Pour-Over', 'Espresso', 'Oat Milk'],
    amenities: ['High-Speed WiFi', 'Outdoor Patio', 'Roastery On-Site', 'Pet Friendly', 'Oat & Almond Milk'],
    roastStyle: 'Light Nordic & Citrus Forward',
    featuredDrink: 'Sweet Tooth Espresso & Tonic',
    menu: [
      {
        id: 'rit-1',
        name: 'Single-Origin Ethiopian Pour-Over',
        category: 'filter',
        description: 'Washed heirloom variety with vibrant notes of bergamot, honeysuckle, and candied lemon.',
        basePrice: 6.25,
        caffeineMg: 165,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true,
        dietary: ['Single-Origin', 'Vegan']
      },
      {
        id: 'rit-2',
        name: 'Brown Sugar Cardamom Cortado',
        category: 'espresso',
        description: 'Equal parts velvety micro-foamed oat milk and double ristretto with house cardamom syrup.',
        basePrice: 5.50,
        caffeineMg: 130,
        image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true,
        dietary: ['House-Crafted']
      },
      {
        id: 'rit-3',
        name: 'Flash-Chilled Nitro Cold Brew',
        category: 'cold_brew',
        description: 'Infused with food-grade nitrogen for a creamy Guinness-like cascade and sweet cocoa finish.',
        basePrice: 5.75,
        caffeineMg: 210,
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true,
        dietary: ['Vegan', 'Sugar-Free']
      },
      {
        id: 'rit-4',
        name: 'Vanilla Bean Oat Latte',
        category: 'espresso',
        description: 'Madagascar bourbon vanilla caviar infused into steamed Minor Figures oat milk.',
        basePrice: 6.50,
        caffeineMg: 130,
        image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=75&fm=webp',
        dietary: ['Plant-Based']
      },
      {
        id: 'rit-5',
        name: 'Almond Kouign-Amann',
        category: 'bakery',
        description: 'Caramelized layered Breton pastry with toasted California almonds.',
        basePrice: 4.75,
        caffeineMg: 0,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=75&fm=webp',
        dietary: ['Fresh Daily']
      }
    ]
  },
  {
    id: 'sf-sightglass-7th',
    name: 'Sightglass Coffee Flagship',
    tagline: 'Multi-level industrial roastery, espresso laboratory, and cupping bar',
    address: '270 7th St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    phone: '(415) 861-1313',
    coordinates: { lat: 37.7766, lng: -122.4085 },
    rating: 4.9,
    reviewCount: 2310,
    priceLevel: '$$$',
    isOpen: true,
    openingHours: '7:00 AM – 5:00 PM',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=75&fm=webp',
    categories: ['Espresso Bar', 'Vintage Probat Roaster', 'Pastries', 'Aeropress'],
    amenities: ['High-Speed WiFi', 'Spacious Seating', 'Roastery Tours', 'Wheelchair Accessible', 'Curbside Pickup'],
    roastStyle: 'Balanced Medium-Light & Direct Trade',
    featuredDrink: 'Banner Dark Vanilla Draft Latte',
    menu: [
      {
        id: 'sg-1',
        name: 'Owl’s Howl Signature Espresso',
        category: 'espresso',
        description: 'Candied citrus, bittersweet dark chocolate, and dense hazelnut crema.',
        basePrice: 4.25,
        caffeineMg: 140,
        image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true,
        dietary: ['Direct-Trade']
      },
      {
        id: 'sg-2',
        name: 'Cascara Coffee Cherry Tonic',
        category: 'specialty',
        description: 'Sun-dried coffee cherry tea brewed cold, sparkling tonic water, and expressed orange peel.',
        basePrice: 5.75,
        caffeineMg: 45,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true,
        dietary: ['Low-Caffeine', 'Antioxidant']
      },
      {
        id: 'sg-3',
        name: 'Kenyan Chemex Pour-Over (Serves 2)',
        category: 'filter',
        description: 'Blackcurrant, red grapefruit, and cane sugar sweetness. Pristine clarity.',
        basePrice: 8.50,
        caffeineMg: 280,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=75&fm=webp',
        dietary: ['Single-Origin']
      },
      {
        id: 'sg-4',
        name: 'Cardamom Morning Bun',
        category: 'bakery',
        description: 'Tartine-style laminated brioche rolled in spiced orange sugar and cardamom.',
        basePrice: 5.25,
        caffeineMg: 0,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=75&fm=webp',
        dietary: ['Vegetarian']
      }
    ]
  },
  {
    id: 'sea-elm-pioneer',
    name: 'Elm Coffee Roasters',
    tagline: 'Light, delicate, and meticulously roasted coffees in Seattle’s historic core',
    address: '240 2nd Ave S',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98104',
    phone: '(206) 445-7808',
    coordinates: { lat: 47.6006, lng: -122.3314 },
    rating: 4.8,
    reviewCount: 980,
    priceLevel: '$$',
    isOpen: true,
    openingHours: '7:00 AM – 3:30 PM',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=75&fm=webp',
    categories: ['Third Wave', 'Scandinavian Roast', 'Single Farm'],
    amenities: ['High-Speed WiFi', 'Quiet Study Vibe', 'Street Parking', 'Organic Syrups'],
    roastStyle: 'Nordic Style Light Roast',
    featuredDrink: 'House Hazelnut Cold Brew',
    menu: [
      {
        id: 'elm-1',
        name: 'Nordic Light Roast Batch Brew',
        category: 'filter',
        description: 'Crisp apple, white peach, and golden honey. Extremely clean finish.',
        basePrice: 4.25,
        caffeineMg: 175,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true
      },
      {
        id: 'elm-2',
        name: 'Spiced Rosemary Honey Latte',
        category: 'espresso',
        description: 'Washington wildflower honey steeped with fresh rosemary and organic whole milk.',
        basePrice: 6.25,
        caffeineMg: 135,
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true
      },
      {
        id: 'elm-3',
        name: 'Matcha Blossom Tonic',
        category: 'tea',
        description: 'Ceremonial Uji matcha, elderflower tonic, and lemon essence.',
        basePrice: 5.75,
        caffeineMg: 60,
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=75&fm=webp'
      }
    ]
  },
  {
    id: 'nyc-devocion-williamsburg',
    name: 'Devoción Farm-to-Cup',
    tagline: 'Farm-fresh Colombian beans roasted just 10 days after harvest under a living vertical garden',
    address: '69 Grand St',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11249',
    phone: '(718) 285-6180',
    coordinates: { lat: 40.7144, lng: -73.9644 },
    rating: 4.9,
    reviewCount: 3100,
    priceLevel: '$$$',
    isOpen: true,
    openingHours: '7:30 AM – 7:00 PM',
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=75&fm=webp',
    categories: ['Farm Fresh', 'Cold Brew Bar', 'Living Green Wall', 'Espresso'],
    amenities: ['Living Wall Skylight', 'High-Speed WiFi', 'Power Outlets', 'Wheelchair Accessible', 'Pet Friendly'],
    roastStyle: 'Ultra-Fresh Farm-to-Table Roast',
    featuredDrink: 'Aroma Perfume Pour-Over',
    menu: [
      {
        id: 'dev-1',
        name: 'Toro Medium Roast Flat White',
        category: 'espresso',
        description: 'Milk chocolate, toasted almonds, and sweet vanilla notes with micro-textured milk.',
        basePrice: 5.75,
        caffeineMg: 140,
        image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true
      },
      {
        id: 'dev-2',
        name: 'Wild Honey Cold Brew',
        category: 'cold_brew',
        description: '24-hour slow steep with unfiltered raw honeycomb and orange peel.',
        basePrice: 6.25,
        caffeineMg: 220,
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true
      },
      {
        id: 'dev-3',
        name: 'Cacao Husk Tisane',
        category: 'tea',
        description: 'Rich organic cocoa aroma with zero sugar and natural theobromine lift.',
        basePrice: 4.75,
        caffeineMg: 20,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=75&fm=webp'
      }
    ]
  },
  {
    id: 'atx-fleet-east',
    name: 'Fleet Coffee Co.',
    tagline: 'Experimental craft espresso drinks and tiny house patio vibes in East Austin',
    address: '2427 Webberville Rd',
    city: 'Austin',
    state: 'TX',
    zipCode: '78702',
    phone: '(512) 655-3533',
    coordinates: { lat: 30.2642, lng: -97.7127 },
    rating: 4.9,
    reviewCount: 780,
    priceLevel: '$$',
    isOpen: true,
    openingHours: '7:00 AM – 4:00 PM',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=75&fm=webp',
    categories: ['Experimental', 'Drive-Up Patio', 'Austin Local'],
    amenities: ['Outdoor Sun Patio', 'Drive-Thru Friendly', 'Pet Friendly', 'Oat Milk Specialty'],
    roastStyle: 'Micro-Roaster Rotating Showcase',
    featuredDrink: 'Morning Ritual Espresso Flip',
    menu: [
      {
        id: 'flt-1',
        name: 'The Ritz (Infused Cortado)',
        category: 'specialty',
        description: 'Espresso shaken with salted butter syrup, crushed Ritz cracker rim, and steamed milk.',
        basePrice: 6.00,
        caffeineMg: 130,
        image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true
      },
      {
        id: 'flt-2',
        name: 'Oat Horchata Iced Latte',
        category: 'espresso',
        description: 'House cinnamon-toasted rice milk, piloncillo sugar, and double shot espresso.',
        basePrice: 6.50,
        caffeineMg: 140,
        image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true
      }
    ]
  },
  {
    id: 'chi-sawada-fulton',
    name: 'Sawada Coffee',
    tagline: 'World Latte Art Champion Hiroshi Sawada’s Military Latte powerhouse',
    address: '112 N Green St',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60607',
    phone: '(312) 754-0431',
    coordinates: { lat: 41.8837, lng: -87.6488 },
    rating: 4.8,
    reviewCount: 1850,
    priceLevel: '$$',
    isOpen: true,
    openingHours: '8:00 AM – 4:00 PM',
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=75&fm=webp',
    categories: ['Matcha Latte', 'Pinball Lounge', 'Espresso'],
    amenities: ['High-Speed WiFi', 'Pinball Machine', 'Rustic Communal Seating', 'Pastries'],
    roastStyle: 'Intense Dark-Chocolate Roast',
    featuredDrink: 'Original Military Latte',
    menu: [
      {
        id: 'swd-1',
        name: 'The Military Latte™',
        category: 'specialty',
        description: 'Hiroshi’s world-famous layered brew: ceremonial green matcha, espresso, cocoa, and vanilla.',
        basePrice: 7.25,
        caffeineMg: 190,
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true
      },
      {
        id: 'swd-2',
        name: 'Black Camo Latte',
        category: 'specialty',
        description: 'Activated coconut charcoal, roasted hojicha tea, espresso, and creamy oat milk.',
        basePrice: 7.50,
        caffeineMg: 150,
        image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true
      }
    ]
  },
  {
    id: 'la-verve-dtla',
    name: 'Verve Coffee Roasters DTLA',
    tagline: 'California coastal coffee culture meets clean architectural urban oasis',
    address: '833 S Spring St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90014',
    phone: '(213) 455-5991',
    coordinates: { lat: 34.0431, lng: -118.2536 },
    rating: 4.7,
    reviewCount: 1640,
    priceLevel: '$$$',
    isOpen: true,
    openingHours: '7:00 AM – 6:00 PM',
    image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=800&q=75&fm=webp',
    categories: ['Nitro Draft', 'California Light Roast', 'Breakfast Toast', 'Espresso'],
    amenities: ['Outdoor Living Patio', 'High-Speed WiFi', 'Drive-Thru Lane', 'Farm Fresh Pastries', 'Pet Friendly'],
    roastStyle: 'Vibrant Santa Cruz Light Roast',
    featuredDrink: 'Nitro Flash Brew & Almond Milk',
    menu: [
      {
        id: 'vrv-1',
        name: 'Draft Nitro Flash Brew',
        category: 'cold_brew',
        description: 'Brewed hot in seconds and instantly flash chilled under pressure to lock in aromatics.',
        basePrice: 6.00,
        caffeineMg: 215,
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true
      },
      {
        id: 'vrv-2',
        name: 'Valencia Orange Shakerato',
        category: 'espresso',
        description: 'Double espresso vigorously shaken over ice with organic citrus syrup and light foam head.',
        basePrice: 5.75,
        caffeineMg: 140,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=75&fm=webp'
      }
    ]
  },
  {
    id: 'pdx-coava-grand',
    name: 'Coava Coffee Roasters',
    tagline: 'Single-origin single-producer focus inside a historic bamboo sawmill',
    address: '1300 SE Grand Ave',
    city: 'Portland',
    state: 'OR',
    zipCode: '97214',
    phone: '(503) 894-8134',
    coordinates: { lat: 45.5134, lng: -122.6608 },
    rating: 4.9,
    reviewCount: 1530,
    priceLevel: '$$',
    isOpen: true,
    openingHours: '7:00 AM – 5:00 PM',
    image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=800&q=75&fm=webp',
    categories: ['Metal Filter Cone', 'Single Origin', 'Pacific Northwest'],
    amenities: ['Handmade Bamboo Furniture', 'High-Speed WiFi', 'Roastery View', 'Electric Vehicle Charger'],
    roastStyle: 'Clean Single Farmer Micro-Lots',
    featuredDrink: 'Koke Honey Pour-Over',
    menu: [
      {
        id: 'coav-1',
        name: 'Coava Cone Pour-Over (Honduras David Mancia)',
        category: 'filter',
        description: 'Brewed through custom gold cone filter. Dried fig, toffee, and red apple brightness.',
        basePrice: 5.50,
        caffeineMg: 170,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=75&fm=webp',
        popular: true
      },
      {
        id: 'coav-2',
        name: 'Real Vanilla Bean Mocha',
        category: 'espresso',
        description: 'Single-origin chocolate from Portland’s Woodblock Chocolate, espresso, and creamy whole milk.',
        basePrice: 6.50,
        caffeineMg: 145,
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=75&fm=webp'
      }
    ]
  }
];

export const POPULAR_AMENITIES = [
  'High-Speed WiFi',
  'Outdoor Patio',
  'Roastery On-Site',
  'Drive-Thru Lane',
  'Pet Friendly',
  'Oat & Almond Milk',
  'Quiet Study Vibe',
  'Curbside Pickup'
];

export const US_METRO_HUBS = [
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, zip: '94103' },
  { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321, zip: '98104' },
  { name: 'New York, NY', lat: 40.7128, lng: -74.0060, zip: '10001' },
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431, zip: '78701' },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, zip: '60601' },
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, zip: '90012' },
  { name: 'Portland, OR', lat: 45.5152, lng: -122.6784, zip: '97204' }
];

export const SAMPLE_PAST_ORDERS: Order[] = [
  {
    id: 'RR-934120',
    storeId: 'sf-ritual-valencia',
    storeName: 'Ritual Coffee Roasters',
    storeLocation: '1026 Valencia St, San Francisco, CA 94110',
    date: 'Sep 21, 2026',
    timestamp: '2026-09-21T08:45:00.000Z',
    placedAt: '8:45 AM',
    totalItems: 2,
    status: 'completed',
    items: [
      {
        cartItemId: 'order-item-1',
        storeId: 'sf-ritual-valencia',
        storeName: 'Ritual Coffee Roasters',
        menuItem: {
          id: 'rit-1',
          name: 'Single-Origin Ethiopian Pour-Over',
          category: 'filter',
          description: 'Washed heirloom variety with vibrant notes of bergamot, honeysuckle, and candied lemon.',
          basePrice: 6.25,
          caffeineMg: 165,
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=75&fm=webp',
          popular: true,
          dietary: ['Single-Origin', 'Vegan']
        },
        customization: {
          size: 'large',
          milk: 'none',
          espressoShots: 0,
          sweetness: 'none'
        },
        quantity: 1,
        totalPrice: 7.25
      },
      {
        cartItemId: 'order-item-2',
        storeId: 'sf-ritual-valencia',
        storeName: 'Ritual Coffee Roasters',
        menuItem: {
          id: 'rit-2',
          name: 'Brown Sugar Cardamom Cortado',
          category: 'espresso',
          description: 'Equal parts velvety micro-foamed oat milk and double ristretto with house cardamom syrup.',
          basePrice: 5.50,
          caffeineMg: 130,
          image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=75&fm=webp',
          popular: true,
          dietary: ['House-Crafted']
        },
        customization: {
          size: 'medium',
          milk: 'oat',
          espressoShots: 2,
          sweetness: 'regular'
        },
        quantity: 1,
        totalPrice: 6.00
      }
    ],
    subtotal: 13.25,
    tax: 1.16,
    tip: 2.00,
    total: 16.41,
    pointsEarned: 164,
    estimatedPickupMinutes: 8,
    pickupCounterCode: 'BAY-42'
  },
  {
    id: 'RR-812049',
    storeId: 'sf-sightglass-7th',
    storeName: 'Sightglass Coffee',
    storeLocation: '301 7th St, San Francisco, CA 94103',
    date: 'Sep 19, 2026',
    timestamp: '2026-09-19T11:15:00.000Z',
    placedAt: '11:15 AM',
    totalItems: 3,
    status: 'completed',
    items: [
      {
        cartItemId: 'order-item-3',
        storeId: 'sf-sightglass-7th',
        storeName: 'Sightglass Coffee',
        menuItem: {
          id: 'sg-1',
          name: "Owl's Howl Espresso Tonic",
          category: 'specialty',
          description: 'Candied citrus and dark cocoa espresso poured over artisanal Fever-Tree tonic with blood orange wheel.',
          basePrice: 5.75,
          caffeineMg: 140,
          image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=75&fm=webp',
          popular: true
        },
        customization: {
          size: 'small',
          milk: 'none',
          espressoShots: 2,
          sweetness: 'none'
        },
        quantity: 1,
        totalPrice: 5.75
      },
      {
        cartItemId: 'order-item-4',
        storeId: 'sf-sightglass-7th',
        storeName: 'Sightglass Coffee',
        menuItem: {
          id: 'sg-2',
          name: 'Vanilla Cardamom Latte',
          category: 'espresso',
          description: 'Infused with organic Tahitian vanilla bean and green cardamom pods, double espresso, microfoam.',
          basePrice: 6.25,
          caffeineMg: 130,
          image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=75&fm=webp',
          popular: true
        },
        customization: {
          size: 'large',
          milk: 'oat',
          espressoShots: 2,
          sweetness: 'less'
        },
        quantity: 1,
        totalPrice: 7.25
      },
      {
        cartItemId: 'order-item-5',
        storeId: 'sf-sightglass-7th',
        storeName: 'Sightglass Coffee',
        menuItem: {
          id: 'sg-4',
          name: 'Fresh Almond Butter Croissant',
          category: 'bakery',
          description: 'Flaky twice-baked butter pastry filled with organic crushed almond frangipane.',
          basePrice: 4.50,
          caffeineMg: 0,
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=75&fm=webp'
        },
        customization: {
          size: 'medium',
          milk: 'none',
          espressoShots: 0,
          sweetness: 'none'
        },
        quantity: 1,
        totalPrice: 4.50
      }
    ],
    subtotal: 17.50,
    tax: 1.53,
    tip: 3.00,
    total: 22.03,
    pointsEarned: 220,
    estimatedPickupMinutes: 10,
    pickupCounterCode: 'BAY-18'
  },
  {
    id: 'RR-740283',
    storeId: 'sf-bluebottle-mint',
    storeName: 'Blue Bottle Coffee',
    storeLocation: '66 Mint Plaza, San Francisco, CA 94103',
    date: 'Sep 16, 2026',
    timestamp: '2026-09-16T14:30:00.000Z',
    placedAt: '2:30 PM',
    totalItems: 1,
    status: 'completed',
    items: [
      {
        cartItemId: 'order-item-6',
        storeId: 'sf-bluebottle-mint',
        storeName: 'Blue Bottle Coffee',
        menuItem: {
          id: 'bb-2',
          name: 'Bella Donovan Drip Brew',
          category: 'filter',
          description: 'Rich dark chocolate, ripe raspberry jam, and sweet molasses blend roasted in small batches.',
          basePrice: 4.75,
          caffeineMg: 180,
          image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=75&fm=webp',
          popular: true
        },
        customization: {
          size: 'medium',
          milk: 'almond',
          espressoShots: 0,
          sweetness: 'none'
        },
        quantity: 1,
        totalPrice: 5.25
      }
    ],
    subtotal: 4.75,
    tax: 0.42,
    tip: 1.00,
    total: 6.17,
    pointsEarned: 62,
    estimatedPickupMinutes: 5,
    pickupCounterCode: 'BAY-89'
  }
];
