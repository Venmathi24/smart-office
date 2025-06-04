import React from "react";
import { Outlet } from "react-router-dom";
import MenuPage from "./MenuPage"; // Assuming MenuPage is the component for the menu

const Layout = () => {
  return (
    <div>
      <MenuPage />
      <main>
        <Outlet /> {/* This will render the nested page content inside the main section */}
      </main>
    </div>
  );
};

export default Layout;