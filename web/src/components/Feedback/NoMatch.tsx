// src/components/Feedback/NoMatch.tsx
import React from "react";
import { Link } from "react-router-dom";

const NoMatch = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 120px)',
    padding: '20px'
  }}>
    <h2>Nothing to see here!</h2>
    <p><Link to="/">Go to the home page</Link></p>
  </div>
);

export default NoMatch;
