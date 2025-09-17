import React from 'react';
import TabSection from '../TabSection';

const MonthlyTabContent: React.FC = () => {
  return (
    <TabSection>
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Monthly Weather Overview</h3>
        <p className="text-gray-400">Monthly weather statistics and trends for UST area</p>
        <div className="mt-4 text-center text-gray-500">
          <p>Monthly data visualization coming soon...</p>
        </div>
      </div>
    </TabSection>
  );
};

export default MonthlyTabContent;
