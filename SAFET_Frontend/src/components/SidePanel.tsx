import React from 'react';
import { RefreshCw, Thermometer, Droplets, Activity } from 'lucide-react';
import { SensorData } from '../types';
import './dashbstyle.css'

interface SidePanelProps {
  data: SensorData;
  onRefresh: () => void;
}

export function SidePanel({ data, onRefresh }: SidePanelProps) {
  return (
    <div className="sticky top-8 p-6 rounded-xl space-y-6 w-80 h-fit bg-blue-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Work Area</h1>
          <p className="text-gray-400">WA1312</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-700 p-4 rounded-lg ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Temperature</p>
              <p className="text-xl text-white">{data.temperature}°C</p>
            </div>
            <Thermometer className="text-blue-400" />
          </div>
        </div>

        <div className="bg-blue-700 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Humidity</p>
              <p className="text-xl text-white">{data.humidity}%</p>
            </div>
            <Droplets className="text-blue-400" />
          </div>
        </div>

        <div className="bg-blue-700 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Air Quality</p>
              <p className="text-xl text-white">{data.aqiScore} AQI</p>
            </div>
            <Activity className="text-blue-400" />
          </div>
        </div>

        <div className="bg-blue-700 p-4 rounded-lg">
          <div className="space-y-2">
            <p className="text-gray-400">Gas Levels</p>
            <div className="space-y-1">
              <p className="text-white">CO2: <span className="font-semibold">{data.co2Ppm} ppm</span></p>
              <p className="text-white">Benzene: <span className="font-semibold">{data.benzenePpm} ppm</span></p>
              <p className="text-white">Ammonia: <span className="font-semibold">{data.ammoniaPpm} ppm</span></p>
              <p className="text-white">Alcohol: <span className="font-semibold">{data.alcoholPpm} ppm</span></p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onRefresh}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <RefreshCw size={16} />
        Refresh
      </button>
    </div>
  );
}