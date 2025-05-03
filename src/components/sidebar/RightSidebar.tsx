import React from 'react';
import VideoUploadPanel from '../panels/VideoUploadPanel';
import { cn } from '@/lib/utils';

interface RightSidebarProps {
  collapsed?: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ collapsed = false }) => {
  return (
    <div className={cn("flex flex-col gap-4 p-4", collapsed && "items-center")}>
      {collapsed ? (
        <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
          <span className="text-xs">Video</span>
        </div>
      ) : (
        <VideoUploadPanel />
      )}
    </div>
  );
};

export default RightSidebar;