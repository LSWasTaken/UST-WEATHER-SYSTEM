import React, { Suspense } from 'react';
import { WeatherData } from '../../types/weather';
import TabSection from '../TabSection';
import LoadingSpinner from '../LoadingSpinner';

// Lazy imports
const WeatherDetailsGrid = React.lazy(() => import('../WeatherDetailsGrid'));
const HourlyDetails = React.lazy(() => import('../HourlyDetails'));

interface DetailsTabContentProps {
  weatherData: WeatherData;
}

const DetailsTabContent: React.FC<DetailsTabContentProps> = ({ weatherData }) => {
  return (
    <TabSection>
      <Suspense fallback={<LoadingSpinner />}>
        <WeatherDetailsGrid data={weatherData} />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <HourlyDetails hourly={weatherData.hourly} />
      </Suspense>
    </TabSection>
  );
};

export default DetailsTabContent;
