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

import "./Deployments.css";

// Types for our deployment data
interface Deployment {
  id: string;
  name: string;
  location: string;
  lastUpdate: string;
  sensorCount: number;
}

// Mock API function to get deployments
const getDeployments = (): Promise<Deployment[]> => {
  return new Promise((resolve) => {
    // Simulating API delay
    setTimeout(() => {
      const mockDeployments: Deployment[] = [
        {
          id: "dep-001",
          name: "Downtown Sensors",
          location: "New York, NY",
          lastUpdate: "2025-03-12T14:32:00",
          sensorCount: 24
        },
        {
          id: "dep-002",
          name: "Harbor Monitoring",
          location: "Seattle, WA",
          lastUpdate: "2025-03-13T09:15:00",
          sensorCount: 18
        },
        {
          id: "dep-003",
          name: "Highway Traffic",
          location: "Los Angeles, CA",
          lastUpdate: "2025-03-10T16:45:00",
          sensorCount: 42
        },
        {
          id: "dep-004",
          name: "River Quality",
          location: "Portland, OR",
          lastUpdate: "2025-03-09T11:23:00",
          sensorCount: 15
        },
        {
          id: "dep-005",
          name: "Smart Buildings",
          location: "Chicago, IL",
          lastUpdate: "2025-03-13T08:05:00",
          sensorCount: 56
        },
        {
          id: "dep-006",
          name: "Park Monitoring",
          location: "Boston, MA",
          lastUpdate: "2025-03-11T13:40:00",
          sensorCount: 12
        },
        {
          id: "dep-007",
          name: "Industrial Zone",
          location: "Detroit, MI",
          lastUpdate: "2025-03-12T17:28:00",
          sensorCount: 37
        },
      ];
      
      resolve(mockDeployments);
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

const Deployments: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { tokens } = useTheme();

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const data = await getDeployments();
        setDeployments(data);
      } catch (error) {
        console.error("Error fetching deployments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  const handleDeploymentClick = (deploymentId: string) => {
    console.log(`Deployment clicked: ${deploymentId}`);
    // This would normally navigate to the deployment detail page
  };

  const handleCreateDeployment = () => {
    console.log("Create deployment clicked");
    // This would normally open a modal or navigate to a creation page
  };

  return (
    <>
      <div className="page-header">
        <Heading level={2}>Deployments</Heading>
        <Button 
          onClick={handleCreateDeployment}
          className="create-btn"
        >
          <Flex alignItems="center">
            <MdAdd size={20} color="black" />
            <Text>Create Deployment</Text>
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
        <h3 style={{ marginTop: 0 }}>All Deployments</h3>
          
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
                  <TableCell as="th">Sensors</TableCell>
                  <TableCell as="th">Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deployments?.map((deployment) => (
                  <TableRow key={deployment.id}>
                    <TableCell>
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeploymentClick(deployment.id);
                        }}
                        className="deployment-link"
                      >
                        {deployment.name}
                      </a>
                    </TableCell>
                    <TableCell>{deployment.location}</TableCell>
                    <TableCell>{deployment.sensorCount}</TableCell>
                    <TableCell>{formatDate(deployment.lastUpdate)}</TableCell>
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

export default Deployments;