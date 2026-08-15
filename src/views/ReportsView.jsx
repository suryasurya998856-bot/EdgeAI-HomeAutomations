import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  Cpu, 
  CheckCircle2,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ReportsView = () => {
  const { appliances, dailyCost, energySavedPct, telemetryHistory } = useSmartHome();
  const [reportType, setReportType] = useState('Monthly Analysis');

  const reportTypes = [
    'Daily Energy Report',
    'Weekly Consumption Report',
    'Monthly Analysis',
    'Appliance Usage Report',
    'AI Recommendation Report'
  ];

  const handleDownloadCSV = () => {
    const headers = "Report Type,Appliance Name,Room,Category,Power Draw (kW),Daily Cost ($)\n";
    const rows = appliances.map(a => 
      `"${reportType}","${a.name}","${a.room}","${a.category}",${a.powerDraw},${(a.powerDraw * 0.15 * 24).toFixed(2)}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Edge_AI_${reportType.replace(/\s+/g, '_')}.csv`);
    a.click();
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const totalMonthlyCost = (dailyCost * 30).toFixed(2);

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Top Banner & Export Options */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <FileText className="w-4 h-4" />
            <span>PROFESSIONAL REPORT GENERATION ENGINE</span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight mt-1">
            Smart Home Energy Audit Reports
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Report Type Pills */}
      <div className="flex flex-wrap gap-2">
        {reportTypes.map(rt => (
          <button
            key={rt}
            onClick={() => setReportType(rt)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              reportType === rt 
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,243,255,0.4)]' 
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {rt}
          </button>
        ))}
      </div>

      {/* Printable Report Document Card */}
      <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 space-y-6 bg-[#0a101e]/90">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-cyan-500/20 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-sans font-bold text-xl text-white tracking-wider">EDGE AI</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/40">
                OFFICIAL REPORT
              </span>
            </div>
            <h1 className="text-2xl font-sans font-bold text-cyan-300 mt-1">{reportType}</h1>
            <p className="text-xs text-slate-400 font-mono">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          </div>

          <div className="text-right text-xs font-mono text-slate-400">
            <p className="text-white font-bold">Property: Edge AI Residence</p>
            <p>Meter ID: #EA-99482-X</p>
            <p className="text-emerald-400 font-semibold">Audit Status: PASS</p>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400">Est. Monthly Cost</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">${totalMonthlyCost}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400">Energy Saved Ratio</span>
            <p className="text-2xl font-bold text-green-400 mt-1 font-mono">{energySavedPct}%</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400">Solar Self-Sufficiency</span>
            <p className="text-2xl font-bold text-yellow-400 mt-1 font-mono">92.4%</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400">AI Efficiency Index</span>
            <p className="text-2xl font-bold text-purple-400 mt-1 font-mono">96 / 100</p>
          </div>
        </div>

        {/* Visual Chart Section */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4">
            Audited Load Profile (kW)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="Fira Code" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="Fira Code" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a101e', borderColor: '#00f3ff', borderRadius: '12px', color: '#fff' }} 
                />
                <Bar dataKey="actual" fill="#00f3ff" name="Actual Load (kW)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="solar" fill="#eab308" name="Solar Gen (kW)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appliance Performance Audit Table */}
        <div className="overflow-x-auto">
          <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
            Individual Appliance Telemetry Audit
          </h4>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-slate-400">
                <th className="py-2.5 px-3">APPLIANCE</th>
                <th className="py-2.5 px-3">ZONE</th>
                <th className="py-2.5 px-3">RATED POWER</th>
                <th className="py-2.5 px-3">ECO STATUS</th>
                <th className="py-2.5 px-3">EST. MONTHLY COST</th>
              </tr>
            </thead>
            <tbody className="text-xs font-mono text-slate-300 divide-y divide-slate-800/60">
              {appliances.map(a => (
                <tr key={a.id}>
                  <td className="py-2.5 px-3 font-semibold text-white">{a.name}</td>
                  <td className="py-2.5 px-3 text-slate-400">{a.room}</td>
                  <td className="py-2.5 px-3 text-amber-400">{a.powerDraw} kW</td>
                  <td className="py-2.5 px-3 text-emerald-400">OPTIMAL</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">${(a.powerDraw * 0.15 * 24 * 30).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Recommendations Summary */}
        <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
          <div className="flex items-center space-x-2 text-purple-300 text-xs font-bold font-mono">
            <Sparkles className="w-4 h-4" />
            <span>AI Energy Recommendations Summary</span>
          </div>
          <p className="text-xs text-purple-100 mt-1 leading-relaxed">
            Shifting EV Charging & Water Heater cycles to off-peak tariff hours (01:00 AM - 06:00 AM) saved an estimated $42.60 this month and reduced peak grid stress by 8.7 kW.
          </p>
        </div>

      </div>

    </div>
  );
};
