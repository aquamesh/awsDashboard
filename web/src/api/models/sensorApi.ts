// src/api/models/sensorApi.ts - This file contains the API functions for sensor management.
import { client } from '../client';
import type { SelectionSet } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';


// Define sensor selection set
export const sensorSelectionSet = [
    'id', // Unique identifier for the sensor
    'serialNumber', // Serial number of the sensor
    'name', // Name of the sensor
    'latitude', // Latitude of the sensor's location
    'longitude', // Longitude of the sensor's location
    'locationName', // Optional name for the location of the sensor
    'status', // Status of the sensor (e.g., active, inactive)
    'enabled', // Indicates if the sensor is enabled or disabled
    'firmwareVersion', // Firmware version of the sensor
    'hardwareVersion', // Hardware version of the sensor
    'batteryLevel', // Battery level of the sensor (percentage or voltage)
    'createdAt', // Timestamp when the sensor was created
    'lastUpdated', // Timestamp when the sensor was last updated
    'lastServiceDate', // Timestamp of the last service date for the sensor
    'nextScheduledService', // Timestamp for the next scheduled service for the sensor
    'ledConfiguration', // Stores which LEDs are installed on the sensor (JSON format)
    'calibrationData', // Calibration parameters for each LED (JSON format)
    'measurableParameters', // Parameters this sensor can measure (based on LEDs)

    'parameterValues.*', // This will fetch all fields of the parameter values associated with this sensor
    'spectrogramReadings.*', // This will fetch all fields of the spectrogram readings associated with this sensor
    'alerts.*', // This will fetch all fields of the alerts associated with this sensor, dont worry
    'organizations.*', // This will fetch all fields of the organizations associated with this sensor
] as const;

export type Sensor = SelectionSet<Schema['Sensor']['type'], typeof sensorSelectionSet>;



// Fetch all sensors
export async function getAllSensors(): Promise<Sensor[] | null> {
  try {
    // Fetch all sensors we have permission to access using the Sensor table and list operation
    const { data, errors } = await client.models.Sensor.list({
      selectionSet: sensorSelectionSet
    });

    if (errors) {
      console.error('Error fetching all sensors:', errors);
      return null;
    }

    // For debugging purposes, log the fetched data
    console.log('Fetched sensors:', data);

    return data;
  }
  catch (error) {
    console.error('Exception when fetching all sensors:', error);
    throw error;
  }
}

