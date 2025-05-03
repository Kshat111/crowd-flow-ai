
import React, { useState } from 'react';
import { AlertCircle, Bell } from 'lucide-react';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import { useSimulation } from '@/context/SimulationContext';

const AlertButton: React.FC = () => {
  const { alertActive, alertType, alertZone, alertTimestamp } = useSimulation();
  const [open, setOpen] = useState(false);
  
  // Format timestamp for display
  const formattedTime = alertTimestamp ? 
    new Date(alertTimestamp).toLocaleTimeString() : '';
  
  // Alert type formatted for display
  const alertTypeDisplay = {
    'none': '',
    'surge': 'Sudden Crowd Surge',
    'reverse': 'Reverse Flow Detected',
    'congestion': 'Dangerous Congestion'
  }[alertType];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <HoverCard open={open} onOpenChange={setOpen}>
        <HoverCardTrigger asChild>
          <button
            className={cn(
              "rounded-full h-14 w-14 flex items-center justify-center shadow-lg transition-all",
              alertActive 
                ? "bg-crowdflow-alert-warning animate-alert-blink"
                : "bg-crowdflow-alert-default"
            )}
          >
            {alertActive ? (
              <AlertCircle className="h-6 w-6 text-white" />
            ) : (
              <Bell className="h-6 w-6 text-white" />
            )}
          </button>
        </HoverCardTrigger>
        
        {alertActive && (
          <HoverCardContent className="w-80 p-0 bg-white dark:bg-crowdflow-blue-dark border border-red-500">
            <div className="p-2 bg-red-500 text-white font-semibold flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Anomaly Detected
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm">{alertTypeDisplay}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm">{alertZone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm">{formattedTime}</p>
              </div>
              <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
                Click to acknowledge and dismiss
              </div>
            </div>
          </HoverCardContent>
        )}
      </HoverCard>
    </div>
  );
};

export default AlertButton;
