import React, { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export interface ChartDataSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface GenericChartProps {
  // Basic props
  series: ChartDataSeries[] | number[];
  type: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" 
    | "scatter" | "bubble" | "heatmap" | "treemap" | "boxPlot" 
    | "candlestick" | "radar" | "polarArea" | "rangeBar" | "rangeArea";
  labels?: string[];
  
  // Appearance props
  height?: number | string;
  title?: string;
  subtitle?: string;
  colors?: string[];
  
  // Customization props
  showLegend?: boolean;
  showToolbar?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
  curve?: "smooth" | "straight" | "stepline";
  
  // Axis props  
  xaxisTitle?: string;
  yaxisTitle?: string;
  
  // Interaction props
  animate?: boolean;
  showDataLabels?: boolean;
  
  // Advanced customization
  customOptions?: ApexOptions;
}

const GenericChart: React.FC<GenericChartProps> = ({
  series,
  type,
  labels,
  height = "100%",
  title,
  subtitle,
  colors = ["#5f71e4", "#2dce88", "#11cdef", "#fb6340", "#f5365c"], 
  showLegend = true,
  showToolbar = false,
  showGrid = true,
  stacked = false,
  curve = "smooth",
  xaxisTitle,
  yaxisTitle,
  animate = true,
  showDataLabels = false,
  customOptions = {}
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState<number | string>(300);
  const [chartWidth, setChartWidth] = useState<number | string>("100%");
  const [chartKey, setChartKey] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Helper to force re-render chart
  const refreshChart = () => {
    setChartKey(prev => prev + 1);
  };
  
  // Component mount and initial setup
  useEffect(() => {
    setMounted(true);
    
    // Initially set a fixed height to prevent rendering issues
    if (typeof height === "number") {
      setChartHeight(height);
    } else {
      setChartHeight(300); // Safe default
    }
    
    // Delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (chartRef.current && chartRef.current.parentElement) {
        const parent = chartRef.current.parentElement;
        const parentHeight = parent.clientHeight || 300;
        const parentWidth = parent.clientWidth || 400;
        
        setChartHeight(parentHeight);
        setChartWidth(parentWidth);
        
        // Force chart to redraw after measuring
        refreshChart();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle resize after initial render
  useEffect(() => {
    if (!mounted || !chartRef.current) return;
    
    const handleResize = () => {
      if (chartRef.current && chartRef.current.parentElement) {
        const parent = chartRef.current.parentElement;
        const parentHeight = parent.clientHeight || 300;
        const parentWidth = parent.clientWidth || 400;
        
        setChartHeight(parentHeight);
        setChartWidth(parentWidth);
      }
    };
    
    // ResizeObservers can sometimes trigger ApexCharts errors
    // Use a more reliable resize handler
    window.addEventListener('resize', handleResize);
    
    // Initial measurement
    handleResize();
    
    // Refresh chart once more after everything is set up
    const timer = setTimeout(() => {
      refreshChart();
    }, 300);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [mounted]);
  
  // Handle explicit height prop changes
  useEffect(() => {
    if (typeof height === "number") {
      setChartHeight(height);
      refreshChart();
    }
  }, [height]);
  
  // Build chart options by combining defaults with props
  const chartOptions: ApexOptions = {
    chart: {
      id: `chart-${chartKey}`,
      type: type as any,
      toolbar: {
        show: showToolbar
      },
      stacked: stacked,
      animations: {
        enabled: animate
      },
      fontFamily: 'inherit',
      sparkline: {
        enabled: false
      },
      background: 'transparent',
      // Disable features that cause errors
      zoom: {
        enabled: false
      },
      selection: {
        enabled: false
      }
    },
    colors: colors,
    title: title ? {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: '500'
      }
    } : undefined,
    subtitle: subtitle ? {
      text: subtitle,
      align: 'left'
    } : undefined,
    legend: {
      show: showLegend,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '13px',
      itemMargin: {
        horizontal: 10
      }
    },
    stroke: {
      curve: curve,
      width: 3,
      lineCap: 'round'
    },
    grid: {
      show: showGrid,
      borderColor: 'rgba(0, 0, 0, 0.05)',
      strokeDashArray: 5,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 5
      }
    },
    dataLabels: {
      enabled: showDataLabels
    },
    xaxis: {
      categories: labels || [],
      title: xaxisTitle ? {
        text: xaxisTitle
      } : undefined,
      labels: {
        style: {
          fontSize: '12px'
        },
        trim: true,
        hideOverlappingLabels: true
      },
      axisBorder: {
        show: true,
        color: 'rgba(0, 0, 0, 0.05)'
      },
      axisTicks: {
        show: true,
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    yaxis: {
      title: yaxisTitle ? {
        text: yaxisTitle
      } : undefined,
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      shared: true,
      intersect: false,
      followCursor: false,
      custom: undefined,
      fillSeriesColor: false,
      marker: {
        show: true
      },
      onDatasetHover: {
        highlightDataSeries: true
      },
      y: {
        formatter: (value) => {
          if (value === undefined || value === null) return 'N/A';
          return value.toLocaleString();
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      },
      bar: {
        columnWidth: '70%'
      }
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.04
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'lighten',
          value: 0.1
        }
      }
    }
  };
  
  // Merge with custom options
  const mergedOptions = {
    ...chartOptions,
    ...customOptions
  };
  
  // Don't try to render chart until mounted
  if (!mounted) {
    return <div ref={chartRef} style={{ width: "100%", height: "100%", minHeight: "200px" }} />;
  }
  
  // Determine if we're using series data or simple array (for pie charts)
  const isPieType = type === 'pie' || type === 'donut' || type === 'radialBar';
  const formattedSeries = isPieType && !Array.isArray(series[0]) ? series : series;
  
  // Static chart size with fixed dimensions
  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: "100%", 
        height: "100%", 
        minHeight: "200px",
        position: "relative",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Chart
        key={chartKey}
        series={formattedSeries as any}
        options={mergedOptions}
        type={type as any}
        height={chartHeight}
        width={chartWidth}
      />
    </div>
  );
};

export default GenericChart;