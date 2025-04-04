// src/components/Header/Header.tsx
import React from "react";
import "./Header.css";
import { baseConfig } from "../../config";
import { Flex } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";

import Logo from "../Logo";
import HeaderNav from "./HeaderNav";
import HeaderSearchBar from "./HeaderSearchBar";

// Add proper type for signOut
interface HeaderProps {
  signOut: () => void;
}

const Header = ({ signOut }: HeaderProps) => {
  return (
    <div className="header">
      <Flex
        direction="row"
        alignItems="center"
        wrap="nowrap"
        gap="1rem"
        justifyContent="space-between"
      >
        <div className="header-left">
          <div className="header-logo">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <span>{baseConfig.headerText}</span>
        </div>

        <div className="header-right">
          {baseConfig.search ? <HeaderSearchBar /> : <></>}
          <HeaderNav signOut={signOut} />
        </div>
      </Flex>
    </div>
  );
};

export default Header;