
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ToggleLayerProps {
  label: string;
  color: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}

const ToggleLayer: React.FC<ToggleLayerProps> = ({
  label,
  color,
  checked,
  onChange,
  className
}) => {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      <div className="flex items-center">
        <div 
          className="w-3 h-3 rounded-full mr-2" 
          style={{ backgroundColor: color }}
        ></div>
        <Label htmlFor={`toggle-${label}`}>{label}</Label>
      </div>
      <Switch
        id={`toggle-${label}`}
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
};

export default ToggleLayer;
