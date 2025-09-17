import React, { Suspense } from 'react';
import TabSection from '../TabSection';
import SkeletonLoader from '../SkeletonLoader';

// Lazy imports
const FreeMapSection = React.lazy(() => import('../FreeMapSection'));

const MapsTabContent: React.FC = () => {
  return (
    <TabSection>
      <Suspense fallback={<SkeletonLoader height="h-64" />}>
        <FreeMapSection />
      </Suspense>
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Weather Map Layers</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-2">Temperature Map</h4>
            <p className="text-gray-400 text-sm">Real-time temperature visualization across the UST area</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-2">Precipitation Map</h4>
            <p className="text-gray-400 text-sm">Rainfall intensity and probability mapping</p>
          </div>
        </div>
      </div>
    </TabSection>
  );
};

export default MapsTabContent;
