// src/pages/sensors/Sensors.tsx - Updated to use real sensor API
import React, { useEffect, useState } from "react";
import {
  View,
  Heading,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Text,
  Flex,
  Card,
  Placeholder,
  useTheme,
} from "@aws-amplify/ui-react";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { getAllSensors } from "../../api/models/sensorApi";
import type { Sensor } from "../../api/models/sensorApi";
import DebugView, { DebugAction } from "../../components/DebugView/DebugView";

import "./Sensors.css";

// Format the datetime to a more readable format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const SensorsPage: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { tokens } = useTheme();

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const data = await getAllSensors();
        setSensors(data);
      } catch (error) {
        console.error("Error fetching sensors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  const handleCreateSensor = () => {
    console.log("Create sensor clicked");
    // This would normally open a modal or navigate to a creation page
  };

  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase?.() || status) {
      case 'active':
        return 'green';
      case 'warning':
      case 'maintenance':
        return '#FFA500'; // Orange
      case 'inactive':
      case 'error':
        return 'red';
      default:
        return 'black';
    }
  };

  // Render the sensor table or empty state
  const renderContent = () => {
    if (loading) {
      return (
        <Flex direction="column" minHeight="285px">
          <Placeholder size="small" />
          <Placeholder size="small" />
          <Placeholder size="small" />
          <Placeholder size="small" />
        </Flex>
      );
    }

    if (!sensors || sensors.length === 0) {
      return (
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          padding="2rem"
          minHeight="200px"
          gap="1rem"
        >
          <Text fontSize="1.2rem" fontWeight="500">
            No sensors found
          </Text>
          <Text color="grey" marginBottom="1rem">
            Add your first sensor to get started with monitoring
          </Text>
          <Button
            onClick={handleCreateSensor}
            // variation="primary"
          >
            <Flex alignItems="center" gap="0.5rem">
              <MdAdd size={20} />
              <Text>Add Sensor</Text>
            </Flex>
          </Button>
        </Flex>
      );
    }

    return (
      <Table highlightOnHover={true}>
        <TableHead>
          <TableRow>
            <TableCell as="th">Name</TableCell>
            <TableCell as="th">Location</TableCell>
            <TableCell as="th">Status</TableCell>
            <TableCell as="th">Battery Level</TableCell>
            <TableCell as="th">Firmware</TableCell>
            <TableCell as="th">Organization</TableCell>
            <TableCell as="th">Last Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sensors.map((sensor) => (
            <TableRow key={sensor.id}>
              <TableCell>
                <Link 
                  to={`/sensors/${sensor.id}`}
                  className="sensor-link"
                >
                  {sensor.name}
                </Link>
              </TableCell>
              <TableCell>{sensor.locationName || (sensor.latitude && sensor.longitude ? `${sensor.latitude}, ${sensor.longitude}` : "Unknown location")}</TableCell>
              <TableCell>
                <span style={{ color: getStatusColor(typeof sensor.status === 'string' ? sensor.status : String(sensor.status)) }}>
                  {typeof sensor.status === 'string' ? sensor.status : String(sensor.status)}
                </span>
              </TableCell>
              <TableCell>{sensor.batteryLevel ? `${sensor.batteryLevel}%` : "Unknown"}</TableCell>
              <TableCell>{sensor.firmwareVersion}</TableCell>
              <TableCell>
                {sensor.organizations && sensor.organizations.length > 0 
                  ? (sensor.organizations[0] as any).name || "Unknown Name"
                  : "Not Assigned"}
              </TableCell>
              <TableCell>{sensor.lastUpdated ? formatDate(sensor.lastUpdated) : "Not available"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  // Define debug actions
  const debugActions: DebugAction[] = [
    {
      label: "Fetch Sensors",
      action: async () => {
        const data = await getAllSensors();
        // Update the component state as well
        setSensors(data);
        setLoading(false);
        return data;
      },
      resultLabel: "Sensor API Result",
    },
    {
      label: "Add Test Sensor",
      action: async () => {
        // This is just a placeholder that returns a mock sensor object
        // The actual implementation would call an API to create a sensor
        const mockSensor = {
          id: `sensor-test-${Date.now()}`,
          name: "Test Sensor",
          serialNumber: `SN-TEST-${Math.floor(Math.random() * 10000)}`,
          status: "active",
          batteryLevel: 98,
          firmwareVersion: "1.0.0",
          locationName: "Test Location",
          latitude: 37.7749,
          longitude: -122.4194,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        
        // Log the mock sensor so you can see it in the console too
        console.log('Would create sensor:', mockSensor);
        
        return mockSensor;
      },
      resultLabel: "Test Sensor (Not Added)",
    },
  ];

  return (
    <>
      <div className="page-header">
        <Heading level={2}>Sensors</Heading>
        <Button 
          onClick={handleCreateSensor}
          className="create-btn"
        >
          <Flex alignItems="center">
            <MdAdd size={20} color="black" />
            <Text>Add Sensor</Text>
          </Flex>
        </Button>
      </div>

      <View 
        borderRadius="6px" 
        maxWidth="100%" 
        padding="0rem" 
      >
        <Card borderRadius="15px">
          <h3 style={{ marginTop: 0 }}>All Sensors</h3>
          {renderContent()}
        </Card>
      </View>
      
      {/* Debug View - Only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <DebugView
          title="Sensor API Debug Tools"
          initialData={sensors}
          initialDataLabel="Current Sensors"
          actions={debugActions}
        />
      )}
    </>
  );
};

export default SensorsPage;