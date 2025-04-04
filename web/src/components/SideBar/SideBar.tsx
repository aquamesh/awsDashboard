import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./SideBar.css";
import { appNavs } from "../../config";
import SideBarNav from "./SidebarNav";
import SidebarNavToggle from "./SidebarNavToggle";

interface SideBarProps {
  showAdminRoute?: boolean;
}

const SideBar = ({ showAdminRoute = false }: SideBarProps) => {
  const [expand, setExpand] = useState(false);

  let location = useLocation();

  useEffect(() => {
    setExpand(false);
  }, [location]);

  return (
    <>
      <div className="btn-sidebar-nav">
        <SidebarNavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </div>
      <div className={"sidebar " + (expand ? "visible" : "")}>
        <SideBarNav navs={appNavs} showAdminRoute={showAdminRoute} />
      </div>
    </>
  );
};

export default SideBar;