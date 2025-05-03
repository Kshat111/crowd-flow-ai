
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Sidebar from '@/components/sidebar/LeftSidebar';
import VisualizationPanel from '@/components/visualization/VisualizationPanel';
import AlertButton from '@/components/alerts/AlertButton';
import { SimulationProvider } from '@/context/SimulationContext';

const Index = () => {
  return (
    <SimulationProvider>
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <VisualizationPanel />
          </div>
        </div>
        <AlertButton />
      </DashboardLayout>
    </SimulationProvider>
  );
};

export default Index;
