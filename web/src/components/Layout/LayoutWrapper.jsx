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
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Skip check if already on profile completion page
    if (isProfileCompletionRoute) {
      setIsCheckingProfile(false);
      return;
    }

    const checkProfileStatus = async () => {
      if (!user || !user.userId) {
        navigate("/profile-completion", { replace: true });
        return;
      }

      try {
        const userData = await getUserById(user.userId);
        
        // Check if profile is complete
        const isComplete = userData?.userSetupStage === UserSetupStage.COMPLETE;
        
        // Check if user is admin
        const userIsAdmin = userData?.globalAdmin === true; // Adjust based on your user data structure
        setIsAdmin(userIsAdmin);

        // Redirect to dashboard if trying to access admin route without permissions
        if (isAdminRoute && !userIsAdmin) {
          console.log("Unauthorized access to admin route, redirecting to dashboard");
          navigate("/", { replace: true });
          return;
        }

        if (!isComplete) {
          navigate("/profile-completion", { replace: true });
        } else {
          setIsCheckingProfile(false);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        navigate("/profile-completion", { replace: true });
      }
    };

    checkProfileStatus();
  }, [user, isProfileCompletionRoute, isAdminRoute, navigate]);

  // Render layout with conditional content
  return (
    <Layout
      signOut={signOut}
      hideHeader={isProfileCompletionRoute}
      hideFooter={isProfileCompletionRoute}
      hideSideBar={isProfileCompletionRoute}
      isAdmin={isAdmin}
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