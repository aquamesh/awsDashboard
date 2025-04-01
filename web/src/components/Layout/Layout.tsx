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
  signOut?: () => void;
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideSideBar?: boolean;
}

const Layout = ({ signOut, hideHeader, hideFooter, hideSideBar }: LayoutProps) => {
  // Create className for page container based on booleans
  const pageContainerClassName = `page-container ${hideSideBar ? 'no-sidebar' : ''} ${hideHeader ? 'no-header' : ''}`;

  return (
    <div className="layout-container">
      {baseConfig.header && !hideHeader && signOut && <Header signOut={signOut} />}
      {!hideSideBar && <SideBar />}

      <div className={pageContainerClassName}>
        <Outlet context={{ signOut }} />
      </div>
      {baseConfig.footer && !hideFooter && <Footer hideSideBar={hideSideBar} />}
    </div>
  );
};

export default Layout;