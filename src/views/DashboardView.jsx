import React from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Zap, 
  Sun, 
  Battery, 
  Leaf, 
  DollarSign, 
  Cpu, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Activity,
  Flame,
  Thermometer,
  Wind
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardView = () => {
  const { 
    totalConsumption, 
    solarGeneration, 
    batteryLevel, 
    gridImport, 
    gridExport,
    dailyCost, 
    energySavedPct,
    aiRecommendations,
    applyRecommendation,
    appliances,
    toggleAppliance,
    telemetryHistory,
    setActiveTab,
    setJarvisActive
  } = useSmartHome();

  const activeApplianceCount = appliances.filter(a => a.status).length;
  const ecoScore = Math.min(98, Math.max(60, Math.round(100 - (totalConsumption * 8) + (solarGeneration * 6))));

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Top Welcome Banner & AI Alert Ticker */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-cyan-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                SYSTEM STATUS: OPTIMAL
              </span>
              <span className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>AI EDGE ENGINE ACTIVE</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
              Edge AI Smart Home & Energy OS
            </h1>
            <p className="text-sm text-slate-400 font-sans mt-1">
              Neural energy forecasting, 3D Digital Twin, and intelligent power matrix optimization active.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('digitaltwin')}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-semibold flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)]"
            >
              <span>Explore 3D Digital Twin</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setJarvisActive(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-400/40 text-purple-200 text-xs font-semibold flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.25)]"
            >
              <Cpu className="w-4 h-4 text-purple-300" />
              <span>Ask Jarvis Voice</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Real-time Load Card */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border-l-4 border-l-amber-400 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Real-Time Load</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-sans font-bold text-white">{totalConsumption}</span>
              <span className="text-sm font-mono text-amber-400">kW</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
              <span>{activeApplianceCount} appliances currently active</span>
            </p>
          </div>
        </div>

        {/* Solar Generation Card */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border-l-4 border-l-yellow-400 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Solar Array Output</span>
            <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-sans font-bold text-white">{solarGeneration}</span>
              <span className="text-sm font-mono text-yellow-400">kW</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center space-x-1">
              <span>100% Clean Solar Power</span>
            </p>
          </div>
        </div>

        {/* Battery Powerwall Card */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border-l-4 border-l-cyan-400 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Edge Power Matrix</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Battery className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-sans font-bold text-white">{batteryLevel}</span>
              <span className="text-sm font-mono text-cyan-400">%</span>
            </div>
            {/* Battery Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Efficiency Score */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border-l-4 border-l-purple-400 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Efficiency Score</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-sans font-bold text-white">{ecoScore}</span>
              <span className="text-sm font-mono text-purple-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Energy Saved: <span className="text-emerald-400 font-semibold">{energySavedPct}%</span>
            </p>
          </div>
        </div>

      </div>

      {/* Analytics Chart & AI Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Energy Forecast Graph */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-cyan-500/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-sans font-bold text-white flex items-center space-x-2">
                <span>Real-Time Energy Stream & AI Prediction</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Actual Load vs Solar Generation vs Neural AI Baseline (kW)</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>Actual Load</span>
              </span>
              <span className="flex items-center space-x-1.5 text-yellow-400">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                <span>Solar Gen</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="Fira Code" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="Fira Code" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a101e', borderColor: '#00f3ff', borderRadius: '12px', color: '#fff' }} 
                />
                <Area type="monotone" dataKey="actual" stroke="#00f3ff" strokeWidth={3} fillOpacity={1} fill="url(#loadGrad)" name="Home Demand (kW)" />
                <Area type="monotone" dataKey="solar" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#solarGrad)" name="Solar Power (kW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-sans font-bold text-white">AI Energy Insights</h3>
                <p className="text-xs text-slate-400 font-mono">Neural Decision Engine</p>
              </div>
            </div>

            <div className="space-y-3">
              {aiRecommendations.map(rec => (
                <div 
                  key={rec.id} 
                  className={`p-3.5 rounded-2xl border transition-all ${
                    rec.applied 
                      ? 'bg-slate-900/50 border-slate-800 text-slate-400' 
                      : 'bg-cyan-950/30 border-cyan-500/30 text-slate-200 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {rec.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 font-mono">{rec.savingsEstimate}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-2">{rec.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{rec.description}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{rec.time}</span>
                    {rec.applied ? (
                      <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => applyRecommendation(rec.id)}
                        className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                      >
                        Approve AI Action
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ai')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-mono text-cyan-300 border border-cyan-500/20 text-center transition-colors"
          >
            View Full Forecasting Engine ➔
          </button>
        </div>

      </div>

    </div>
  );
};
