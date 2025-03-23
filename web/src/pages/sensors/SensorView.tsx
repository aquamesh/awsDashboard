// SensorView.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Flex,
  Card,
  Placeholder,
  Heading,
  Button,
  Icon,
  Text,
  Badge,
  Image,
  useTheme
} from "@aws-amplify/ui-react";
import { MdEdit, MdDragIndicator, MdAdd, MdClose, MdBattery90, MdMemory, MdCalendarToday, MdRouter } from "react-icons/md";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useParams } from "react-router-dom";
import Map from "../../components/Map/Map"; // Import the Map component
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import "./SensorView.css";

// Enable responsiveness in the grid
const ResponsiveGridLayout = WidthProvider(Responsive);

// Tiles for the sensor dashboard
interface SensorTile {
  id: string;
  title: string;
  type: SensorTileType;
  minW?: number;
  minH?: number;
  data?: any;
}

enum SensorTileType {
  PH = "ph",
  TEMPERATURE = "temperature",
  SALINITY = "salinity",
  DISSOLVED_O2 = "dissolved_o2",
  READINGS_OVER_TIME = "readings_over_time",
  STATUS_HISTORY = "status_history",
  ALERTS = "alerts"
}

// Mock sensor data
interface SensorData {
  id: string;
  name: string;
  type: string;
  status: string;
  model: string;
  batteryLevel: number;
  firmwareVersion: string;
  lastMaintenance: string;
  lastReading: string;
  deploymentId?: string;
  deploymentName?: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  image: string;
  connectionStatus: "online" | "offline";
}

// Initial layout for the sensor dashboard
const initialLayout = {
  lg: [
    { i: "ph", x: 0, y: 0, w: 1, h: 1 },
    { i: "temperature", x: 1, y: 0, w: 1, h: 1 },
    { i: "salinity", x: 2, y: 0, w: 1, h: 1 },
    { i: "dissolved_o2", x: 3, y: 0, w: 1, h: 1 },
    { i: "readings_over_time", x: 0, y: 1, w: 4, h: 2 },
    { i: "status_history", x: 0, y: 3, w: 2, h: 2 },
    { i: "alerts", x: 2, y: 3, w: 2, h: 2 }
  ],
  md: [
    { i: "ph", x: 0, y: 0, w: 1, h: 1 },
    { i: "temperature", x: 1, y: 0, w: 1, h: 1 },
    { i: "salinity", x: 2, y: 0, w: 1, h: 1 },
    { i: "dissolved_o2", x: 3, y: 0, w: 1, h: 1 },
    { i: "readings_over_time", x: 0, y: 1, w: 4, h: 2 },
    { i: "status_history", x: 0, y: 3, w: 2, h: 2 },
    { i: "alerts", x: 2, y: 3, w: 2, h: 2 }
  ],
  sm: [
    { i: "ph", x: 0, y: 0, w: 1, h: 1 },
    { i: "temperature", x: 1, y: 0, w: 1, h: 1 },
    { i: "salinity", x: 0, y: 1, w: 1, h: 1 },
    { i: "dissolved_o2", x: 1, y: 1, w: 1, h: 1 },
    { i: "readings_over_time", x: 0, y: 2, w: 2, h: 2 },
    { i: "status_history", x: 0, y: 4, w: 2, h: 2 },
    { i: "alerts", x: 0, y: 6, w: 2, h: 2 }
  ],
  xs: [
    { i: "ph", x: 0, y: 0, w: 1, h: 1 },
    { i: "temperature", x: 1, y: 0, w: 1, h: 1 },
    { i: "salinity", x: 0, y: 1, w: 1, h: 1 },
    { i: "dissolved_o2", x: 1, y: 1, w: 1, h: 1 },
    { i: "readings_over_time", x: 0, y: 2, w: 2, h: 2 },
    { i: "status_history", x: 0, y: 4, w: 2, h: 2 },
    { i: "alerts", x: 0, y: 6, w: 2, h: 2 }
  ]
};

