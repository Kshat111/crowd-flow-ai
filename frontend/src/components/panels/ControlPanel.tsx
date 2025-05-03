
import React from 'react';
import { Play, Pause, Eye, EyeOff, ToggleLeft, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSimulation } from '@/context/SimulationContext';

const ControlPanel: React.FC = () => {
  const {
    isPlaying, togglePlay,
    isDetectionRunning, toggleDetection,
    showHeatmap, toggleHeatmap,
    showFlowVectors, toggleFlowVectors,
    showTrajectories, toggleTrajectories,
    injectPanic,
  } = useSimulation();

  return (
    <Card className="w-full">
      <CardHeader className="pb-1">
        {/* <CardTitle className="text-lg">Control Panel</CardTitle> */}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Playback controls */}
        <div className="flex justify-between items-center">
          <Label htmlFor="video-playback">Video Playback</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Play
              </>
            )}
          </Button>
        </div>
        
        {/* Detection toggle */}
        <div className="flex justify-between items-center">
          <Label htmlFor="detection-toggle">Pedestrian Detection</Label>
          <Switch
            id="detection-toggle"
            checked={isDetectionRunning}
            onCheckedChange={toggleDetection}
          />
        </div>
        
        {/* Visualization layers */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-medium mb-2">Visualization Layers</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-crowdflow-viz-heatmap mr-2"></div>
                <Label htmlFor="heatmap-toggle">Heatmap</Label>
              </div>
              <Switch
                id="heatmap-toggle"
                checked={showHeatmap}
                onCheckedChange={toggleHeatmap}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-crowdflow-viz-flow mr-2"></div>
                <Label htmlFor="flow-toggle">Flow Vectors</Label>
              </div>
              <Switch
                id="flow-toggle"
                checked={showFlowVectors}
                onCheckedChange={toggleFlowVectors}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-crowdflow-viz-trajectory mr-2"></div>
                <Label htmlFor="trajectory-toggle">Trajectories</Label>
              </div>
              <Switch
                id="trajectory-toggle"
                checked={showTrajectories}
                onCheckedChange={toggleTrajectories}
              />
            </div>
          </div>
        </div>
        
        {/* Panic simulation */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-medium mb-2">Simulation Control</h4>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="panic-delay">Panic injection delay (seconds)</Label>
              <Slider
                id="panic-delay"
                min={1}
                max={30}
                step={1}
                defaultValue={[5]}
              />
            </div>
            
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={injectPanic}
            >
              <AlertTriangle className="h-4 w-4 mr-2" /> Inject Panic Scenario
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
