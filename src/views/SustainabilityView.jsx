import React from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Globe, 
  Leaf, 
  Award, 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  Zap,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const SustainabilityView = () => {
  const { 
    energySavedPct, 
    powerOptimizationScore, 
    renewableUtilization, 
    automationEfficiency 
  } = useSmartHome();

  const monthlyImpactData = [
    { month: 'Jan', savedPct: 18, renewPct: 82 },
    { month: 'Feb', savedPct: 20, renewPct: 86 },
    { month: 'Mar', savedPct: 22, renewPct: 90 },
    { month: 'Apr', savedPct: 24, renewPct: 94 },
    { month: 'May', savedPct: 25, renewPct: 96 }
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 relative overflow-hidden bg-emerald-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <Globe className="w-4 h-4" />
              <span>ENERGY OPTIMIZATION & AUTOMATION HUB</span>
            </div>
            <h2 className="text-2xl font-sans font-bold text-white tracking-tight mt-1">
              Intelligent Power Efficiency Scorecard
            </h2>
            <p className="text-xs text-slate-300 font-sans mt-1">
              Live renewable energy utilization and smart automation load scheduling tracking.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>OS LEVEL: ULTRA OPTIMAL</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Requested Energy Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* 1. Energy Efficiency Score */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-400">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Energy Efficiency Score</span>
          <p className="text-3xl font-bold text-white mt-1 font-mono">{powerOptimizationScore} <span className="text-sm font-normal text-emerald-400">/ 100</span></p>
          <p className="text-[10px] font-mono text-slate-400 mt-1">Grid load balance index</p>
        </div>

        {/* 2. Energy Saved Percentage */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-cyan-400">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Energy Saved Percentage</span>
          <p className="text-3xl font-bold text-white mt-1 font-mono">{energySavedPct}%</p>
          <p className="text-[10px] font-mono text-slate-400 mt-1">Compared to unoptimized baseline</p>
        </div>

        {/* 3. Renewable Energy Utilization */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-yellow-400">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Renewable Utilization</span>
          <p className="text-3xl font-bold text-white mt-1 font-mono">{renewableUtilization}%</p>
          <p className="text-[10px] font-mono text-slate-400 mt-1">Direct solar consumption ratio</p>
        </div>

        {/* 4. Smart Automation Efficiency */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-purple-400">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Automation Efficiency</span>
          <p className="text-3xl font-bold text-white mt-1 font-mono">{automationEfficiency}%</p>
          <p className="text-[10px] font-mono text-slate-400 mt-1">Schedules executed successfully</p>
        </div>

      </div>

      {/* AI Performance Insights */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3 bg-emerald-950/30">
        <div className="flex items-center space-x-2 text-emerald-300 text-xs font-mono font-bold">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>AI AUTOMATION INSIGHTS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <p className="text-xs text-emerald-100 font-sans leading-relaxed">
              "Your smart automation timing suite reduced estimated energy consumption by <strong>18% this month</strong> through AI-driven load shifting and standby isolation."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <p className="text-xs text-cyan-100 font-sans leading-relaxed">
              "Enabling circulate schedule on the kitchen fans can optimize thermal ventilation and increase overall workstation cooling index."
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Performance Optimization Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20">
        <h3 className="text-base font-sans font-bold text-white mb-4">Monthly Renewable Utilization Index</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyImpactData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="renewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} fontFamily="Fira Code" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="Fira Code" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a101e', borderColor: '#10b981', borderRadius: '12px', color: '#fff' }} 
              />
              <Area type="monotone" dataKey="renewPct" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#renewGrad)" name="Renewable Energy %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
