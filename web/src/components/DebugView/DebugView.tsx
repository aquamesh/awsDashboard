// src/components/DebugView.tsx
import React, { useState } from "react";
import { Text, Button, View, Card } from "@aws-amplify/ui-react";

// Define a type for the debug action buttons
export interface DebugAction {
  label: string;
  action: () => Promise<any>;
  resultLabel?: string;
}

interface DebugViewProps {
  title?: string;
  initialData?: any;
  initialDataLabel?: string;
  actions: DebugAction[];
}

const DebugView: React.FC<DebugViewProps> = ({
  title = "Debug Info",
  initialData = null,
  initialDataLabel = "Initial Data",
  actions = [],
}) => {
  // Create states for each action's result, loading state, and error
  const [actionResults, setActionResults] = useState<Record<number, any>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<number, string | null>>({});

  const handleActionClick = async (index: number) => {
    // Set loading state for this action
    setLoadingStates(prev => ({ ...prev, [index]: true }));
    setErrorStates(prev => ({ ...prev, [index]: null }));

    try {
      // Execute the action
      const result = await actions[index].action();

      // Store the result
      setActionResults(prev => ({ ...prev, [index]: result }));
    } catch (err) {
      // Handle error
      console.error(`Failed to execute action ${actions[index].label}:`, err);
      setErrorStates(prev => ({
        ...prev,
        [index]: err instanceof Error ? err.message : "An error occurred"
      }));
    } finally {
      // Reset loading state
      setLoadingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <Card 
      borderRadius="15px" 
      marginTop="2rem"
      backgroundColor="#FFF8E6"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="#FFB700"
      style={{
        boxShadow: "0 4px 6px rgba(255, 183, 0, 0.2)"
      }}
    >
      <div style={{ 
        backgroundColor: "#FFB700",
        padding: "1rem 1rem",
        marginBottom: "1rem",
        borderRadius: "15px",
        marginTop: "-1px",
        marginLeft: "-1px",
        marginRight: "-1px",
        display: "flex",
        alignItems: "center"
      }}>
        <Text fontWeight="600" fontSize="18px">
          🔧 DEVELOPER MODE 🔧
        </Text>
      </div>
      
      <div className="profile-card-content" style={{ padding: "0 1rem 1rem 1rem" }}>
        <Text fontWeight="600" fontSize="18px" marginBottom="18px">
          {title}
        </Text>

        {initialData && (
          <>
            <Text fontWeight="500" fontSize="16px" marginTop="20px" marginBottom="10px">
              {initialDataLabel}
            </Text>
            <View
              padding="1rem"
              backgroundColor="rgba(0, 0, 0, 0.05)"
              borderRadius="4px"
              style={{
                height: 'auto',
                resize: 'vertical',
                overflow: 'auto',
                minHeight: '100px',
                maxHeight: '1080px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <pre>{JSON.stringify(initialData, null, 2)}</pre>
            </View>
          </>
        )}

        {actions.map((action, index) => (
          <div key={index} className="debug-action">
            <Text fontWeight="500" fontSize="16px" marginTop="20px" marginBottom="10px">
              {action.resultLabel || action.label}
            </Text>
            <Button
              onClick={() => handleActionClick(index)}
              isLoading={loadingStates[index]}
              marginBottom="10px"
              backgroundColor="#FFB700"
              _hover={{ backgroundColor: "#FFCA4F" }}
            >
              {action.label}
            </Button>

            {errorStates[index] && (
              <View
                padding="1rem"
                backgroundColor="#FFECEC"
                color="#D73A49"
                borderRadius="4px"
                marginTop="10px"
                style={{ border: '1px solid #F97583' }}
              >
                {errorStates[index]}
              </View>
            )}

            {actionResults[index] && (
              <View
                padding="1rem"
                backgroundColor="rgba(0, 0, 0, 0.05)"
                borderRadius="4px"
                marginTop="10px"
                style={{
                  height: 'auto',
                  resize: 'vertical',
                  overflow: 'auto',
                  minHeight: '100px',
                  maxHeight: '1080px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <pre>{JSON.stringify(actionResults[index], null, 2)}</pre>
              </View>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DebugView;