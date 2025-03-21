import React from "react";
import { Flex, Text } from "@aws-amplify/ui-react";

const ProfileHeader = ({ name = "N/A", email = "N/A" }) => {
  return (
    <Flex direction={{ base: "column", large: "row" }} alignItems="flex-start">
      <div className="profile-header-image">
        <img alt="avatar" src="/avatar.jpg" />
      </div>
      <div className="profile-header-text">
        <Text variation="primary" fontWeight={600} fontSize="18px">
          {name}
        </Text>
        <Text variation="tertiary">{email}</Text>
      </div>
    </Flex>
  );
};

export default ProfileHeader;
