// src/config.tsx - Configuration file for the AquaView web application
import { Icon } from "@aws-amplify/ui-react";

import {
  MdDashboard,
  MdMap,
  MdOutlineRocketLaunch,
  MdSensors,
  MdBusiness,
  MdAdminPanelSettings,
  MdPeople,
  MdSettings
} from "react-icons/md";

// Store the base URL as a string
const baseUrl = import.meta.env.BASE_URL;

export const baseConfig = {
  titleSuffix: "",
  search: false,
  header: true,
  headerText: "AquaView",
  footer: true,
  logo: (
    <>
      <img
        src={baseUrl + "logo.png"}
        alt="logo"
        width="30"
        height="22"
      />
    </>
  ),
};

/// Navigation sidebar
export const appNavs = [
  {
    eventKey: "dashboard",
    icon: <Icon as={MdDashboard} />,
    title: "Dashboard",
    to: "/",
  },
  {
    eventKey: "deployments",
    icon: <Icon as={MdOutlineRocketLaunch} />,
    title: "Deployments",
    to: "/deployments",
  },
  {
    eventKey: "sensors",
    icon: <Icon as={MdSensors} />,
    title: "Sensors",
    to: "/sensors",
  },
  {
    eventKey: "map",
    icon: <Icon as={MdMap} />,
    title: "Map",
    to: "/map",
  },
  {
    eventKey: "organization",
    icon: <Icon as={MdBusiness} />,
    title: "Organization",
    to: "/organization",
  },
  {
    eventKey: "admin",
    icon: <Icon as={MdAdminPanelSettings} />,
    title: "Admin",
    to: "/admin",
    isAdmin: true,
    children: [
      {
        eventKey: "admin-orgs",
        title: "Organizations",
        to: "/admin/organizations",
        isAdmin: true,
      },
      {
        eventKey: "admin-deployments",
        title: "Deployments",
        to: "/admin/deployments",
        isAdmin: true,
      },
      {
        eventKey: "admin-sensors",
        title: "Sensors",
        to: "/admin/sensors",
        isAdmin: true,
      },
      {
        eventKey: "admin-users",
        title: "Users",
        to: "/admin/users",
        isAdmin: true,
      },
      {
        eventKey: "admin-settings",
        title: "Settings",
        to: "/admin/settings",
        isAdmin: true,
      }
    ]
  },
];