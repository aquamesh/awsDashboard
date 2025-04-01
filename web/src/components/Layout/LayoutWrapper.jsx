// src/components/layout/LayoutWrapper.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Layout from "../Layout"; // Make sure this path is correct
import { getUserById } from "../../api/models/userApi";

// Define locally
const UserSetupStage = {
  COMPLETE: "COMPLETE"
};

const LayoutWrapper = ({ signOut, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isProfileCompletionRoute = location.pathname === "/profile-completion";
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // console.log("LayoutWrapper rendering with user:", user);

  useEffect(() => {
    // Skip check if already on profile completion page
    if (isProfileCompletionRoute) {
      setIsCheckingProfile(false);
      return;
    }

    const checkProfileStatus = async () => {
      // console.log("Checking profile for user:", user);

      if (!user || !user.userId) {
        // console.log("No valid user data, redirecting to profile completion");
        navigate("/profile-completion", { replace: true });
        return;
      }

      try {
        // console.log("Fetching user profile data for ID:", user.userId);
        const userData = await getUserById(user.userId);
        // console.log("User profile data received:", userData);

        // Check if profile is complete
        const isComplete = userData?.userSetupStage === UserSetupStage.COMPLETE;
        console.log("Is profile complete?", isComplete);

        if (!isComplete) {
          // console.log("Profile is incomplete, redirecting to profile completion");
          navigate("/profile-completion", { replace: true });
        } else {
          // console.log("Profile is complete, allowing access");
          setIsCheckingProfile(false);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        console.log("Error occurred, redirecting to profile completion");
        navigate("/profile-completion", { replace: true });
      }
    };

    checkProfileStatus();
  }, [user, isProfileCompletionRoute, navigate]);

  // Render layout with conditional content
  return (
    <Layout
      signOut={signOut}
      hideHeader={isProfileCompletionRoute}
      hideFooter={isProfileCompletionRoute}
      hideSideBar={isProfileCompletionRoute}
    >
      {/* Show loading state while checking and not on completion page */}
      {!isProfileCompletionRoute && isCheckingProfile && (
        <div>Checking profile status...</div>
      )}

      {/* Show regular content if either on completion page or done checking */}
      {(isProfileCompletionRoute || !isCheckingProfile) && (
        <Outlet />
      )}
    </Layout>
  );
};

export default LayoutWrapper;