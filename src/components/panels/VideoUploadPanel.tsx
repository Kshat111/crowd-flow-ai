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

// Sample videos data
const sampleVideos = [
  {
    id: 'sample1',
    title: 'Kumbh Mela',
    thumbnail: '/assets/kumbh.jpg',
    src: '/assets/03.mp4',
    description: 'Video 1'
  },
  {
    id: 'sample2',
    title: 'Kumbh Mela',
    thumbnail: '/assets/kumbh1.jpg',
    src: '/assets/14.mp4',
    description: 'Video 2'
  },
  {
    id: 'sample3',
    title: 'Kumbh Mela',
    thumbnail: '/assets/kumbh2.jpg',
    src: '/assets/19.mp4',
    description: 'Video 3'
  }
];

const VideoUploadPanel: React.FC = () => {
  const {
    videoFile, setVideoFile, videoUrl, setVideoUrl,
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
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    toast.success(`Video "${file.name}" uploaded successfully`);
  };

  const handleSelectSampleVideo = (videoSrc: string, videoTitle: string) => {
    // Create a fake file object for consistency with the rest of the app
    fetch(videoSrc)
      .then(response => response.blob())
      .then(blob => {
        // Create a File object from the blob
        const file = new File([blob], `${videoTitle}.mp4`, { type: 'video/mp4' });
        setVideoFile(file);
        setVideoUrl(videoSrc);
        toast.success(`Sample video "${videoTitle}" loaded successfully`);
      })
      .catch(error => {
        toast.error('Failed to load sample video');
        console.error('Error loading sample video:', error);
      });
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleClearVideo = () => {
    setVideoFile(null);
    setVideoUrl(null);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        {/* <CardTitle className="text-lg">Video Upload & Simulation Setup</CardTitle> */}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!videoFile ? (
          <>
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
            
            {/* Sample Videos Section */}
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-3">Or use a sample video:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sampleVideos.map((video) => (
                  <div 
                    key={video.id} 
                    className="border rounded-md overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => handleSelectSampleVideo(video.src, video.title)}
                  >
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if thumbnail doesn't load
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <div className="p-2">
                      <h4 className="font-medium text-sm">{video.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
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
          
          {/* <div className="space-y-2">
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
          </div> */}
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