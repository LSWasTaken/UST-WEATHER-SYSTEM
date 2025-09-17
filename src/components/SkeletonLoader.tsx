import React from 'react';

interface SkeletonLoaderProps {
  height?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  height = 'h-20', 
  className = '' 
}) => {
  return (
    <div className={`bg-gray-800/30 rounded-lg animate-pulse ${height} ${className}`} />
  );
};

export default SkeletonLoader;
