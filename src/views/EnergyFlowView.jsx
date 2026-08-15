import React, { useEffect, useRef } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Share2, 
  Sun, 
  Home, 
  Zap, 
  Moon, 
  AlertTriangle
} from 'lucide-react';

export const EnergyFlowView = () => {
  const { 
    solarGeneration, 
    batteryLevel, 
    totalConsumption, 
    gridImport, 
    gridExport,
    timeOfDayScenario,
    setTimeOfDayScenario 
  } = useSmartHome();

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = canvas.parentElement.clientWidth);
    const height = (canvas.height = 420);

    const isNight = timeOfDayScenario === 'Night Battery Mode';

    const solarNode = { x: width * 0.2, y: height * 0.25, label: 'Solar Array', val: isNight ? '0.0 kW' : `${solarGeneration} kW`, color: isNight ? '#64748b' : '#f59e0b' };
    const batteryNode = { x: width * 0.2, y: height * 0.75, label: 'Power Matrix', val: `${batteryLevel}%`, color: '#00f3ff' };
    const homeNode = { x: width * 0.5, y: height * 0.5, label: 'Smart Home', val: `${totalConsumption} kW`, color: '#a855f7' };
    const gridNode = { x: width * 0.8, y: height * 0.5, label: 'Power Grid', val: gridExport > 0 ? `+${gridExport} kW` : `${gridImport} kW`, color: '#10b981' };

    class Particle {
      constructor(fromNode, toNode, color, speed) {
        this.from = fromNode;
        this.to = toNode;
        this.color = color;
        this.progress = Math.random();
        this.speed = speed || 0.008;
      }

      update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
          this.progress = 0;
        }
      }

      draw(context) {
        const currentX = this.from.x + (this.to.x - this.from.x) * this.progress;
        const currentY = this.from.y + (this.to.y - this.from.y) * this.progress;

        context.beginPath();
        context.arc(currentX, currentY, 4, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.shadowColor = this.color;
        context.shadowBlur = 10;
        context.fill();
        context.shadowBlur = 0;
      }
    }

    const particles = [];
    if (!isNight && solarGeneration > 0) {
      for (let i = 0; i < 8; i++) {
        particles.push(new Particle(solarNode, homeNode, '#f59e0b', 0.006));
      }
    }

    for (let i = 0; i < 6; i++) {
      particles.push(new Particle(batteryNode, homeNode, '#00f3ff', 0.007));
    }

    for (let i = 0; i < 6; i++) {
      if (gridExport > 0) {
        particles.push(new Particle(homeNode, gridNode, '#10b981', 0.007));
      } else {
        particles.push(new Particle(gridNode, homeNode, '#ef4444', 0.007));
      }
    }

    const drawLine = (n1, n2, color) => {
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawNode = (node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(10, 16, 30, 0.9)';
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.font = 'bold 12px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y - 4);

      ctx.font = '11px "Fira Code", monospace';
      ctx.fillStyle = node.color;
      ctx.fillText(node.val, node.x, node.y + 12);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      drawLine(solarNode, homeNode, isNight ? 'rgba(100, 116, 139, 0.2)' : 'rgba(245, 158, 11, 0.4)');
      drawLine(batteryNode, homeNode, 'rgba(0, 243, 255, 0.4)');
      drawLine(homeNode, gridNode, gridExport > 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)');

      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      drawNode(solarNode);
      drawNode(batteryNode);
      drawNode(homeNode);
      drawNode(gridNode);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [solarGeneration, batteryLevel, totalConsumption, gridExport, gridImport, timeOfDayScenario]);

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Share2 className="w-4 h-4" />
            <span>DAY/NIGHT ANIMATED ENERGY PIPELINE</span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight mt-1">
            Live Energy Flow Visualization & Scenarios
          </h2>
        </div>

        {/* Day/Night Scenario Picker */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'Day Solar Surplus', label: 'Day Solar Peak', icon: Sun },
            { id: 'Night Battery Mode', label: 'Night Battery', icon: Moon },
            { id: 'Grid Peak Crisis', label: 'Grid Crisis', icon: AlertTriangle }
          ].map(sc => {
            const Icon = sc.icon;
            const active = timeOfDayScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setTimeOfDayScenario(sc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-1.5 transition-all ${
                  active ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,243,255,0.4)]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-slate-400">PARTICLE POWER ROUTING ({timeOfDayScenario.toUpperCase()})</span>
          <span className="text-xs font-mono text-cyan-400">TOTAL DRAW: {totalConsumption} kW</span>
        </div>

        <div className="w-full bg-[#050811] rounded-2xl border border-slate-800 p-2">
          <canvas ref={canvasRef} className="w-full h-[420px]" />
        </div>
      </div>

    </div>
  );
};
