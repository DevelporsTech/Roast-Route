export interface Coordinates {
  lat: number;
  lng: number;
}

// Convert degrees to radians
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates great-circle distance between two points in US Statute Miles.
 */
export function calculateDistanceMiles(coord1: Coordinates, coord2: Coordinates): number {
  const R = 3958.8; // Earth radius in statute miles
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Formats distance in US units (feet if under 0.1 mile, otherwise miles)
 */
export function formatDistance(distanceMiles: number): string {
  if (distanceMiles < 0.1) {
    const feet = Math.round(distanceMiles * 5280);
    return `${feet} ft`;
  }
  return `${distanceMiles.toFixed(1)} mi`;
}

/**
 * Estimates driving and walking time
 */
export function estimateTravelTime(distanceMiles: number): {
  walkMinutes: number;
  driveMinutes: number;
} {
  // Average city walking speed: 3.0 mph
  const walkMinutes = Math.max(1, Math.round((distanceMiles / 3.0) * 60));
  // Average city driving speed including signals: 18 mph
  const driveMinutes = Math.max(2, Math.round((distanceMiles / 18.0) * 60) + 2);
  return { walkMinutes, driveMinutes };
}

/**
 * Geolocation wrapper with fallback handling
 */
export async function getCurrentUserLocation(): Promise<{
  coords: Coordinates;
  isRealGps: boolean;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unsupported';
}> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      coords: { lat: 37.7749, lng: -122.4194 }, // Default SF
      isRealGps: false,
      permissionStatus: 'unsupported'
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          },
          isRealGps: true,
          permissionStatus: 'granted'
        });
      },
      (error) => {
        // Fallback to San Francisco coffee capital
        resolve({
          coords: { lat: 37.7749, lng: -122.4194 },
          isRealGps: false,
          permissionStatus: error.code === error.PERMISSION_DENIED ? 'denied' : 'prompt'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 60000
      }
    );
  });
}
