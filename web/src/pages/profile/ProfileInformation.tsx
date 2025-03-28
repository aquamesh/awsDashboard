// src/pages/profile/ProfileInformation.tsx
import React, { useState } from "react";
import { Flex, Text, Button, TextField, Card } from "@aws-amplify/ui-react";
import { updateUserProfile } from "../../api/models/userApi";
import type { UserAccount } from "../../api/models/userApi";

interface ProfileInformationProps {
  user: UserAccount | null;
  attributes: Record<string, any> | undefined; // Fallback Cognito attributes
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({ user, attributes = {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || attributes?.phone_number || "",
    email: user?.email || attributes?.email || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      await updateUserProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        // Note: Email updates might require verification in a real app
        email: formData.email,
      });

      // Success - close edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || attributes?.phone_number || "",
      email: user?.email || attributes?.email || "",
    });
    setIsEditing(false);
  };

  // Display user information in view mode
  const renderViewMode = () => (
    <>
      <Flex>
        <Text variation="tertiary" fontWeight="600" marginRight="0.5rem">
          First Name:
        </Text>
        <Text variation="tertiary">{user?.firstName || attributes?.given_name || "N/A"}</Text>
      </Flex>
      <Flex>
        <Text variation="tertiary" fontWeight="600" marginRight="0.5rem">
          Last Name:
        </Text>
        <Text variation="tertiary">{user?.lastName || attributes?.family_name || "N/A"}</Text>
      </Flex>
      <Flex>
        <Text variation="tertiary" fontWeight="600" marginRight="0.5rem">
          Phone:
        </Text>
        <Text variation="tertiary">{user?.phoneNumber || attributes?.phone_number || "N/A"}</Text>
      </Flex>
      <Flex>
        <Text variation="tertiary" fontWeight="600" marginRight="0.5rem">
          Email:
        </Text>
        <Text variation="tertiary">{user?.email || attributes?.email || "N/A"}</Text>
      </Flex>
      {user?.lastLogin && (
        <Flex>
          <Text variation="tertiary" fontWeight="600" marginRight="0.5rem">
            Last Login:
          </Text>
          <Text variation="tertiary">
            {new Date(user.lastLogin).toLocaleString()}
          </Text>
        </Flex>
      )}

      <div className="profile-card-edit">
        <Button
          onClick={() => setIsEditing(true)}
          // marginBottom="10px"
          // variation="secondary"
        >
          Edit
        </Button>
      </div>
    </>
  );

  // Edit mode with inline form
  const renderEditMode = () => (
    <Card>
      <Flex direction="column" gap="1rem">
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <TextField
          label="Phone"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          descriptiveText="Email changes may require verification"
        />

        <Flex justifyContent="flex-end" gap="0.5rem">
          <Button
            onClick={handleCancel}
          // variation="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isLoading}
          >
            Save Changes
          </Button>
        </Flex>
      </Flex>
    </Card>
  );

  return (
    <div className="profile-card-content">
      <Text fontWeight="600" fontSize="18px" marginBottom="14px">
        Profile Information
      </Text>

      {isEditing ? renderEditMode() : renderViewMode()}
    </div>
  );
};

export default ProfileInformation;