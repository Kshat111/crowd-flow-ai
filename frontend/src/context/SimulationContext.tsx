
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SimulationContextType {
  // Video and file handling
  videoFile: File | null;
  videoUrl: string | null;
  setVideoFile: (file: File | null) => void;
  
  // Simulation parameters
  frameRate: number;
  particleDensity: number;
  smoothingFactor: number;
  perspectiveMatrix: number[][];
  setFrameRate: (rate: number) => void;
  setParticleDensity: (density: number) => void;
  setSmoothingFactor: (factor: number) => void;
  setPerspectiveMatrix: (matrix: number[][]) => void;
    setVideoUrl: (url: string | null) => void;
  
  // Control state
  isPlaying: boolean;
  isDetectionRunning: boolean;
  togglePlay: () => void;
  toggleDetection: () => void;
  
  // Visualization layers
  showHeatmap: boolean;
  showFlowVectors: boolean;
  showTrajectories: boolean;
  toggleHeatmap: () => void;
  toggleFlowVectors: () => void;
  toggleTrajectories: () => void;
  
  // Alert state
  alertActive: boolean;
  alertType: 'none' | 'surge' | 'reverse' | 'congestion';
  alertZone: string;
  alertTimestamp: string;
  setAlert: (active: boolean, type: 'none' | 'surge' | 'reverse' | 'congestion', zone: string, timestamp: string) => void;
  
  // API integration
  runSimulation: () => void;
  injectPanic: () => void;
  
  // Function injection for modular components
  registerApiEndpoint: (key: string, endpoint: string) => void;
  getApiEndpoint: (key: string) => string | undefined;
}

const defaultMatrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Video and file state
  const [videoFile, setVideoFileState] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Simulation parameters
  const [frameRate, setFrameRate] = useState(30);
  const [particleDensity, setParticleDensity] = useState(50);
  const [smoothingFactor, setSmoothingFactor] = useState(5);
  const [perspectiveMatrix, setPerspectiveMatrix] = useState(defaultMatrix);
  
  // Control state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDetectionRunning, setIsDetectionRunning] = useState(false);
  
  // Visualization layers
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showFlowVectors, setShowFlowVectors] = useState(true);
  const [showTrajectories, setShowTrajectories] = useState(false);
  
  // Alert state
  const [alertActive, setAlertActive] = useState(false);
  const [alertType, setAlertType] = useState<'none' | 'surge' | 'reverse' | 'congestion'>('none');
  const [alertZone, setAlertZone] = useState('');
  const [alertTimestamp, setAlertTimestamp] = useState('');
  
  // API integration
  const [apiEndpoints, setApiEndpoints] = useState<Record<string, string>>({});
  
  const setVideoFile = (file: File | null) => {
    setVideoFileState(file);
    
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    } else {
      setVideoUrl(null);
    }
  };
  
  const togglePlay = () => setIsPlaying(prev => !prev);
  const toggleDetection = () => setIsDetectionRunning(prev => !prev);
  const toggleHeatmap = () => setShowHeatmap(prev => !prev);
  const toggleFlowVectors = () => setShowFlowVectors(prev => !prev);
  const toggleTrajectories = () => setShowTrajectories(prev => !prev);
  
  const setAlert = (
    active: boolean, 
    type: 'none' | 'surge' | 'reverse' | 'congestion', 
    zone: string, 
    timestamp: string
  ) => {
    setAlertActive(active);
    setAlertType(type);
    setAlertZone(zone);
    setAlertTimestamp(timestamp);
  };
  
  const runSimulation = () => {
    console.log("Running simulation with parameters:", {
      frameRate,
      particleDensity,
      smoothingFactor,
      perspectiveMatrix
    });
    // In a real implementation, this would call the backend API
  };
  
  const injectPanic = () => {
    console.log("Injecting panic into simulation");
    // This would trigger panic simulation via API call
    
    // For demo purposes, let's set an alert after 2 seconds
    setTimeout(() => {
      setAlert(
        true, 
        'surge', 
        'Zone A', 
        new Date().toISOString()
      );
    }, 2000);
  };
  
  const registerApiEndpoint = (key: string, endpoint: string) => {
    setApiEndpoints(prev => ({ ...prev, [key]: endpoint }));
  };
  
  const getApiEndpoint = (key: string) => apiEndpoints[key];
  
  const value = {
    videoFile,
    videoUrl,
    setVideoFile,
    setVideoUrl,
    
    frameRate,
    particleDensity,
    smoothingFactor,
    perspectiveMatrix,
    setFrameRate,
    setParticleDensity,
    setSmoothingFactor,
    setPerspectiveMatrix,

    
    
    isPlaying,
    isDetectionRunning,
    togglePlay,
    toggleDetection,
    
    showHeatmap,
    showFlowVectors,
    showTrajectories,
    toggleHeatmap,
    toggleFlowVectors,
    toggleTrajectories,
    
    alertActive,
    alertType,
    alertZone,
    alertTimestamp,
    setAlert,
    
    runSimulation,
    injectPanic,
    
    registerApiEndpoint,
    getApiEndpoint,
  };
  
  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  
  return context;
};
