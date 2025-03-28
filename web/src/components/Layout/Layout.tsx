// src/components/Layout/Layout.tsx
import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { baseConfig } from "../../config";
import SideBar from "../SideBar";
import Header from "../Header";
import Footer from "../Footer";
import "./Layout.css";

export interface LayoutProps {
  children?: React.ReactNode;
  signOut?: () => void; // Define proper type for signOut, make it optional with ?
}

const Layout = ({ signOut }: LayoutProps) => {
  return (
    <div className="layout-container">
      {baseConfig.header ? (signOut && <Header signOut={signOut} />) : <></>}
      <SideBar />

      <div className="page-container">
        <Outlet context={{ signOut }} />
      </div>
      {baseConfig.footer ? <Footer /> : <></>}
    </div>
  );
};

export default Layout;