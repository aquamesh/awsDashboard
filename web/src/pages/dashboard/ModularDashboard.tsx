import React, { useEffect, useState } from "react";
import {
    View,
    Flex,
    Card,
    Placeholder,
    Heading,
    Button,
    Icon,
} from "@aws-amplify/ui-react";
import { MdRemoveRedEye, MdWeb, MdPermIdentity, MdEdit, MdDragIndicator, MdAdd } from "react-icons/md";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import MiniStatistics from "./MiniStatistics";
import TrafficSources from "./TrafficSources";
import SalesSummary from "./SalesSummary";
import TrafficSummary from "./TrafficSummary";
import CustomersSummary from "./CustomersSummary";
import Map from "../../components/Map/Map";

import "./Dashboard.css";
import "./ModularDashboard.css";

// Enable responsiveness in the grid
const ResponsiveGridLayout = WidthProvider(Responsive);

/// Mock Data
const barChartDataDemo = [
    {
        name: "Web",
        data: [
            11, 8, 9, 10, 3, 11, 11, 11, 12, 13, 2, 12, 5, 8, 22, 6, 8, 6, 4, 1, 8,
            24, 29, 51, 40, 47, 23, 26, 50, 26, 22, 27, 46, 47, 81, 46, 40,
        ],
    },
    {
        name: "Social",
        data: [
            7, 5, 4, 3, 3, 11, 4, 7, 5, 12, 12, 15, 13, 12, 6, 7, 7, 1, 5, 5, 2, 12,
            4, 6, 18, 3, 5, 2, 13, 15, 20, 47, 18, 15, 11, 10, 9,
        ],
    },
    {
        name: "Other",
        data: [
            4, 9, 11, 7, 8, 3, 6, 5, 5, 4, 6, 4, 11, 10, 3, 6, 7, 5, 2, 8, 4, 9, 9, 2,
            6, 7, 5, 1, 8, 3, 12, 3, 4, 9, 7, 11, 10,
        ],
    },
];

const lineChartData = [
    {
        name: "Mobile apps",
        data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    },
    {
        name: "Websites",
        data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
    },
];

const customersData = [
    {
        name: "New Customers",
        data: [50, 60, 140, 190, 180, 230],
    },
];

const getChartData = () =>
    new Promise((resolve, reject) => {
        if (!barChartDataDemo) {
            return setTimeout(() => reject(new Error("no data")), 750);
        }

        setTimeout(() => resolve(Object.values(barChartDataDemo)), 750);
    });

// Define initial layout for the dashboard widgets with 6-column grid
// Using rowHeight of 120px (4x larger than original 30px)
// Widget heights are scaled down by 4x to maintain same visual size
const initialLayout = {
    lg: [
        { i: "pageviews", x: 0, y: 0, w: 1, h: 1 },
        { i: "visits", x: 1, y: 0, w: 1, h: 1 },
        { i: "uniquevisitors", x: 2, y: 0, w: 1, h: 1 },
        { i: "map", x: 0, y: 1, w: 6, h: 2.5 },
        { i: "trafficsummary", x: 0, y: 3.5, w: 4, h: 3 },
        { i: "trafficsources", x: 4, y: 3.5, w: 2, h: 3 },
        { i: "salessummary", x: 0, y: 6.5, w: 4, h: 3 },
        { i: "customers", x: 4, y: 6.5, w: 2, h: 3 },
    ],
    md: [
        { i: "pageviews", x: 0, y: 0, w: 1, h: 1 },
        { i: "visits", x: 1, y: 0, w: 1, h: 1 },
        { i: "uniquevisitors", x: 2, y: 0, w: 1, h: 1 },
        { i: "map", x: 0, y: 1, w: 6, h: 2.5 },
        { i: "trafficsummary", x: 0, y: 3.5, w: 4, h: 3 },
        { i: "trafficsources", x: 4, y: 3.5, w: 2, h: 3 },
        { i: "salessummary", x: 0, y: 6.5, w: 4, h: 3 },
        { i: "customers", x: 4, y: 6.5, w: 2, h: 3 },
    ],
    sm: [
        { i: "pageviews", x: 0, y: 0, w: 1, h: 1 },
        { i: "visits", x: 1, y: 0, w: 1, h: 1 },
        { i: "uniquevisitors", x: 2, y: 0, w: 1, h: 1 },
        { i: "map", x: 0, y: 1, w: 4, h: 2.5 },
        { i: "trafficsummary", x: 0, y: 3.5, w: 4, h: 3 },
        { i: "trafficsources", x: 0, y: 6.5, w: 4, h: 3 },
        { i: "salessummary", x: 0, y: 9.5, w: 4, h: 3 },
        { i: "customers", x: 0, y: 12.5, w: 4, h: 3 },
    ],
    xs: [
        { i: "pageviews", x: 0, y: 0, w: 1, h: 1 },
        { i: "visits", x: 1, y: 0, w: 1, h: 1 },
        { i: "uniquevisitors", x: 0, y: 1, w: 2, h: 1 },
        { i: "map", x: 0, y: 2, w: 2, h: 2.5 },
        { i: "trafficsummary", x: 0, y: 4.5, w: 2, h: 3 },
        { i: "trafficsources", x: 0, y: 7.5, w: 2, h: 3 },
        { i: "salessummary", x: 0, y: 10.5, w: 2, h: 3 },
        { i: "customers", x: 0, y: 13.5, w: 2, h: 3 },
    ],
};

