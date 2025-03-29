// src/theme.tsx - Custom theme for AWS Amplify UI
import { Theme } from "@aws-amplify/ui-react";

const lightTheme: Theme = {
  name: "light",
  tokens: {
    colors: {
      font: {
        primary: { value: "#000000" },
        // ...
      },
      background: { secondary: "#f5f8fa" },
    },
  },
};

const darkTheme: Theme = {
  name: "dark",
  tokens: {
    colors: {
      font: {
        primary: { value: "#ffffff" },
        // ...
      },
      background: { 
        primary: { value: "#1a1a1a" },
        secondary: { value: "#2a2a2a" } 
      },
    },
  },
};

export { lightTheme, darkTheme };
export default lightTheme;
