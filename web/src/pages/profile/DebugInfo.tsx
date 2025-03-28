// src/pages/profile/DebugInfo.tsx - DebugInfo component for displaying user profile and all users
import React, { useState } from "react";
import { Text, Button, View } from "@aws-amplify/ui-react";
import { getAllUsers, UserAccount } from "../../api/models/userApi";

interface DebugInfoProps {
  userProfile: UserAccount | null;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ userProfile }) => {
  const [allUsers, setAllUsers] = useState<UserAccount[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const users = await getAllUsers();
      console.log("All Users:", users);
      setAllUsers(users);
    } catch (err) {
      console.error("Failed to fetch all users:", err);
      setError("Failed to fetch all users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-card-content">
      <Text fontWeight="600" fontSize="18px" marginBottom="18px">
        Debug Info
      </Text>

      <Text fontWeight="500" fontSize="16px" marginTop="20px" marginBottom="10px">
        Current User Profile
      </Text>
      <View
        padding="1rem"
        backgroundColor="var(--amplify-colors-background-secondary)"
        borderRadius="4px"
        maxHeight="300px"
        overflow="auto"
      >
        <pre>{JSON.stringify(userProfile, null, 2)}</pre>
      </View>

      <Text fontWeight="500" fontSize="16px" marginTop="20px" marginBottom="10px">
        All Users
      </Text>
      <Button
        onClick={handleFetchAllUsers}
        isLoading={loading}
        // marginBottom="10px"
        // variation="primary"
      >
        Fetch All Users
      </Button>

      {error && (
        <View 
          padding="1rem" 
          backgroundColor="var(--amplify-colors-background-error)" 
          color="var(--amplify-colors-font-error)"
          borderRadius="4px"
          marginTop="10px"
        >
          {error}
        </View>
      )}

      {allUsers && (
        <View
          padding="1rem"
          backgroundColor="var(--amplify-colors-background-secondary)"
          borderRadius="4px"
          maxHeight="300px"
          overflow="auto"
          marginTop="10px"
        >
          <pre>{JSON.stringify(allUsers, null, 2)}</pre>
        </View>
      )}
    </div>
  );
};

export default DebugInfo;