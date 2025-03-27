// src/App.jsx - Main application file
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";
import "./App.css";

import awsExports from "../amplify_outputs.json";
import theme from "./theme";

import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard";
import Deployments from "./pages/deployments";
import Profile from "./pages/profile"; // Profile = Account/Settings
import Sensors from "./pages/sensors"; // Sensors = Devices
import SensorView from "./pages/sensors/SensorView"; // Import the SensorView component

// Configure Amplify
Amplify.configure(awsExports);

const App = () => {
  return (
    <Authenticator hideSignUp={false}>
      {({ signOut, user }) => (
    <ThemeProvider theme={theme}>
      <div>
        {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="deployments" element={<Deployments />} />
            <Route path="account" element={<Profile />} />
            <Route path="sensors" element={<Sensors />} />
            <Route path="sensors/:sensorId" element={<SensorView />} />
            {/*
            <Route path="organization" element={<Organization />} />
            <Route path="map" element={<Map />} />
            */}
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
    )}
    </Authenticator>
  );
};


function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
