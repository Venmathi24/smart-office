import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  TextField,
  Button,
  TablePagination,
} from "@mui/material";
import axios from "axios";

const AttendanceHistoryPage = () => {
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const code = localStorage.getItem("employeeCode");
     const name = localStorage.getItem("employeeName");
    setUserRole(role);

    if (role === "admin") {
      fetchAttendance("");
    } else {
      setEmployeeName(name);
      fetchAttendance(name);
    }
  }, []);

  const fetchAttendance = async (employeeName = "") => {
    setLoading(true);
    setErrorMsg("");

    var empName = ""; 

    const userRole = localStorage.getItem("role");
    if(userRole === "admin") {
    
     if (!employeeName || employeeName.trim() === "" ) {
      empName = "ALL";
    } else {
      empName = employeeName.trim;
    }
    } else{
      empName = localStorage.getItem("username");
    }

    try {
      const res = await axios.get(
        `http://localhost:8081/attendance/history/search/${empName}/${userRole}`
      );
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("No record found or Failed to fetch attendance history.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        pb: 4,
        backgroundColor: "rgb(223 238 245)", // Match with MarkAttendancePage.js background color
        borderRadius: 2,
        boxShadow: 3,
        minHeight: "80vh",
        padding: 3,
      }}
    >
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold">
          Attendance History
        </Typography>
      </Box>

      {userRole === "admin" && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Employee Name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
          <Button variant="contained" color="primary" onClick={() => fetchAttendance(employeeName.trim() || "")}>
            Fetch History
          </Button>
        </Box>
      )}

      {loading && <CircularProgress sx={{ display: "block", mx: "auto", mt: 2 }} />}
      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      {!loading && !errorMsg && records.length === 0 && (
  <Alert severity="info">No attendance records found.</Alert>
)}

{!loading && records.length > 0 && (
  <Box sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 3 }}>
    <Table>
      <TableHead sx={{ bgcolor: "primary.main" }}>
        <TableRow>
          {["Employee Code", "Employee Name", "Date", "Status", "Check-In Method", "Transport Mode", "Check-In Time", "Check-Out Time"].map((col) => (
            <TableCell key={col} sx={{ color: "white", fontWeight: "bold" }}>{col}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {records
          .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
          .map((rec, index) => (
            <TableRow key={index} hover>
              <TableCell>{rec.employeeCode}</TableCell>
              <TableCell>{rec.employeeName}</TableCell>
              <TableCell>{rec.date}</TableCell>
              <TableCell>{rec.status?.label || "-"}</TableCell>
              <TableCell>{rec.checkInMethod?.label || "-"}</TableCell>
              <TableCell>{rec.transportMode?.label || "-"}</TableCell>
              <TableCell>{rec.checkInTime?.replace("T", " ") || "-"}</TableCell>
              <TableCell>{rec.checkOutTime?.replace("T", " ") || "-"}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
    <TablePagination
      component="div"
      count={records.length}
      page={currentPage}
      onPageChange={(event, newPage) => setCurrentPage(newPage)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
    />
  </Box>
)}
    </Container>
  );
};

export default AttendanceHistoryPage;
