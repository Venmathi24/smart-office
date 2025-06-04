
import React from "react";
import MarkAttendancePage from "./MarkAttendancePage";
import AttendanceHistoryPage from "./AttendanceHistoryPage";
import CreateUserPage from "./CreateUserPage";
import UsersListPage from "./UsersListPage";
import ParkingSlotsPage from "./ParkingSlotsPage";
import MeetingRoomBookingPage from "./MeetingRoomBookingPage";
import ManageBookingRoom from "./ManageBookingRoom";

const MainContent = ({ activePage }) => {
  switch (activePage) {
    case "mark-attendance":
      return <MarkAttendancePage />;
    case "attendance-history":
      return <AttendanceHistoryPage />;
    case "create-user":
      return <CreateUserPage />;
    case "users":
      return <UsersListPage />;
    case "parking-slots":
      return <ParkingSlotsPage />;
    case "book-meeting-room":
      return <MeetingRoomBookingPage />;
    case "manage-meeting-rooms":
      return <ManageBookingRoom />;
    default:
      return <h2>Welcome! Select an option from the menu.</h2>;
  }
};

export default MainContent;
