import React from 'react';
import TabSection from '../TabSection';

const TrendsTabContent: React.FC = () => {
  return (
    <TabSection>
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Weather Trends</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Temperature Trends</h4>
            <p className="text-gray-400 text-sm">Historical temperature patterns and predictions</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Precipitation Trends</h4>
            <p className="text-gray-400 text-sm">Rainfall patterns and seasonal analysis</p>
          </div>
        </div>
      </div>
    </TabSection>
  );
};

export default TrendsTabContent;
