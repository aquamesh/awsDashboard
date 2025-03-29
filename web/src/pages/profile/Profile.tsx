// src/pages/profile/Profile.tsx - Profile component for displaying user profile information and settings.
import React, { useEffect, useState } from "react";
import { View, Flex, useTheme, Loader } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";

// Importing components for the profile page
import ProfileHeader from "./ProfileHeader";
import ProfileInformation from "./ProfileInformation";
import ProfileSettings from "./ProfileSettings";
import DebugView, { DebugAction } from "../../components/DebugView/DebugView";
import {
  UserAccount,
  getUserAccount,
  getUserSettings,
  getAllUsers
} from "../../api/models/userApi";
import "./Profile.css";

// Props for the Profile component
interface ProfileProps {
  user: AuthUser; // The user object from the Authenticator
}

// Profile component
const Profile = ({ user }: ProfileProps) => {
  const { tokens } = useTheme();
  const [userProfile, setUserProfile] = useState<UserAccount | null>(null);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The rest of the component remains largely the same
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

  // Centralized data fetching function for debug purposes
  const handleFetchAllUsers = async () => {
    try {
      const users = await getAllUsers();
      console.log("All Users:", users);
      return users; // Return for DebugView component
    } catch (err) {
      console.error("Failed to fetch all users:", err);
      throw new Error("Failed to fetch all users");
    }
  };

  if (loading) {
    return (
      <View padding="2rem" textAlign="center">
        <Loader size="large" />
        <p>Loading account data...</p>
      </View>
    );
  }

  if (error) {
    return (
      <View padding="2rem">
        <h2>Account</h2>
        <div className="error-message">{error}</div>
      </View>
    );
  }

  // Define debug actions for DebugView
  const debugActions: DebugAction[] = [
    {
      label: "Fetch All Users",
      action: handleFetchAllUsers,
      resultLabel: "All Users"
    }
    // TODO: Add more debug actions here if needed
  ];

  return (
    <>
      <div>
        <h2>Account</h2>
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
          <DebugView
            title="Debug Info"
            initialData={userProfile}
            initialDataLabel="Current User Profile"
            actions={debugActions}
          />
        )}
      </div>
    </>
  );
};

export default Profile;