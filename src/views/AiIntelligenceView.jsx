import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Sparkles, 
  ShieldAlert,
  Calendar,
  Zap,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

export const AiIntelligenceView = () => {
  const { telemetryHistory, aiRecommendations } = useSmartHome();
  const [granularity, setGranularity] = useState('Hourly'); // Hourly | Daily | Weekly | Monthly

  const granularityData = {
    Hourly: telemetryHistory,
    Daily: [
      { time: 'Mon', actual: 24.5, predicted: 26.0, solar: 22.0, cost: 3.40 },
      { time: 'Tue', actual: 28.2, predicted: 27.5, solar: 25.4, cost: 3.85 },
      { time: 'Wed', actual: 21.0, predicted: 22.1, solar: 24.0, cost: 2.90 },
      { time: 'Thu', actual: 31.4, predicted: 29.8, solar: 28.2, cost: 4.10 },
      { time: 'Fri', actual: 26.8, predicted: 27.0, solar: 26.0, cost: 3.65 },
      { time: 'Sat', actual: 34.0, predicted: 32.5, solar: 29.1, cost: 4.80 },
      { time: 'Sun', actual: 22.4, predicted: 23.0, solar: 25.0, cost: 3.10 }
    ],
    Weekly: [
      { time: 'Week 1', actual: 185, predicted: 190, solar: 175, cost: 24.50 },
      { time: 'Week 2', actual: 168, predicted: 172, solar: 180, cost: 21.20 },
      { time: 'Week 3', actual: 194, predicted: 188, solar: 192, cost: 26.80 },
      { time: 'Week 4', actual: 172, predicted: 175, solar: 185, cost: 22.40 }
    ],
    Monthly: [
      { time: 'Jan', actual: 780, predicted: 800, solar: 650, cost: 98.00 },
      { time: 'Feb', actual: 720, predicted: 710, solar: 740, cost: 89.50 },
      { time: 'Mar', actual: 690, predicted: 700, solar: 820, cost: 82.10 },
      { time: 'Apr', actual: 640, predicted: 650, solar: 910, cost: 74.00 }
    ]
  };

  const selectedDataset = granularityData[granularity] || granularityData['Hourly'];

  const aiExplanations = [
    {
      q: "Why was AC changed to Eco Mode?",
      a: "High ambient temperature (28°C outdoor) and increased grid tariff detected between 16:00 - 21:00. Eco Mode activated to lower consumption by 1.8 kW while maintaining 22°C indoor comfort.",
      category: "HVAC Automation"
    },
    {
      q: "Why did battery discharge accelerate at 18:00?",
      a: "Grid high-peak tariff slot ($0.48/kWh) began. The Tesla Powerwall automatically discharged to cover 100% of home load, saving $3.60 in grid electricity fees.",
      category: "Battery Management"
    },
    {
      q: "Why was Office AI Workstation load throttled?",
      a: "No motion detected in Office for 45 minutes. Background AI model training was shifted to off-peak 02:00 AM slot.",
      category: "Compute Scheduler"
    }
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Top Banner & Granularity Picker */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Cpu className="w-4 h-4" />
            <span>NEURAL PREDICTIVE ENGINE v2.8</span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight mt-1">
            AI Energy Usage Forecasting & Cost Estimation
          </h2>
        </div>

        {/* Time Granularity Selector */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {['Hourly', 'Daily', 'Weekly', 'Monthly'].map(g => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                granularity === g 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,243,255,0.4)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="text-base font-sans font-bold text-white">{granularity} Energy Load Curve vs Neural Model</h3>
            <p className="text-xs text-slate-400 font-mono">Actual Load vs Solar Generation vs Neural AI Baseline</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
              <span>Actual Load</span>
            </span>
            <span className="flex items-center space-x-1.5 text-purple-400">
              <span className="w-3 h-0.5 bg-purple-400 inline-block" />
              <span>AI Predicted</span>
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={selectedDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00f3ff" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="Fira Code" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="Fira Code" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a101e', borderColor: '#00f3ff', borderRadius: '12px', color: '#fff' }} 
              />
              <Area type="monotone" dataKey="actual" stroke="#00f3ff" strokeWidth={3} fillOpacity={1} fill="url(#actualGrad)" name="Actual Load" />
              <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" name="AI Predicted" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Behavior-Based AI Explanations & Decision Rationale */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-sans font-bold text-white">Behavioral AI Rationale & Explanations</h3>
            <p className="text-xs text-slate-400 font-mono">Why AI made specific automation decisions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiExplanations.map((exp, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {exp.category}
                </span>
                <h4 className="text-xs font-bold text-white mt-2.5">{exp.q}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{exp.a}</p>
              </div>
              <span className="mt-3 text-[10px] font-mono text-emerald-400">VERIFIED OPTIMAL</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
