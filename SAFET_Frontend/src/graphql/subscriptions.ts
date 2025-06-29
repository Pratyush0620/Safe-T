import { gql } from '@apollo/client';

// Subscription for band vital updates
export const VITAL_UPDATES_SUBSCRIPTION = gql`
  subscription vitalUpdates($topic: String!) {
    vitalUpdates(topic: $topic) {
      topic
      heartRate
      spo2
      bodyTemp
      ledStatus
      sos
      isActive
    }
  }
`;

// Subscription for factory data
export const FACTORY_DATA_UPDATES_SUBSCRIPTION = gql`
  subscription factoryDataUpdates($topic: String!) {
    factoryDataUpdates(topic: $topic) {
      topic
      temperature
      humidity
      aqiScore
      co2Ppm
      benzenePpm
      ammoniaPpm
      alcoholPpm
    }
  }
`;