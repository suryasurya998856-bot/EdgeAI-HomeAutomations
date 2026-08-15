import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Zap, 
  Cpu, 
  Battery, 
  Sun,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const NotificationCenter = () => {
  const { 
    notificationOpen, 
    setNotificationOpen, 
    notifications, 
    markNotificationRead, 
    clearAllNotifications 
  } = useSmartHome();

  const [filter, setFilter] = useState('All'); // All | Unread | High

  if (!notificationOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'Unread') return !n.read;
    if (filter === 'High') return n.priority === 'High';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#050811]/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full glass-panel-glow border-l border-cyan-400/40 p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,243,255,0.2)]">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-sans font-bold text-white tracking-wider">NOTIFICATIONS</h3>
                <p className="text-xs text-slate-400 font-mono">Neural Event & System Telemetry</p>
              </div>
            </div>

            <button
              onClick={() => setNotificationOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between my-4">
            <div className="flex space-x-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {['All', 'Unread', 'High'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    filter === f 
                      ? 'bg-cyan-500 text-slate-950 font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs font-mono text-slate-400 hover:text-rose-400 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(n => (
                <div 
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    n.read 
                      ? 'bg-slate-950/50 border-slate-800 text-slate-400' 
                      : 'bg-slate-900/80 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(0,243,255,0.1)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      n.priority === 'High' 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                        : n.priority === 'Medium' 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    }`}>
                      {n.priority} Priority
                    </span>

                    <span className="text-[10px] font-mono text-slate-500">{n.timestamp}</span>
                  </div>

                  <h4 className="text-xs font-bold mt-2 text-white">{n.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">{n.message}</p>

                  {!n.read && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark as Read</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                No active notifications in this category.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>AI Alert Scanner: ACTIVE</span>
          <span className="text-emerald-400">Zero Critical Faults</span>
        </div>

      </div>
    </div>
  );
};
