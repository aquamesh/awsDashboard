// Tile Components for the dashboard

import React from "react";
import { Card } from "@aws-amplify/ui-react";
import Chart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';
import { MdRemoveRedEye, MdWeb, MdPermIdentity } from "react-icons/md";
import Map from "../../components/Map/Map";
import { DashboardTile, TileType, ChartType } from "./dashboardData";

// ----------------------------------------
// Value Tile Component
// ----------------------------------------
interface ValueTileProps {
  data: DashboardTile;
}

export const ValueTile: React.FC<ValueTileProps> = ({ data }) => {
  // Map string icon names to components
  const getIcon = (iconName: string | undefined) => {
    if (!iconName) return null;
    
    const iconMap = {
      MdRemoveRedEye: <MdRemoveRedEye />,
      MdWeb: <MdWeb />,
      MdPermIdentity: <MdPermIdentity />,
    };
    
    return iconMap[iconName] || null;
  };

  return (
    <Card height="100%" borderRadius="15px">
      <div className="card-content">
        <div className="card-header">
          <div className="card-title">{data.title}</div>
          <div className="card-statistics-icon" style={{ color: "black" }}>
            {getIcon(data.icon)}
          </div>
        </div>
        <div className="card-statistics-amount">{data.value}</div>
      </div>
    </Card>
  );
};

// ----------------------------------------
// Chart Tile Component
// ----------------------------------------
interface ChartTileProps {
  data: DashboardTile;
}

export const ChartTile: React.FC<ChartTileProps> = ({ data }) => {
  // Default chart options based on chart type
  const getChartOptions = (chartType: ChartType): ApexOptions => {
    const baseOptions: ApexCharts.ApexOptions = {
      chart: {
        toolbar: { show: false },
        fontFamily: "inherit",
      },
      xaxis: {
        categories: data.chartLabels || [],
      }
    };

    // Chart type specific options
    switch (chartType) {
      case ChartType.DONUT:
        return {
          ...baseOptions,
          dataLabels: { enabled: false },
          plotOptions: {
            pie: {
              customScale: 0.8,
              donut: { size: "75%" },
              offsetY: 0,
            },
          },
          colors: ["#5f71e4", "#2dce88", "#fa6340", "#f5365d", "#13cdef"],
          legend: { 
            position: "bottom" as const,
            offsetY: 0 
          },
        };
      
      case ChartType.BAR:
        return {
          ...baseOptions,
          chart: {
            ...baseOptions.chart,
            stacked: true,
          },
          plotOptions: {
            bar: { columnWidth: "50%" },
          },
          dataLabels: { enabled: false },
          grid: {
            padding: { top: -20, right: 0, left: -4, bottom: -4 },
            strokeDashArray: 4,
          },
          colors: ["#406abf", "#40aabf", "#81e391"],
          legend: { show: false },
        };
      
      case ChartType.LINE:
      default:
        return {
          ...baseOptions,
          colors: ["#5f71e4", "#2dce88"],
          legend: { show: false },
          stroke: { curve: "smooth" },
          grid: { row: { colors: ["transparent", "transparent"], opacity: 0.2 } },
        };
    }
  };

  return (
    <Card height="100%" borderRadius="15px">
      <div className="card-title">{data.title}</div>
      <div className="chart-wrap">
        <Chart
          series={data.chartData}
          type={data.chartType?.toLowerCase() as any}
          height="100%"
          options={getChartOptions(data.chartType as ChartType)}
        />
      </div>
    </Card>
  );
};

// ----------------------------------------
// Map Tile Component
// ----------------------------------------
interface MapTileProps {
  data: DashboardTile;
}

export const MapTile: React.FC<MapTileProps> = ({ data }) => {
  return (
    <Card height="100%" borderRadius="15px">
      <div className="card-title">{data.title}</div>
      <div className="map-wrap" style={{ height: "calc(100% - 30px)" }}>
        <Map />
      </div>
    </Card>
  );
};

// ----------------------------------------
// Generic Tile Renderer
// ----------------------------------------
interface TileRendererProps {
  tile: DashboardTile;
}

export const TileRenderer: React.FC<TileRendererProps> = ({ tile }) => {
  switch (tile.type) {
    case TileType.VALUE:
      return <ValueTile data={tile} />;
    case TileType.CHART:
      return <ChartTile data={tile} />;
    case TileType.MAP:
      return <MapTile data={tile} />;
    default:
      return <div>Unknown tile type</div>;
  }
};