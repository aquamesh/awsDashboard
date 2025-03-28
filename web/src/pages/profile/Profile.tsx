// src/pages/profile/Profile.tsx - Profile component for displaying user profile information and settings.
import React, { useEffect, useState } from "react";
import { View, Flex, useTheme, Loader } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileInformation from "./ProfileInformation";
import ProfileSettings from "./ProfileSettings";
import DebugInfo from "./DebugInfo";
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
          setUserProfile(profileData);

          // Fetch user settings
          const settings = await getUserSettings(user.userId);
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
      <div className="profile-container">
        {/* Header section */}
        <div className="profile-header-row">
          <div className="profile-header-card">
            <ProfileHeader
              name={userProfile?.firstName && userProfile?.lastName
                ? `${userProfile.firstName} ${userProfile.lastName}`
                : "User"}
              email={userProfile?.email || ""}
              profilePicture={null}
              /* For now lets pass the userId as the organization name */
              organization={userProfile?.id || "N/A"}
            />
          </div>
        </div>

        {/* Main content section */}
        <div className="profile-row">
          <div className="profile-card">
            <ProfileInformation
              user={userProfile}
              attributes={{}}
            />
          </div>
          <div className="profile-card">
            <ProfileSettings
              userId={user?.username}
              settings={userSettings}
              onSettingsUpdated={(newSettings) => setUserSettings(newSettings)}
            />
          </div>
        </div>

        {/* Debug section */}
        {process.env.NODE_ENV === "development" && (
          <div className="profile-card" style={{ marginTop: "20px" }}>
            <DebugInfo userProfile={userProfile} />
          </div>
        )}
      </div>
    </>
  );

};


export default Profile;