import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Settings, 
  DollarSign, 
  Wifi, 
  Battery, 
  Volume2, 
  Bell, 
  Save, 
  CheckCircle2,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const SettingsView = () => {
  const { settings, setSettings } = useSmartHome();
  const [saved, setSaved] = useState(false);

  const handleChange = (field, val) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Settings className="w-4 h-4" />
            <span>SYSTEM CONFIGURATION & HARDWARE SETTINGS</span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight mt-1">
            OS Preferences & Tariff Configuration
          </h2>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Preferences Saved!' : 'Save System Settings'}</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tariff & Utility Rates */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
          <div className="flex items-center space-x-2.5 text-emerald-400 font-mono text-xs font-bold">
            <DollarSign className="w-5 h-5" />
            <span>ELECTRICITY TARIFF RATES</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono text-slate-300">Peak Slot Tariff Rate ($/kWh):</label>
              <input 
                type="number" 
                step="0.01" 
                value={settings.peakTariffRate}
                onChange={(e) => handleChange('peakTariffRate', parseFloat(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300">Off-Peak Tariff Rate ($/kWh):</label>
              <input 
                type="number" 
                step="0.01" 
                value={settings.offPeakTariffRate}
                onChange={(e) => handleChange('offPeakTariffRate', parseFloat(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* MQTT & IoT Hardware Gateway */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
          <div className="flex items-center space-x-2.5 text-cyan-400 font-mono text-xs font-bold">
            <Wifi className="w-5 h-5" />
            <span>ESP32 / MQTT BROKER HOST</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono text-slate-300">MQTT Broker Connection URL:</label>
              <input 
                type="text" 
                value={settings.mqttBrokerUrl}
                onChange={(e) => handleChange('mqttBrokerUrl', e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-cyan-300 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-300">Auto Load Shedding during Grid Outage:</span>
              <button
                onClick={() => handleChange('autoLoadShedding', !settings.autoLoadShedding)}
                className={`w-12 h-6 rounded-full p-1 transition-all ${
                  settings.autoLoadShedding ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  settings.autoLoadShedding ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Battery Protection Buffer */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
          <div className="flex items-center space-x-2.5 text-purple-400 font-mono text-xs font-bold">
            <Battery className="w-5 h-5" />
            <span>BATTERY RESERVE PROTECTION</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>Minimum Reserve Buffer:</span>
              <span className="text-purple-400 font-bold">{settings.batteryMinBuffer}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="30" 
              value={settings.batteryMinBuffer}
              onChange={(e) => handleChange('batteryMinBuffer', parseInt(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">Prevents deep battery discharge to prolong battery lifespan.</p>
          </div>
        </div>

        {/* Voice & Notifications */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
          <div className="flex items-center space-x-2.5 text-yellow-400 font-mono text-xs font-bold">
            <Volume2 className="w-5 h-5" />
            <span>JARVIS VOICE & NOTIFICATION PREFERENCES</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300">Enable Push Notifications:</span>
            <button
              onClick={() => handleChange('notificationAlerts', !settings.notificationAlerts)}
              className={`w-12 h-6 rounded-full p-1 transition-all ${
                settings.notificationAlerts ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                settings.notificationAlerts ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
