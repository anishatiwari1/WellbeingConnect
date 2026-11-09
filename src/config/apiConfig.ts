// API Configuration
// In production, use environment variables for security

export const API_CONFIG = {
  // Google Maps API Key - Replace with your actual key
  // Get from: https://console.cloud.google.com/apis/credentials
  GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
  
  // Required Google APIs to enable:
  // - Maps JavaScript API
  // - Places API  
  // - Geocoding API
  
  // API Endpoints
  GOOGLE_PLACES_API: 'https://maps.googleapis.com/maps/api/place',
  GOOGLE_GEOCODING_API: 'https://maps.googleapis.com/maps/api/geocode',
  
  // Default search parameters
  DEFAULT_SEARCH_RADIUS: 10000, // 10km in meters
  MAX_RESULTS: 20,
  
  // Fallback locations for demo
  DEMO_MODE: true // Set to false when you have a real API key
};

// Instructions for setting up Google Maps API:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing
// 3. Enable Maps JavaScript API, Places API, and Geocoding API
// 4. Create credentials (API Key)
// 5. Restrict the API key to your domain for security
// 6. Replace 'YOUR_API_KEY_HERE' with your actual key
// 7. Set DEMO_MODE to false
