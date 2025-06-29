import { useState, useEffect } from 'react';
import './dashbstyle.css'
import { Bell } from 'lucide-react';
// @ts-ignore
import { useSubscription, ApolloProvider } from '@apollo/client';
// @ts-ignore
import { SidePanel } from '../components/SidePanel';
import { BandCard } from '../components/BandCard';
import { NotificationPanel } from '../components/NotificationPanel'
import { BandData, SensorData, Notification } from '../types';
import { client } from '../graphql/client';
import { 
  VITAL_UPDATES_SUBSCRIPTION,
  FACTORY_DATA_UPDATES_SUBSCRIPTION
} from '../graphql/subscriptions';

//Mock data for fallback
const mockSensorData: SensorData = {
  temperature: 0,
  humidity: 0,
  aqiScore: 0,
  co2Ppm: 0,
  benzenePpm: 0,
  ammoniaPpm: 0,
  alcoholPpm: 0
};

// Create only two bands instead of nine
const mockBands: BandData[] = [
  {
    id: 'band-1',
    name: 'Band1',
    gender: 'male',
    age: 25,
    bloodGroup: 'A+',
    diseases: ['Diabetes Type 2', 'Hypertension'],
    medications: ['Metformin 500mg', 'Lisinopril 10mg'],
    emergencyContact: {
      name: 'Emergency Contact 1',
      relation: 'Spouse',
      phone: '+1 (555) 0001'
    },
    humidity: 0,
    temperature:0,
    spo2Level: 0,
    status: 'active',
    sosActivated: false,
    heartRate: 0,
    lastCheckup: '2024-03-15',
    doctorNotes: 'Patient is responding well to current treatment plan.',
    ledStatus: ""
  },
  {
    id: 'band-2',
    name: 'Band2',
    gender: 'female',
    age: 28,
    bloodGroup: 'B+',
    diseases: ['Asthma'],
    medications: ['Albuterol Inhaler'],
    emergencyContact: {
      name: 'Emergency Contact 2',
      relation: 'Son',
      phone: '+1 (555) 0002'
    },
    humidity: 0,
    temperature: 0,
    spo2Level: 0,
    status: 'active',
    sosActivated: false,
    heartRate: 0,
    lastCheckup: '2024-03-14',
    doctorNotes: 'Regular monitoring of asthma symptoms required.',
    ledStatus: ""
  }
];

