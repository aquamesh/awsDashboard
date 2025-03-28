// src/components/DebugView.tsx
import React, { useState } from "react";
import { Text, Button, View } from "@aws-amplify/ui-react";

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
    <div className="profile-card-content">
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
            backgroundColor="var(--amplify-colors-background-secondary)"
            borderRadius="4px"
            maxHeight="300px"
            overflow="auto"
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
          >
            {action.label}
          </Button>

          {errorStates[index] && (
            <View 
              padding="1rem" 
              backgroundColor="var(--amplify-colors-background-error)" 
              color="var(--amplify-colors-font-error)"
              borderRadius="4px"
              marginTop="10px"
            >
              {errorStates[index]}
            </View>
          )}

          {actionResults[index] && (
            <View
              padding="1rem"
              backgroundColor="var(--amplify-colors-background-secondary)"
              borderRadius="4px"
              maxHeight="300px"
              overflow="auto"
              marginTop="10px"
            >
              <pre>{JSON.stringify(actionResults[index], null, 2)}</pre>
            </View>
          )}
        </div>
      ))}
    </div>
  );
};

export default DebugView;