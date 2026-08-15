import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { Cpu, ShieldCheck, ArrowRight, Lock, Mail, Sparkles, Key } from 'lucide-react';

export const LoginView = () => {
  const { loginUser } = useSmartHome();
  const [email, setEmail] = useState('alex.mercer@edgeai.home');
  const [password, setPassword] = useState('••••••••••••');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      loginUser(email, password);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#050811] text-slate-100 overflow-hidden">
      
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md glass-panel-glow rounded-3xl p-8 border border-cyan-400/40 shadow-[0_0_60px_rgba(0,243,255,0.2)]">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(0,243,255,0.4)] animate-pulse-glow mb-4">
            <Cpu className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-sans font-bold text-white tracking-wider flex items-center space-x-2">
            <span>EDGE AI OS</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/40">
              v3.0 PRO
            </span>
          </h1>
          
          <h2 className="text-xl font-sans font-bold text-cyan-300 mt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Access your intelligent smart home ecosystem
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Identity (Email):</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@edgeai.home"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>Neural Access Key:</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-purple-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono"
            />
          </div>

          {/* Forgot Password link */}
          <div className="flex justify-end text-xs font-mono">
            <button type="button" className="text-cyan-400 hover:underline">
              Forgot Access Key?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-sans font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)]"
          >
            <span>{isRegister ? 'Initialize Smart Identity' : 'Authenticate & Launch OS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="relative my-4 text-center text-xs font-mono text-slate-500">
            <span className="bg-[#050811] px-2 relative z-10">OR AUTHENTICATE WITH</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => loginUser('google.user@edgeai.home', 'google')}
            className="w-full py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center justify-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google Identity</span>
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 text-center text-xs font-mono text-slate-400">
          <span>{isRegister ? 'Already registered?' : 'Need a Smart Home ecosystem identity?'} </span>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-cyan-400 font-bold hover:underline"
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>

      </div>
    </div>
  );
};
