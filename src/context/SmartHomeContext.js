import React, { createContext, useContext, useState, useEffect } from 'react';

const SmartHomeContext = createContext();

const initialAppliances = [
  {
    id: 'ac',
    name: 'Smart Climate AC',
    room: 'Living Room',
    powerDraw: 1.8, // kW
    status: true,
    mode: 'Cool',
    temp: 22,
    targetTemp: 22,
    fanSpeed: 'Auto',
    schedule: '22:00 - 06:00 Eco Mode',
    icon: 'Thermometer',
    category: 'HVAC'
  },
  {
    id: 'fan',
    name: 'Smart Ceiling Fan',
    room: 'Bedroom',
    powerDraw: 0.06, // kW
    status: true,
    speed: 3,
    breezeMode: true,
    schedule: 'Auto Motion Sense',
    icon: 'Wind',
    category: 'HVAC'
  },
  {
    id: 'lights',
    name: 'RGB Ambient Lighting',
    room: 'Living Room',
    powerDraw: 0.08, // kW
    status: true,
    brightness: 80,
    color: '#00f3ff',
    preset: 'Cyber Cyan',
    schedule: 'Dusk to 23:00',
    icon: 'Lightbulb',
    category: 'Lighting'
  },
  {
    id: 'fridge',
    name: 'Inverter Refrigerator',
    room: 'Kitchen',
    powerDraw: 0.18, // kW
    status: true,
    freezerTemp: -18,
    fridgeTemp: 3,
    ecoLock: true,
    schedule: 'Always On (Peak-Aware)',
    icon: 'Refrigerator',
    category: 'Kitchen'
  },
  {
    id: 'washer',
    name: 'Smart Eco Washer',
    room: 'Kitchen',
    powerDraw: 0.85, // kW
    status: false,
    cycle: 'Eco Cold 30°C',
    delayStart: '02:00 (Off-Peak)',
    progress: 0,
    schedule: 'Run at Low Tariff',
    icon: 'WashingMachine',
    category: 'Laundry'
  },
  {
    id: 'tv',
    name: '85" 4K OLED TV',
    room: 'Living Room',
    powerDraw: 0.14, // kW
    status: false,
    source: 'Jarvis OS Cinema',
    volume: 35,
    schedule: 'Manual',
    icon: 'Tv',
    category: 'Entertainment'
  },
  {
    id: 'heater',
    name: 'Heat Pump Water Heater',
    room: 'Garage',
    powerDraw: 1.5, // kW
    status: true,
    waterTemp: 55,
    targetTemp: 55,
    solarHeating: true,
    schedule: 'Heat via Solar 12:00',
    icon: 'Flame',
    category: 'Utility'
  },
  {
    id: 'ev',
    name: 'Level-2 EV Charger',
    room: 'Garage',
    powerDraw: 7.2, // kW
    status: false,
    chargeLimit: 80,
    currentBattery: 64,
    chargeRate: '7.2 kW',
    schedule: '01:00 AM cheap tariff',
    icon: 'Zap',
    category: 'Automotive'
  },
  {
    id: 'workstation',
    name: 'AI Workstation & Server',
    room: 'Office',
    powerDraw: 0.45, // kW
    status: true,
    ecoCompute: true,
    schedule: 'Neural Model Training',
    icon: 'Cpu',
    category: 'Office'
  }
];

const initialVectorAutomations = [
  {
    id: 'v1',
    deviceId: 'ac',
    deviceName: 'Smart Climate AC',
    room: 'Living Room',
    mode: 'Countdown',
    remainingSec: 1800, // 30 mins
    targetAction: 'Turn OFF',
    status: 'Running'
  },
  {
    id: 'v2',
    deviceId: 'fan',
    deviceName: 'Smart Ceiling Fan',
    room: 'Bedroom',
    mode: 'Circulate',
    onMin: 15,
    offMin: 10,
    currentCycle: 'ON (12:45 left)',
    status: 'Active Cycle'
  },
  {
    id: 'v3',
    deviceId: 'lights',
    deviceName: 'RGB Ambient Lighting',
    room: 'Living Room',
    mode: 'Schedule',
    nextActionTime: '06:00 PM',
    repeat: 'Everyday',
    targetAction: 'Turn ON (Preset: Cyber Cyan)',
    status: 'Scheduled'
  },
  {
    id: 'v4',
    deviceId: 'workstation',
    deviceName: 'AI Workstation & Server',
    room: 'Office',
    mode: 'Inching',
    durationSec: 30,
    remainingSec: 14,
    targetAction: 'Pulse Sync Task',
    status: 'Pulsing'
  },
  {
    id: 'v5',
    deviceId: 'tv',
    deviceName: '85" 4K OLED TV',
    room: 'Living Room',
    mode: 'Random',
    interval: 'Every 45 - 90 mins',
    securityMode: 'Occupancy Simulation',
    status: 'Enabled'
  }
];

