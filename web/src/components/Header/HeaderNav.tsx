// src/components/Header/HeaderNav.tsx
import React from "react";
import { Menu, MenuItem, MenuButton, Link } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import { AiFillGithub } from "react-icons/ai";
import { baseConfig } from "../../config";

// Add proper type for signOut
interface HeaderNavProps {
  signOut: () => void;
}

const HeaderNav = ({ signOut }: HeaderNavProps) => {
  const navigate = useNavigate();
  return (
    <>
      <Menu
        menuAlign="end"
        trigger={
          <MenuButton variation="menu">
            <div className="header-avatar">
              <img alt="avatar" src="https://placehold.co/512x512/png"></img>
            </div>
          </MenuButton>
        }
      >
        <MenuItem onClick={() => navigate("/account")}>Account</MenuItem>
        <MenuItem onClick={signOut}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default HeaderNav;