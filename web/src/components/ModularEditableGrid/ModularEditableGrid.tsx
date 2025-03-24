// ModularEditableGrid.tsx - A reusable grid component with editing capabilities
import React, { useState } from "react";
import {
    View,
    Flex,
    Placeholder,
    Button,
    Icon,
} from "@aws-amplify/ui-react";
import { MdEdit, MdDragIndicator, MdAdd, MdClose, MdRefresh } from "react-icons/md";
import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "./ModularEditableGrid.css";

// Enable responsiveness in the grid
const ResponsiveGridLayout = WidthProvider(Responsive);

// Default grid configuration
export const DEFAULT_GRID_CONFIG = {
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480 },
    cols: { lg: 6, md: 6, sm: 4, xs: 2 },
    rowHeight: 130,
    containerPadding: [16, 16],
    margin: [16, 16]
};

export interface GridItem {
    id: string;
    // Size constraints
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    // Any additional data needed for the item
    [key: string]: any;
}

interface ModularEditableGridProps {
    // Items to be displayed in the grid
    items: GridItem[];
    // Initial layout for different breakpoints
    initialLayouts: Layouts;
    // Optional grid configuration
    gridConfig?: typeof DEFAULT_GRID_CONFIG;
    // Loading state
    loading?: boolean;
    // Function to render each grid item
    renderItem: (item: GridItem, editMode: boolean) => React.ReactNode;
    // Optional callback for layout changes
    onLayoutChange?: (currentLayout: Layout[], allLayouts: Layouts) => void;
    // Optional callback for reset layout
    onResetLayout?: () => void;
    // Optional callback for adding a new item
    onAddItem?: () => void;
    // Additional class name for the grid
    className?: string;
}

const ModularEditableGrid: React.FC<ModularEditableGridProps> = ({
    items,
    initialLayouts,
    gridConfig = DEFAULT_GRID_CONFIG,
    loading = false,
    renderItem,
    onLayoutChange,
    onResetLayout,
    onAddItem,
    className = ""
}) => {
    // State
    const [layouts, setLayouts] = useState<Layouts>(initialLayouts);
    const [editMode, setEditMode] = useState(false);
    const [initialized, setInitialized] = useState(false);

    // Layout change handler
    const handleLayoutChange = (current: Layout[], allLayouts: Layouts) => {
        // Update layouts when changed
        setLayouts(allLayouts);
        
        // Call the callback if provided
        if (onLayoutChange) {
            onLayoutChange(current, allLayouts);
        }
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };
    
    // Reset dashboard to default layout
    const resetLayout = () => {
        setLayouts(initialLayouts);
        if (onResetLayout) {
            onResetLayout();
        }
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

    // Set initialized after initial render
    React.useEffect(() => {
        if (!loading && !initialized) {
            setTimeout(() => {
                setInitialized(true);
            }, 100);
        }
    }, [loading, initialized]);

    return (
        <View borderRadius="6px" maxWidth="100%" padding="0rem" minHeight="100px" className="modular-editable-grid-container">
            {loading ? (
                <Flex direction="column" gap="16px">
                    <Placeholder size="large" />
                    <Placeholder size="large" />
                    <Placeholder size="large" />
                </Flex>
            ) : (
                <>
                    {/* Add Tile Button - Only shown in edit mode */}
                    {editMode && onAddItem && (
                        <div className="grid-controls">
                            <Button variation="primary" className="add-tile-button" onClick={onAddItem}>
                                <Icon as={MdAdd} />
                                Add Tile
                            </Button>
                        </div>
                    )}
                    
                    <div style={{ position: 'relative' }}>
                        <ResponsiveGridLayout
                            className={`layout ${editMode ? "edit-mode" : ""} ${initialized ? "initialized" : ""} ${className}`}
                            layouts={layouts}
                            breakpoints={gridConfig.breakpoints}
                            cols={gridConfig.cols}
                            rowHeight={gridConfig.rowHeight}
                            onLayoutChange={handleLayoutChange}
                            isDraggable={editMode}
                            isResizable={editMode}
                            compactType="vertical"
                            preventCollision={false}
                            containerPadding={gridConfig.containerPadding}
                            margin={gridConfig.margin}
                            draggableCancel=".react-resizable-handle"
                            transformScale={1}
                        >
                            {items.map((item) => (
                                <div 
                                    key={item.id} 
                                    className="grid-item"
                                >
                                    {renderDragHandle()}
                                    {renderItem(item, editMode)}
                                </div>
                            ))}
                        </ResponsiveGridLayout>
                    </div>

                    {/* Floating buttons container */}
                    <div className="floating-button-container">
                        {/* Edit/Done button */}
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
                        
                        {/* Reset button - only visible in edit mode */}
                        {editMode && (
                            <Button
                                variation="secondary"
                                onClick={resetLayout}
                                className="floating-reset-button"
                                ariaLabel="Reset Layout"
                            >
                                <Icon as={MdRefresh} className="reset-icon" />
                                <span className="button-text">Reset</span>
                            </Button>
                        )}
                    </div>
                </>
            )}
        </View>
    );
};

export default ModularEditableGrid;