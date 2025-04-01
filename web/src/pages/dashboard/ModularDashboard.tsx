// pages/dashboard/ModularDashboard.tsx - Uses ModularEditableGrid

import React, { useEffect, useState } from "react";
import { Heading, View } from "@aws-amplify/ui-react";

// Import the ModularEditableGrid component
import ModularEditableGrid, { GridItem } from "../../components/ModularEditableGrid/ModularEditableGrid";

// Import dashboard tile components and data
import { TileRenderer } from "./TileComponents";
import { dashboardTiles, DashboardTile, getInitialLayout } from "./dashboardData";

import "./ModularDashboard.css";

const ModularDashboard = () => {
    // State
    const [tiles, setTiles] = useState<DashboardTile[]>([]);
    const [loading, setLoading] = useState(true);

    // Load tiles data
    useEffect(() => {
        const loadDashboard = async () => {
            console.log("Loading dashboard tiles...");
            // Simulate an API call to fetch dashboard tiles
            setLoading(true);
            // TODO: Fetch data from API
            setTiles(dashboardTiles);
            
            // Short delay to simulate data loading
            setTimeout(() => {
                setLoading(false);
            }, 750);
        };

        loadDashboard();
    }, []);

    // Layout change handler - would typically save to a database
    const handleLayoutChange = (current: any[], allLayouts: any) => {
        console.log('Layout changed, would save to database:', allLayouts);
        // API call or GraphQL mutation would go here
        // Example: saveDashboardLayout(userId, allLayouts);
    };
    
    // Handle adding a new tile
    const handleAddTile = () => {
        console.log('Add new tile clicked');
        // TODO: Open a modal to configure a new tile
    };

    // Render each tile
    const renderDashboardTile = (tile: GridItem, editMode: boolean) => {
        return <TileRenderer tile={tile as DashboardTile} />;
    };

    return (
        <View className="dashboard-container">
            <div className="page-header">
                <Heading level={2}>Dashboard</Heading>
            </div>

            <ModularEditableGrid
                items={tiles}
                initialLayouts={getInitialLayout()}
                loading={loading}
                renderItem={renderDashboardTile}
                onLayoutChange={handleLayoutChange}
                onAddItem={handleAddTile}
                className="dashboard-grid"
            />
        </View>
    );
};

export default ModularDashboard;