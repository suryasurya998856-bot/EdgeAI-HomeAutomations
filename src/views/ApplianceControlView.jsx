import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Sliders, 
  Power, 
  Clock, 
  Thermometer, 
  Wind, 
  Lightbulb, 
  Tv, 
  Zap, 
  Flame, 
  RotateCw,
  Sparkles,
  Calendar
} from 'lucide-react';

export const ApplianceControlView = () => {
  const { appliances, toggleAppliance, updateAppliance } = useSmartHome();
  const [filterRoom, setFilterRoom] = useState('All');

  const filteredAppliances = filterRoom === 'All' 
    ? appliances 
    : appliances.filter(a => a.room === filterRoom);

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Top Header & Room Filter Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Sliders className="w-4 h-4" />
            <span>VIRTUAL APPLIANCE CONTROL MATRIX</span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight mt-1">
            Smart Appliance Management & Schedules
          </h2>
        </div>

        {/* Room Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Living Room', 'Bedroom', 'Kitchen', 'Garage'].map(room => (
            <button
              key={room}
              onClick={() => setFilterRoom(room)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterRoom === room 
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,243,255,0.4)] font-bold' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      {/* Appliances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAppliances.map(app => (
          <div 
            key={app.id} 
            className={`glass-panel p-5 rounded-3xl border transition-all flex flex-col justify-between ${
              app.status 
                ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(0,243,255,0.1)] bg-slate-900/80' 
                : 'border-slate-800 opacity-75 hover:opacity-100 bg-slate-950/60'
            }`}
          >
            <div>
              {/* Card Top Info */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {app.room}
                </span>

                <button
                  onClick={() => toggleAppliance(app.id)}
                  className={`p-2 rounded-xl transition-all ${
                    app.status 
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,243,255,0.4)]' 
                      : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                  title="Power Switch"
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Power Draw */}
              <div className="mt-3">
                <h3 className="text-base font-sans font-bold text-white">{app.name}</h3>
                <div className="flex items-center space-x-2 mt-1 font-mono text-xs">
                  <span className="text-amber-400 font-semibold">{app.powerDraw} kW</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">${(app.powerDraw * 0.15).toFixed(2)}/hr</span>
                </div>
              </div>

              {/* Custom Dynamic Appliance Controls */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                
                {/* AC Thermostat */}
                {app.id === 'ac' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>Target Temp:</span>
                      <span className="text-cyan-400 font-bold">{app.temp}°C</span>
                    </div>
                    <input 
                      type="range" 
                      min="18" 
                      max="28" 
                      value={app.temp} 
                      onChange={(e) => updateAppliance('ac', { temp: parseInt(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                )}

                {/* Fan Speed Stepper */}
                {app.id === 'fan' && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-300">Fan Speed:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map(s => (
                        <button
                          key={s}
                          onClick={() => updateAppliance('fan', { speed: s })}
                          className={`w-6 h-6 rounded text-xs font-mono font-bold ${
                            app.speed === s ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* RGB Light Brightness */}
                {app.id === 'lights' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>Brightness:</span>
                      <span className="text-cyan-400 font-bold">{app.brightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={app.brightness} 
                      onChange={(e) => updateAppliance('lights', { brightness: parseInt(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                )}

                {/* EV Fast Charger limit */}
                {app.id === 'ev' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>Battery Charge SoC:</span>
                      <span className="text-emerald-400 font-bold">{app.currentBattery}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${app.currentBattery}%` }} />
                    </div>
                  </div>
                )}

                {/* Water Heater Target Temp */}
                {app.id === 'heater' && (
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Water Target:</span>
                    <span className="text-amber-400 font-bold">{app.waterTemp}°C</span>
                  </div>
                )}

              </div>
            </div>

            {/* Automation & Schedule Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center space-x-1.5 truncate">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{app.schedule}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
