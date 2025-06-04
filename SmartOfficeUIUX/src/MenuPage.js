import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import Background from "./images/BackgroundMenuItem1.png";
import MainContent from "./MainContent"; // Component for rendering content

const drawerWidth = 280;

function MenuPage() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    if (!role) {
      navigate("/");
    } else {
      setUserRole(role);
      setUserName(username || "Guest");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    {
      title: "Attendance",
      subItems: [
        { label: "Mark Attendance", path: "mark-attendance" },
        { label: "View Reports", path: "attendance-history" },
      ],
    },
    {
      title: "Meeting Rooms",
      subItems: [
        ...(userRole === "admin"
          ? [
              { label: "Manage Meeting Rooms", path: "manage-meeting-rooms" },
              { label: "Booking Meeting Rooms", path: "book-meeting-room" },
            ]
          : [{ label: "Booking Meeting Rooms", path: "book-meeting-room" }]),
      ],
    },
    {
      title: "Parking Slots",
      subItems: [
        {
          label: userRole === "admin" ? "Manage Parking Slots" : "View Parking Slots",
          path: "parking-slots",
        },
      ],
    },
    ...(userRole === "admin"
      ? [
          {
            title: "User Management",
            subItems: [
              { label: "Create User", path: "create-user" },
              { label: "View All Users", path: "users" },
            ],
          },
        ]
      : []),
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "#e5e7eb" }}>
      {/* AppBar & Toolbar Container */}
      <Box sx={{ width: "100%", position: "fixed", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <AppBar
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            background: "linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
          }}
          elevation={3}
        >
          <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px", height: "64px", px: 3 }}>
            <Typography variant="h5" fontWeight={700} color="white">
              Smart Office
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#fff", color: "#6366f1" }}>
                {userName ? userName[0].toUpperCase() : "U"}
              </Avatar>
              <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 500 }}>
                {userName}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  borderColor: "#fff",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#ffffff",
            borderRight: "1px solid #e0e0e0",
            boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Toolbar sx={{ minHeight: "64px", height: "64px" }} />
        <Divider />
        <Box sx={{ mt: 2, px: 2 }}>
          {menuItems.map((menu, index) => (
            <Accordion key={index} elevation={1} sx={{ borderRadius: 1, boxShadow: "none" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography fontWeight={600}>{menu.title}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List>
                  {menu.subItems.map((item, subIndex) => (
                    <ListItem
                      key={subIndex}
                      button
                      onClick={() => setActivePage(item.path)}
                      sx={{
                        pl: 4,
                        borderRadius: 1,
                        "&:hover": { background: "#e0e7ff" },
                        transition: "background 0.3s ease-in-out",
                      }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          bgcolor: "#f8fafc",
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          marginTop: "64px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          px: 3,
          py: 4,
          borderRadius: "12px",
        }}
      >
        <MainContent activePage={activePage} />
      </Box>
    </Box>
  );
}

export default MenuPage;
