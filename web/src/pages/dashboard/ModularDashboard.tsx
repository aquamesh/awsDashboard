// ModularDashboard.tsx (modified version)
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
import { MdEdit, MdDragIndicator, MdAdd } from "react-icons/md";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Import dashboard data and tile components
import { dashboardTiles, initialLayout, fetchTileData, DashboardTile } from "./dashboardData";
import { TileRenderer } from "./TileComponents";

import "./Dashboard.css";
import "./ModularDashboard.css";

// Enable responsiveness in the grid
const ResponsiveGridLayout = WidthProvider(Responsive);

const ModularDashboard = () => {
    // State
    const [tiles, setTiles] = useState<DashboardTile[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [layout, setLayout] = useState(initialLayout);
    const [initialized, setInitialized] = useState(false);

    // Load tiles and layout
    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);

            // Load saved layout from localStorage if available
            const savedLayout = localStorage.getItem('dashboardLayout');
            if (savedLayout) {
                try {
                    const parsedLayout = JSON.parse(savedLayout);
                    setLayout(parsedLayout);
                } catch (e) {
                    console.error('Error parsing saved layout:', e);
                }
            }

            // Load tiles
            // In the future, this could be a GraphQL query to fetch tiles configuration
            setTiles(dashboardTiles);

            // Simulate loading delay
            setTimeout(() => {
                setLoading(false);
                setInitialized(true);
            }, 750);
        };

        loadDashboard();
    }, []);

    // Layout change handler
    const handleLayoutChange = (currentLayout: any, layouts: any) => {
        // Save the layout when it changes
        if (layouts) {
            setLayout(layouts);
            localStorage.setItem('dashboardLayout', JSON.stringify(layouts));
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

    const renderGridOverlay = () => {
        if (!editMode) return null;

        // These should match the values in your ResponsiveGridLayout
        const containerPadding = [16, 16];
        const margin = [16, 16];
        const rowHeight = 130;

        // Get columns for current breakpoint
        const getColumns = () => {
            const width = window.innerWidth;
            if (width >= 1200) return 6; // lg
            if (width >= 996) return 6;  // md
            if (width >= 768) return 4;  // sm
            return 2;                    // xs
        };

        const columns = getColumns();

        // Create an array with the correct length and properly typed
        const gridCells: React.ReactNode[] = [];

        // Generate 20 rows (adjust as needed)
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
                {loading ? (
                    <Flex direction="column" gap="16px">
                        <Placeholder size="large" />
                        <Placeholder size="large" />
                        <Placeholder size="large" />
                    </Flex>
                ) : (
                    <div style={{ position: 'relative' }}>
                        {renderGridOverlay()}
                        <ResponsiveGridLayout
                            className={`layout ${editMode ? "edit-mode" : ""} ${initialized ? "initialized" : ""}`}
                            layouts={layout}
                            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
                            cols={{ lg: 6, md: 6, sm: 4, xs: 2 }}
                            rowHeight={130}
                            compactType="vertical"
                            preventCollision={false}
                            isDraggable={editMode}
                            isResizable={editMode}
                            onLayoutChange={handleLayoutChange}
                            containerPadding={[16, 16]}
                            margin={[16, 16]}
                            // Add these properties to control transition behavior:
                            draggableCancel=".react-resizable-handle" // Prevent drag from resize handle
                            transformScale={1}
                            // If you want slower resize operations:
                            // resizeHandle={<div className="custom-resize-handle" />}
                        >
                            {tiles.map((tile) => (
                                <div key={tile.id} className="dashboard-item">
                                    {renderDragHandle()}
                                    <TileRenderer tile={tile} />
                                </div>
                            ))}
                        </ResponsiveGridLayout>
                    </div>
                )}
            </View>
        </>
    );
};

export default ModularDashboard;