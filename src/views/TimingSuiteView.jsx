import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Clock, 
  Calendar, 
  RefreshCw, 
  HelpCircle, 
  Zap, 
  Sliders, 
  Play, 
  Pause, 
  Trash2, 
  ToggleLeft, 
  ShieldAlert, 
  Activity,
  ArrowRight,
  Plus
} from 'lucide-react';

export const TimingSuiteView = () => {
  const { appliances, vectorAutomations, addVectorAutomation, cancelVectorAutomation } = useSmartHome();
  const [selectedDevice, setSelectedDevice] = useState(appliances[0]?.id || 'ac');
  
  // Countdown State
  const [countdownMins, setCountdownMins] = useState(30);
  const [countdownAction, setCountdownAction] = useState('Turn OFF');

  // Schedule State
  const [scheduleTime, setScheduleTime] = useState('18:00');
  const [scheduleAction, setScheduleAction] = useState('Turn ON');
  const [scheduleRepeat, setScheduleRepeat] = useState('Everyday');

  // Circulate State
  const [circulateOnMin, setCirculateOnMin] = useState(15);
  const [circulateOffMin, setCirculateOffMin] = useState(10);

  // Random State
  const [randomRange, setRandomRange] = useState('30-60 mins');
  const [randomMode, setRandomMode] = useState('Security Simulation');

  // Inching State
  const [inchingSeconds, setInchingSeconds] = useState(10);

  const getDeviceName = (id) => appliances.find(a => a.id === id)?.name || 'Device';
  const getDeviceRoom = (id) => appliances.find(a => a.id === id)?.room || 'Global';

  const handleAddCountdown = () => {
    const newAuto = {
      id: 'v-' + Date.now(),
      deviceId: selectedDevice,
      deviceName: getDeviceName(selectedDevice),
      room: getDeviceRoom(selectedDevice),
      mode: 'Countdown',
      remainingSec: countdownMins * 60,
      targetAction: countdownAction,
      status: 'Running'
    };
    addVectorAutomation(newAuto);
  };

  const handleAddSchedule = () => {
    const newAuto = {
      id: 'v-' + Date.now(),
      deviceId: selectedDevice,
      deviceName: getDeviceName(selectedDevice),
      room: getDeviceRoom(selectedDevice),
      mode: 'Schedule',
      nextActionTime: scheduleTime,
      repeat: scheduleRepeat,
      targetAction: scheduleAction,
      status: 'Scheduled'
    };
    addVectorAutomation(newAuto);
  };

  const handleAddCirculate = () => {
    const newAuto = {
      id: 'v-' + Date.now(),
      deviceId: selectedDevice,
      deviceName: getDeviceName(selectedDevice),
      room: getDeviceRoom(selectedDevice),
      mode: 'Circulate',
      onMin: circulateOnMin,
      offMin: circulateOffMin,
      currentCycle: `ON (${circulateOnMin} mins remaining)`,
      status: 'Active Cycle'
    };
    addVectorAutomation(newAuto);
  };

  const handleAddRandom = () => {
    const newAuto = {
      id: 'v-' + Date.now(),
      deviceId: selectedDevice,
      deviceName: getDeviceName(selectedDevice),
      room: getDeviceRoom(selectedDevice),
      mode: 'Random',
      interval: randomRange,
      securityMode: randomMode,
      status: 'Enabled'
    };
    addVectorAutomation(newAuto);
  };

  const handleAddInching = (sec) => {
    const duration = sec || inchingSeconds;
    const newAuto = {
      id: 'v-' + Date.now(),
      deviceId: selectedDevice,
      deviceName: getDeviceName(selectedDevice),
      room: getDeviceRoom(selectedDevice),
      mode: 'Inching',
      durationSec: duration,
      remainingSec: duration,
      targetAction: 'Pulse Spark Control',
      status: 'Pulsing'
    };
    addVectorAutomation(newAuto);
  };

  const formatCountdown = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Clock className="w-4 h-4 animate-spin-slow" />
            <span>5-VECTOR TIMING SUITE • ADVANCED OPERATING STATES</span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight mt-1">
            Intelligent Automation Vectors
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Configurable control pulses, schedules, loops, and security triggers.
          </p>
        </div>

        {/* Global Device Selector */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-[10px] font-mono text-slate-400">Target Appliance Selector:</label>
          <select 
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
          >
            {appliances.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.room})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5-Vector Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        
        {/* 1. Countdown Vector */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
              <span className="p-1 rounded bg-cyan-500/10"><Clock className="w-3.5 h-3.5" /></span>
              <span>1. Countdown</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Auto-trigger power state swap after set delay.
            </p>

            <div className="space-y-2 mt-4">
              <label className="text-[10px] font-mono text-slate-400">Minutes Delay:</label>
              <input 
                type="number"
                value={countdownMins}
                onChange={(e) => setCountdownMins(parseInt(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white"
              />

              <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 text-[10px] font-mono mt-2 justify-around">
                {['Turn ON', 'Turn OFF'].map(action => (
                  <button
                    key={action}
                    onClick={() => setCountdownAction(action)}
                    className={`px-2 py-1 rounded transition-colors ${countdownAction === action ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddCountdown}
            className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_10px_rgba(0,243,255,0.3)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply Countdown</span>
          </button>
        </div>

        {/* 2. Schedule Vector */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
              <span className="p-1 rounded bg-cyan-500/10"><Calendar className="w-3.5 h-3.5" /></span>
              <span>2. Schedule</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Standard calendar automation triggers.
            </p>

            <div className="space-y-2 mt-4">
              <label className="text-[10px] font-mono text-slate-400">Trigger Time:</label>
              <input 
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white"
              />

              <label className="text-[10px] font-mono text-slate-400 mt-2 block">Action:</label>
              <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 text-[10px] font-mono justify-around">
                {['Turn ON', 'Turn OFF'].map(action => (
                  <button
                    key={action}
                    onClick={() => setScheduleAction(action)}
                    className={`px-2 py-1 rounded transition-colors ${scheduleAction === action ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddSchedule}
            className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_10px_rgba(0,243,255,0.3)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply Schedule</span>
          </button>
        </div>

        {/* 3. Circulate Vector */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
              <span className="p-1 rounded bg-cyan-500/10"><RefreshCw className="w-3.5 h-3.5" /></span>
              <span>3. Circulate</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Infinite loop timers for air cycling or pumps.
            </p>

            <div className="space-y-2 mt-4">
              <div className="flex space-x-2">
                <div>
                  <label className="text-[9px] font-mono text-slate-400">ON (min):</label>
                  <input 
                    type="number"
                    value={circulateOnMin}
                    onChange={(e) => setCirculateOnMin(parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-slate-400">OFF (min):</label>
                  <input 
                    type="number"
                    value={circulateOffMin}
                    onChange={(e) => setCirculateOffMin(parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddCirculate}
            className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_10px_rgba(0,243,255,0.3)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply Circulate</span>
          </button>
        </div>

        {/* 4. Random Vector */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
              <span className="p-1 rounded bg-cyan-500/10"><HelpCircle className="w-3.5 h-3.5" /></span>
              <span>4. Random</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Random occupancy signals for home security.
            </p>

            <div className="space-y-2 mt-4">
              <label className="text-[10px] font-mono text-slate-400">Time Interval Range:</label>
              <select
                value={randomRange}
                onChange={(e) => setRandomRange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300"
              >
                <option value="15-30 mins">15 - 30 mins</option>
                <option value="30-60 mins">30 - 60 mins</option>
                <option value="1-3 hours">1 - 3 hours</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleAddRandom}
            className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_10px_rgba(0,243,255,0.3)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply Random</span>
          </button>
        </div>

        {/* 5. Inching Vector */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
              <span className="p-1 rounded bg-cyan-500/10"><Zap className="w-3.5 h-3.5" /></span>
              <span>5. Inching</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Short-duration pulse switch activation.
            </p>

            <div className="grid grid-cols-3 gap-1 mt-4 text-[10px] font-mono">
              {[5, 10, 30].map(s => (
                <button
                  key={s}
                  onClick={() => handleAddInching(s)}
                  className="py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 text-center"
                >
                  {s}s Pulse
                </button>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 text-center italic">
            Tap a pulse preset to launch
          </div>
        </div>

      </div>

      {/* Active Vector Schedule Monitor Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
        <h3 className="text-base font-sans font-bold text-white mb-4 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span>Active Timing Vectors & Automation Status</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-cyan-400">
                <th className="py-3 px-4">APPLIANCE</th>
                <th className="py-3 px-4">ROOM</th>
                <th className="py-3 px-4">VECTOR STATE</th>
                <th className="py-3 px-4">TARGET ACTION</th>
                <th className="py-3 px-4">MONITOR METRIC</th>
                <th className="py-3 px-4">CANCEL</th>
              </tr>
            </thead>
            <tbody className="text-xs font-mono text-slate-300 divide-y divide-slate-800/60">
              {vectorAutomations.map(auto => (
                <tr key={auto.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{auto.deviceName}</td>
                  <td className="py-3.5 px-4 text-slate-400">{auto.room}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {auto.mode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{auto.targetAction || 'Cycle Loop'}</td>
                  <td className="py-3.5 px-4 text-amber-400 font-bold">
                    {auto.mode === 'Countdown' && auto.remainingSec > 0 && `Remaining: ${formatCountdown(auto.remainingSec)}`}
                    {auto.mode === 'Countdown' && auto.remainingSec === 0 && 'COMPLETED'}
                    {auto.mode === 'Schedule' && `Next Action: ${auto.nextActionTime}`}
                    {auto.mode === 'Circulate' && auto.currentCycle}
                    {auto.mode === 'Random' && `Interval: ${auto.interval}`}
                    {auto.mode === 'Inching' && auto.remainingSec > 0 && `Pulse: ${auto.remainingSec}s left`}
                    {auto.mode === 'Inching' && auto.remainingSec === 0 && 'FINISHED'}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => cancelVectorAutomation(auto.id)}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
