import React from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Zap, 
  Sun, 
  BatteryCharging, 
  Leaf, 
  Cpu, 
  Mic, 
  Activity,
  LayoutDashboard,
  Box,
  Sliders,
  Share2,
  BarChart3,
  Wifi,
  Settings,
  Bell,
  FileText,
  LogOut,
  Clock
} from 'lucide-react';

export const Navbar = () => {
  const { 
    totalConsumption, 
    solarGeneration, 
    batteryLevel, 
    gridImport, 
    gridExport,
    ecoMode, 
    setEcoMode,
    activeTab, 
    setActiveTab,
    setJarvisActive,
    setNotificationOpen,
    unreadNotificationCount,
    logoutUser
  } = useSmartHome();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'digitaltwin', label: '3D Twin', icon: Box },
    { id: 'appliances', label: 'Appliances', icon: Sliders },
    { id: 'timing', label: 'Timing Suite', icon: Clock },
    { id: 'ai', label: 'AI Forecast', icon: Cpu },
    { id: 'energyflow', label: 'Energy Flow', icon: Share2 },
    { id: 'sustainability', label: 'Eco Center', icon: Leaf },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'iot', label: 'IoT Stream', icon: Wifi },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 backdrop-blur-xl bg-[#050811]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.3)] animate-pulse-glow">
              <Cpu className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-sans font-bold text-lg tracking-wider text-white">EDGE AI</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v3.0 PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-tight">SMART HOME & ENERGY OS</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 glass-pill px-3 py-1.5 rounded-full border border-slate-800">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,243,255,0.25)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls & Quick Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Eco Mode Toggle */}
            <button
              onClick={() => setEcoMode(!ecoMode)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
                ecoMode 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(0,255,136,0.2)]' 
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{ecoMode ? 'AI Eco Active' : 'Performance'}</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => setNotificationOpen(true)}
              className="relative p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Jarvis */}
            <button
              onClick={() => setJarvisActive(true)}
              className="relative p-2.5 rounded-full bg-gradient-to-r from-purple-600/30 to-cyan-500/30 border border-cyan-400/50 text-cyan-300 hover:text-white shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all hover:scale-105"
            >
              <Mic className="w-4 h-4 text-cyan-300" />
            </button>

            {/* Logout */}
            <button
              onClick={logoutUser}
              className="p-2.5 rounded-full bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Live Energy Ticker Banner */}
        <div className="border-t border-cyan-500/10 py-2 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
          <div className="flex items-center space-x-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Total Load:</span>
            <span className="font-semibold text-amber-300">{totalConsumption} kW</span>
          </div>

          <div className="flex items-center space-x-2">
            <Sun className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-slate-400">Solar Gen:</span>
            <span className="font-semibold text-yellow-300">{solarGeneration} kW</span>
          </div>

          <div className="flex items-center space-x-2">
            <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Battery:</span>
            <span className="font-semibold text-cyan-300">{batteryLevel}%</span>
          </div>

          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Grid:</span>
            <span className="font-semibold text-emerald-300">
              {gridExport > 0 ? `Exporting +${gridExport} kW` : gridImport > 0 ? `Importing ${gridImport} kW` : '100% Self-Powered'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
