import React from "react";
import { Autocomplete } from "@aws-amplify/ui-react";

//import { baseConfig } from "../../config";

const HeaderSearchBar = () => {
  // const navigate = useNavigate();
  return (
    <div className="header-search-bar">
      <Autocomplete
        label="Autocomplete"
        options={[
          { id: "dashboard", label: "Dashboard" },
          { id: "deployments", label: "Deployments" },
          { id: "sensors", label: "Sensors" },
          { id: "map", label: "Map" },
          { id: "organization", label: "Organization" },
        ]}
        placeholder="Search here..."
        size="small"
      />
    </div>
  );
};

export default HeaderSearchBar;
