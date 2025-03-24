// pages/dashboard/dashboardData.tsx - Dashboard and layout configuration

// Dashboard tile types
export enum TileType {
  VALUE = 'value',
  CHART = 'chart',
  MAP = 'map'
}

// Chart types
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  DONUT = 'donut',
  AREA = 'area'
}

// Definition for a dashboard tile
export interface DashboardTile {
  id: string;
  title: string;
  abbreviation?: string;  // Optional abbreviated title for display
  type: TileType;
  icon?: string;
  graphQLEndpoint?: string;
  // For chart tiles
  chartType?: ChartType;
  chartData?: any;
  chartLabels?: string[];
  // For value tiles
  value?: string;
  unit?: string;
  // Size constraints
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  // Alert thresholds
  alertThreshold?: number;
  warningThreshold?: number;
  // Icon customization
  iconConfig?: {
    name: string;    // Icon name from react-icons/md
    color?: string;  // Optional color for the icon
    size?: number;   // Optional size for the icon
  };
  // Any additional configuration needed for the tile
  config?: Record<string, any>;
}

// Define dashboard tiles with water quality monitoring data
export const dashboardTiles: DashboardTile[] = [
  {
    id: "nitrate",
    title: "Nitrate",
    abbreviation: "NO₃",
    type: TileType.VALUE,
    iconConfig: {
      name: "MdOutlineWaterDrop",
      color: "#3498db"
    },
    value: "4.2",
    unit: "mg/L",
    graphQLEndpoint: "/api/metrics/nitrate",
    alertThreshold: 10,
    warningThreshold: 7.5,
    // Value tiles must be exactly 1x1
    minW: 1,
    minH: 1,
    maxW: 1,
    maxH: 1
  },
  {
    id: "toc",
    title: "Total Organic Carbon",
    abbreviation: "TOC",
    type: TileType.VALUE,
    iconConfig: {
      name: "MdScience",
      color: "#2ecc71"
    },
    value: "3.7",
    unit: "mg/L",
    graphQLEndpoint: "/api/metrics/toc",
    alertThreshold: 6,
    warningThreshold: 4.5,
    minW: 1,
    minH: 1,
    maxW: 1,
    maxH: 1
  },
  {
    id: "uv254",
    title: "UV Absorbance at 254nm",
    abbreviation: "UV254",
    type: TileType.VALUE,
    iconConfig: {
      name: "MdOutlineWaves",
      color: "#9b59b6"
    },
    value: "0.125",
    unit: "cm⁻¹",
    graphQLEndpoint: "/api/metrics/uv254",
    alertThreshold: 0.25,
    warningThreshold: 0.15,
    minW: 1,
    minH: 1,
    maxW: 1,
    maxH: 1
  },
  {
    id: "map",
    title: "Water Quality Monitoring Sensor Locations",
    abbreviation: "Sensor Locations",
    type: TileType.MAP,
    graphQLEndpoint: "/api/metrics/sensorlocations",
    // Map tiles at least 2x2, no max
    minW: 2,
    minH: 2
  },
  {
    id: "turbidity_trend",
    title: "Turbidity Measurements Over 24 Hours",
    abbreviation: "Turbidity Trend",
    type: TileType.CHART,
    chartType: ChartType.LINE,
    graphQLEndpoint: "/api/metrics/turbidity_trend",
    chartData: [
      {
        name: "Turbidity",
        data: [0.8, 1.2, 0.9, 0.7, 1.5, 2.3, 1.9, 1.1, 0.85, 0.95]
      }
    ],
    chartLabels: [
      "08:00", "10:00", "12:00", "14:00", "16:00",
      "18:00", "20:00", "22:00", "00:00", "02:00"
    ],
    // Chart tiles at least 2x2, no max
    minW: 2,
    minH: 2
  },
  {
    id: "chlorophyll",
    title: "Chlorophyll-α Distribution",
    abbreviation: "Chl-α Dist.",
    type: TileType.CHART,
    chartType: ChartType.BAR,
    graphQLEndpoint: "/api/metrics/chlorophyll",
    chartData: [
      {
        name: "Chlorophyll-α",
        data: [2.1, 3.2, 4.5, 3.8, 5.2, 6.1, 5.7, 4.2, 3.9, 2.8]
      }
    ],
    chartLabels: [
      "Site A", "Site B", "Site C", "Site D", "Site E",
      "Site F", "Site G", "Site H", "Site I", "Site J"
    ],
    minW: 2,
    minH: 2
  },
  {
    id: "parameter_comparison",
    title: "Parameter Comparison",
    abbreviation: "Param. Comp.",
    type: TileType.CHART,
    chartType: ChartType.DONUT,
    graphQLEndpoint: "/api/metrics/parameter_readings",
    chartData: [35, 25, 15, 18, 7],
    chartLabels: [
      "Dissolved Oxygen", "Conductivity", "pH", "Temperature", "Salinity"
    ],
    minW: 2,
    minH: 2
  },
  {
    id: "cdom_trend",
    title: "Colored Dissolved Organic Matter Monthly Trend",
    abbreviation: "CDOM Trend",
    type: TileType.CHART,
    chartType: ChartType.LINE,
    graphQLEndpoint: "/api/metrics/cdom_trend",
    chartData: [
      {
        name: "CDOM",
        data: [12.5, 13.2, 15.7, 18.4, 16.9, 14.2]
      }
    ],
    chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    minW: 2,
    minH: 2
  },
  {
    id: "phosphate",
    title: "Phosphate Levels",
    abbreviation: "PO₄",
    type: TileType.CHART,
    chartType: ChartType.AREA,
    graphQLEndpoint: "/api/metrics/phosphate",
    chartData: [
      {
        name: "Phosphate",
        data: [0.3, 0.25, 0.4, 0.35, 0.45, 0.5, 0.42, 0.38, 0.35, 0.31]
      }
    ],
    chartLabels: [
      "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", 
      "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"
    ],
    minW: 2,
    minH: 2
  }
];

