import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  FileText,
  DollarSign,
  PieChart
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export const AnalyticsView = () => {
  const { appliances, dailyCost } = useSmartHome();
  const [timeframe, setTimeframe] = useState('Daily');

  const applianceRanking = appliances.map(app => ({
    name: app.name.replace('Smart ', ''),
    power: app.status ? app.powerDraw : 0.05,
    cost: (app.powerDraw * 0.15 * 24).toFixed(2),
    color: app.category === 'HVAC' ? '#f59e0b' : app.category === 'Automotive' ? '#00f3ff' : '#a855f7'
  })).sort((a, b) => b.power - a.power);

  const downloadCSVReport = () => {
    const headers = "Appliance Name,Room,Category,Power Draw (kW),Status,Est. Daily Cost ($)\n";
    const rows = appliances.map(a => 
      `"${a.name}","${a.room}","${a.category}",${a.powerDraw},"${a.status ? 'ON' : 'OFF'}",${(a.powerDraw * 0.15 * 24).toFixed(2)}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Edge_AI_SmartHome_EnergyReport_${timeframe.toLowerCase()}.csv`);
    a.click();
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Top Header & Download Button */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <BarChart3 className="w-4 h-4" />
            <span>ANALYTICS & CONSUMPTION AUDIT</span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight mt-1">
            Energy Consumption Reports & Rankings
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Timeframe Selector */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['Daily', 'Weekly', 'Monthly'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  timeframe === tf ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={downloadCSVReport}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Audit</span>
          </button>
        </div>
      </div>

      {/* Appliance Ranking Bar Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-sans font-bold text-white">Appliance Power Consumption Breakdown</h3>
            <p className="text-xs text-slate-400 font-mono">Ranked by real-time load draw (kW)</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={applianceRanking} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontFamily="Fira Code" angle={-15} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="Fira Code" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a101e', borderColor: '#00f3ff', borderRadius: '12px', color: '#fff' }} 
              />
              <Bar dataKey="power" name="Power Load (kW)" radius={[6, 6, 0, 0]}>
                {applianceRanking.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Breakdown Table */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
        <h3 className="text-base font-sans font-bold text-white mb-4">Detailed Appliance Audit Table</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-cyan-400">
                <th className="py-3 px-4">APPLIANCE</th>
                <th className="py-3 px-4">ROOM</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">POWER DRAW</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">EST. 24H COST</th>
              </tr>
            </thead>
            <tbody className="text-xs font-mono text-slate-300 divide-y divide-slate-800/60">
              {appliances.map(a => (
                <tr key={a.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{a.name}</td>
                  <td className="py-3.5 px-4 text-slate-400">{a.room}</td>
                  <td className="py-3.5 px-4 text-purple-300">{a.category}</td>
                  <td className="py-3.5 px-4 text-amber-400 font-bold">{a.powerDraw} kW</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${a.status ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'}`}>
                      {a.status ? 'ONLINE' : 'OFF'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">${(a.powerDraw * 0.15 * 24).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
