import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import RightSidebar from '../sidebar/RightSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(prev => !prev);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar for desktop - Controls */}
      <div
        className={cn(
          "hidden md:block bg-white dark:bg-crowdflow-blue-dark border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
          leftSidebarOpen ? "w-80" : "w-16"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            {leftSidebarOpen && (
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Controls
              </h2>
            )}
            <button
              onClick={toggleLeftSidebar}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {leftSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto">
            {sidebar}
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden bg-gray-600 bg-opacity-75 transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-crowdflow-blue-dark overflow-y-auto transition-transform duration-300 transform md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Controls
          </h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {sidebar}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-crowdflow-blue-dark shadow-sm z-10 h-16 flex items-center px-4 justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 mr-4 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              CrowdFlowAI
            </h1>
          </div>
          <button
            onClick={toggleRightSidebar}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:block"
          >
            {rightSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>

      {/* Right Sidebar for desktop - Video Upload */}
      <div
        className={cn(
          "hidden md:block bg-white dark:bg-crowdflow-blue-dark border-l border-gray-200 dark:border-gray-800 transition-all duration-300",
          rightSidebarOpen ? "w-80" : "w-16"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            {rightSidebarOpen && (
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Video Setup
              </h2>
            )}
            <button
              onClick={toggleRightSidebar}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {rightSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto">
            <RightSidebar collapsed={!rightSidebarOpen} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;