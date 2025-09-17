import React, { Suspense } from 'react';
import TabSection from '../TabSection';
import SkeletonLoader from '../SkeletonLoader';

// Lazy imports
const NewsSection = React.lazy(() => import('../NewsSection'));

const NewsTabContent: React.FC = () => {
  return (
    <TabSection>
      <Suspense fallback={<SkeletonLoader height="h-64" />}>
        <NewsSection />
      </Suspense>
    </TabSection>
  );
};

export default NewsTabContent;
