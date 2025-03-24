// pages/dashboard/TileComponents.tsx - Tile components

import React, { useState, useEffect } from "react";
import { Card } from "@aws-amplify/ui-react";
import Chart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';
import * as MdIcons from "react-icons/md";
import Map from "../../components/Map/Map";
import { DashboardTile, TileType, ChartType } from "./dashboardData";

// ----------------------------------------
// Value Tile Component
// ----------------------------------------
interface ValueTileProps {
  data: DashboardTile;
}

// ----------------------------------------
// Value Tile Component
// ----------------------------------------
interface ValueTileProps {
  data: DashboardTile;
}

export const ValueTile: React.FC<ValueTileProps> = ({ data }) => {
  // Use dynamic icon from react-icons/md based on the iconConfig
  const renderIcon = () => {
    if (!data.iconConfig?.name) return null;
    
    try {
      // Get the icon component dynamically
      const IconComponent = MdIcons[data.iconConfig.name as keyof typeof MdIcons];
      
      if (!IconComponent) {
        console.warn(`Icon ${data.iconConfig.name} not found in react-icons/md`);
        return null;
      }
      
      return (
        <IconComponent 
          size={24} 
          color={data.iconConfig.color || "black"} 
        />
      );
    } catch (error) {
      console.error(`Error rendering icon ${data.iconConfig.name}:`, error);
      return null;
    }
  };

  // Determine which title to display (abbreviation if available, otherwise full title)
  const displayTitle = data.abbreviation || data.title;

  return (
    <Card height="100%" borderRadius="15px">
      <div className="card-content value-tile-content">
        <div className="card-header">
          <div 
            className="card-title" 
            title={data.title} // Add tooltip with full title
          >
            {displayTitle}
          </div>
          <div className="card-statistics-icon">
            {renderIcon()}
          </div>
        </div>
        <div className="value-container">
          <div className="card-statistics-amount">
            {data.value}
            {data.unit && <span className="unit-label">{data.unit}</span>}
          </div>
        </div>
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
          colors: ["#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c"],
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
          colors: ["#3498db", "#2ecc71", "#1abc9c"],
          legend: { show: false },
        };
      
      case ChartType.LINE:
      default:
        return {
          ...baseOptions,
          colors: ["#3498db", "#2ecc71"],
          legend: { show: false },
          stroke: { curve: "smooth" },
          grid: { row: { colors: ["transparent", "transparent"], opacity: 0.2 } },
        };
    }
  };

  // Determine which title to display (abbreviation if available, otherwise full title)
  const displayTitle = data.abbreviation || data.title;

  return (
    <Card height="100%" borderRadius="15px">
      <div 
        className="card-title"
        title={data.title} // Add tooltip with full title
      >
        {displayTitle}
      </div>
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
  // Determine which title to display (abbreviation if available, otherwise full title)
  const displayTitle = data.abbreviation || data.title;

  return (
    <Card height="100%" borderRadius="15px">
      <div 
        className="card-title"
        title={data.title} // Add tooltip with full title
      >
        {displayTitle}
      </div>
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