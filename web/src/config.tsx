// src/config.tsx - Configuration file for the AquaView web application
import { Icon } from "@aws-amplify/ui-react";

import {
  MdDashboard,
  MdMap,
  MdOutlineRocketLaunch,
  MdSensors,
  MdBusiness
} from "react-icons/md";

// Store the base URL as a string
const baseUrl = import.meta.env.BASE_URL;

export const baseConfig = {
  titleSuffix: "",
  search: true,
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
];