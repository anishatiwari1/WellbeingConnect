# Google Maps API Setup Instructions

## Overview
The Expert Network page now uses Google Maps APIs to provide real location-based psychologist search. This feature works in two modes:

1. **Demo Mode** (Default): Uses realistic mock data for major Indian cities
2. **Production Mode**: Uses real Google Places API to find actual psychologists

## Setting up Google Maps API (Optional)

### Step 1: Get Google Cloud Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing (required for Maps APIs)

### Step 2: Enable Required APIs
Enable these APIs in your Google Cloud project:
- **Maps JavaScript API**
- **Places API** 
- **Geocoding API**

### Step 3: Create API Key
1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Copy your API key

### Step 4: Secure Your API Key (Important!)
1. Click on your API key to edit it
2. Under **Application restrictions**, select **HTTP referrers**
3. Add your domain (e.g., `localhost:5173/*` for development)
4. Under **API restrictions**, select **Restrict key**
5. Choose the three APIs you enabled above

### Step 5: Add API Key to Your App
1. Open `src/config/apiConfig.ts`
2. Replace `'YOUR_API_KEY_HERE'` with your actual API key
3. Set `DEMO_MODE: false` to enable real API calls

```typescript
export const API_CONFIG = {
  GOOGLE_MAPS_API_KEY: 'your_actual_api_key_here',
  DEMO_MODE: false, // Set to false for production
  // ... rest of config
};
```

### Step 6: Test the Integration
1. Restart your development server: `npm run dev`
2. Go to The Expert Network page
3. Enter a location (e.g., "New York", "London", "Tokyo")
4. The app should now find real psychologists in that area

## Demo Mode Features (No API Key Required)

Even without a Google API key, the app provides:

- **7 Major Indian Cities**: Mumbai, Delhi, Bangalore, Pune, Chennai, Kolkata, Hyderabad
- **Realistic Data**: 8-12 psychologists per city with authentic details
- **Local Information**: Proper addresses, phone numbers, languages, insurance
- **Interactive Map**: Shows psychologist locations on map
- **Full Functionality**: All search and filter features work

## Supported Cities in Demo Mode

- Mumbai, Maharashtra
- Delhi, NCR
- Bangalore, Karnataka  
- Pune, Maharashtra
- Chennai, Tamil Nadu
- Kolkata, West Bengal
- Hyderabad, Telangana

## API Usage and Costs

**Google Maps API Pricing** (as of 2024):
- Places API: $17 per 1,000 requests
- Geocoding API: $5 per 1,000 requests
- Maps JavaScript API: $7 per 1,000 map loads

**Free Tier**: Google provides $200 monthly credit, which covers:
- ~11,700 Places API requests
- ~40,000 Geocoding requests
- ~28,500 map loads

## Troubleshooting

### Common Issues:

1. **"Location not found"**: 
   - Check if the city is in our demo list
   - Verify API key is correct and APIs are enabled

2. **No psychologists found**:
   - Try a major city name
   - Check if Places API is enabled and has quota

3. **Map not loading**:
   - Verify Maps JavaScript API is enabled
   - Check browser console for errors

### Support
For issues with Google Maps integration, check:
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Places API Guide](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Guide](https://developers.google.com/maps/documentation/geocoding)

## Security Notes

- Never commit API keys to version control
- Always restrict API keys to specific domains
- Monitor API usage in Google Cloud Console
- Set up billing alerts to avoid unexpected charges
