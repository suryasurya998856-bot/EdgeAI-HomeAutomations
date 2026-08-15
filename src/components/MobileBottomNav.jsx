import React from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  LayoutDashboard, 
  Share2, 
  Sliders, 
  Cpu, 
  Settings,
  Clock
} from 'lucide-react';

export const MobileBottomNav = () => {
  const { activeTab, setActiveTab } = useSmartHome();

  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'timing', label: 'Timing', icon: Clock },
    { id: 'appliances', label: 'Devices', icon: Sliders },
    { id: 'ai', label: 'AI', icon: Cpu },
    { id: 'energyflow', label: 'Flow', icon: Share2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-cyan-500/30 px-2 py-2 backdrop-blur-2xl bg-[#050811]/95">
      <div className="flex items-center justify-around">
        {mobileNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-[10px] font-sans font-medium mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
