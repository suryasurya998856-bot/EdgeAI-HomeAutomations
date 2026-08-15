import React from 'react';
import { SmartHomeProvider, useSmartHome } from './context/SmartHomeContext';
import { ThreeBackground } from './components/ThreeBackground';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { JarvisAssistant } from './components/JarvisAssistant';
import { NotificationCenter } from './components/NotificationCenter';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { DigitalTwinView } from './views/DigitalTwinView';
import { ApplianceControlView } from './views/ApplianceControlView';
import { TimingSuiteView } from './views/TimingSuiteView';
import { AiIntelligenceView } from './views/AiIntelligenceView';
import { EnergyFlowView } from './views/EnergyFlowView';
import { SustainabilityView } from './views/SustainabilityView';
import { ReportsView } from './views/ReportsView';
import { AnalyticsView } from './views/AnalyticsView';
import { IoTIntegrationView } from './views/IoTIntegrationView';
import { SettingsView } from './views/SettingsView';

const MainContent = () => {
  const { activeTab, isAuthenticated } = useSmartHome();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'digitaltwin' && <DigitalTwinView />}
      {activeTab === 'appliances' && <ApplianceControlView />}
      {activeTab === 'timing' && <TimingSuiteView />}
      {activeTab === 'ai' && <AiIntelligenceView />}
      {activeTab === 'energyflow' && <EnergyFlowView />}
      {activeTab === 'sustainability' && <SustainabilityView />}
      {activeTab === 'reports' && <ReportsView />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'iot' && <IoTIntegrationView />}
      {activeTab === 'settings' && <SettingsView />}
    </main>
  );
};

export const App = () => {
  return (
    <SmartHomeProvider>
      <div className="relative min-h-screen bg-[#050811] text-slate-100 cyber-gradient-bg overflow-x-hidden">
        <ThreeBackground />
        <AppLayout />
      </div>
    </SmartHomeProvider>
  );
};

const AppLayout = () => {
  const { isAuthenticated } = useSmartHome();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <>
      <Navbar />
      <MainContent />
      <MobileBottomNav />
      <JarvisAssistant />
      <NotificationCenter />
    </>
  );
};

export default App;
