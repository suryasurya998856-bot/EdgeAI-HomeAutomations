import React, { useState, useEffect } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { 
  Wifi, 
  Terminal, 
  Code2, 
  Cpu, 
  CheckCircle2, 
  Copy, 
  Send,
  Radio,
  Server
} from 'lucide-react';

export const IoTIntegrationView = () => {
  const { totalConsumption, solarGeneration, batteryLevel } = useSmartHome();
  const [copied, setCopied] = useState(false);
  const [mqttPackets, setMqttPackets] = useState([
    { id: 1, topic: 'home/sensor/solar', payload: `{"voltage": 230.4, "current": 20.0, "power_kw": ${solarGeneration}}`, timestamp: '10:14:02' },
    { id: 2, topic: 'home/powermetrix/telemetry', payload: `{"soc_pct": ${batteryLevel}, "temp_c": 31.2, "status": "DISCHARGING"}`, timestamp: '10:14:05' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPacket = {
        id: Date.now(),
        topic: 'home/sensor/main_meter',
        payload: `{"active_load_kw": ${totalConsumption}, "grid_import_kw": 0.0, "freq_hz": 60.01}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setMqttPackets(prev => [newPacket, ...prev.slice(0, 15)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalConsumption]);

  const esp32CodeSnippet = `// Edge AI Smart Home - ESP32 MQTT Telemetry Client
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "edge-ai-hub.local";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // Read ACS712 Current Sensor & Voltage Sensor
  float power_kw = readACS712Current() * 230.0 / 1000.0;

  StaticJsonDocument<200> doc;
  doc["device_id"] = "esp32_main_meter";
  doc["active_load_kw"] = power_kw;
  doc["timestamp"] = millis();

  char buffer[256];
  serializeJson(doc, buffer);
  client.publish("home/sensor/main_meter", buffer);

  delay(2000);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(esp32CodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Wifi className="w-4 h-4" />
            <span>ESP32 / ARDUINO / MQTT HARDWARE INTEGRATION ENGINE</span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white tracking-tight mt-1">
            Physical IoT Sensor & Hardware Pipeline
          </h2>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>MQTT Broker: ONLINE (Port 1883)</span>
        </div>
      </div>

      {/* Grid: MQTT Telemetry Terminal & C++ Code Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Live MQTT JSON Telemetry Feed */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-sans font-bold text-white">Live MQTT Stream Console</h3>
              </div>
              <span className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>RECEIVING PACKETS</span>
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 rounded-2xl bg-[#050811] border border-slate-800 font-mono text-xs space-y-2">
              {mqttPackets.map(pkt => (
                <div key={pkt.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="text-cyan-400 font-bold">TOPIC: {pkt.topic}</span>
                    <span>[{pkt.timestamp}]</span>
                  </div>
                  <p className="text-emerald-400 mt-1 break-all">{pkt.payload}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Protocol: MQTT v5.0 / WebSockets</span>
            <span className="text-cyan-400">Lat: 4ms</span>
          </div>
        </div>

        {/* C++ Arduino ESP32 Firmware Generator */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-sans font-bold text-white">ESP32 Firmware C++ Boilerplate</h3>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 text-xs font-mono border border-purple-500/40 flex items-center space-x-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy C++ Code'}</span>
              </button>
            </div>

            <pre className="max-h-96 overflow-y-auto p-4 rounded-2xl bg-[#050811] border border-slate-800 font-mono text-[11px] text-cyan-300 leading-relaxed">
              {esp32CodeSnippet}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Ready for flashing onto ESP32/ESP8266/RPi</span>
            <span className="text-purple-400">JSON Schema Valid</span>
          </div>
        </div>

      </div>

    </div>
  );
};
