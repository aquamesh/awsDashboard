import React from "react";
import { Flex, Text, Button } from "@aws-amplify/ui-react";

const ProfileInformation = ({ user = {} }) => {
  return (
    <div className="profile-card-content">
      <Text fontWeight="600" fontSize="18px" marginBottom="14px">
        Profile Information
      </Text>
      <Flex>
        <Text variation="tertiary" fontWeight="600" marginRight="0.5rem">
          Full Name:
        </Text>
        <Text variation="tertiary">{user.name || "N/A"}</Text>
      </Flex>
      <Flex>
        <Text variation="tertiary" fontWeight="600" marginRight="0.5rem">
          Phone:
        </Text>
        <Text variation="tertiary">{user.phone_number || "N/A"}</Text>
      </Flex>
      <Flex>
        <Text variation="tertiary" fontWeight="600" marginRight="0.5rem">
          Email:
        </Text>
        <Text variation="tertiary">{user.email || "N/A"}</Text>
      </Flex>
      <Flex>
        <Text variation="tertiary" fontWeight="600" marginRight="0.5rem">
          Location:
        </Text>
        <Text variation="tertiary">{user.locale || "United States"}</Text>
      </Flex>

      <div className="profile-card-edit">
        <Button marginLeft="auto">Edit</Button>
      </div>

      {/* Debug info - can remove later */}
      {process.env.NODE_ENV === "development" && (
        <pre style={{ marginTop: "1rem", fontSize: "12px" }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ProfileInformation;
