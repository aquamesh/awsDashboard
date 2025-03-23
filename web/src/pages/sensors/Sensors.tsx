// Sensors.tsx
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

import "./Sensors.css";

// Types for our sensor data
interface Sensor {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  lastUpdate: string;
  deploymentId?: string; // Optional deployment ID
}

// Mock deployment data
interface Deployment {
  id: string;
  name: string;
}

// Mock deployments list
const mockDeployments: Deployment[] = [
  { id: "dep-001", name: "Downtown Network" },
  { id: "dep-002", name: "Harbor Monitoring" },
  { id: "dep-003", name: "River Quality" },
  { id: "dep-004", name: "Marina Network" },
];

// Mock function to get deployment name from ID
const getDeploymentName = (deploymentId?: string): string => {
  if (!deploymentId) return "Not Assigned";
  
  const deployment = mockDeployments.find(dep => dep.id === deploymentId);
  return deployment ? deployment.name : "Unknown Deployment";
};

// Mock API function to get sensors
const getSensors = (): Promise<Sensor[]> => {
  return new Promise((resolve) => {
    // Simulating API delay
    setTimeout(() => {
      const mockSensors: Sensor[] = [
        {
          id: "sensor-001",
          name: "Bay Monitor A1",
          location: "San Francisco Bay, North",
          type: "WATER_QUALITY_SENSOR",
          status: "Normal",
          lastUpdate: "2025-03-21T14:32:00",
          deploymentId: "dep-002" // Harbor Monitoring
        },
        {
          id: "sensor-002",
          name: "Bay Monitor A2",
          location: "San Francisco Bay, East",
          type: "WATER_QUALITY_SENSOR",
          status: "Warning",
          lastUpdate: "2025-03-22T09:15:00",
          deploymentId: "dep-002" // Harbor Monitoring
        },
        {
          id: "sensor-003",
          name: "Harbor Monitor B1",
          location: "Oakland Harbor",
          type: "WATER_QUALITY_SENSOR",
          status: "Normal",
          lastUpdate: "2025-03-20T16:45:00",
          deploymentId: "dep-002" // Harbor Monitoring
        },
        {
          id: "sensor-004",
          name: "River Inlet C1",
          location: "Sacramento River Delta",
          type: "WATER_QUALITY_SENSOR",
          status: "Critical",
          lastUpdate: "2025-03-21T11:23:00",
          deploymentId: "dep-003" // River Quality
        },
        {
          id: "sensor-005",
          name: "Marina Monitor D1",
          location: "Berkeley Marina",
          type: "WATER_QUALITY_SENSOR",
          status: "Normal",
          lastUpdate: "2025-03-22T08:05:00",
          deploymentId: "dep-004" // Marina Network
        },
        {
          id: "sensor-006",
          name: "Coastal Monitor E1",
          location: "Golden Gate",
          type: "WATER_QUALITY_SENSOR",
          status: "Warning",
          lastUpdate: "2025-03-21T13:40:00",
          deploymentId: "dep-003" // River Quality
        },
        {
          id: "sensor-007",
          name: "Industrial Zone F1",
          location: "Richmond Harbor",
          type: "WATER_QUALITY_SENSOR",
          status: "Normal",
          lastUpdate: "2025-03-22T17:28:00"
          // No deploymentId - not assigned to any deployment
        },
      ];
      
      resolve(mockSensors);
    }, 800);
  });
};

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

const Sensors: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { tokens } = useTheme();

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const data = await getSensors();
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
    switch (status.toLowerCase()) {
      case 'normal':
        return 'green';
      case 'warning':
        return '#FFA500'; // Orange
      case 'critical':
        return 'red';
      default:
        return 'black';
    }
  };

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
        minHeight="calc(100vh - 120px)"
      >
        <Card borderRadius="15px">
          <div className="card-title">All Sensors</div>
          
          {loading ? (
            <Flex direction="column" minHeight="285px">
              <Placeholder size="small" />
              <Placeholder size="small" />
              <Placeholder size="small" />
              <Placeholder size="small" />
            </Flex>
          ) : (
            <Table highlightOnHover={true}>
              <TableHead>
                <TableRow>
                  <TableCell as="th">Name</TableCell>
                  <TableCell as="th">Location</TableCell>
                  <TableCell as="th">Type</TableCell>
                  <TableCell as="th">Status</TableCell>
                  <TableCell as="th">Deployment</TableCell>
                  <TableCell as="th">Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sensors?.map((sensor) => (
                  <TableRow key={sensor.id}>
                    <TableCell>
                      <Link 
                        to={`/sensors/${sensor.id}`}
                        className="sensor-link"
                      >
                        {sensor.name}
                      </Link>
                    </TableCell>
                    <TableCell>{sensor.location}</TableCell>
                    <TableCell>{sensor.type}</TableCell>
                    <TableCell>
                      <span style={{ color: getStatusColor(sensor.status) }}>
                        {sensor.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getDeploymentName(sensor.deploymentId)}
                    </TableCell>
                    <TableCell>{formatDate(sensor.lastUpdate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </View>
    </>
  );
};

export default Sensors;