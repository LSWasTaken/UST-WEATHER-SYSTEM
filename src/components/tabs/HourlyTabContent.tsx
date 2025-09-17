import React, { Suspense } from 'react';
import { WeatherData } from '../../types/weather';
import TabSection from '../TabSection';
import LoadingSpinner from '../LoadingSpinner';

// Lazy imports
const HourlyDetails = React.lazy(() => import('../HourlyDetails'));

interface HourlyTabContentProps {
  weatherData: WeatherData;
}

const HourlyTabContent: React.FC<HourlyTabContentProps> = ({ weatherData }) => {
  return (
    <TabSection>
      <Suspense fallback={<LoadingSpinner />}>
        <HourlyDetails hourly={weatherData.hourly} />
      </Suspense>
    </TabSection>
  );
};

export default HourlyTabContent;
