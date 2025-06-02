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
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const code = localStorage.getItem("employeeCode");
    setUserRole(role);

    if (role === "admin") {
      fetchAttendance("0");
    } else {
      setEmployeeCode(code);
      fetchAttendance(code);
    }
  }, []);

  const fetchAttendance = async (empCode = "") => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.get(
        `http://localhost:8081/attendance/history/${empCode}`
      );
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to fetch attendance history.");
      setRecords("");
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    const trimmedCode = employeeCode.trim();
    const codeToFetch = trimmedCode === "" ? "0" : trimmedCode;
    fetchAttendance(codeToFetch);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const paginatedRecords = records.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h5">Attendance History</Typography>
      </Box>

      {userRole === "admin" && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Employee Code"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
          />
          <Button variant="contained" onClick={handleFetch}>
            Fetch History
          </Button>
        </Box>
      )}

      {loading && <CircularProgress />}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      {!loading && records.length > 0 && (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Code</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Check-In Method</TableCell>
                <TableCell>Transport Mode</TableCell>
                <TableCell>Check-In Time</TableCell>
                <TableCell>Check-Out Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRecords.map((rec, index) => (
                <TableRow key={index}>
                  <TableCell>{rec.employeeCode}</TableCell>
                  <TableCell>{rec.date}</TableCell>
                  <TableCell>{rec.status?.label || "-"}</TableCell>
                  <TableCell>{rec.checkInMethod?.label || "-"}</TableCell>
                  <TableCell>{rec.transportMode?.label || "-"}</TableCell>
                  <TableCell>
                    {rec.checkInTime?.replace("T", " ") || "-"}
                  </TableCell>
                  <TableCell>
                    {rec.checkOutTime?.replace("T", " ") || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={records.length}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Container>
  );
};

export default AttendanceHistoryPage;
