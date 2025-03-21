// dashboardData.ts - Dashboard data and layout configuration

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
  type: TileType;
  icon?: string;
  graphQLEndpoint?: string;
  // For chart tiles
  chartType?: ChartType;
  chartData?: any;
  chartLabels?: string[];
  // For value tiles
  value?: string;
  // Size constraints
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  // Any additional configuration needed for the tile
  config?: Record<string, any>;
}

// Define dashboard tiles with mock data
export const dashboardTiles: DashboardTile[] = [
  {
    id: "pageviews",
    title: "Page Views",
    type: TileType.VALUE,
    icon: "MdRemoveRedEye",
    value: "321,236",
    graphQLEndpoint: "/api/metrics/pageviews",
    // Value tiles must be exactly 1x1
    minW: 1,
    minH: 1,
    maxW: 1,
    maxH: 1
  },
  {
    id: "visits",
    title: "Visits",
    type: TileType.VALUE,
    icon: "MdWeb",
    value: "251,607",
    graphQLEndpoint: "/api/metrics/visits",
    minW: 1,
    minH: 1,
    maxW: 1,
    maxH: 1
  },
  {
    id: "uniquevisitors",
    title: "Unique Visitors",
    type: TileType.VALUE,
    icon: "MdPermIdentity",
    value: "23,762",
    graphQLEndpoint: "/api/metrics/uniquevisitors",
    minW: 1,
    minH: 1,
    maxW: 1,
    maxH: 1
  },
  {
    id: "map",
    title: "Visitor Location",
    type: TileType.MAP,
    graphQLEndpoint: "/api/metrics/visitorlocations",
    // Map tiles at least 2x2, no max
    minW: 2,
    minH: 2
  },
  {
    id: "trafficsummary",
    title: "Traffic Summary",
    type: TileType.CHART,
    chartType: ChartType.BAR,
    graphQLEndpoint: "/api/metrics/trafficsummary",
    chartData: [
      {
        name: "Web",
        data: [11, 8, 9, 10, 3, 11, 11, 11, 12, 13]
      },
      {
        name: "Social",
        data: [7, 5, 4, 3, 3, 11, 4, 7, 5, 12]
      },
      {
        name: "Other",
        data: [4, 9, 11, 7, 8, 3, 6, 5, 5, 4]
      }
    ],
    chartLabels: [
      "Jan 20", "Jan 21", "Jan 22", "Jan 23", "Jan 24",
      "Jan 25", "Jan 26", "Jan 27", "Jan 28", "Jan 29"
    ],
    // Chart tiles at least 2x2, no max
    minW: 2,
    minH: 2
  },
  {
    id: "trafficsources",
    title: "Traffic Sources",
    type: TileType.CHART,
    chartType: ChartType.DONUT,
    graphQLEndpoint: "/api/metrics/trafficsources",
    chartData: [112332, 123221, 432334, 342334, 133432],
    chartLabels: [
      "Direct", "Internal", "Referrals", "Search Engines", "Other"
    ],
    minW: 2,
    minH: 2
  },
  {
    id: "salessummary",
    title: "Sales Summary",
    type: TileType.CHART,
    chartType: ChartType.LINE,
    graphQLEndpoint: "/api/metrics/salessummary",
    chartData: [
      {
        name: "Mobile apps",
        data: [50, 40, 300, 220, 500, 250, 400, 230, 500]
      },
      {
        name: "Websites",
        data: [30, 90, 40, 140, 290, 290, 340, 230, 400]
      }
    ],
    chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    minW: 2,
    minH: 2
  },
  {
    id: "customers",
    title: "New Customers",
    type: TileType.CHART,
    chartType: ChartType.LINE,
    graphQLEndpoint: "/api/metrics/customers",
    chartData: [
      {
        name: "New Customers",
        data: [50, 60, 140, 190, 180, 230]
      }
    ],
    chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    minW: 2,
    minH: 2
  }
];

// Define initial layout for the dashboard widgets with 6-column grid
// Using rowHeight of 120px
export const initialLayout = {
  lg: [
    { i: "pageviews", x: 0, y: 0, w: 1, h: 1 },
    { i: "visits", x: 1, y: 0, w: 1, h: 1 },
    { i: "uniquevisitors", x: 2, y: 0, w: 1, h: 1 },
    { i: "map", x: 0, y: 1, w: 6, h: 2.5 },
    { i: "trafficsummary", x: 0, y: 3.5, w: 4, h: 3 },
    { i: "trafficsources", x: 4, y: 3.5, w: 2, h: 3 },
    { i: "salessummary", x: 0, y: 6.5, w: 4, h: 3 },
    { i: "customers", x: 4, y: 6.5, w: 2, h: 3 }
  ],
  md: [
    { i: "pageviews", x: 0, y: 0, w: 1, h: 1 },
    { i: "visits", x: 1, y: 0, w: 1, h: 1 },
    { i: "uniquevisitors", x: 2, y: 0, w: 1, h: 1 },
    { i: "map", x: 0, y: 1, w: 6, h: 2.5 },
    { i: "trafficsummary", x: 0, y: 3.5, w: 4, h: 3 },
    { i: "trafficsources", x: 4, y: 3.5, w: 2, h: 3 },
    { i: "salessummary", x: 0, y: 6.5, w: 4, h: 3 },
    { i: "customers", x: 4, y: 6.5, w: 2, h: 3 }
  ],
  sm: [
    { i: "pageviews", x: 0, y: 0, w: 1, h: 1 },
    { i: "visits", x: 1, y: 0, w: 1, h: 1 },
    { i: "uniquevisitors", x: 2, y: 0, w: 1, h: 1 },
    { i: "map", x: 0, y: 1, w: 4, h: 2.5 },
    { i: "trafficsummary", x: 0, y: 3.5, w: 4, h: 3 },
    { i: "trafficsources", x: 0, y: 6.5, w: 4, h: 3 },
    { i: "salessummary", x: 0, y: 9.5, w: 4, h: 3 },
    { i: "customers", x: 0, y: 12.5, w: 4, h: 3 }
  ],
  xs: [
    { i: "pageviews", x: 0, y: 0, w: 1, h: 1 },
    { i: "visits", x: 1, y: 0, w: 1, h: 1 },
    { i: "uniquevisitors", x: 0, y: 1, w: 2, h: 1 },
    { i: "map", x: 0, y: 2, w: 2, h: 2.5 },
    { i: "trafficsummary", x: 0, y: 4.5, w: 2, h: 3 },
    { i: "trafficsources", x: 0, y: 7.5, w: 2, h: 3 },
    { i: "salessummary", x: 0, y: 10.5, w: 2, h: 3 },
    { i: "customers", x: 0, y: 13.5, w: 2, h: 3 }
  ]
};

// Simulate data loading (for now, just return the mock data)
export const fetchTileData = (tileId: string) => {
  return new Promise((resolve) => {
    const tile = dashboardTiles.find(t => t.id === tileId);
    setTimeout(() => resolve(tile), 750);
  });
};