
import React, { useState, useRef } from 'react';
import { Upload, Play, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSimulation } from '@/context/SimulationContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const VideoUploadPanel: React.FC = () => {
  const {
    videoFile, setVideoFile, videoUrl,
    frameRate, setFrameRate,
    particleDensity, setParticleDensity,
    smoothingFactor, setSmoothingFactor,
    runSimulation
  } = useSimulation();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    const validTypes = ['video/mp4', 'video/avi', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload only MP4 or AVI video files');
      return;
    }
    
    setVideoFile(file);
    toast.success(`Video "${file.name}" uploaded successfully`);
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleClearVideo = () => {
    setVideoFile(null);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Video Upload & Simulation Setup</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!videoFile ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
              dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.avi"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium">
              Drag & drop video file or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Supports MP4, AVI format
            </p>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
            <div className="aspect-video">
              {videoUrl && (
                <video
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  controls={false}
                />
              )}
            </div>
            <div className="absolute top-2 right-2">
              <Button
                size="icon"
                variant="destructive"
                onClick={handleClearVideo}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {videoFile.name}
            </div>
          </div>
        )}
        
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="frame-rate">Frame Rate: {frameRate} fps</Label>
            <Slider
              id="frame-rate" 
              min={1} 
              max={60} 
              step={1} 
              value={[frameRate]}
              onValueChange={(values) => setFrameRate(values[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="particle-density">Particle Density: {particleDensity}</Label>
            <Slider
              id="particle-density" 
              min={10} 
              max={100} 
              step={5} 
              value={[particleDensity]}
              onValueChange={(values) => setParticleDensity(values[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smoothing">Smoothing Factor: {smoothingFactor}</Label>
            <Slider
              id="smoothing" 
              min={1} 
              max={20} 
              step={1} 
              value={[smoothingFactor]}
              onValueChange={(values) => setSmoothingFactor(values[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transformation-preset">Transformation Preset</Label>
            <Select defaultValue="default">
              <SelectTrigger>
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default (No Transform)</SelectItem>
                <SelectItem value="overhead">Overhead Camera</SelectItem>
                <SelectItem value="angle-45">45° Angle View</SelectItem>
                <SelectItem value="custom">Custom Matrix</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={runSimulation}
          disabled={!videoFile}
        >
          <Play className="h-4 w-4 mr-2" /> Run Simulation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoUploadPanel;
