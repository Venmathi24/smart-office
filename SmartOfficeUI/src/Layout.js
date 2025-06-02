// Layout.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, AppBar, Toolbar } from "@mui/material";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1); // Go to the previous page
  };

  return (
    <Box>
      {!isLoginPage && (
        <AppBar position="static" color="default" sx={{ mb: 2 }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
};

export default Layout;
