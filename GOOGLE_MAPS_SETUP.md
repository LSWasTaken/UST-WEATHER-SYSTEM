# Google Maps API Key Setup (Optional)

## Free Alternative Already Implemented ✅

Your app is already using **OpenStreetMap with Leaflet** which is completely FREE and doesn't require any API keys!

## If You Want to Use Google Maps Instead

### Step 1: Get a Free Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### Step 2: Add API Key to Your App

1. Create a `.env` file in your project root:
```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

2. Replace `FreeMapSection` with `GoogleMapSection` in `src/App.tsx`:
```typescript
// Change this line:
import FreeMapSection from './components/FreeMapSection';
// To this:
import GoogleMapSection from './components/GoogleMapSection';

// And update the component usage:
<GoogleMapSection />
```

### Step 3: Security (Recommended)

1. In Google Cloud Console, go to your API key settings
2. Add **Application restrictions**:
   - Choose "HTTP referrers"
   - Add your domain: `localhost:3000`, `localhost:3001`, etc.
3. Add **API restrictions**:
   - Select "Maps JavaScript API"

## Current Free Map Features ✅

- **No API key required**
- **Interactive UST campus map**
- **Click to get weather info**
- **Zoom controls**
- **UST location markers**
- **OpenStreetMap integration**
- **Fully functional**

## Cost Comparison

| Map Service | Cost | Features |
|-------------|------|----------|
| **OpenStreetMap (Current)** | **FREE** | Full functionality, no limits |
| Google Maps | $7 per 1000 loads | More detailed, satellite view |

## Recommendation

The current **OpenStreetMap implementation is perfect** for your UST weather app and costs nothing! Only switch to Google Maps if you specifically need satellite imagery or advanced features.