const ModularDashboard = () => {
    const [barChartData, setBarChartData] = useState<any | null>(null);
    const [trafficSourceData, setTrafficSourceData] = useState<any | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [layout, setLayout] = useState(initialLayout);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const doChartData = async () => {
            const result = await getChartData();
            setBarChartData(result);
            setTrafficSourceData([112332, 123221, 432334, 342334, 133432]);
        };

        doChartData();
    }, []);

    const handleLayoutChange = (currentLayout: any, layouts: any) => {
        // Save the layout when it changes (could save to localStorage or API)
        setLayout(layouts);

        // You could also save to localStorage for persistence
        if (layouts) {
            localStorage.setItem('dashboardLayout', JSON.stringify(layouts));
        }
    };

    // Load saved layout from localStorage if available
    useEffect(() => {
        const savedLayout = localStorage.getItem('dashboardLayout');
        if (savedLayout) {
            try {
                const parsedLayout = JSON.parse(savedLayout);
                setLayout(parsedLayout);
            } catch (e) {
                console.error('Error parsing saved layout:', e);
            }
        }

        // Set initialized after a small delay to prevent animations on first render
        setTimeout(() => {
            setInitialized(true);
        }, 100);
    }, []);

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

    return (
        <>
            <div className="page-header">
                <Heading level={2}>Dashboard</Heading>
                <div className="dashboard-controls">
                    <Button
                        variation="primary"
                        onClick={toggleEditMode}
                        className="edit-button"
                    >
                        <Icon as={MdEdit} />
                        {editMode ? "Exit Edit Mode" : "Edit Layout"}
                    </Button>
                    {editMode && (
                        <Button variation="primary" className="add-tile-button">
                            <Icon as={MdAdd} />
                            Add Tile
                        </Button>
                    )}
                </div>
            </div>
            <View borderRadius="6px" maxWidth="100%" padding="0rem" minHeight="100vh">
                <ResponsiveGridLayout
                    className={`layout ${editMode ? "edit-mode" : ""} ${initialized ? "initialized" : ""}`}
                    layouts={layout}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
                    cols={{ lg: 6, md: 6, sm: 4, xs: 2 }}
                    maxRows={255}
                    rowHeight={120}
                    compactType="vertical"
                    preventCollision={false}
                    isDraggable={editMode}
                    isResizable={editMode}
                    onLayoutChange={handleLayoutChange}
                    containerPadding={[16, 16]}
                    margin={[16, 16]}
                >
                    {/* Page Views */}
                    <div key="pageviews" className="dashboard-item">
                        {renderDragHandle()}
                        <MiniStatistics
                            title="Page Views"
                            amount="321,236"
                            icon={<MdRemoveRedEye />}
                        />
                    </div>

                    {/* Visits */}
                    <div key="visits" className="dashboard-item">
                        {renderDragHandle()}
                        <MiniStatistics
                            title="Visits"
                            amount="251,607"
                            icon={<MdWeb />}
                        />
                    </div>

                    {/* Unique Visitors */}
                    <div key="uniquevisitors" className="dashboard-item">
                        {renderDragHandle()}
                        <MiniStatistics
                            title="Unique Visitors"
                            amount="23,762"
                            icon={<MdPermIdentity />}
                        />
                    </div>

                    {/* Map */}
                    <div key="map" className="dashboard-item">
                        {renderDragHandle()}
                        <Card height="100%" borderRadius="15px">
                            <div className="card-title">Map</div>
                            <div className="map-wrap" style={{ height: "calc(100% - 30px)" }}>
                                <Map />
                            </div>
                        </Card>
                    </div>

                    {/* Traffic Summary */}
                    <div key="trafficsummary" className="dashboard-item">
                        {renderDragHandle()}
                        <Card borderRadius="15px" height="100%">
                            <div className="card-title">Traffic Summary</div>
                            <div className="chart-wrap">
                                {barChartData ? (
                                    <div className="row">
                                        <TrafficSummary
                                            title="Traffic Summary"
                                            data={barChartData}
                                            type="bar"
                                            labels={[
                                                "2022-01-20",
                                                "2022-01-21",
                                                "2022-01-22",
                                                "2022-01-23",
                                                "2022-01-24",
                                                "2022-01-25",
                                                "2022-01-26",
                                                "2022-01-27",
                                                "2022-01-28",
                                                "2022-01-29",
                                                "2022-01-30",
                                                "2022-02-01",
                                                "2022-02-02",
                                                "2022-02-03",
                                                "2022-02-04",
                                                "2022-02-05",
                                                "2022-02-06",
                                                "2022-02-07",
                                                "2022-02-08",
                                                "2022-02-09",
                                                "2022-02-10",
                                                "2022-02-11",
                                                "2022-02-12",
                                                "2022-02-13",
                                                "2022-02-14",
                                                "2022-02-15",
                                                "2022-02-16",
                                                "2022-02-17",
                                                "2022-02-18",
                                                "2022-02-19",
                                                "2022-02-20",
                                                "2022-02-21",
                                                "2022-02-22",
                                                "2022-02-23",
                                                "2022-02-24",
                                                "2022-02-25",
                                                "2022-02-26",
                                            ]}
                                        />
                                    </div>
                                ) : (
                                    <Flex direction="column" minHeight="285px">
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                    </Flex>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Traffic Sources */}
                    <div key="trafficsources" className="dashboard-item">
                        {renderDragHandle()}
                        <Card height="100%" borderRadius="15px">
                            <div className="card-title">Traffic Sources</div>
                            <div className="chart-wrap">
                                {barChartData ? (
                                    <TrafficSources
                                        title="Traffic Sources"
                                        data={trafficSourceData}
                                        type="donut"
                                        labels={[
                                            "Direct",
                                            "Internal",
                                            "Referrals",
                                            "Search Engines",
                                            "Other",
                                        ]}
                                    />
                                ) : (
                                    <Flex direction="column" minHeight="285px">
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                    </Flex>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sales Summary */}
                    <div key="salessummary" className="dashboard-item">
                        {renderDragHandle()}
                        <Card borderRadius="15px" height="100%">
                            <div className="card-title">Sales Summary</div>
                            <div className="chart-wrap">
                                {barChartData ? (
                                    <div className="row">
                                        <SalesSummary
                                            title="Sales Summary"
                                            data={lineChartData}
                                            type="line"
                                            labels={[
                                                "Jan",
                                                "Feb",
                                                "Mar",
                                                "Apr",
                                                "May",
                                                "Jun",
                                                "Jul",
                                                "Aug",
                                                "Sep",
                                                "Oct",
                                                "Nov",
                                                "Dec",
                                            ]}
                                        />
                                    </div>
                                ) : (
                                    <Flex direction="column" minHeight="285px">
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                    </Flex>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Customers Summary */}
                    <div key="customers" className="dashboard-item">
                        {renderDragHandle()}
                        <Card height="100%" borderRadius="15px">
                            <div className="card-title">New Customers</div>
                            <div className="chart-wrap">
                                {barChartData ? (
                                    <div className="row">
                                        <CustomersSummary
                                            title="CustomersSummary"
                                            data={customersData}
                                            type="line"
                                            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
                                        />
                                    </div>
                                ) : (
                                    <Flex direction="column" minHeight="285px">
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                        <Placeholder size="small" />
                                    </Flex>
                                )}
                            </div>
                        </Card>
                    </div>
                </ResponsiveGridLayout>
            </View>
        </>
    );
};

export default ModularDashboard;