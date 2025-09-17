import React from 'react';

interface TabSectionProps {
  children: React.ReactNode;
  className?: string;
}

const TabSection: React.FC<TabSectionProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default TabSection;
