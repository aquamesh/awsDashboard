// src/pages/profile/Profile.tsx
import React, { useEffect, useState } from "react";
import { View, Flex, useTheme, Loader } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileInformation from "./ProfileInformation";
import ProfileSettings from "./ProfileSettings";
import { getUserAccount, UserAccount, getUserSettings } from "../../api/models/userApi";
import "./Profile.css";

const Profile = () => {
  const { tokens } = useTheme();
  const { user } = useAuthenticator();
  const [userProfile, setUserProfile] = useState<UserAccount | null>(null);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.username) {
        try {
          setLoading(true);
          
          // Fetch user profile data
          const profileData = await getUserAccount(user.userId);
          console.log("Profile Data:", profileData);
          setUserProfile(profileData);

          
          // Fetch user settings
          const settings = await getUserSettings(user.userId);
          console.log('User settings:', settings);
          if (settings) {
            setUserSettings(settings);
          }
          
          setError(null);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user profile data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <View padding="2rem" textAlign="center">
        <Loader size="large" />
        <p>Loading profile data...</p>
      </View>
    );
  }

  if (error) {
    return (
      <View padding="2rem">
        <h2>Profile</h2>
        <div className="error-message">{error}</div>
      </View>
    );
  }

  return (
    <>
      <div>
        <h2>Profile</h2>
      </div>
      <View maxWidth="100%" padding="0rem" minHeight="100vh">
        <Flex
          direction={{ base: "column", large: "row" }}
          alignItems="flex-start"
          gap={tokens.space.xl}
          marginBottom="30px"
        >
          <View
            backgroundColor="var(--amplify-colors-white)"
            borderRadius="6px"
            width={{ base: "100%", large: "100%" }}
            padding="1rem"
          >
            <ProfileHeader
              name={userProfile?.firstName && userProfile?.lastName 
                ? `${userProfile.firstName} ${userProfile.lastName}` 
                : "User"}
              email={userProfile?.email || ""}
              profilePicture={null}
              organization={userProfile?.organizations?.[0]?.organization?.name}
            />
          </View>
        </Flex>

        <Flex
          direction={{ base: "column", large: "row" }}
          gap={tokens.space.xl}
          alignItems="flex-start"
        >
          <View
            backgroundColor="var(--amplify-colors-white)"
            borderRadius="6px"
            width={{ base: "100%", large: "40%" }}
            padding={{ base: "1em", large: "1.5rem" }}
          >
            <ProfileInformation 
              user={userProfile} 
              attributes={{}}
            />
          </View>
          <View
            backgroundColor="var(--amplify-colors-white)"
            borderRadius="6px"
            width={{ base: "100%", large: "40%" }}
            padding={{ base: "1em", large: "1.5rem" }}
          >
            <ProfileSettings 
              userId={user?.username} 
              settings={userSettings}
              onSettingsUpdated={(newSettings) => setUserSettings(newSettings)}
            />
          </View>
        </Flex>
      </View>
    </>
  );
};

export default Profile;