const initialNotifications = [
  {
    id: 101,
    title: 'High Energy Usage Alert ⚡',
    message: 'Living Room AC consumed 35% more energy than usual in the past 2 hours.',
    priority: 'High',
    timestamp: '10:14 AM',
    read: false,
    category: 'Alert'
  },
  {
    id: 102,
    title: 'AI Tariff Optimization 🤖',
    message: 'Peak electricity usage detected. Shift heavy appliances (EV Charger, Washer) to off-peak slot.',
    priority: 'Medium',
    timestamp: '09:45 AM',
    read: false,
    category: 'Recommendation'
  },
  {
    id: 103,
    title: 'Energy Optimization 🔋',
    message: 'Battery level is low (18%). Eco-mode auto-throttled standby entertainment units.',
    priority: 'High',
    timestamp: '08:30 AM',
    read: true,
    category: 'Battery'
  },
  {
    id: 104,
    title: 'Solar Generation Peak ☀️',
    message: 'Rooftop solar array reaching maximum output of 5.8 kW. Edge Power Matrix fully charging.',
    priority: 'Low',
    timestamp: '07:15 AM',
    read: true,
    category: 'Solar'
  }
];

const initialAiRecommendations = [
  {
    id: 1,
    title: 'Pre-Cooling Activated for Peak Hours',
    description: 'Grid electricity tariff increases in 45 minutes ($0.42/kWh). Lowered thermostat by 2°C now using solar power.',
    savingsEstimate: '$2.40 / day',
    category: 'Tariff Optimization',
    impact: 'High',
    actionable: true,
    applied: true,
    time: '10 mins ago'
  },
  {
    id: 2,
    title: 'Shift Washing Machine to Off-Peak',
    description: 'Scheduled washer cycle to 02:00 AM automatically when solar/battery reserves cover 100% load.',
    savingsEstimate: '$1.15 / cycle',
    category: 'Automated Schedule',
    impact: 'Medium',
    actionable: true,
    applied: true,
    time: '25 mins ago'
  },
  {
    id: 3,
    title: 'Garage EV Charging Paused',
    description: 'Paused EV charger to prevent drawing expensive grid energy. Will resume at 01:00 AM off-peak rate.',
    savingsEstimate: '$4.80 / charge',
    category: 'Load Shedding',
    impact: 'High',
    actionable: true,
    applied: false,
    time: '1 hour ago'
  }
];

