// src/pages/profile/ProfileHeader.tsx
import React from "react";
import { Flex, Text } from "@aws-amplify/ui-react";
import { MdAccountCircle } from "react-icons/md";

const ProfileHeader = ({ 
  name = "N/A", 
  email = "",
  organization = "N/A", 
  profilePicture = null 
}) => {
  return (
    <Flex direction={{ base: "column", large: "row" }} alignItems="center" gap="1rem">
      <div style={{ fontSize: "100px", lineHeight: 1, color: "#000" }}>
        {profilePicture ? (
          <img
            alt="Profile avatar"
            src={profilePicture}
            style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <MdAccountCircle />
        )}
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
