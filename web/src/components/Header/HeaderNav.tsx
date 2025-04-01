// src/components/Header/HeaderNav.tsx
import React from "react";
import { Menu, MenuItem, MenuButton, Link } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { baseConfig } from "../../config";

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
              <div style={{ fontSize: "34px", lineHeight: 1, color: "#000" }}>
                <MdAccountCircle />
              </div>
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
