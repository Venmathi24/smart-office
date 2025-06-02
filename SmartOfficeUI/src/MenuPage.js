import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

function MenuPage() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) {
      navigate("/");
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  const menuItems = [
    {
      title: "Attendance",
      subItems: [
        { label: "Mark Attendance", path: "/mark-attendance" },
        { label: "View Reports", path: "/attendance-history" },
      ],
    },
    {
      title: "Meeting Rooms",
      subItems: [
        ...(userRole === "admin"
          ? [
              { label: "Manage Meeting Rooms", path: "/manage-meeting-rooms" },
              { label: "Booking Meeting Rooms", path: "/book-meeting-room" },
            ]
          : [{ label: "Booking Meeting Rooms", path: "/book-meeting-room" }]),
      ],
    },
    {
      title: "Parking Slots",
      subItems: [
        {
          label:
            userRole === "admin"
              ? "Manage Parking Slots"
              : "View Parking Slots",
          path: "/parking-slots",
        },
      ],
    },
    ...(userRole === "admin"
      ? [
          {
            title: "User Management",
            subItems: [
              { label: "Create User", path: "/create-user" },
              { label: "View All Users", path: "/users" },
            ],
          },
        ]
      : []),
  ];

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Smart Office
      </Typography>

      {menuItems.map((menu, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{menu.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {menu.subItems.map((item, subIndex) => (
                <ListItem
                  key={subIndex}
                  button
                  onClick={() => navigate(item.path)}
                >
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}

export default MenuPage;
