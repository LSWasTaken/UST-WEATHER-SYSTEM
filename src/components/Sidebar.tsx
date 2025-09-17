import React from 'react';
import { Sun, Clock, List, MapPin, Calendar, TrendingUp, Newspaper, ArrowUp, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, collapsed = false, onToggleCollapse }) => {
  const navigationItems = [
    { id: 'current', label: 'Current', icon: Sun },
    { id: 'hourly', label: 'Hourly', icon: Clock },
    { id: 'details', label: 'Details', icon: List },
    { id: 'maps', label: 'Maps', icon: MapPin },
    { id: 'monthly', label: 'Monthly', icon: Calendar },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'news', label: 'News', icon: Newspaper },
  ];

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`hidden md:block ${collapsed ? 'w-16' : 'w-64'} fixed left-0 top-0 h-full bg-gray-900 dark:bg-gray-800 border-r border-gray-700 dark:border-gray-600 z-50 transition-all duration-200`}>
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="px-2 py-3 border-b border-gray-700/60 flex items-center justify-end">
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-md bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        {/* Navigation Items */}
        <div className="flex-1 px-2 py-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
              <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    isActive
                      ? 'bg-yellow-500 text-gray-900 font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-700 dark:border-gray-600">
          <div className={`flex ${collapsed ? 'flex-col space-y-2 items-center' : 'justify-center space-x-2'}`}>
            <button
              onClick={handleScrollToTop}
              className="w-10 h-10 rounded-full bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 flex items-center justify-center text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-10 h-10 rounded-full bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 flex items-center justify-center text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