export const SmartHomeProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    name: 'Alex Mercer',
    email: 'alex.mercer@edgeai.home',
    avatar: 'AM',
    role: 'System Administrator'
  });

  const [appliances, setAppliances] = useState(initialAppliances);
  const [vectorAutomations, setVectorAutomations] = useState(initialVectorAutomations);
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [ecoMode, setEcoMode] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(78); // %
  const [solarGeneration, setSolarGeneration] = useState(4.6); // kW
  const [gridImport, setGridImport] = useState(0.0); // kW
  const [gridExport, setGridExport] = useState(1.8); // kW
  const [dailyCost, setDailyCost] = useState(3.42); // $

  // Energy-Focused Metrics (Replacing CO2 references)
  const [energySavedPct, setEnergySavedPct] = useState(24.5); // %
  const [powerOptimizationScore, setPowerOptimizationScore] = useState(98); // 0-100
  const [renewableUtilization, setRenewableUtilization] = useState(94); // %
  const [automationEfficiency, setAutomationEfficiency] = useState(96); // %

  const [aiRecommendations, setAiRecommendations] = useState(initialAiRecommendations);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | digitaltwin | appliances | timing | ai | energyflow | sustainability | reports | iot | settings
  const [jarvisActive, setJarvisActive] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [timeOfDayScenario, setTimeOfDayScenario] = useState('Day Solar Surplus');
  
  const [settings, setSettings] = useState({
    mqttBrokerUrl: 'mqtt://edge-ai-hub.local:1883',
    peakTariffRate: 0.48,
    offPeakTariffRate: 0.12,
    batteryMinBuffer: 15,
    autoLoadShedding: true,
    jarvisVoiceSpeed: 1.0,
    notificationAlerts: true
  });

  const [jarvisLogs, setJarvisLogs] = useState([
    { id: 1, text: "System initialized. Edge AI Neural Optimization online.", type: 'system', timestamp: '10:00:00' },
    { id: 2, text: "Solar array delivering 4.6 kW. Edge Power Matrix charging at 2.4 kW.", type: 'ai', timestamp: '10:02:15' }
  ]);

  const [telemetryHistory, setTelemetryHistory] = useState([
    { time: '06:00', actual: 1.2, predicted: 1.4, solar: 0.2, cost: 0.18 },
    { time: '08:00', actual: 3.5, predicted: 3.2, solar: 1.8, cost: 0.42 },
    { time: '10:00', actual: 2.8, predicted: 2.9, solar: 4.6, cost: 0.25 },
    { time: '12:00', actual: 4.1, predicted: 3.8, solar: 6.2, cost: 0.10 },
    { time: '14:00', actual: 3.2, predicted: 3.4, solar: 5.8, cost: 0.12 },
    { time: '16:00', actual: 2.4, predicted: 2.6, solar: 3.4, cost: 0.28 },
    { time: '18:00', actual: 4.8, predicted: 4.5, solar: 1.1, cost: 0.75 },
    { time: '20:00', actual: 3.9, predicted: 3.7, solar: 0.0, cost: 0.62 },
  ]);

  // Vector Automation Countdown Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setVectorAutomations(prev => prev.map(item => {
        if (item.mode === 'Countdown' && item.remainingSec > 0 && item.status === 'Running') {
          const nextSec = item.remainingSec - 1;
          if (nextSec === 0) {
            return { ...item, remainingSec: 0, status: 'Completed' };
          }
          return { ...item, remainingSec: nextSec };
        }
        if (item.mode === 'Inching' && item.remainingSec > 0 && item.status === 'Pulsing') {
          const nextSec = item.remainingSec - 1;
          if (nextSec === 0) {
            return { ...item, remainingSec: 0, status: 'Pulse Finished' };
          }
          return { ...item, remainingSec: nextSec };
        }
        return item;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Telemetry stream generator tick
  useEffect(() => {
    const interval = setInterval(() => {
      const activeLoad = appliances.reduce((sum, app) => sum + (app.status ? app.powerDraw : 0), 0);
      const netLoad = parseFloat(activeLoad.toFixed(2));

      let baseSolar = 4.6;
      if (timeOfDayScenario === 'Night Battery Mode') baseSolar = 0.0;
      else if (timeOfDayScenario === 'Grid Peak Crisis') baseSolar = 1.2;

      const randomSolar = parseFloat(Math.max(0, baseSolar + (Math.random() * 0.4 - 0.2)).toFixed(2));
      setSolarGeneration(randomSolar);

      const powerSurplus = randomSolar - netLoad;
      if (powerSurplus > 0) {
        setGridImport(0.0);
        setGridExport(parseFloat(Math.min(powerSurplus, 4.0).toFixed(2)));
        setBatteryLevel(prev => Math.min(100, parseFloat((prev + 0.1).toFixed(1))));
      } else {
        const deficit = Math.abs(powerSurplus);
        if (batteryLevel > settings.batteryMinBuffer) {
          setBatteryLevel(prev => Math.max(settings.batteryMinBuffer, parseFloat((prev - 0.1).toFixed(1))));
          setGridImport(0.0);
          setGridExport(0.0);
        } else {
          setGridImport(parseFloat(deficit.toFixed(2)));
          setGridExport(0.0);
        }
      }

      setDailyCost(prev => parseFloat((prev + (gridImport * 0.0001)).toFixed(2)));
      setEnergySavedPct(prev => parseFloat(Math.min(38, prev + 0.01).toFixed(1)));
    }, 3000);

    return () => clearInterval(interval);
  }, [appliances, batteryLevel, gridImport, timeOfDayScenario, settings.batteryMinBuffer]);

  const toggleAppliance = (id) => {
    setAppliances(prev => prev.map(app => {
      if (app.id === id) {
        const nextStatus = !app.status;
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setJarvisLogs(logs => [
          {
            id: Date.now(),
            text: `Manual Override: Turned ${nextStatus ? 'ON' : 'OFF'} ${app.name} (${app.room}). Power delta: ${nextStatus ? '+' : '-'}${app.powerDraw} kW.`,
            type: 'user',
            timestamp: timeStr
          },
          ...logs.slice(0, 15)
        ]);
        return { ...app, status: nextStatus };
      }
      return app;
    }));
  };

  const updateAppliance = (id, newProps) => {
    setAppliances(prev => prev.map(app => app.id === id ? { ...app, ...newProps } : app));
  };

  // Add 5-Vector Automations
  const addVectorAutomation = (newAuto) => {
    setVectorAutomations(prev => [newAuto, ...prev]);
  };

  const cancelVectorAutomation = (id) => {
    setVectorAutomations(prev => prev.filter(a => a.id !== id));
  };

  const applyRecommendation = (id) => {
    setAiRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, applied: true } : rec));
    const rec = aiRecommendations.find(r => r.id === id);
    if (rec) {
      setJarvisLogs(logs => [
        {
          id: Date.now(),
          text: `Applied Recommendation: "${rec.title}". Optimized home energy load.`,
          type: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        },
        ...logs.slice(0, 15)
      ]);
    }
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const loginUser = (email, password) => {
    setUser({
      name: email.split('@')[0].toUpperCase(),
      email,
      avatar: email.substring(0, 2).toUpperCase(),
      role: 'System Administrator'
    });
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
  };

  const processJarvisCommand = (commandText) => {
    const text = commandText.toLowerCase();
    let responseText = "I have analyzed your smart home system. Everything is operating within peak green parameters.";

    if (text.includes('why was ac changed') || text.includes('why eco mode') || text.includes('why did you turn off')) {
      responseText = "High ambient temperature and increased peak tariff energy usage detected. Eco Mode activated to reduce power consumption by 1.8 kW while maintaining 22°C comfort.";
    } else if (text.includes('turn off ac') || text.includes('ac off')) {
      toggleAppliance('ac');
      responseText = "Air conditioner powered off. Estimated energy savings: 1.8 kW/hr.";
    } else if (text.includes('turn on ac') || text.includes('ac on')) {
      updateAppliance('ac', { status: true });
      responseText = "Air conditioner engaged in Eco Cool mode set to 22°C.";
    } else if (text.includes('office') || text.includes('workstation')) {
      responseText = "Office AI Workstation is running in Eco-Compute mode at 0.45 kW using clean solar power.";
    } else if (text.includes('battery') || text.includes('power matrix') || text.includes('storage')) {
      responseText = `Edge Power Matrix storage array state of charge is at ${batteryLevel}%. Running solar self-consumption strategy.`;
    } else if (text.includes('solar') || text.includes('generation')) {
      responseText = `Solar roof array is generating ${solarGeneration} kW of clean energy. Zero grid dependence detected.`;
    } else if (text.includes('charge ev') || text.includes('ev charger')) {
      toggleAppliance('ev');
      responseText = "EV Fast Charger toggled. Charging rate set to 7.2 kW using direct solar & battery storage.";
    } else if (text.includes('eco mode') || text.includes('save energy')) {
      setEcoMode(true);
      updateAppliance('tv', { status: false });
      responseText = "Eco Mode fully engaged! TV powered down, thermostat optimized to 22°C, and battery export activated.";
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setJarvisLogs(logs => [
      { id: Date.now() + 1, text: commandText, type: 'user', timestamp: timeStr },
      { id: Date.now() + 2, text: responseText, type: 'ai', timestamp: timeStr },
      ...logs.slice(0, 15)
    ]);

    return responseText;
  };

  const totalConsumption = parseFloat(appliances.reduce((sum, app) => sum + (app.status ? app.powerDraw : 0), 0).toFixed(2));
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <SmartHomeContext.Provider value={{
      isAuthenticated,
      user,
      loginUser,
      logoutUser,
      appliances,
      toggleAppliance,
      updateAppliance,
      vectorAutomations,
      addVectorAutomation,
      cancelVectorAutomation,
      selectedRoom,
      setSelectedRoom,
      ecoMode,
      setEcoMode,
      batteryLevel,
      solarGeneration,
      gridImport,
      gridExport,
      totalConsumption,
      dailyCost,
      energySavedPct,
      powerOptimizationScore,
      renewableUtilization,
      automationEfficiency,
      aiRecommendations,
      applyRecommendation,
      activeTab,
      setActiveTab,
      jarvisActive,
      setJarvisActive,
      notificationOpen,
      setNotificationOpen,
      notifications,
      unreadNotificationCount,
      markNotificationRead,
      clearAllNotifications,
      jarvisLogs,
      processJarvisCommand,
      telemetryHistory,
      timeOfDayScenario,
      setTimeOfDayScenario,
      settings,
      setSettings
    }}>
      {children}
    </SmartHomeContext.Provider>
  );
};

export const useSmartHome = () => useContext(SmartHomeContext);
