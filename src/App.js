import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import AttendanceHistoryPage from "./AttendanceHistoryPage";
import CreateUserPage from "./CreateUserPage";
import UsersListPage from "./UsersListPage";
import MarkAttendancePage from "./MarkAttendancePage";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Layout";
import ParkingSlotsPage from "./ParkingSlotsPage";
import MeetingRoomBookingPage from "./MeetingRoomBookingPage";
import ManageBookingRoom from "./ManageBookingRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/menu" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
  <Route path="mark-attendance" element={<MarkAttendancePage />} />
  <Route path="attendance-history" element={<AttendanceHistoryPage />} />
  <Route path="parking-slots" element={<ParkingSlotsPage />} />
  <Route path="manage-meeting-rooms" element={<ManageBookingRoom />} />
  <Route path="book-meeting-room" element={<MeetingRoomBookingPage />} />
  <Route path="create-user" element={<CreateUserPage />} />
  <Route path="users" element={<UsersListPage />} />
</Route>
      </Routes>
    </Router>
  );
}
export default App;