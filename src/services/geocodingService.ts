// Geocoding service for address validation and coordinate accuracy
export interface GeocodedLocation {
  address: string;
  coordinates: { lat: number; lng: number };
  formattedAddress: string;
  verified: boolean;
}

export class GeocodingService {
  // Mumbai and Thane area verified coordinates
  private static verifiedLocations: Record<string, GeocodedLocation> = {
    'bandra-kurla-complex': {
      address: "Bandra Kurla Complex, Bandra East",
      coordinates: { lat: 19.0619, lng: 72.8685 },
      formattedAddress: "Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051",
      verified: true
    },
    'linking-road-bandra': {
      address: "Linking Road, Bandra West",
      coordinates: { lat: 19.0596, lng: 72.8295 },
      formattedAddress: "Linking Road, Bandra West, Mumbai, Maharashtra 400050",
      verified: true
    },
    'worli-sea-face': {
      address: "Worli Sea Face",
      coordinates: { lat: 19.0176, lng: 72.8118 },
      formattedAddress: "Worli Sea Face, Mumbai, Maharashtra 400018",
      verified: true
    },
    'carter-road-bandra': {
      address: "Carter Road, Bandra West",
      coordinates: { lat: 19.0728, lng: 72.8194 },
      formattedAddress: "Carter Road, Bandra West, Mumbai, Maharashtra 400050",
      verified: true
    },
    'colaba-causeway': {
      address: "Colaba Causeway, Colaba",
      coordinates: { lat: 18.9067, lng: 72.8147 },
      formattedAddress: "Colaba Causeway, Colaba, Mumbai, Maharashtra 400005",
      verified: true
    },
    'fort-area': {
      address: "Fort Area, Mumbai",
      coordinates: { lat: 18.9389, lng: 72.8357 },
      formattedAddress: "Fort Area, Mumbai, Maharashtra 400001",
      verified: true
    },
    'majiwada-thane': {
      address: "Majiwada, Thane West",
      coordinates: { lat: 19.2147, lng: 72.9647 },
      formattedAddress: "Majiwada, Thane West, Maharashtra 400601",
      verified: true
    },
    'ghodbunder-road-thane': {
      address: "Ghodbunder Road, Thane West",
      coordinates: { lat: 19.2183, lng: 72.9781 },
      formattedAddress: "Ghodbunder Road, Thane West, Maharashtra 400607",
      verified: true
    },
    'hiranandani-estate-thane': {
      address: "Hiranandani Estate, Thane West",
      coordinates: { lat: 19.2056, lng: 72.9689 },
      formattedAddress: "Hiranandani Estate, Thane West, Maharashtra 400607",
      verified: true
    },
    'naupada-thane': {
      address: "Naupada, Thane West",
      coordinates: { lat: 19.1866, lng: 72.9781 },
      formattedAddress: "Naupada, Thane West, Maharashtra 400602",
      verified: true
    }
  };

  /**
   * Get verified coordinates for a known location
   */
  static getVerifiedLocation(locationKey: string): GeocodedLocation | null {
    return this.verifiedLocations[locationKey] || null;
  }

  /**
   * Find the best matching location for an address
   */
  static findBestMatch(address: string): GeocodedLocation | null {
    const normalizedAddress = address.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    
    for (const [key, location] of Object.entries(this.verifiedLocations)) {
      const normalizedLocationAddress = location.address.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      
      // Check for exact match or significant overlap
      if (normalizedAddress.includes(normalizedLocationAddress) || 
          normalizedLocationAddress.includes(normalizedAddress)) {
        return location;
      }
    }
    
    return null;
  }

  /**
   * Validate and correct coordinates for an address
   */
  static validateAddress(address: string, coordinates: { lat: number; lng: number }): GeocodedLocation {
    const verifiedLocation = this.findBestMatch(address);
    
    if (verifiedLocation) {
      // Check if coordinates are close to verified location (within ~1km)
      const distance = this.calculateDistance(
        coordinates.lat, coordinates.lng,
        verifiedLocation.coordinates.lat, verifiedLocation.coordinates.lng
      );
      
      if (distance <= 1.0) {
        return {
          ...verifiedLocation,
          verified: true
        };
      } else {
        // Coordinates don't match, use verified coordinates
        return {
          ...verifiedLocation,
          verified: true
        };
      }
    }
    
    // No verified location found, return original data with warning
    return {
      address,
      coordinates,
      formattedAddress: address,
      verified: false
    };
  }

  /**
   * Calculate distance between two coordinates in kilometers
   */
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Get all verified locations
   */
  static getAllVerifiedLocations(): GeocodedLocation[] {
    return Object.values(this.verifiedLocations);
  }

  /**
   * Format address for Google Maps
   */
  static formatAddressForMaps(address: string, city: string, state: string, zipCode: string): string {
    return `${address}, ${city}, ${state} ${zipCode}`.trim();
  }

  /**
   * Create Google Maps URL with address
   */
  static createMapsUrl(address: string, city: string, state: string, zipCode: string): string {
    const fullAddress = this.formatAddressForMaps(address, city, state, zipCode);
    const encodedAddress = encodeURIComponent(fullAddress);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  }

  /**
   * Create Google Maps URL with coordinates as fallback
   */
  static createMapsUrlWithCoordinates(coordinates: { lat: number; lng: number }): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
  }
}
