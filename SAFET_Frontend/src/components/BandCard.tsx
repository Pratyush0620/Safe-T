import React from 'react';
import { Activity, Droplets, Thermometer, AlertTriangle, Heart, Calendar, Stethoscope, Phone, User } from 'lucide-react';
import { BandData } from '../types';
import './dashbstyle.css'


interface BandCardProps {
  band: BandData;
  isExpanded: boolean;
  onClick: () => void;
}

export function BandCard({ band, isExpanded, onClick }: BandCardProps) {
  // Change this section to make SOS style take precedence
  const baseColor = band.sosActivated ? 'bg-red-500' : (band.gender === 'female' ? 'bg-purple-900' : 'bg-blue-900');
  const statusStyle = band.status === 'error' ? 'opacity-70' : '';

  // LED status colors
  const statusColor = band.ledStatus === 0 ? 'bg-green-400' : 
                     band.ledStatus === 1 ? 'bg-blue-400' : 
                     'bg-red-400';

  return (
    <div
          className={`${baseColor} ${statusStyle} p-6 rounded-xl cursor-pointer transition-all duration-300 ${
              isExpanded ? 'col-span-2 row-span-2 scale-100' : 'hover:scale-102'
          } ${band.sosActivated ? 'animate-pulse' : ''}`}
          onClick={onClick}
    >

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">{band.name}</h2>
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <span className="capitalize">{band.gender}</span>
            <span>•</span>
            <span>{band.age} years</span>
            <span>•</span>
            <span>{band.bloodGroup}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {band.sosActivated && (
            <AlertTriangle className="text-red-400 animate-pulse" />
          )}
          {band.status === 'error' && (
                <span className="text-xs font-medium bg-red-500/20 text-red-300 px-2 py-0.5 rounded">Inactive</span>
          )}
          <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>

          {band.ledStatus === "" && (
        <span className="text-xs font-medium bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
          Inactive
        </span>
      )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between bg-opacity-20 bg-white p-3 rounded-lg">
            <div>
              <p className="text-gray-300">Heart Rate</p>
              <p className="text-white">{band.heartRate} bpm</p>
            </div>
            <Heart className="text-blue-400" />
          </div>

          <div className="flex items-center justify-between bg-opacity-20 bg-white p-3 rounded-lg">
            <div>
              <p className="text-gray-300">Temperature</p>
              <p className="text-white">{band.temperature}°C</p>
            </div>
            <Thermometer className="text-blue-400" />
          </div>

          <div className="flex items-center justify-between bg-opacity-20 bg-white p-3 rounded-lg ">
            <div>
              <p className="text-gray-300">SPO2 Level</p>
              <p className="text-white">{band.spo2Level}%</p>
            </div>
            <Activity className="text-blue-400" />
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-6">
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Stethoscope className="text-blue-400" />
                Medical Information
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-300 mb-2">Current Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {band.diseases.map((disease, index) => (
                      <span
                        key={index}
                        className="bg-white/10 px-3 py-1 rounded-full text-sm"
                      >
                        {disease}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-300 mb-2">Medications</h4>
                  <div className="flex flex-wrap gap-2">
                    {band.medications.map((medication, index) => (
                      <span
                        key={index}
                        className="bg-white/10 px-3 py-1 rounded-full text-sm"
                      >
                        {medication}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="text-blue-400" />
                Last Checkup Details
              </h3>
              <p className="text-gray-300 mb-2">Date: {band.lastCheckup}</p>
              <p className="text-gray-300">{band.doctorNotes}</p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="text-blue-400" />
                Emergency Contact
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="text-gray-400" size={16} />
                  <span className="text-white">{band.emergencyContact.name}</span>
                </div>
                <p className="text-gray-300">{band.emergencyContact.relation}</p>
                <p className="text-gray-300">{band.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}