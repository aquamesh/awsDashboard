// src/pages/profile/ProfileSettings.tsx - This file contains the ProfileSettings component for managing user profile settings.
import React, { useState, useEffect } from "react";
import { Text, SelectField, Button, Alert, Flex } from "@aws-amplify/ui-react";
import { updateUserSettings, UserSettings } from "../../api/models/userApi";

interface ProfileSettingsProps {
  userId: string | undefined;
  settings: UserSettings | any;
  onSettingsUpdated: (settings: UserSettings | any) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  userId,
  settings,
  onSettingsUpdated
}) => {
  const [theme, setTheme] = useState(settings?.theme || 'light');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize from settings
  useEffect(() => {
    if (settings) {
      setTheme(settings.theme || 'light');
      setHasChanges(false);
    }
  }, [settings]);

  // Handle theme change
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
    setHasChanges(true);
  };

  // Save settings
  const handleSave = async () => {
    if (!userId) return;

    setSaveStatus('loading');
    try {
      const updatedSettings = await updateUserSettings(userId, {
        theme
      });

      if (updatedSettings) {
        onSettingsUpdated(updatedSettings);
        setSaveStatus('success');
        setHasChanges(false);

        // Reset status after a delay
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      setSaveStatus('error');
    }
  };

  return (
    <div className="profile-card-content">
      <Text fontWeight="600" fontSize="18px" marginBottom="18px">
        Settings
      </Text>

      {saveStatus === 'success' && (
        <Alert
          variation="success"
          isDismissible={true}
          hasIcon={true}
          heading="Settings saved successfully"
        >
          Your profile settings have been updated.
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert
          variation="error"
          isDismissible={true}
          hasIcon={true}
          heading="Error saving settings"
        >
          There was a problem updating your settings. Please try again.
        </Alert>
      )}

      <Text fontWeight="500" fontSize="16px" marginTop="20px" marginBottom="10px">
        Appearance
      </Text>

      {/* Theme selection */}
      <SelectField
        label="Theme"
        value={theme}
        onChange={handleThemeChange}
        isDisabled={saveStatus === 'loading'}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </SelectField>

      {/* Save button */}
      {hasChanges && (
        <Flex justifyContent="flex-end" marginTop="20px">
          <Button
            onClick={handleSave}
            isLoading={saveStatus === 'loading'}
          >
            Save Changes
          </Button>
        </Flex>
      )}
    </div>
  );
};

export default ProfileSettings;