# UST Weather System Setup

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google Maps API Key
# Get your API key from: https://developers.google.com/maps/documentation/javascript/get-api-key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Weather API Configuration
VITE_WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
```

## Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security
6. Add the API key to your `.env` file

## Features

### ✅ Implemented Features

- **Dark Theme UI** - Modern dark interface matching the reference design
- **Sidebar Navigation** - Current, Hourly, Details, Maps, Monthly, Trends, News
- **Real-time Weather** - Live weather data for UST area
- **Google Maps Integration** - Interactive map of UST campus
- **Flood Predictions** - 24-hour flood risk with timestamps
- **Rain Predictions** - Detailed rain forecasts with intensity levels
- **Varsitarian News** - Integration with UST's official news source
- **Hourly Details** - Comprehensive hourly weather breakdown
- **Auto-refresh** - Updates every 10 minutes
- **Responsive Design** - Works on all devices

### 🌧️ Weather Predictions

- **Flood Risk Assessment** - Based on rainfall intensity and probability
- **Rain Intensity Levels** - Light, Moderate, Heavy, Extreme
- **Future Timestamps** - Only shows current and future predictions
- **Affected Areas** - UST-specific locations (Main Building, Quadricentennial Pavilion, etc.)
- **Safety Tips** - Weather-related safety recommendations

### 📱 Navigation Tabs

- **Current** - Main weather dashboard with map and forecasts
- **Hourly** - Detailed 24-hour weather breakdown
- **Details** - Current weather + hourly details
- **Maps** - Google Maps with UST area focus
- **Monthly** - Monthly weather overview (coming soon)
- **Trends** - Weather trend analysis (coming soon)
- **News** - Varsitarian news integration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your Google Maps API key

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Deployment

The app is configured for deployment on:
- **Netlify** (netlify.toml included)
- **Vercel** (vercel.json included)

Make sure to add your environment variables in your deployment platform's settings.
