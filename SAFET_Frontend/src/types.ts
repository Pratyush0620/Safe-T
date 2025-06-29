export interface BandData {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  bloodGroup: string;
  diseases: string[];
  medications: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  humidity: number;
  temperature: number;
  spo2Level: number;
  status: 'active' | 'warning' | 'error';
  sosActivated: boolean;
  heartRate: number;
  lastCheckup: string;
  doctorNotes: string;
  ledStatus: number | string ;
}

export interface SensorData {
  temperature: number;
  humidity: number;
  aqiScore: number;
  co2Ppm: number;
  benzenePpm: number;
  ammoniaPpm: number;
  alcoholPpm: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'sos' | 'warning' | 'info';
  timestamp: Date;
}