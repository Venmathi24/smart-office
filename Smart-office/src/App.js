import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import MenuPage from "./MenuPage";
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
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Layout>
                <MenuPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateUserPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UsersListPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark-attendance"
          element={
            <ProtectedRoute>
              <Layout>
                <MarkAttendancePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance-history"
          element={
            <ProtectedRoute>
              <Layout>
                <AttendanceHistoryPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/parking-slots"
          element={
            <ProtectedRoute>
              <Layout>
                <ParkingSlotsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-meeting-rooms"
          element={
            <ProtectedRoute>
              <Layout>
                <ManageBookingRoom />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-meeting-room"
          element={
            <ProtectedRoute>
              <Layout>
                <MeetingRoomBookingPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
