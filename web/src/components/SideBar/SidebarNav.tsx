import React from "react";
import "./SideBar.css";
import { NavLink } from "react-router-dom";
import { Icon } from "@aws-amplify/ui-react";

export interface NavItemData {
  eventKey?: string;
  title?: string;
  icon?: any;
  to?: any;
  target?: string;
  isAdmin?: boolean;
  children?: NavItemData[];
}

export interface SidebarNavProps {
  navs?: NavItemData[];
  showAdminRoute?: boolean;
}

const SideBarNav = (props: SidebarNavProps) => {
  const { navs, showAdminRoute = false } = props;

  let activeClassName = "active";

  // Filter out admin routes if showAdminRoute is false
  const filteredNavs = navs?.filter(item => {
    return showAdminRoute || !item.isAdmin;
  });

  return (
    <div className="sidebar-nav">
      <ul>
        {filteredNavs?.map((item) => {
          const { children, ...rest } = item;

          // Filter children if they exist
          const filteredChildren = children?.filter(child => {
            return showAdminRoute || !child.isAdmin;
          });

          if (children && filteredChildren && filteredChildren.length > 0) {
            return (
              <li key={item.eventKey}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? activeClassName : undefined
                  }
                >
                  <Icon>{item.icon}</Icon>
                  {item.title}
                </NavLink>
                <ul>
                  {filteredChildren.map((child) => {
                    return (
                      <li key={child.eventKey}>
                        <NavLink
                          to={child.to}
                          className={({ isActive }) =>
                            isActive ? activeClassName : undefined
                          }
                        >
                          {child.title}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          }

          if (rest.target === "_blank") {
            return <></>;
          }

          return (
            <li key={item.eventKey}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? activeClassName : undefined
                }
              >
                <Icon>{item.icon}</Icon>
                {item.title}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBarNav;