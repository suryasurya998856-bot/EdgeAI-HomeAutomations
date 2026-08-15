import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Box, 
  Thermometer, 
  Zap, 
  Sparkles, 
  Eye, 
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Cpu
} from 'lucide-react';

export const DigitalTwinView = () => {
  const { appliances, toggleAppliance, selectedRoom, setSelectedRoom } = useSmartHome();
  const mountRef = useRef(null);
  const [thermalMode, setThermalMode] = useState(false);

  // Helper to compute live load for any room
  const getRoomLoad = (roomName) => {
    return parseFloat(
      appliances
        .filter(a => a.room === roomName && a.status)
        .reduce((sum, app) => sum + app.powerDraw, 0)
        .toFixed(2)
    );
  };

  const getEnergyColor = (loadKw) => {
    if (loadKw > 1.5) return { hex: 0xef4444, css: 'text-rose-400 border-rose-500/40 bg-rose-500/10', label: 'High Usage (Red)' };
    if (loadKw >= 0.2) return { hex: 0xf59e0b, css: 'text-amber-400 border-amber-500/40 bg-amber-500/10', label: 'Medium Usage (Yellow)' };
    return { hex: 0x10b981, css: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', label: 'Efficient (Green)' };
  };

  const roomsData = {
    'Living Room': {
      temp: '22°C',
      humidity: '48%',
      devicesCount: appliances.filter(a => a.room === 'Living Room').length,
      aiTip: 'Ambient lighting dimmed automatically by 20% to save 0.04 kW during daylight.'
    },
    'Bedroom': {
      temp: '21°C',
      humidity: '52%',
      devicesCount: appliances.filter(a => a.room === 'Bedroom').length,
      aiTip: 'HVAC setback schedule active. Bedtime temperature auto-preset to 21°C.'
    },
    'Kitchen': {
      temp: '24°C',
      humidity: '55%',
      devicesCount: appliances.filter(a => a.room === 'Kitchen').length,
      aiTip: 'Refrigerator running eco-inverter cycle. Eco Washer scheduled for 02:00 AM.'
    },
    'Garage': {
      temp: '26°C',
      humidity: '40%',
      devicesCount: appliances.filter(a => a.room === 'Garage').length,
      aiTip: 'Edge Power Matrix battery at 78%. EV Charger set to cheap off-peak rate slot.'
    },
    'Office': {
      temp: '23°C',
      humidity: '45%',
      devicesCount: appliances.filter(a => a.room === 'Office').length,
      aiTip: 'AI Workstation operating in Eco-Compute mode powered by 100% solar array.'
    },
    'Garden': {
      temp: '27°C',
      humidity: '65%',
      devicesCount: 2,
      aiTip: 'Smart irrigation postponed due to predicted morning rainfall.'
    }
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    scene.fog = new THREE.FogExp2(0x050811, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(18, 18, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.6);
    scene.add(ambientLight);

    const mainDirectionalLight = new THREE.DirectionalLight(0x00f3ff, 2.0);
    mainDirectionalLight.position.set(12, 22, 16);
    mainDirectionalLight.castShadow = true;
    scene.add(mainDirectionalLight);

    const secondaryLight = new THREE.PointLight(0xa855f7, 2.5, 35);
    secondaryLight.position.set(-12, 10, -12);
    scene.add(secondaryLight);

    // Grid Floor Platform
    const gridHelper = new THREE.GridHelper(34, 34, 0x00f3ff, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    const houseGroup = new THREE.Group();

    // Base Slab
    const baseGeo = new THREE.BoxGeometry(16, 0.4, 14);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0a101e,
      roughness: 0.2,
      metalness: 0.8
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.2;
    houseGroup.add(baseMesh);

    // Helper to build 3D Room Box
    const createRoomBox = (name, posX, posZ, sizeX, sizeZ) => {
      const roomGroup = new THREE.Group();
      const load = getRoomLoad(name);
      const colorInfo = getEnergyColor(load);

      const isSelected = selectedRoom === name;
      const floorColor = thermalMode 
        ? (load > 1.0 ? 0xef4444 : 0x00f3ff)
        : (isSelected ? 0x00f3ff : colorInfo.hex);

      // Floor plane
      const floorGeo = new THREE.BoxGeometry(sizeX, 0.12, sizeZ);
      const floorMat = new THREE.MeshStandardMaterial({
        color: floorColor,
        roughness: 0.3,
        metalness: 0.5,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.65
      });
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.position.set(posX, 0.46, posZ);
      roomGroup.add(floorMesh);

      // Glass Walls around room
      const wallMat = new THREE.MeshPhysicalMaterial({
        color: floorColor,
        transparent: true,
        opacity: 0.22,
        roughness: 0.1,
        transmission: 0.85,
        thickness: 0.5
      });

      const wallGeoX = new THREE.BoxGeometry(sizeX, 1.8, 0.1);
      const wallBack = new THREE.Mesh(wallGeoX, wallMat);
      wallBack.position.set(posX, 1.35, posZ - sizeZ / 2);
      roomGroup.add(wallBack);

      // Top Neon Status Bar
      const barGeo = new THREE.BoxGeometry(sizeX, 0.1, 0.1);
      const barMat = new THREE.MeshBasicMaterial({ color: floorColor });
      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.set(posX, 2.3, posZ - sizeZ / 2);
      roomGroup.add(barMesh);

      // Point light inside Room
      const roomLight = new THREE.PointLight(floorColor, isSelected ? 3.0 : 1.2, 7);
      roomLight.position.set(posX, 1.5, posZ);
      roomGroup.add(roomLight);

      houseGroup.add(roomGroup);
    };

    // 6 Rooms positioning:
    createRoomBox('Living Room', -4, 2.5, 5.2, 4.8);
    createRoomBox('Bedroom', 1.2, 2.5, 4.8, 4.8);
    createRoomBox('Office', 6.2, 2.5, 4.2, 4.8);
    createRoomBox('Kitchen', -4, -2.8, 5.2, 4.8);
    createRoomBox('Garage', 3.6, -2.8, 9.4, 4.8);
    createRoomBox('Garden', 0, 6.2, 16, 2.0);

    scene.add(houseGroup);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      houseGroup.rotation.y += 0.0018;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [selectedRoom, thermalMode, appliances]);

  const currentLoad = getRoomLoad(selectedRoom);
  const colorInfo = getEnergyColor(currentLoad);
  const activeRoomInfo = roomsData[selectedRoom] || roomsData['Living Room'];
  const roomDevices = appliances.filter(a => a.room === selectedRoom);

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Top Header & Color Legend */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Box className="w-4 h-4" />
            <span>INTERACTIVE 3D DIGITAL TWIN • 6 ROOM ZONES</span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight mt-1">
            Smart Home Spatial Floorplan & Energy Indicators
          </h2>
        </div>

        {/* Energy Consumption Indicator Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Green (&lt; 0.2 kW)</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Yellow (0.2-1.5 kW)</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Red (&gt; 1.5 kW)</span>
          </span>

          <button
            onClick={() => setThermalMode(!thermalMode)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              thermalMode 
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Thermal View</span>
          </button>
        </div>
      </div>

      {/* Main 3D Viewport & Inspector Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3D Canvas Container */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-cyan-500/20 h-[520px] relative overflow-hidden flex flex-col">
          
          {/* 6 Room Selector Floating Pills */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 max-w-full">
            {['Living Room', 'Bedroom', 'Office', 'Kitchen', 'Garage', 'Garden'].map(room => {
              const loadKw = getRoomLoad(room);
              const col = getEnergyColor(loadKw);
              return (
                <button
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all flex items-center space-x-1.5 ${
                    selectedRoom === room 
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,243,255,0.4)] font-bold' 
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  <span>{room}</span>
                  <span className={`w-2 h-2 rounded-full ${loadKw > 1.5 ? 'bg-rose-400' : loadKw >= 0.2 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Three.js Render Target */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Bottom Viewport Legend */}
          <div className="absolute bottom-4 left-4 right-4 z-10 glass-pill px-4 py-2 rounded-xl flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>3D Spatial Floorplan: 6 Interactive Zones</span>
            </span>
            <span className="text-slate-400">Drag to orbit 3D model</span>
          </div>

        </div>

        {/* Selected Room Inspector Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">ZONE INSPECTOR</span>
                <h3 className="text-xl font-sans font-bold text-white">{selectedRoom}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono border ${colorInfo.css}`}>
                {colorInfo.label}
              </span>
            </div>

            {/* Room Environment Metrics */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  <span>Ambient Temp</span>
                </div>
                <p className="text-lg font-bold text-white mt-1 font-mono">{activeRoomInfo.temp}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Zone Power Load</span>
                </div>
                <p className="text-lg font-bold text-amber-300 mt-1 font-mono">{currentLoad} kW</p>
              </div>
            </div>

            {/* Room AI Recommendation */}
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 mb-4">
              <div className="flex items-center space-x-2 text-purple-300 text-xs font-semibold font-mono">
                <Sparkles className="w-4 h-4" />
                <span>Zone AI Optimization</span>
              </div>
              <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                {activeRoomInfo.aiTip}
              </p>
            </div>

            {/* Appliances in Selected Room */}
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Zone Appliances ({roomDevices.length})
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {roomDevices.length > 0 ? (
                roomDevices.map(app => (
                  <div key={app.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-semibold text-white">{app.name}</h5>
                      <p className="text-[10px] font-mono text-amber-400">{app.powerDraw} kW</p>
                    </div>

                    <button
                      onClick={() => toggleAppliance(app.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        app.status ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,243,255,0.3)]' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {app.status ? 'ON' : 'OFF'}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs font-mono text-slate-500 italic py-2">No active powered appliances in this zone.</p>
              )}
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Spatial Mesh Sync: 100%</span>
            <span className="text-emerald-400">Zero Latency</span>
          </div>
        </div>

      </div>

    </div>
  );
};