// Define the tiles for the sensor dashboard
const sensorTiles: SensorTile[] = [
  {
    id: "ph",
    title: "pH Level",
    type: SensorTileType.PH,
    data: { value: 7.2, trend: "stable" }
  },
  {
    id: "temperature",
    title: "Temperature",
    type: SensorTileType.TEMPERATURE,
    data: { value: 54.3, unit: "°F", trend: "rising" }
  },
  {
    id: "salinity",
    title: "Salinity",
    type: SensorTileType.SALINITY,
    data: { value: 32.1, unit: "PSU", trend: "stable" }
  },
  {
    id: "dissolved_o2",
    title: "Dissolved O₂",
    type: SensorTileType.DISSOLVED_O2,
    data: { value: 8.4, unit: "mg/L", trend: "falling" }
  },
  {
    id: "readings_over_time",
    title: "Readings Over Time",
    type: SensorTileType.READINGS_OVER_TIME,
    minW: 2,
    minH: 2,
    data: { /* time series data would go here */ }
  },
  {
    id: "status_history",
    title: "Status History",
    type: SensorTileType.STATUS_HISTORY,
    minW: 2,
    minH: 2,
    data: { /* status history data would go here */ }
  },
  {
    id: "alerts",
    title: "Recent Alerts",
    type: SensorTileType.ALERTS,
    minW: 2,
    minH: 2,
    data: { /* alerts data would go here */ }
  }
];

// Mock function to get sensor details
const getSensorDetails = (sensorId: string): Promise<SensorData> => {
  return new Promise((resolve) => {
    // Simulating API delay
    setTimeout(() => {
      const mockSensor: SensorData = {
        id: sensorId,
        name: "Bay Monitor A1",
        type: "FLOR_ABS_TURB_SENSOR",
        status: "Normal",
        model: "ProbeV1Prototype",
        batteryLevel: 87,
        firmwareVersion: "3.2.1",
        lastMaintenance: "2025-01-15",
        lastReading: "2025-03-22T09:15:00",
        deploymentId: "dep-002",
        deploymentName: "Harbor Monitoring",
        location: "San Francisco Bay, North",
        coordinates: {
          latitude: 37.826,
          longitude: -122.422
        },
        image: "https://placehold.co/512x512/png",
        connectionStatus: "online"
      };
      
      resolve(mockSensor);
    }, 800);
  });
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

// Generate mock time series data for sensor readings
const generateTimeSeries = (days = 14, baseValue = 0, variance = 1, trend = 0) => {
  const data = [];
  const labels = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    labels.push(date.toISOString().split('T')[0]);
    
    // Calculate value with some randomness, and apply a trend if specified
    const trendFactor = trend * (days - i) / days;
    const randomVariance = (Math.random() - 0.5) * variance;
    const value = baseValue + randomVariance + trendFactor;
    
    data.push(parseFloat(value.toFixed(2)));
  }
  
  return { data, labels };
};

// Generate mock status history data
const generateStatusHistory = () => {
  const statuses = ["Normal", "Warning", "Critical", "Normal", "Normal", "Warning", "Normal", "Normal"];
  const durations = [48, 4, 3, 72, 96, 6, 120, 24]; // hours
  const startDate = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
  
  let currentDate = new Date(startDate);
  const data = [];
  
  statuses.forEach((status, index) => {
    const durationHours = durations[index];
    const endDate = new Date(currentDate.getTime() + (durationHours * 60 * 60 * 1000));
    
    data.push({
      x: status,
      y: [
        currentDate.getTime(),
        endDate.getTime()
      ]
    });
    
    currentDate = endDate;
  });
  
  return data;
};

// Generate mock alerts data
const generateAlerts = () => {
  return [
    {
      id: "alert-1",
      type: "Warning",
      message: "pH level above threshold (8.2)",
      timestamp: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString()
    },
    {
      id: "alert-2",
      type: "Critical",
      message: "Battery level below 20%",
      timestamp: new Date(Date.now() - (4 * 24 * 60 * 60 * 1000)).toISOString()
    },
    {
      id: "alert-3",
      type: "Warning",
      message: "Temperature rising rapidly",
      timestamp: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)).toISOString()
    }
  ];
};

