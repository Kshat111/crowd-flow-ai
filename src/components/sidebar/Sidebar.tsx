
import React from 'react';
import VideoUploadPanel from '../panels/VideoUploadPanel';
import ControlPanel from '../panels/ControlPanel';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  return (
    <div className={cn("flex flex-col gap-4 p-4", collapsed && "items-center")}>
      {collapsed ? (
        <div className="flex flex-col gap-6 items-center">
          <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
            <span className="text-xs">Video</span>
          </div>
          <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
            <span className="text-xs">Controls</span>
          </div>
        </div>
      ) : (
        <>
          <VideoUploadPanel />
          <ControlPanel />
        </>
      )}
    </div>
  );
};

export default Sidebar;
