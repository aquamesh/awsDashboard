import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";
import "./App.css";

import awsExports from "../amplify_outputs.json";
import theme from "./theme";

import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard";
import Deployments from "./pages/deployments";
import Profile from "./pages/profile"; // Profile = Account/Settings

// Configure Amplify
Amplify.configure(awsExports);



Amplify.configure(awsExports);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="deployments" element={<Deployments />} />
            {/*
            <Route path="sensors" element={<Sensors />} />
            <Route path="organization" element={<Organization />} />
            <Route path="map" element={<Map />} />
            */}
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
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

export default withAuthenticator(App, { hideSignUp: false });