/**
 * Function to get the initial layout for the dashboard
 * In the future, this will be replaced with a DB call
 * to fetch the user's saved layout or a default layout if none exists
 */
export function getInitialLayout() {
  // Define layout for responsive breakpoints
  return {
    lg: [
      { i: "nitrate", x: 0, y: 0, w: 1, h: 1 },
      { i: "toc", x: 1, y: 0, w: 1, h: 1 },
      { i: "uv254", x: 2, y: 0, w: 1, h: 1 },
      { i: "map", x: 0, y: 1, w: 6, h: 2.5 },
      { i: "turbidity_trend", x: 0, y: 3.5, w: 3, h: 2 },
      { i: "chlorophyll", x: 3, y: 3.5, w: 3, h: 2 },
      { i: "parameter_comparison", x: 0, y: 5.5, w: 2, h: 2.5 },
      { i: "cdom_trend", x: 2, y: 5.5, w: 2, h: 2.5 },
      { i: "phosphate", x: 4, y: 5.5, w: 2, h: 2.5 }
    ],
    md: [
      { i: "nitrate", x: 0, y: 0, w: 1, h: 1 },
      { i: "toc", x: 1, y: 0, w: 1, h: 1 },
      { i: "uv254", x: 2, y: 0, w: 1, h: 1 },
      { i: "map", x: 0, y: 1, w: 6, h: 2.5 },
      { i: "turbidity_trend", x: 0, y: 3.5, w: 3, h: 2 },
      { i: "chlorophyll", x: 3, y: 3.5, w: 3, h: 2 },
      { i: "parameter_comparison", x: 0, y: 5.5, w: 2, h: 2.5 },
      { i: "cdom_trend", x: 2, y: 5.5, w: 2, h: 2.5 },
      { i: "phosphate", x: 4, y: 5.5, w: 2, h: 2.5 }
    ],
    sm: [
      { i: "nitrate", x: 0, y: 0, w: 1, h: 1 },
      { i: "toc", x: 1, y: 0, w: 1, h: 1 },
      { i: "uv254", x: 2, y: 0, w: 1, h: 1 },
      { i: "map", x: 0, y: 1, w: 4, h: 2.5 },
      { i: "turbidity_trend", x: 0, y: 3.5, w: 4, h: 2 },
      { i: "chlorophyll", x: 0, y: 5.5, w: 4, h: 2 },
      { i: "parameter_comparison", x: 0, y: 7.5, w: 4, h: 2.5 },
      { i: "cdom_trend", x: 0, y: 10, w: 4, h: 2.5 },
      { i: "phosphate", x: 0, y: 12.5, w: 4, h: 2.5 }
    ],
    xs: [
      { i: "nitrate", x: 0, y: 0, w: 1, h: 1 },
      { i: "toc", x: 1, y: 0, w: 1, h: 1 },
      { i: "uv254", x: 0, y: 1, w: 2, h: 1 },
      { i: "map", x: 0, y: 2, w: 2, h: 2.5 },
      { i: "turbidity_trend", x: 0, y: 4.5, w: 2, h: 2 },
      { i: "chlorophyll", x: 0, y: 6.5, w: 2, h: 2 },
      { i: "parameter_comparison", x: 0, y: 8.5, w: 2, h: 2.5 },
      { i: "cdom_trend", x: 0, y: 11, w: 2, h: 2.5 },
      { i: "phosphate", x: 0, y: 13.5, w: 2, h: 2.5 }
    ]
  };
}