// src/pages/profile/ProfileHeader.tsx
import React from "react";
import { Flex, Text } from "@aws-amplify/ui-react";

const ProfileHeader = ({ 
  name = "N/A", 
  email = "",
  organization = "N/A", 
  profilePicture = null 
}) => {
  return (
    <Flex direction={{ base: "column", large: "row" }} alignItems="flex-start">
      <div className="profile-header-image">
        <img 
          alt="Profile avatar" 
          src={profilePicture || "https://placehold.co/512x512/png"} 
        />
      </div>
      <div className="profile-header-text">
        <Text variation="primary" fontWeight={600} fontSize="18px">
          {name}
        </Text>
        <Text variation="tertiary">{organization}</Text>
        {email && <Text variation="tertiary" fontSize="14px">{email}</Text>}
      </div>
    </Flex>
  );
};

export default ProfileHeader;