// Render tile content based on type
const TileRenderer: React.FC<{ tile: SensorTile }> = ({ tile }) => {
  const { tokens } = useTheme();

  // Helper function to render trend indicators
  const renderTrend = (trend: string) => {
    if (trend === "rising") {
      return <Text color="green" fontSize="0.8rem">↑</Text>;
    } else if (trend === "falling") {
      return <Text color="red" fontSize="0.8rem">↓</Text>;
    }
    return <Text color="gray" fontSize="0.8rem">→</Text>;
  };

  switch (tile.type) {
    case SensorTileType.PH:
    case SensorTileType.TEMPERATURE:
    case SensorTileType.SALINITY:
    case SensorTileType.DISSOLVED_O2:
      return (
        <Card height="100%" padding="1rem">
          <div className="card-header">
            <Text className="card-title">{tile.title}</Text>
          </div>
          <Flex direction="column" alignItems="center" justifyContent="center" height="calc(100% - 30px)">
            <Flex alignItems="center">
              <Text fontSize="2rem" fontWeight="bold">{tile.data?.value}</Text>
              {tile.data?.unit && <Text fontSize="1rem" marginLeft="0.25rem">{tile.data.unit}</Text>}
              {tile.data?.trend && <Text marginLeft="0.5rem">{renderTrend(tile.data.trend)}</Text>}
            </Flex>
          </Flex>
        </Card>
      );
    
    case SensorTileType.READINGS_OVER_TIME:
      // Generate mock time series data for different readings
      const phData = generateTimeSeries(14, 7.2, 0.4, 0.1);
      const tempData = generateTimeSeries(14, 54.3, 2.5, 0.5);
      const salinityData = generateTimeSeries(14, 32.1, 0.3, -0.2);
      const oxygenData = generateTimeSeries(14, 8.4, 0.5, -0.1);
      
      const chartOptions: ApexOptions = {
        chart: {
          toolbar: { show: false },
          animations: { enabled: true },
          fontFamily: 'inherit',
          type: 'line',
          zoom: { enabled: false }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        colors: ['#5f71e4', '#2dce88', '#11cdef', '#fb6340'],
        grid: { 
          borderColor: 'rgba(0, 0, 0, 0.05)',
          strokeDashArray: 5
        },
        legend: { 
          position: 'top',
          horizontalAlign: 'right',
          fontSize: '13px'
        },
        xaxis: {
          categories: phData.labels,
          labels: {
            style: { fontSize: '12px' },
            rotate: 0,
            trim: true,
            hideOverlappingLabels: true
          }
        },
        tooltip: {
          shared: true,
          intersect: false
        }
      };
      
      const chartSeries = [
        {
          name: 'pH Level',
          data: phData.data
        },
        {
          name: 'Temperature (°F)',
          data: tempData.data
        },
        {
          name: 'Salinity (PSU)',
          data: salinityData.data
        },
        {
          name: 'Dissolved O₂ (mg/L)',
          data: oxygenData.data
        }
      ];
      
      return (
        <Card height="100%" padding="1rem">
          <div className="card-header">
            <Text className="card-title">{tile.title}</Text>
          </div>
          <div className="chart-wrap">
            <Chart
              series={chartSeries}
              options={chartOptions}
              type="line"
              height="100%"
            />
          </div>
        </Card>
      );
    
    case SensorTileType.STATUS_HISTORY:
      const statusData = generateStatusHistory();
      
      const statusChartOptions: ApexOptions = {
        chart: {
          height: 350,
          type: 'rangeBar',
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '50%',
            rangeBarGroupRows: true
          }
        },
        colors: ['#4CAF50', '#FFA500', '#F44336'],
        fill: {
          type: 'solid',
          opacity: 0.6,
          colors: [
            function({ value, seriesIndex, dataPointIndex, w }) {
              const status = w.globals.labels[dataPointIndex];
              if (status === 'Normal') return '#4CAF50';
              if (status === 'Warning') return '#FFA500';
              if (status === 'Critical') return '#F44336';
              return '#999';
            }
          ]
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'MMM dd',
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: ['#000'],
              fontSize: '12px'
            }
          }
        },
        tooltip: {
          custom: function({ seriesIndex, dataPointIndex, w }) {
            const status = w.globals.labels[dataPointIndex];
            const startDate = new Date(w.globals.seriesRangeStart[seriesIndex][dataPointIndex]);
            const endDate = new Date(w.globals.seriesRangeEnd[seriesIndex][dataPointIndex]);
            
            const formatDate = (date: Date) => {
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            };
            
            const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
            
            return (
              '<div class="apexcharts-tooltip-rangebar">' +
              '<div> <span class="category">' + status + '</span> </div>' +
              '<div> <span class="value start-value">' + formatDate(startDate) + '</span> </div>' +
              '<div> <span class="value end-value">' + formatDate(endDate) + '</span> </div>' +
              '<div> <span class="value">Duration: ' + duration + ' hours</span> </div>' +
              '</div>'
            );
          }
        },
        legend: { show: false }
      };
      
      return (
        <Card height="100%" padding="1rem">
          <div className="card-header">
            <Text className="card-title">{tile.title}</Text>
          </div>
          <div className="chart-wrap">
            <Chart
              series={[{ data: statusData }]}
              options={statusChartOptions}
              type="rangeBar"
              height="100%"
            />
          </div>
        </Card>
      );
    
    case SensorTileType.ALERTS:
      const alerts = generateAlerts();
      
      return (
        <Card height="100%" padding="1rem">
          <div className="card-header">
            <Text className="card-title">{tile.title}</Text>
          </div>
          <Flex direction="column" gap="0.5rem">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <Card key={alert.id} backgroundColor="rgba(0,0,0,0.03)" padding="0.75rem" borderRadius="8px">
                  <Flex justifyContent="space-between" alignItems="center" marginBottom="0.25rem">
                    <Badge
                      variation="solid"
                      backgroundColor={
                        alert.type === "Critical" ? "red" : 
                        alert.type === "Warning" ? "#FFA500" : 
                        "green"
                      }
                      color="white"
                      fontSize="0.7rem"
                      padding="0.2rem 0.5rem"
                    >
                      {alert.type}
                    </Badge>
                    <Text fontSize="0.8rem" color={tokens.colors.font.secondary}>
                      {formatDate(alert.timestamp)}
                    </Text>
                  </Flex>
                  <Text fontSize="0.9rem">{alert.message}</Text>
                </Card>
              ))
            ) : (
              <Text fontSize="0.9rem">No recent alerts</Text>
            )}
          </Flex>
        </Card>
      );
    
    default:
      return (
        <Card height="100%" padding="1rem">
          <Text>Unknown tile type</Text>
        </Card>
      );
  }
};

