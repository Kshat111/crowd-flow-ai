import React from 'react';
import ControlPanel from '../panels/ControlPanel';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed?: boolean;
}

const LeftSidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  return (
    <div className={cn("flex flex-col gap-4 p-4", collapsed && "items-center")}>
      {collapsed ? (
        <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
          <span className="text-xs">Controls</span>
        </div>
      ) : (
        <ControlPanel />
      )}
    </div>
  );
};

export default LeftSidebar;