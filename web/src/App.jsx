// src/App.jsx - Main application file
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";
import "./App.css";

import awsExports from "../amplify_outputs.json";
import { lightTheme, darkTheme } from "./theme";

import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard";
import Deployments from "./pages/deployments";
import Profile from "./pages/profile";
import Sensors from "./pages/sensors";
import SensorView from "./pages/sensors/SensorView";

// Configure Amplify
Amplify.configure(awsExports);

const App = () => {
  return (
    <Authenticator hideSignUp={false}>
      {({ signOut, user }) => (
        <ThemeProvider theme={lightTheme}>
          <div>
            <Routes>
              <Route path="/" element={<Layout signOut={signOut} />}>
                {/* Default route to redirect to the dashboard */}
                <Route index element={<Dashboard />} />

                {/* Nested Routes for Deployments */}
                <Route path="deployments" element={<Deployments />} />

                {/* Nested Routes for Sensors */}
                <Route path="sensors" element={<Sensors />} />
                <Route path="sensors/:sensorId" element={<SensorView />} />

                {/* Nested Routes for Organizations */}

                {/* Account Routes */}
                <Route path="account" element={<Profile user={user} />} />

                {/* Catch-all route for 404 Not Found */}
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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 120px)', // Adjust this value based on your header/footer heights
      padding: '20px'
    }}>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;