const SensorView: React.FC = () => {
  // Get the sensor ID from URL params
  const { sensorId } = useParams<{ sensorId: string }>();
  
  // State
  const [sensor, setSensor] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [layout, setLayout] = useState(initialLayout);
  const [initialized, setInitialized] = useState<boolean>(false);
  const { tokens } = useTheme();

  // Load sensor data
  useEffect(() => {
    const loadSensor = async () => {
      setLoading(true);
      
      // Get sensor details
      if (sensorId) {
        try {
          const sensorDetails = await getSensorDetails(sensorId);
          setSensor(sensorDetails);
        } catch (error) {
          console.error("Error fetching sensor details:", error);
        }
      }

      // Load saved layout from localStorage if available
      const savedLayoutKey = `sensorLayout_${sensorId}`;
      const savedLayout = localStorage.getItem(savedLayoutKey);
      
      if (savedLayout) {
        try {
          const parsedLayout = JSON.parse(savedLayout);
          setLayout(parsedLayout);
        } catch (e) {
          console.error('Error parsing saved layout:', e);
          // Use default layout if there's an error parsing
          setLayout(initialLayout);
        }
      } else {
        // Use default layout if no saved layout
        setLayout(initialLayout);
      }

      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
        setInitialized(true);
      }, 750);
    };

    loadSensor();
  }, [sensorId]);

  // Layout change handler
  const handleLayoutChange = (currentLayout: any, layouts: any) => {
    // Save the layout when it changes
    if (layouts && sensorId) {
      setLayout(layouts);
      localStorage.setItem(`sensorLayout_${sensorId}`, JSON.stringify(layouts));
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Render drag handle only in edit mode
  const renderDragHandle = () => {
    if (editMode) {
      return (
        <div className="drag-handle">
          <MdDragIndicator />
        </div>
      );
    }
    return null;
  };

  // Render grid overlay for edit mode
  const renderGridOverlay = () => {
    if (!editMode) return null;

    // These should match the values in your ResponsiveGridLayout
    const containerPadding = [16, 16];
    const margin = [16, 16];
    const rowHeight = 130;

    // Get columns for current breakpoint
    const getColumns = () => {
      const width = window.innerWidth;
      if (width >= 1200) return 4; // lg
      if (width >= 996) return 4;  // md
      if (width >= 768) return 2;  // sm
      return 2;                    // xs
    };

    const columns = getColumns();

    // Create grid cells array
    const gridCells: React.ReactNode[] = [];

    // Generate rows as needed
    for (let i = 0; i < 20 * columns; i++) {
      gridCells.push(
        <div
          key={`grid-cell-${i}`}
          style={{
            border: '1px dashed rgba(0,0,0,0.1)',
            height: `${rowHeight}px`,
            borderRadius: '4px'
          }}
        />
      );
    }

    return (
      <div className="grid-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        padding: `${containerPadding[1]}px ${containerPadding[0]}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridGap: `${margin[1]}px ${margin[0]}px`,
        pointerEvents: 'none'
      }}>
        {gridCells}
      </div>
    );
  };

  return (
    <>
      <div className="page-header">
        <Heading level={2}>Sensor Details</Heading>
        <Button 
          onClick={() => window.history.back()}
          className="back-button"
        >
          Back to Sensors
        </Button>
      </div>

      <View 
        borderRadius="6px" 
        maxWidth="100%" 
        padding="0rem" 
        minHeight="calc(100vh - 120px)"
      >
        {loading ? (
          <Flex direction="column" gap="16px">
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </Flex>
        ) : (
          <>
            {/* Sensor Header Section */}
            <Card borderRadius="15px" marginBottom="20px">
              <Flex direction={{ base: 'column', medium: 'row' }} gap="2rem">
                {/* Left column - Image and basic info */}
                <Flex direction="column" alignItems="center" padding="1rem" flex="1">
                  <div className="sensor-avatar">
                    <Image
                      src={sensor?.image || "https://placehold.co/512x512/png"}
                      alt={sensor?.name || "Sensor"}
                      width="150px"
                      height="150px"
                      objectFit="cover"
                      borderRadius="50%"
                    />
                    <div className={`connection-indicator ${sensor?.connectionStatus || 'offline'}`} />
                  </div>
                  
                  <Heading level={4} marginTop="1rem">{sensor?.name}</Heading>
                  
                  <Badge
                    variation="solid"
                    backgroundColor={getStatusColor(sensor?.status || "Unknown")}
                    color="white"
                    marginTop="0.5rem"
                  >
                    {sensor?.status || "Unknown"}
                  </Badge>
                  
                  <Text marginTop="0.5rem" color={tokens.colors.font.secondary}>
                    {sensor?.type || "Unknown Type"}
                  </Text>
                  
                  {sensor?.deploymentName && (
                    <Text marginTop="0.5rem" fontStyle="italic">
                      Deployment: {sensor.deploymentName}
                    </Text>
                  )}
                </Flex>

                {/* Middle column - Technical details */}
                <Flex direction="column" padding="1rem" flex="1">
                  <Heading level={5}>Technical Details</Heading>
                  
                  <Flex className="sensor-detail-item" alignItems="center" marginTop="1rem">
                    <Icon as={MdBattery90} color="green" />
                    <Text marginLeft="0.5rem">Battery Level: {sensor?.batteryLevel || 0}%</Text>
                  </Flex>
                  
                  <Flex className="sensor-detail-item" alignItems="center" marginTop="0.5rem">
                    <Icon as={MdMemory} />
                    <Text marginLeft="0.5rem">Firmware: v{sensor?.firmwareVersion || "Unknown"}</Text>
                  </Flex>
                  
                  <Flex className="sensor-detail-item" alignItems="center" marginTop="0.5rem">
                    <Icon as={MdRouter} />
                    <Text marginLeft="0.5rem">Model: {sensor?.model || "Unknown"}</Text>
                  </Flex>
                  
                  <Flex className="sensor-detail-item" alignItems="center" marginTop="0.5rem">
                    <Icon as={MdCalendarToday} />
                    <Text marginLeft="0.5rem">Last Maintenance: {formatDate(sensor?.lastMaintenance || "")}</Text>
                  </Flex>
                  
                  <Flex className="sensor-detail-item" alignItems="center" marginTop="0.5rem">
                    <Icon as={MdCalendarToday} />
                    <Text marginLeft="0.5rem">Last Reading: {formatDate(sensor?.lastReading || "")}</Text>
                  </Flex>
                </Flex>

                {/* Right column - Map */}
                <Flex direction="column" padding="1rem" flex="1">
                  <Heading level={5} marginBottom="0.5rem">Location</Heading>
                  <Text marginBottom="0.5rem">{sensor?.location || "Unknown location"}</Text>
                  
                  <div className="sensor-map-container">
                    <Map 
                      // Using the actual Map component instead of placeholder
                      // The Map component will load all sensors by default
                      // In a production environment, we would want to pass parameters to
                      // focus on this specific sensor's location
                    />
                  </div>
                </Flex>
              </Flex>
            </Card>

            {/* Sensor Readings Section */}
            <Card borderRadius="15px">
              <Heading level={4} padding="1rem" paddingBottom="0">Sensor Readings</Heading>
              
              <div style={{ position: 'relative', padding: '1rem' }}>
                {renderGridOverlay()}
                <ResponsiveGridLayout
                  className={`layout ${editMode ? "edit-mode" : ""} ${initialized ? "initialized" : ""}`}
                  layouts={layout}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
                  cols={{ lg: 4, md: 4, sm: 2, xs: 2 }}
                  rowHeight={130}
                  compactType="vertical"
                  preventCollision={false}
                  isDraggable={editMode}
                  isResizable={editMode}
                  onLayoutChange={handleLayoutChange}
                  containerPadding={[16, 16]}
                  margin={[16, 16]}
                  draggableCancel=".react-resizable-handle"
                  transformScale={1}
                >
                  {sensorTiles.map((tile) => {
                    // Find the layout item for this tile in current layout
                    const breakpoint = layout ? 
                      (Object.keys(layout).find(key => 
                        layout[key] && Array.isArray(layout[key]) && layout[key].length > 0) || 'lg')
                      : 'lg';

                    // Find this tile in the current layout or use default values
                    const currentLayout = layout && layout[breakpoint] ? 
                      layout[breakpoint].find(item => item.i === tile.id) : null;
                    
                    // If layout is found, use it; otherwise, use values from initialLayout
                    const defaultLayoutItem = initialLayout[breakpoint].find(item => item.i === tile.id);
                    
                    return (
                      <div 
                        key={tile.id} 
                        className="dashboard-item"
                        data-grid={{
                          x: currentLayout?.x ?? defaultLayoutItem?.x ?? 0,
                          y: currentLayout?.y ?? defaultLayoutItem?.y ?? 0,
                          w: currentLayout?.w ?? defaultLayoutItem?.w ?? 1,
                          h: currentLayout?.h ?? defaultLayoutItem?.h ?? 1,
                          minW: tile.minW || 1,
                          minH: tile.minH || 1,
                        }}
                      >
                        {renderDragHandle()}
                        <TileRenderer tile={tile} />
                      </div>
                    );
                  })}
                </ResponsiveGridLayout>
              </div>
            </Card>
          </>
        )}
      </View>

      {/* Floating edit button */}
      <Button
        variation="primary"
        onClick={toggleEditMode}
        className={`floating-edit-button ${editMode ? 'in-edit-mode' : ''}`}
        ariaLabel={editMode ? "Done" : "Edit Layout"}
      >
        {editMode ? (
          <>
            <Icon as={MdClose} className="close-icon" />
            <span className="button-text">Done</span>
          </>
        ) : (
          <>
            <Icon as={MdEdit} className="edit-icon" />
            <span className="button-text">Edit</span>
          </>
        )}
      </Button>
    </>
  );
};

export default SensorView;