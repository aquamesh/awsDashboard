// src/App.jsx - Main application file for the AWS Amplify UI React application.
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";
import "./App.css";

import awsExports from "../amplify_outputs.json";
import { lightTheme, darkTheme } from "./theme";

import LayoutWrapper from "./components/Layout/LayoutWrapper";
import Dashboard from "./pages/dashboard";
import Deployments from "./pages/deployments";
import Profile from "./pages/profile";
import Sensors from "./pages/sensors";
import SensorView from "./pages/sensors/SensorView";
import ProfileCompletion from "./pages/profile-completion";
import NoMatch from "./components/feedback/NoMatch";

// Admin components
import AdminOrganizations from "./pages/admin/AdminOrganizations";
import CreateOrganization from "./pages/admin/CreateOrganization";
import AdminOrganizationView from "./pages/admin/AdminOrganizationView";
// import AdminDashboard from "./pages/admin"; // Create this component
// import AdminUsers from "./pages/admin/users"; // Create this component
// import AdminSettings from "./pages/admin/settings"; // Create this component

Amplify.configure(awsExports);

const App = () => (
  <Authenticator hideSignUp={false}>
    {({ signOut, user }) => (
      <ThemeProvider theme={lightTheme}>
        <Routes>
          <Route path="/" element={<LayoutWrapper signOut={signOut} user={user} />}>
            <Route path="profile-completion" element={<ProfileCompletion user={user} />} />
            <Route index element={<Dashboard />} />
            <Route path="deployments" element={<Deployments />} />
            <Route path="sensors" element={<Sensors />} />
            <Route path="sensors/:sensorId" element={<SensorView />} />
            <Route path="account" element={<Profile user={user} />} />
            
            {/* Admin Routes */}
            <Route path="admin/organizations" element={<AdminOrganizations />} />
            <Route path="admin/organizations/create" element={<CreateOrganization />} />
            <Route path="admin/organizations/:organizationId" element={<AdminOrganizationView />} />
            {/* <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/settings" element={<AdminSettings />} /> */}
            
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </ThemeProvider>
    )}
  </Authenticator>
);

export default App;