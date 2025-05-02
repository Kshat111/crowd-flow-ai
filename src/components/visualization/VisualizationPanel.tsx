
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSimulation } from '@/context/SimulationContext';
import { cn } from '@/lib/utils';

const VisualizationPanel: React.FC = () => {
  const {
    videoUrl,
    isPlaying,
    showHeatmap,
    showFlowVectors,
    showTrajectories
  } = useSimulation();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null);
  const flowCanvasRef = useRef<HTMLCanvasElement>(null);
  const trajectoryCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  // Handle video playback
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, videoUrl]);
  
  // Handle canvas resizing
  useEffect(() => {
    if (!videoRef.current) return;
    
    const updateCanvasSize = () => {
      const video = videoRef.current;
      if (!video) return;
      
      const rect = video.getBoundingClientRect();
      setCanvasSize({
        width: rect.width,
        height: rect.height
      });
    };
    
    // Initial size
    videoRef.current.addEventListener('loadedmetadata', updateCanvasSize);
    
    // Handle window resize
    window.addEventListener('resize', updateCanvasSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      videoRef.current?.removeEventListener('loadedmetadata', updateCanvasSize);
    };
  }, [videoUrl]);

  return (
    <Card className="w-full h-full">
      <CardContent className="p-0 relative flex flex-col">
        {/* Main content area - stacked vertically with equal sections */}
        <div className="flex flex-col gap-4 p-4 h-screen">
          {/* Video element - first half */}
          <div>
            <p className="text-xl text-black-500">
              Video Player
            </p>
          </div>

          <div className="w-full h-1/2 relative">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain bg-black rounded-md"
                loop
                muted
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400 rounded-md">
                <p>Upload a video to begin analysis</p>
              </div>
            )}
            
            {/* Visualization layers */}
            <canvas
              ref={heatmapCanvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className={cn(
                "absolute top-0 left-0 pointer-events-none",
                showHeatmap ? "opacity-60" : "opacity-0"
              )}
            />
            
            <canvas
              ref={flowCanvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className={cn(
                "absolute top-0 left-0 pointer-events-none",
                showFlowVectors ? "opacity-80" : "opacity-0"
              )}
            />
            
            <canvas
              ref={trajectoryCanvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className={cn(
                "absolute top-0 left-0 pointer-events-none",
                showTrajectories ? "opacity-80" : "opacity-0"
              )}
            />
          </div>

          <div>
            <p className="text-xl text-black-500">
              Simulation
            </p>
          </div>

          {/* People as Particles Simulation - second half */}
          <div className="w-full h-1/2 border border-dashed border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center h-full">
              {videoUrl ? (
                <>
                  <div className="flex flex-wrap justify-center gap-3 mb-2">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 h-2 rounded-full bg-blue-500 opacity-70"
                        style={{ 
                          transform: `translate(${Math.sin(i * 0.5) * 10}px, ${Math.cos(i * 0.5) * 10}px)`,
                          animationDelay: `${i * 0.1}s`,
                          animation: "pulse 2s infinite"
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">People as Particles Simulation</p>
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Upload a video for simulation</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizationPanel;