function AppContent() {
  const [expandedBandId, setExpandedBandId] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<SensorData>(mockSensorData);
  const [bands, setBands] = useState<BandData[]>(mockBands);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [filteredNotificationCount, setFilteredNotificationCount] = useState(0);

  // Factory Data Subscription
  const { data: factoryData } = useSubscription(
    FACTORY_DATA_UPDATES_SUBSCRIPTION,
    {
      variables: { topic: 'factory' },
      onError: (error: any) => {
        console.error('Factory data subscription error:', error);
      }
    }
  );

  

  // Update factory data when subscription data arrives
  useEffect(() => {
    if (factoryData?.factoryDataUpdates) {
      setSensorData(factoryData.factoryDataUpdates);
    }
  }, [factoryData]);

  // Individual subscriptions for each band
  const { data: band1Data } = useSubscription(
    VITAL_UPDATES_SUBSCRIPTION,
    {
      variables: { topic: 'band1' },
      onError: (error: any) => {
        console.error('Band 1 vital updates subscription error:', error);
      }
    }
  );

  const { data: band2Data } = useSubscription(
    VITAL_UPDATES_SUBSCRIPTION,
    {
      variables: { topic: 'band2' },
      onError: (error: any) => {
        console.error('Band 2 vital updates subscription error:', error);
      }
    }
  );

  // Update Band 1 data
  useEffect(() => {
    if (band1Data?.vitalUpdates) {
      const updates = band1Data.vitalUpdates;
      updateBandData('band-1', updates);
    }
  }, [band1Data]);

  // Update Band 2 data
  useEffect(() => {
    if (band2Data?.vitalUpdates) {
      const updates = band2Data.vitalUpdates;
      updateBandData('band-2', updates);
    }
  }, [band2Data]);

  // Helper function to update band data and handle SOS
  // const updateBandData = (bandId: string, updates: any) => {
  //   setBands(prevBands =>
  //     prevBands.map(band => {
  //       if (band.id === bandId) {
  //         if (updates.sos && !band.sosActivated) {
  //           // Only add the SOS notification if not already present
  //           setNotifications(prev => {
  //             // Prevent duplicate if one already exists for this band
  //             if (prev.some(n => n.message.includes(band.name))) {
  //               return prev;
  //             }
  //             const notification: Notification = {
  //               id: `sos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  //               message: `SOS Alert: ${band.name} has activated their emergency button!`,
  //               type: 'sos',
  //               timestamp: new Date(),
  //             };
  //             return [notification, ...prev];
  //           });
  //           setIsNotificationPanelOpen(true);

  //           const resetDelay = 3000 + Math.random() * 3000;
  //           setTimeout(() => {
  //             setBands(currentBands =>
  //               currentBands.map(currentBand =>
  //                 currentBand.id === bandId
  //                   ? { ...currentBand, sosActivated: false }
  //                   : currentBand
  //               )
  //             );
  //           }, resetDelay);
  //         }
  const updateBandData = (bandId: string, updates: any) => {
    setBands(prevBands =>
        prevBands.map(band => {
          if (band.id === bandId) {
            // MODIFIED: Track previous active state to detect changes
            const wasActive = band.status === 'active';
            const isNowActive = updates.isActive;

            // MODIFIED: Check if band has become inactive
            if (wasActive && !isNowActive) {
              // Create notification for inactive band
              const notification: Notification = {
                id: `sos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                message: `Warning: ${band.name} has become inactive!`,
                type: 'warning', // Using warning type for inactive notifications
                timestamp: new Date()
              };
              setNotifications(prev => [notification, ...prev]);
              setIsNotificationPanelOpen(true);
            }

            // Check if SOS status changed to true
            if (updates.sos && !band.sosActivated) {
              // Create notification for new SOS
              const notification: Notification = {
                id: `sos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                message: `SOS Alert: ${band.name} has activated their emergency button!`,
                type: 'sos',
                timestamp: new Date()
              };
              setNotifications(prev => [notification, ...prev]);
              setIsNotificationPanelOpen(true);

              // Auto-reset SOS visual indicator after 5-10 seconds
              const resetDelay = 5000 + Math.random() * 5000;
              setTimeout(() => {
                setBands(currentBands =>
                    currentBands.map(currentBand =>
                        currentBand.id === bandId ? { ...currentBand, sosActivated: false } : currentBand
                    )
                );
              }, resetDelay);
            }

          return {
            ...band,
            heartRate: updates.heartRate,
            spo2Level: updates.spo2,
            temperature: updates.bodyTemp,
            ledStatus: updates.ledStatus,
            sosActivated: updates.sos,
            status: updates.isActive ? 'active' : 'error',
          };
        }
        return band;
      })
    );
  };

  const handleRefresh = () => {
    // Reset sensor data
    setSensorData({ ...mockSensorData });
    
    // Reset band data to initial state
    const handleRefresh = () => {
      // Reset sensor data
      setSensorData({ ...mockSensorData });
      
      // Reset band data to initial state
      setBands(prevBands => prevBands.map(band => ({
        ...band,
        heartRate: Math.floor(Math.random() * (100 - 60) + 60), // Generate random initial heart rate
        spo2Level: Math.floor(Math.random() * (100 - 95) + 95), // Generate random initial SpO2
        temperature: parseFloat((Math.random() * (37.5 - 36.0) + 36.0).toFixed(1)), // Convert back to number
        ledStatus: "", // Reset LED status
        sosActivated: false, // Reset SOS status
        status: 'active' // Reset band status to active
      })));
    
      // Add notification for the refresh
      const notification: Notification = {
        id: `refresh-${Date.now()}`,
        message: "All band data has been refreshed",
        type: 'info',
        timestamp: new Date()
      };
      
      setNotifications(prev => [notification, ...prev]);
    };
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white p-8">
      <div className="flex gap-8">
        <SidePanel data={sensorData} onRefresh={handleRefresh} />
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <p className="text-lg">Active Bands</p>
              </div>
            </div>
            
            <button 
              className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors relative"
              onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
            >
              <Bell size={24} />
        {filteredNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {filteredNotificationCount}
          </span>
        )}
      </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {bands.map((band) => (
              <BandCard
                key={band.id}
                band={band}
                isExpanded={band.id === expandedBandId}
                onClick={() => setExpandedBandId(band.id === expandedBandId ? null : band.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <NotificationPanel
        notifications={notifications}
        onDismiss={dismissNotification}
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        onFilteredCountChange={setFilteredNotificationCount}
      />
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <AppContent />
    </ApolloProvider>
  );
}

export default App;